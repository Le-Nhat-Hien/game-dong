"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================================
// FRONTEND - Trang chính của game "Cả Lớp Đánh Boss"
// ============================================================

interface Player {
  name: string;
  totalDamage: number;
}

interface LogEntry {
  text: string;
  timestamp: number;
}

interface GameState {
  bossHp: number;
  bossMaxHp: number;
  players: Player[];
  logs: LogEntry[];
  bossDefeated: boolean;
}

export default function Home() {
  // --- Trạng thái ---
  const [playerName, setPlayerName] = useState("");
  const [inGame, setInGame] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [isAttacking, setIsAttacking] = useState(false);
  const [lastDamage, setLastDamage] = useState<number | null>(null);
  const [damagePosition, setDamagePosition] = useState({ x: 50, y: 40 });
  const [shakeBoss, setShakeBoss] = useState(false);

  // --- Gọi API ---
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data: GameState = await res.json();
        setGameState(data);
      }
    } catch {
      // silently ignore
    }
  }, []);

  // Polling mỗi 2 giây khi đang trong game
  useEffect(() => {
    if (!inGame) return;
    const timeout = setTimeout(fetchState, 100);
    const interval = setInterval(fetchState, 2000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [inGame, fetchState]);

  // --- Xử lý gia nhập ---
  const handleJoin = async () => {
    if (!playerName.trim()) {
      setJoinMessage("Vui lòng nhập tên!");
      return;
    }
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setInGame(true);
        setJoinMessage("");
      } else {
        setJoinMessage(data.message);
      }
    } catch {
      setJoinMessage("Không kết nối được server!");
    }
  };

  // --- Xử lý tấn công ---
  const handleAttack = async () => {
    if (isAttacking || !gameState || gameState.bossDefeated) return;
    setIsAttacking(true);
    setShakeBoss(true);

    try {
      const res = await fetch("/api/attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setLastDamage(data.damage);
        setDamagePosition({
          x: 30 + Math.random() * 40,
          y: 20 + Math.random() * 30,
        });
        setTimeout(() => setLastDamage(null), 1000);
      }
      await fetchState();
    } catch {
      // silently ignore
    }

    setTimeout(() => setShakeBoss(false), 400);
    setTimeout(() => setIsAttacking(false), 600);
  };

  // --- Hàm hiển thị HP ---
  const hpPercent = gameState
    ? Math.max(0, (gameState.bossHp / gameState.bossMaxHp) * 100)
    : 100;

  const hpColor =
    hpPercent > 60 ? "#22c55e" : hpPercent > 30 ? "#eab308" : "#ef4444";

  // --- Màn hình Lobby ---
  if (!inGame) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">⚔️</div>
            <h1
              className="text-4xl font-extrabold mb-2"
              style={{
                background: "linear-gradient(to right, #fbbf24, #f59e0b, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
              }}
            >
              CẢ LỚP ĐÁNH BOSS
            </h1>
            <p className="text-indigo-300 text-sm">
              Cùng nhau tiêu diệt Boss!
            </p>
          </div>

          {/* Card nhập tên */}
          <div
            className="rounded-2xl p-8 shadow-2xl border"
            style={{
              background: "rgba(30, 27, 75, 0.8)",
              borderColor: "rgba(139, 92, 246, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <label className="block text-indigo-200 font-semibold mb-3 text-sm uppercase tracking-wider">
              Tên người chơi
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Nhập tên của bạn..."
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl text-white text-lg font-medium outline-none transition-all duration-200"
              style={{
                background: "rgba(55, 48, 107, 0.8)",
                border: "2px solid rgba(139, 92, 246, 0.4)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139, 92, 246, 0.8)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139, 92, 246, 0.4)")
              }
            />

            {joinMessage && (
              <p className="mt-3 text-red-400 text-sm font-medium">
                {joinMessage}
              </p>
            )}

            <button
              onClick={handleJoin}
              className="w-full mt-6 py-3.5 rounded-xl text-lg font-bold text-white transition-all duration-200 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 6px 30px rgba(124, 58, 237, 0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(124, 58, 237, 0.4)")
              }
            >
              🎮 VÀO TRẬN
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-indigo-400/50 text-xs mt-6">
            Nhập tên và chiến đấu cùng bạn bè!
          </p>
        </div>
      </div>
    );
  }

  // --- Màn hình Game ---
  return (
    <div
      className="min-h-screen flex flex-col p-4 md:p-6"
      style={{
        background: "linear-gradient(180deg, #0f0a1e 0%, #1a1035 50%, #0f0a1e 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1
          className="text-2xl md:text-3xl font-extrabold"
          style={{
            background: "linear-gradient(to right, #fbbf24, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⚔️ CẢ LỚP ĐÁNH BOSS ⚔️
        </h1>
        <p className="text-indigo-400 text-sm mt-1">
          Xin chào, <span className="text-white font-semibold">{playerName}</span>!
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cột trái: Boss */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Boss Card */}
          <div
            className="rounded-2xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: "rgba(30, 27, 75, 0.6)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            {/* Boss HP */}
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-400 font-bold text-lg">BOSS</span>
                <span className="text-white font-mono text-sm font-bold">
                  {gameState?.bossHp ?? 0} / {gameState?.bossMaxHp ?? 500}
                </span>
              </div>
              <div
                className="h-6 rounded-full overflow-hidden"
                style={{ background: "rgba(55, 48, 107, 0.8)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${hpPercent}%`,
                    background: `linear-gradient(90deg, ${hpColor}, ${hpColor}cc)`,
                    boxShadow: `0 0 15px ${hpColor}66`,
                  }}
                />
              </div>
            </div>

            {/* Boss Sprite */}
            <div className="relative">
              <div
                className={`text-8xl md:text-9xl select-none transition-transform duration-100 ${
                  shakeBoss ? "animate-shake" : ""
                }`}
                style={{
                  filter: gameState?.bossDefeated
                    ? "grayscale(1) opacity(0.5)"
                    : "none",
                  transition: "filter 0.5s",
                }}
              >
                {gameState?.bossDefeated ? "💀" : "🐉"}
              </div>

              {/* Damage popup */}
              {lastDamage !== null && (
                <div
                  className="absolute animate-damage font-extrabold text-3xl pointer-events-none"
                  style={{
                    left: `${damagePosition.x}%`,
                    top: `${damagePosition.y}%`,
                    color: "#fbbf24",
                    textShadow: "0 0 10px rgba(251, 191, 36, 0.8), 0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  -{lastDamage}
                </div>
              )}
            </div>

            {/* Victory Message */}
            {gameState?.bossDefeated && (
              <div className="mt-4 text-center animate-pulse">
                <p
                  className="text-3xl font-extrabold"
                  style={{
                    background: "linear-gradient(to right, #fbbf24, #f59e0b, #22c55e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  🎉 CẢ LỚP CHIẾN THẮNG! 🎉
                </p>
              </div>
            )}

            {/* Attack Button */}
            {!gameState?.bossDefeated && (
              <button
                onClick={handleAttack}
                disabled={isAttacking}
                className="mt-6 px-12 py-4 rounded-xl text-xl font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isAttacking
                    ? "linear-gradient(135deg, #b91c1c, #991b1b)"
                    : "linear-gradient(135deg, #dc2626, #b91c1c)",
                  boxShadow: isAttacking
                    ? "0 4px 15px rgba(220, 38, 38, 0.3)"
                    : "0 6px 25px rgba(220, 38, 38, 0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!isAttacking)
                    e.currentTarget.style.boxShadow =
                      "0 8px 35px rgba(220, 38, 38, 0.7)";
                }}
                onMouseLeave={(e) => {
                  if (!isAttacking)
                    e.currentTarget.style.boxShadow =
                      "0 6px 25px rgba(220, 38, 38, 0.5)";
                }}
              >
                {isAttacking ? "⚔️ Đang đánh..." : "⚔️ TẤN CÔNG!"}
              </button>
            )}
          </div>
        </div>

        {/* Cột phải: Players + Log */}
        <div className="flex flex-col gap-4">
          {/* Player List */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(30, 27, 75, 0.6)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <h2 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2">
              👥 Đội hình ({gameState?.players.length ?? 0})
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gameState?.players.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: "rgba(55, 48, 107, 0.5)" }}
                >
                  <span className="text-white text-sm font-medium truncate">
                    {p.name}
                    {p.name.toLowerCase() ===
                      playerName.toLowerCase() && (
                      <span className="text-indigo-400 text-xs ml-1">
                        (bạn)
                      </span>
                    )}
                  </span>
                  <span className="text-yellow-400 text-xs font-mono font-bold">
                    {p.totalDamage} dmg
                  </span>
                </div>
              ))}
              {(!gameState?.players || gameState.players.length === 0) && (
                <p className="text-indigo-400/50 text-sm text-center py-4">
                  Chưa có ai...
                </p>
              )}
            </div>
          </div>

          {/* Battle Log */}
          <div
            className="rounded-2xl p-5 flex-1"
            style={{
              background: "rgba(30, 27, 75, 0.6)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <h2 className="text-lg font-bold text-indigo-300 mb-3 flex items-center gap-2">
              📜 Nhật ký chiến đấu
            </h2>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {[...(gameState?.logs ?? [])].reverse().map((log, i) => (
                <div
                  key={i}
                  className={`text-sm px-3 py-1.5 rounded ${
                    i === 0
                      ? "text-yellow-300 font-medium"
                      : "text-indigo-300/70"
                  }`}
                  style={{
                    background:
                      i === 0
                        ? "rgba(251, 191, 36, 0.1)"
                        : "transparent",
                  }}
                >
                  {log.text}
                </div>
              ))}
              {(!gameState?.logs || gameState.logs.length === 0) && (
                <p className="text-indigo-400/50 text-sm text-center py-4">
                  Chưa có hoạt động...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-indigo-400/30 text-xs mt-4">
        Cả Lớp Đánh Boss &mdash; Cùng nhau chiến đấu!
      </p>
    </div>
  );
}
