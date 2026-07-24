// ============================================================
// BACKEND API - POST /api/attack
// Nhận tên người chơi, random sát thương 5-20, trừ máu boss
// ============================================================

import { NextResponse } from "next/server";
import { attackBoss } from "@/lib/game-state";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName } = body;

    if (!playerName || typeof playerName !== "string") {
      return NextResponse.json(
        { success: false, damage: 0, message: "Thiếu tên người chơi!" },
        { status: 400 }
      );
    }

    const result = attackBoss(playerName);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, damage: 0, message: "Lỗi server!" },
      { status: 500 }
    );
  }
}
