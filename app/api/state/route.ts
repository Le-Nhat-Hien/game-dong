// ============================================================
// BACKEND API - GET /api/state
// Trả về trạng thái hiện tại: bossHp, players, logs
// ============================================================

import { NextResponse } from "next/server";
import { getGameState } from "@/lib/game-state";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = getGameState();
    return NextResponse.json(state);
  } catch {
    return NextResponse.json(
      { success: false, message: "Lỗi server!" },
      { status: 500 }
    );
  }
}
