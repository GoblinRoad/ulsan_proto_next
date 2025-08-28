import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const allowedOrigins = [
    "https://ulsantour.vercel.app",
    "http://localhost:5173",
];

function getCorsHeaders(origin: string | null) {
    if (origin && allowedOrigins.includes(origin)) {
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };
    }
    return {
        "Access-Control-Allow-Origin": allowedOrigins[0], // 기본값
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    try {
        const { searchParams } = new URL(request.url)
        const contentId = searchParams.get("contentId")
        if (!contentId) {
            return NextResponse.json({
                success: false,
                data: null,
            }, {status: 400, headers: corsHeaders})
        }
        const { data, error } = await supabase.from("tourist_spots").select("*").eq("id", contentId).single()
        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "관광지 조회에 실패했습니다.",
                    error: error.message,
                },
                { status: 500 , headers: corsHeaders },
            )
        }
        return NextResponse.json({
            success: true,
            data: data,
        },
            { headers: corsHeaders }
        )

    } catch (error) {
        console.error("관광지 조회 오류:", error)
        return NextResponse.json(
            {
                success: false,
                message: "관광지 조회에 실패했습니다.",
                error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
            },
            { status: 500 , headers: corsHeaders },
        )
    }
}
