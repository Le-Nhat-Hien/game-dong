# CA LOP DANH BOSS

> *Toi bi ep (🥺)*

Game mini **"Ca Lop Danh Boss"** - Moi nguoi trong lop cung nhau danh chung 1 con Boss! Nhap ten, bam nut, va chien dau cung ban be.

---

## 🎮 Huong dan choi

1. Nhap ten nguoi choi vao o text
2. Bam **VAO TRAN** de bat dau
3. Bam **TAN CONG!** de danh Boss (sat thuong random 5-20)
4. Moi nguoi cung danh, Boss se bi giet dan
5. Khi Boss het mau -> **CA LOP CHIEN THANG!**

Mo nguoi co the mo nhieu tab/trinh duyet khac nhau, nhap ten khac nhau de "gia lap" nhieu nguoi choi cung luc.

---

## ⚙️ Ky thuat

| Thanh phan | Cong nghe |
|---|---|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes |
| Trang thai | In-memory (global variable) |
| Font | Nunito (Google Fonts) |
| Deploy | Vercel |

### Cau truc thu muc

```
game-dong/
├── lib/
│   └── game-state.ts          # BACKEND - Trang thai game in-memory
├── app/
│   ├── api/
│   │   ├── join/route.ts      # POST /api/join   - Them nguoi choi
│   │   ├── attack/route.ts    # POST /api/attack  - Tan cong boss
│   │   └── state/route.ts     # GET  /api/state   - Lay trang thai
│   ├── page.tsx               # FRONTEND - Game UI (lobby + battle)
│   ├── globals.css            # Animations, boss aura, hieu ung
│   └── layout.tsx             # Root layout, font Nunito
└── README.md
```

### API Routes

- **POST /api/join** - Gui `{ "name": "Ten" }` de them nguoi choi
- **POST /api/attack** - Gui `{ "playerName": "Ten" }` de danh boss, tra ve sat thuong
- **GET /api/state** - Tra ve `{ bossHp, bossMaxHp, players, logs, bossDefeated }`

---

## 🚀 Chay local

```bash
git clone https://github.com/Le-Nhat-Hien/game-dong.git
cd game-dong
npm install
npm run dev
```

Mo trinh duyet tai `http://localhost:3000`

---

## 🌐 Deploy len Vercel

1. Fork/Clone repo nay
2. Vao [vercel.com](https://vercel.com) → New Project
3. Import repo `Le-Nhat-Hien/game-dong`
4. Bam **Deploy**

---

## ⚠️ Luu y

Trang thai game duoc luu **in-memory** (bien toan cuc tren server). tren Vercel serverless, trang thai se bi reset khi cold start. Day la cach don gian de demo, phu hop cho hoc lop/hoc sinh.

---

*Created by Hien Hong Hach*
