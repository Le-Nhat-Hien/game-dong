// ============================================================
// BACKEND API - POST /api/join
// Nhận tên người chơi, thêm vào danh sách nếu chưa có
// ============================================================

import { NextResponse } from "next/server";
import { addPlayer } from "@/lib/game-state";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Thiếu tên người chơi!" },
        { status: 400 }
      );
    }

    const result = addPlayer(name);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: "Lỗi server!" },
      { status: 500 }
    );
  }
}
