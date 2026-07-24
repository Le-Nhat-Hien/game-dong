// ============================================================
// BACKEND - Trạng thái game lưu trong bộ nhớ (in-memory)
// ============================================================
// Lưu ý: Biến toàn cục này chỉ tồn tại trong 1 instance server.
// Trên Vercel serverless, mỗi cold start sẽ reset trạng thái.
// Đây là cách đơn giản để demo, chưa cần database.

export interface Player {
  name: string;
  totalDamage: number;
}

export interface LogEntry {
  text: string;
  timestamp: number;
}

export interface GameState {
  bossHp: number;
  bossMaxHp: number;
  players: Player[];
  logs: LogEntry[];
  bossDefeated: boolean;
}

// Giá trị mặc định
const BOSS_MAX_HP = 500;
const MAX_LOGS = 8;

function createInitialState(): GameState {
  return {
    bossHp: BOSS_MAX_HP,
    bossMaxHp: BOSS_MAX_HP,
    players: [],
    logs: [],
    bossDefeated: false,
  };
}

// Biến toàn cục để giữ trạng thái giữa các request trong cùng 1 instance.
// eslint-disable-next-line no-var
var globalState: GameState | null = null;

function getState(): GameState {
  if (!globalState) {
    globalState = createInitialState();
  }
  return globalState;
}

export function resetGame(): GameState {
  globalState = createInitialState();
  return globalState;
}

export function addPlayer(name: string): { success: boolean; message: string } {
  const state = getState();

  if (state.bossDefeated) {
    resetGame();
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return { success: false, message: "Tên không được để trống!" };
  }

  if (trimmed.length > 20) {
    return { success: false, message: "Tên quá dài (tối đa 20 ký tự)!" };
  }

  const exists = state.players.find(
    (p) => p.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (exists) {
    return { success: false, message: "Tên này đã có người dùng!" };
  }

  state.players.push({ name: trimmed, totalDamage: 0 });
  addLog(`${trimmed} đã gia nhập trận chiến!`);
  return { success: true, message: "Thành công!" };
}

export function attackBoss(
  playerName: string
): { success: boolean; damage: number; message: string } {
  const state = getState();

  if (state.bossDefeated) {
    return { success: false, damage: 0, message: "Boss đã bị đánh bại!" };
  }

  const player = state.players.find(
    (p) => p.name.toLowerCase() === playerName.toLowerCase()
  );
  if (!player) {
    return {
      success: false,
      damage: 0,
      message: "Bạn chưa gia nhập trận chiến!",
    };
  }

  const damage = Math.floor(Math.random() * 16) + 5; // 5 - 20
  state.bossHp = Math.max(0, state.bossHp - damage);
  player.totalDamage += damage;

  addLog(`${player.name} đánh ${damage} máu!`);

  if (state.bossHp <= 0) {
    state.bossDefeated = true;
    addLog("Boss đã bị đánh bại! Cả lớp chiến thắng!");
  }

  return { success: true, damage, message: `Gây ${damage} sát thương!` };
}

function addLog(text: string) {
  const state = getState();
  state.logs.push({ text, timestamp: Date.now() });
  if (state.logs.length > MAX_LOGS) {
    state.logs = state.logs.slice(-MAX_LOGS);
  }
}

export function getGameState(): GameState {
  return getState();
}
