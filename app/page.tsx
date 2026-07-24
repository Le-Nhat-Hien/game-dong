"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// FRONTEND - Trang chính của game "Cả Lớp Đánh Boss"
// Giao diện ma quái, boss 3D với hào quang, animation đẹp
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

// ---- Component Boss CSS ma quái ----
function ScaryBoss({ defeated, shaking, hitFlashing }: { defeated: boolean; shaking: boolean; hitFlashing: boolean }) {
  return (
    <div className="boss-3d-container" style={{ perspective: "800px" }}>
      <div
        className={`boss-body relative ${shaking ? "animate-shake-3d" : ""} ${hitFlashing ? "animate-hit-flash" : ""}`}
        style={{
          animation: !shaking ? "boss-idle-3d 3s ease-in-out infinite" : undefined,
          transformStyle: "preserve-3d",
          filter: defeated ? "grayscale(1) brightness(0.4)" : "none",
          transition: "filter 1s",
        }}
      >
        {/* Hào quang ngoài cùng - ring lớn nhất */}
        <div
          className="absolute rounded-full"
          style={{
            width: 280,
            height: 280,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px solid rgba(200, 30, 30, 0.25)",
            animation: "aura-rotate 8s linear infinite",
            boxShadow: "0 0 30px rgba(200, 30, 30, 0.15), inset 0 0 30px rgba(200, 30, 30, 0.1)",
          }}
        />
        {/* Hào quang giữa */}
        <div
          className="absolute rounded-full"
          style={{
            width: 240,
            height: 240,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "3px solid rgba(180, 20, 20, 0.35)",
            animation: "aura-rotate-reverse 6s linear infinite",
            boxShadow: "0 0 25px rgba(180, 20, 20, 0.2), inset 0 0 25px rgba(180, 20, 20, 0.15)",
          }}
        />
        {/* Hào quang trong - pulse */}
        <div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(200, 20, 20, 0.12) 0%, transparent 70%)",
            animation: "aura-pulse 2.5s ease-in-out infinite",
          }}
        />
        {/* Glow breathing effect */}
        <div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "aura-breathe 3s ease-in-out infinite",
          }}
        />

        {/* Satellites bay quanh boss */}
        <div
          className="absolute"
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ff4444, #aa0000)",
            boxShadow: "0 0 12px #ff4444, 0 0 24px rgba(255, 68, 68, 0.5)",
            top: "50%",
            left: "50%",
            animation: "aura-orbit-1 5s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ff8800, #aa4400)",
            boxShadow: "0 0 10px #ff8800, 0 0 20px rgba(255, 136, 0, 0.4)",
            top: "50%",
            left: "50%",
            animation: "aura-orbit-2 4s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "radial-gradient(circle, #cc22ff, #7700aa)",
            boxShadow: "0 0 10px #cc22ff, 0 0 20px rgba(204, 34, 255, 0.4)",
            top: "50%",
            left: "50%",
            animation: "aura-orbit-3 7s linear infinite",
          }}
        />

        {/* Khói ma quái */}
        <div
          className="absolute"
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(80,0,80,0.5), transparent)",
            bottom: 20,
            left: 20,
            animation: "smoke-drift-1 3s ease-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(100,0,0,0.4), transparent)",
            bottom: 30,
            right: 15,
            animation: "smoke-drift-2 3.5s ease-out infinite 0.8s",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(60,0,80,0.4), transparent)",
            bottom: 10,
            left: "50%",
            animation: "smoke-drift-3 4s ease-out infinite 1.5s",
          }}
        />

        {/* ===== CON BOSS CSS ===== */}
        <div className="boss-sprite relative" style={{ width: 160, height: 180 }}>
          {/* Sừng trái */}
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "50px solid #2a0a2a",
              top: -35,
              left: 18,
              transform: "rotate(-15deg)",
              filter: "drop-shadow(0 0 6px rgba(150, 0, 150, 0.5))",
            }}
          />
          {/* Sừng phải */}
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "50px solid #2a0a2a",
              top: -35,
              right: 18,
              transform: "rotate(15deg)",
              filter: "drop-shadow(0 0 6px rgba(150, 0, 150, 0.5))",
            }}
          />
          {/* Đỉnh sừng phát sáng */}
          <div
            className="absolute"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "radial-gradient(circle, #ff4444, #880000)",
              boxShadow: "0 0 8px #ff0000, 0 0 16px rgba(255,0,0,0.5)",
              top: -38,
              left: 16,
              transform: "rotate(-15deg) translateX(2px)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "radial-gradient(circle, #ff4444, #880000)",
              boxShadow: "0 0 8px #ff0000, 0 0 16px rgba(255,0,0,0.5)",
              top: -38,
              right: 16,
              transform: "rotate(15deg) translateX(-2px)",
            }}
          />

          {/* Đầu boss */}
          <div
            className="absolute rounded-full"
            style={{
              width: 130,
              height: 110,
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(ellipse at 50% 40%, #3d1a3d 0%, #1a0a1a 60%, #0d050d 100%)",
              border: "3px solid rgba(100, 0, 100, 0.4)",
              boxShadow:
                "0 0 30px rgba(120, 0, 120, 0.3), inset 0 -15px 25px rgba(0, 0, 0, 0.6), inset 0 5px 15px rgba(80, 0, 80, 0.3)",
            }}
          >
            {/* Mắt trái - hốc mắt */}
            <div
              className="absolute"
              style={{
                width: 36,
                height: 28,
                top: 30,
                left: 18,
                borderRadius: "50% 50% 45% 45%",
                background: "radial-gradient(ellipse, #1a0000 0%, #0a0000 100%)",
                border: "2px solid rgba(80, 0, 0, 0.5)",
                boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Con mắt phát sáng */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  top: 6,
                  left: 10,
                  background: "radial-gradient(circle at 40% 40%, #ff4444 0%, #cc0000 40%, #880000 70%, transparent 100%)",
                  boxShadow: "0 0 12px #ff0000, 0 0 24px rgba(255, 0, 0, 0.6), 0 0 40px rgba(255, 0, 0, 0.3)",
                  animation: "aura-pulse 2s ease-in-out infinite",
                }}
              />
              {/* Pupil */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 6,
                  height: 8,
                  top: 8,
                  left: 14,
                  background: "#000",
                  boxShadow: "0 0 4px #ff0000",
                }}
              />
            </div>

            {/* Mắt phải - hốc mắt */}
            <div
              className="absolute"
              style={{
                width: 36,
                height: 28,
                top: 30,
                right: 18,
                borderRadius: "50% 50% 45% 45%",
                background: "radial-gradient(ellipse, #1a0000 0%, #0a0000 100%)",
                border: "2px solid rgba(80, 0, 0, 0.5)",
                boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.8)",
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  top: 6,
                  left: 10,
                  background: "radial-gradient(circle at 40% 40%, #ff4444 0%, #cc0000 40%, #880000 70%, transparent 100%)",
                  boxShadow: "0 0 12px #ff0000, 0 0 24px rgba(255, 0, 0, 0.6), 0 0 40px rgba(255, 0, 0, 0.3)",
                  animation: "aura-pulse 2s ease-in-out infinite 0.3s",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 6,
                  height: 8,
                  top: 8,
                  left: 14,
                  background: "#000",
                  boxShadow: "0 0 4px #ff0000",
                }}
              />
            </div>

            {/* Sẹo / đường nét trên mặt */}
            <div
              className="absolute"
              style={{
                width: 30,
                height: 2,
                top: 28,
                left: 25,
                background: "linear-gradient(90deg, transparent, rgba(150, 0, 0, 0.6), transparent)",
                transform: "rotate(-20deg)",
              }}
            />

            {/* Miệng boss - hình cánh cung ma quái */}
            <div
              className="absolute"
              style={{
                width: 70,
                height: 30,
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "0 0 50% 50%",
                background: "linear-gradient(180deg, #1a0000 0%, #330000 100%)",
                border: "2px solid rgba(100, 0, 0, 0.4)",
                borderTop: "none",
                boxShadow: "inset 0 5px 15px rgba(0, 0, 0, 0.8), 0 0 10px rgba(150, 0, 0, 0.3)",
                overflow: "hidden",
              }}
            >
              {/* Răng trên */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`tooth-t-${i}`}
                  className="absolute"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: "10px solid #e8e0d0",
                    top: 0,
                    left: `${8 + i * 10}px`,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                  }}
                />
              ))}
              {/* Răng dưới */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={`tooth-b-${i}`}
                  className="absolute"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderBottom: "10px solid #e8e0d0",
                    bottom: 0,
                    left: `${12 + i * 11}px`,
                    filter: "drop-shadow(0 -1px 2px rgba(0,0,0,0.5))",
                  }}
                />
              ))}
              {/* Lưỡi / huyết quản */}
              <div
                className="absolute"
                style={{
                  width: 20,
                  height: 8,
                  bottom: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #880000, #440000)",
                  boxShadow: "0 0 6px rgba(150, 0, 0, 0.5)",
                }}
              />
            </div>
          </div>

          {/* Cổ boss */}
          <div
            className="absolute"
            style={{
              width: 50,
              height: 25,
              top: 100,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(180deg, #1a0a1a, #0d050d)",
              borderRadius: "0 0 10px 10px",
            }}
          />

          {/* Vai / cơ thể trên */}
          <div
            className="absolute"
            style={{
              width: 140,
              height: 70,
              top: 115,
              left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(ellipse at 50% 20%, #2a102a 0%, #1a0a1a 50%, #0d050d 100%)",
              borderRadius: "20px 20px 40px 40px",
              border: "2px solid rgba(80, 0, 80, 0.25)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 5px 15px rgba(60, 0, 60, 0.2)",
            }}
          >
            {/* Vuốt /爪子 trái */}
            <div
              className="absolute"
              style={{
                width: 25,
                height: 15,
                top: 10,
                left: -12,
                background: "linear-gradient(135deg, #3d1a3d, #1a0a1a)",
                borderRadius: "50% 0 0 50%",
                border: "2px solid rgba(100, 0, 100, 0.3)",
                transform: "rotate(-20deg)",
              }}
            />
            {/* Vuốt phải */}
            <div
              className="absolute"
              style={{
                width: 25,
                height: 15,
                top: 10,
                right: -12,
                background: "linear-gradient(225deg, #3d1a3d, #1a0a1a)",
                borderRadius: "0 50% 50% 0",
                border: "2px solid rgba(100, 0, 100, 0.3)",
                transform: "rotate(20deg)",
              }}
            />
            {/* Ngực phát sáng */}
            <div
              className="absolute rounded-full"
              style={{
                width: 30,
                height: 30,
                top: 15,
                left: "50%",
                transform: "translateX(-50%)",
                background: "radial-gradient(circle, rgba(200, 20, 20, 0.4) 0%, transparent 70%)",
                boxShadow: "0 0 20px rgba(200, 20, 20, 0.3)",
                animation: "aura-pulse 2s ease-in-out infinite 0.5s",
              }}
            />
          </div>
        </div>
        {/* Hết con boss */}
      </div>
    </div>
  );
}

// ---- Component Hiệu ứng Attack ----
function AttackEffects({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Slash mark */}
      <div
        className="absolute animate-slash"
        style={{
          width: 120,
          height: 4,
          top: "45%",
          left: "50%",
          marginLeft: -60,
          background: "linear-gradient(90deg, transparent, #ffcc00, #ffffff, #ffcc00, transparent)",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(255, 200, 0, 0.8), 0 0 40px rgba(255, 200, 0, 0.4)",
          transform: "rotate(-25deg)",
        }}
      />
      {/* Particles - gia tri tinh san de tranh lint error */}
      {([
        { size: 6, left: 48, color: "#ff4444" },
        { size: 5, left: 52, color: "#ffaa00" },
        { size: 7, left: 46, color: "#ff6622" },
        { size: 4, left: 54, color: "#ff2200" },
        { size: 5, left: 50, color: "#ffcc00" },
      ] as const).map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: "42%",
            left: `${p.left}%`,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            animation: `particle-fly-${i + 1} 0.6s ease-out forwards`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [inGame, setInGame] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [isAttacking, setIsAttacking] = useState(false);
  const [lastDamage, setLastDamage] = useState<number | null>(null);
  const [damagePosition, setDamagePosition] = useState({ x: 50, y: 40 });
  const [shakeBoss, setShakeBoss] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const bossContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!inGame) return;
    const timeout = setTimeout(fetchState, 100);
    const interval = setInterval(fetchState, 2000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [inGame, fetchState]);

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setJoinMessage("Vui long nhap ten!");
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
      setJoinMessage("Khong ket noi duoc server!");
    }
  };

  const handleAttack = async () => {
    if (isAttacking || !gameState || gameState.bossDefeated) return;
    setIsAttacking(true);
    setShakeBoss(true);
    setHitFlash(true);
    setShowSlash(true);
    setScreenShake(true);

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
          x: 25 + Math.random() * 50,
          y: 15 + Math.random() * 35,
        });
        setTimeout(() => setLastDamage(null), 1200);
      }
      await fetchState();
    } catch {
      // silently ignore
    }

    setTimeout(() => setShakeBoss(false), 500);
    setTimeout(() => setHitFlash(false), 400);
    setTimeout(() => setShowSlash(false), 400);
    setTimeout(() => setScreenShake(false), 300);
    setTimeout(() => setIsAttacking(false), 700);
  };

  const hpPercent = gameState
    ? Math.max(0, (gameState.bossHp / gameState.bossMaxHp) * 100)
    : 100;

  const hpColor =
    hpPercent > 60 ? "#22c55e" : hpPercent > 30 ? "#eab308" : "#ef4444";
  const hpGlow =
    hpPercent > 60
      ? "rgba(34,197,94,0.4)"
      : hpPercent > 30
        ? "rgba(234,179,8,0.4)"
        : "rgba(239,68,68,0.5)";

  // ============================================
  // LOBBY SCREEN
  // ============================================
  if (!inGame) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0f0618 40%, #050208 100%)",
        }}
      >
        {/* Ambient particles - gia tri tinh san */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {([
            { w: 3, h: 4, r: 200, g: 30, b: 20, a: 0.35, l: 5, t: 12, dur: 5, del: 1 },
            { w: 2, h: 3, r: 180, g: 20, b: 40, a: 0.25, l: 15, t: 45, dur: 6, del: 0 },
            { w: 4, h: 4, r: 220, g: 10, b: 30, a: 0.30, l: 28, t: 78, dur: 4, del: 2 },
            { w: 3, h: 3, r: 170, g: 40, b: 15, a: 0.28, l: 42, t: 20, dur: 7, del: 1.5 },
            { w: 2, h: 2, r: 190, g: 15, b: 35, a: 0.22, l: 55, t: 65, dur: 5, del: 0.5 },
            { w: 3, h: 3, r: 210, g: 25, b: 10, a: 0.32, l: 68, t: 35, dur: 6, del: 2.5 },
            { w: 4, h: 3, r: 160, g: 35, b: 25, a: 0.27, l: 78, t: 88, dur: 4, del: 1 },
            { w: 2, h: 2, r: 230, g: 8, b: 18, a: 0.20, l: 88, t: 52, dur: 7, del: 3 },
            { w: 3, h: 4, r: 200, g: 20, b: 30, a: 0.33, l: 10, t: 90, dur: 5, del: 0.8 },
            { w: 2, h: 3, r: 175, g: 30, b: 20, a: 0.24, l: 35, t: 8, dur: 6, del: 2 },
            { w: 3, h: 2, r: 205, g: 12, b: 28, a: 0.30, l: 62, t: 42, dur: 4, del: 1.2 },
            { w: 4, h: 4, r: 195, g: 18, b: 22, a: 0.26, l: 82, t: 72, dur: 5, del: 3.5 },
            { w: 2, h: 3, r: 215, g: 5, b: 35, a: 0.29, l: 22, t: 58, dur: 7, del: 0.3 },
            { w: 3, h: 2, r: 185, g: 28, b: 12, a: 0.23, l: 48, t: 15, dur: 6, del: 1.8 },
            { w: 2, h: 2, r: 200, g: 15, b: 25, a: 0.31, l: 72, t: 30, dur: 5, del: 2.2 },
            { w: 3, h: 3, r: 190, g: 22, b: 18, a: 0.25, l: 58, t: 82, dur: 4, del: 0.7 },
            { w: 4, h: 3, r: 210, g: 10, b: 30, a: 0.28, l: 8, t: 48, dur: 6, del: 1.5 },
            { w: 2, h: 2, r: 170, g: 35, b: 22, a: 0.21, l: 92, t: 10, dur: 7, del: 3.2 },
            { w: 3, h: 4, r: 225, g: 8, b: 15, a: 0.34, l: 38, t: 68, dur: 5, del: 0.4 },
            { w: 2, h: 3, r: 180, g: 25, b: 28, a: 0.27, l: 75, t: 55, dur: 4, del: 2.8 },
          ] as const).map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.w,
                height: p.h,
                background: `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a})`,
                left: `${p.l}%`,
                top: `${p.t}%`,
                animation: `aura-pulse ${p.dur}s ease-in-out infinite ${p.del}s`,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(200, 20, 20, 0.5))" }}>
              {["&#9876;", "&#9876;"]} {/* fallback */}
              <span style={{ fontSize: 64 }}>&#9876;&#65039;</span>
            </div>
            <h1
              className="text-5xl font-black mb-3 tracking-tight"
              style={{
                background: "linear-gradient(180deg, #ff6b35 0%, #ff2e2e 40%, #aa0000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 8px rgba(200, 30, 30, 0.5))",
              }}
            >
              CA LOP DANH BOSS
            </h1>
            <p
              className="text-sm tracking-widest uppercase"
              style={{ color: "rgba(180, 120, 255, 0.7)" }}
            >
              Cung nhau tieu diet Boss!
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: "linear-gradient(180deg, rgba(25, 15, 50, 0.9) 0%, rgba(15, 8, 30, 0.95) 100%)",
              borderColor: "rgba(120, 40, 160, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(100, 20, 140, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            <label
              className="block font-bold mb-3 text-sm uppercase tracking-widest"
              style={{ color: "rgba(180, 140, 255, 0.8)" }}
            >
              Ten nguoi choi
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Nhap ten cua ban..."
              maxLength={20}
              className="w-full px-5 py-3.5 rounded-xl text-white text-lg font-semibold outline-none transition-all duration-300 input-glow"
              style={{
                background: "rgba(40, 25, 70, 0.7)",
                border: "2px solid rgba(120, 60, 180, 0.3)",
              }}
            />

            {joinMessage && (
              <p className="mt-3 text-red-400 text-sm font-semibold flex items-center gap-1.5">
                <span style={{ fontSize: 14 }}>&#9888;</span> {joinMessage}
              </p>
            )}

            <button
              onClick={handleJoin}
              className="btn-3d w-full mt-6 py-4 rounded-xl text-lg font-black text-white cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #7c3aed 0%, #5b21b6 50%, #4c1d95 100%)",
                boxShadow: "0 6px 0 #3b0764, 0 8px 25px rgba(91, 33, 182, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "none",
                letterSpacing: 2,
              }}
            >
              VAO TRAN
            </button>
          </div>

          <p
            className="text-center text-xs mt-6 tracking-wide"
            style={{ color: "rgba(150, 100, 200, 0.4)" }}
          >
            Nhap ten va chien dau cung ban be!
          </p>
          <p
            className="text-center text-xs mt-2 tracking-wide"
            style={{ color: "rgba(150, 100, 200, 0.25)" }}
          >
            Created by Hien Hong Hach
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // GAME SCREEN
  // ============================================
  return (
    <div
      className={`min-h-screen flex flex-col p-4 md:p-6 ${screenShake ? "animate-screen-shake" : ""}`}
      style={{
        background: "radial-gradient(ellipse at 50% 20%, #1a0a2e 0%, #0c0518 40%, #050208 100%)",
      }}
    >
      {/* Ambient particles - gia tri tinh san */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {([
          { w: 2, h: 3, r: 160, g: 25, b: 35, a: 0.22, l: 8, t: 15, dur: 6, del: 0 },
          { w: 3, h: 3, r: 180, g: 15, b: 20, a: 0.28, l: 22, t: 55, dur: 5, del: 1.2 },
          { w: 2, h: 2, r: 200, g: 30, b: 15, a: 0.20, l: 35, t: 80, dur: 7, del: 0.5 },
          { w: 3, h: 2, r: 150, g: 20, b: 40, a: 0.25, l: 50, t: 25, dur: 6, del: 2.0 },
          { w: 2, h: 3, r: 170, g: 10, b: 30, a: 0.18, l: 65, t: 70, dur: 5, del: 1.5 },
          { w: 3, h: 3, r: 190, g: 35, b: 10, a: 0.30, l: 78, t: 40, dur: 4, del: 0.8 },
          { w: 2, h: 2, r: 140, g: 20, b: 25, a: 0.22, l: 88, t: 60, dur: 7, del: 3.0 },
          { w: 3, h: 2, r: 210, g: 12, b: 18, a: 0.26, l: 12, t: 90, dur: 5, del: 1.8 },
          { w: 2, h: 3, r: 165, g: 28, b: 22, a: 0.24, l: 42, t: 5, dur: 6, del: 2.5 },
          { w: 3, h: 3, r: 195, g: 8, b: 30, a: 0.28, l: 58, t: 48, dur: 4, del: 0.3 },
          { w: 2, h: 2, r: 175, g: 18, b: 35, a: 0.20, l: 72, t: 85, dur: 7, del: 1.0 },
          { w: 3, h: 2, r: 155, g: 30, b: 12, a: 0.23, l: 30, t: 35, dur: 5, del: 3.5 },
          { w: 2, h: 3, r: 200, g: 22, b: 28, a: 0.27, l: 85, t: 18, dur: 6, del: 0.7 },
          { w: 3, h: 3, r: 185, g: 15, b: 20, a: 0.21, l: 45, t: 65, dur: 5, del: 2.2 },
          { w: 2, h: 2, r: 160, g: 35, b: 15, a: 0.25, l: 95, t: 42, dur: 4, del: 1.3 },
        ] as const).map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.w,
              height: p.h,
              background: `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a})`,
              left: `${p.l}%`,
              top: `${p.t}%`,
              animation: `aura-pulse ${p.dur}s ease-in-out infinite ${p.del}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-4 relative z-10">
        <h1
          className="text-2xl md:text-3xl font-black tracking-tight"
          style={{
            background: "linear-gradient(180deg, #ff8844 0%, #ff3333 50%, #aa0000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 6px rgba(200, 30, 30, 0.4))",
          }}
        >
          CA LOP DANH BOSS
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(180, 140, 255, 0.6)" }}>
          Xin chao, <span className="text-white font-bold">{playerName}</span>!
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
        {/* LEFT: Boss Area */}
        <div className="lg:col-span-2 flex flex-col" ref={bossContainerRef}>
          <div
            className="rounded-3xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(20, 10, 40, 0.7) 0%, rgba(10, 5, 20, 0.8) 100%)",
              border: "1px solid rgba(120, 40, 160, 0.15)",
              boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* HP Bar */}
            <div className="w-full max-w-md mb-6 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span
                  className="font-black text-lg tracking-wide"
                  style={{ color: "#ff4444", textShadow: "0 0 10px rgba(255, 68, 68, 0.4)" }}
                >
                  BOSS
                </span>
                <span className="text-white font-bold text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {gameState?.bossHp ?? 0} / {gameState?.bossMaxHp ?? 500}
                </span>
              </div>
              <div
                className="h-5 rounded-full overflow-hidden relative"
                style={{
                  background: "rgba(30, 15, 50, 0.8)",
                  border: "1px solid rgba(80, 40, 120, 0.3)",
                }}
              >
                <div
                  className="h-full rounded-full relative transition-all duration-700 ease-out"
                  style={{
                    width: `${hpPercent}%`,
                    background: `linear-gradient(180deg, ${hpColor} 0%, ${hpColor}aa 100%)`,
                    boxShadow: `0 0 12px ${hpGlow}, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)`,
                    transition: "width 0.7s ease-out, background 0.5s",
                  }}
                >
                  {/* Shine effect */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: "100%",
                      height: "40%",
                      top: "10%",
                      left: 0,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Boss + Effects container */}
            <div className="relative" style={{ width: 300, height: 300 }}>
              <AttackEffects active={showSlash} />
              <div className="absolute inset-0 flex items-center justify-center">
                <ScaryBoss
                  defeated={gameState?.bossDefeated ?? false}
                  shaking={shakeBoss}
                  hitFlashing={hitFlash}
                />
              </div>

              {/* Damage popup */}
              {lastDamage !== null && (
                <div
                  className="absolute animate-damage font-black pointer-events-none z-20"
                  style={{
                    left: `${damagePosition.x}%`,
                    top: `${damagePosition.y}%`,
                    fontSize: lastDamage >= 15 ? 42 : 34,
                    color: lastDamage >= 15 ? "#ff4444" : "#ffcc00",
                    textShadow:
                      lastDamage >= 15
                        ? "0 0 15px rgba(255,50,50,0.9), 0 0 30px rgba(255,50,50,0.5), 0 3px 6px rgba(0,0,0,0.6)"
                        : "0 0 12px rgba(255,200,0,0.9), 0 0 25px rgba(255,200,0,0.5), 0 3px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  -{lastDamage}
                </div>
              )}
            </div>

            {/* Victory */}
            {gameState?.bossDefeated && (
              <div
                className="mt-4 text-center relative z-10"
                style={{ animation: "victory-bounce 2s ease-in-out infinite" }}
              >
                <p
                  className="text-3xl font-black"
                  style={{
                    background: "linear-gradient(180deg, #ffd700 0%, #ffaa00 40%, #22c55e 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "victory-glow 2s ease-in-out infinite",
                  }}
                >
                  CA LOP CHIEN THANG!
                </p>
              </div>
            )}

            {/* Attack Button */}
            {!gameState?.bossDefeated && (
              <button
                onClick={handleAttack}
                disabled={isAttacking}
                className="btn-3d mt-6 px-14 py-4 rounded-xl text-xl font-black text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed relative z-10"
                style={{
                  background: isAttacking
                    ? "linear-gradient(180deg, #991b1b 0%, #7f1d1d 100%)"
                    : "linear-gradient(180deg, #ef4444 0%, #dc2626 40%, #b91c1c 100%)",
                  boxShadow: isAttacking
                    ? "0 4px 0 #7f1d1d, 0 6px 15px rgba(185, 28, 28, 0.3)"
                    : "0 6px 0 #991b1b, 0 8px 25px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                  border: "none",
                  letterSpacing: 3,
                }}
              >
                {isAttacking ? "DANG DANH..." : "TAN CONG!"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Players + Log */}
        <div className="flex flex-col gap-4">
          {/* Player List */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: "linear-gradient(180deg, rgba(20, 10, 40, 0.7) 0%, rgba(12, 6, 25, 0.8) 100%)",
              border: "1px solid rgba(120, 40, 160, 0.15)",
            }}
          >
            <h2
              className="text-base font-black mb-3 flex items-center gap-2 tracking-wide"
              style={{ color: "rgba(180, 140, 255, 0.9)" }}
            >
              <span style={{ fontSize: 18 }}>&#128101;</span>
              DOI HINH ({gameState?.players.length ?? 0})
            </h2>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {gameState?.players.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background:
                      p.name.toLowerCase() === playerName.toLowerCase()
                        ? "rgba(100, 40, 160, 0.2)"
                        : "rgba(40, 20, 70, 0.4)",
                    border:
                      p.name.toLowerCase() === playerName.toLowerCase()
                        ? "1px solid rgba(140, 80, 200, 0.3)"
                        : "1px solid transparent",
                  }}
                >
                  <span className="text-white text-sm font-bold truncate">
                    {p.name}
                    {p.name.toLowerCase() === playerName.toLowerCase() && (
                      <span
                        className="text-xs ml-1.5 font-semibold"
                        style={{ color: "rgba(180, 140, 255, 0.7)" }}
                      >
                        (ban)
                      </span>
                    )}
                  </span>
                  <span
                    className="text-xs font-black"
                    style={{ color: "#ffaa00", fontVariantNumeric: "tabular-nums" }}
                  >
                    {p.totalDamage} dmg
                  </span>
                </div>
              ))}
              {(!gameState?.players || gameState.players.length === 0) && (
                <p
                  className="text-sm text-center py-4"
                  style={{ color: "rgba(150, 100, 200, 0.4)" }}
                >
                  Chua co ai...
                </p>
              )}
            </div>
          </div>

          {/* Battle Log */}
          <div
            className="rounded-3xl p-5 flex-1"
            style={{
              background: "linear-gradient(180deg, rgba(20, 10, 40, 0.7) 0%, rgba(12, 6, 25, 0.8) 100%)",
              border: "1px solid rgba(120, 40, 160, 0.15)",
            }}
          >
            <h2
              className="text-base font-black mb-3 flex items-center gap-2 tracking-wide"
              style={{ color: "rgba(180, 140, 255, 0.9)" }}
            >
              <span style={{ fontSize: 18 }}>&#128220;</span>
              NHAT KY CHIEN DAU
            </h2>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {[...(gameState?.logs ?? [])]
                .reverse()
                .map((log, i) => (
                  <div
                    key={i}
                    className="text-sm px-3 py-1.5 rounded-lg transition-all duration-200"
                    style={{
                      color:
                        i === 0 ? "#ffcc66" : "rgba(180, 150, 220, 0.6)",
                      background:
                        i === 0
                          ? "rgba(255, 180, 50, 0.08)"
                          : "transparent",
                      fontWeight: i === 0 ? 700 : 400,
                    }}
                  >
                    {log.text}
                  </div>
                ))}
              {(!gameState?.logs || gameState.logs.length === 0) && (
                <p
                  className="text-sm text-center py-4"
                  style={{ color: "rgba(150, 100, 200, 0.4)" }}
                >
                  Chua co hoat dong...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs mt-4 relative z-10" style={{ color: "rgba(120, 80, 180, 0.3)" }}>
        <p>Ca Lop Danh Boss &mdash; Cung nhau chien dau!</p>
        <p className="mt-1" style={{ color: "rgba(120, 80, 180, 0.2)" }}>Created by Hien Hong Hach</p>
      </div>
    </div>
  );
}
