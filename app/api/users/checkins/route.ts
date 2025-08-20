import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const limit = Number.parseInt(searchParams.get("limit") || "50")

        if (!userId) {
            return NextResponse.json({ success: false, message: "사용자 ID가 필요합니다." }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("checkins")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit)

        if (error) {
            return NextResponse.json(
                { success: false, message: "체크인 이력을 가져올 수 없습니다.", error: error.message },
                { status: 500 },
            )
        }

        return NextResponse.json({
            success: true,
            data: data || [],
        })
    } catch (error) {
        console.error("체크인 이력 조회 오류:", error)
        return NextResponse.json(
            {
                success: false,
                message: "체크인 이력 조회에 실패했습니다.",
                error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
            },
            { status: 500 },
        )
    }
}
