import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const contentId = searchParams.get("contentId")

        if (contentId) {
            const { data, error } = await supabase.from("tourist_spots").select("*").eq("id", contentId).single()

            if (error) {
                return NextResponse.json(
                    { success: false, message: "관광지를 찾을 수 없습니다.", error: error.message },
                    { status: 404 },
                )
            }

            return NextResponse.json({
                success: true,
                data: data,
            })
        } else {
            const { data, error } = await supabase.from("tour_spots").select("*").order("created_at", { ascending: false })

            if (error) {
                return NextResponse.json(
                    { success: false, message: "관광지 목록을 가져올 수 없습니다.", error: error.message },
                    { status: 500 },
                )
            }

            return NextResponse.json({
                success: true,
                data: data || [],
            })
        }
    } catch (error) {
        console.error("관광지 조회 오류:", error)
        return NextResponse.json(
            {
                success: false,
                message: "관광지 조회에 실패했습니다.",
                error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
            },
            { status: 500 },
        )
    }
}
