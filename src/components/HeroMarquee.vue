<template>
  <section class="hero">
    <!-- 背景跑馬燈 -->
    <div class="marqueeBg" aria-hidden="true">
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="marqueeRow"
        :style="rowStyle(i)"
      >
        <div class="track">
          <span
            v-for="(t, idx) in row"
            :key="`a-${i}-${idx}-${t.label}`"
            class="token"
            :style="{ color: t.color }"
          >
            {{ t.label }}
          </span>
        </div>
        <div class="track">
          <span
            v-for="(t, idx) in row"
            :key="`b-${i}-${idx}-${t.label}`"
            class="token"
            :style="{ color: t.color }"
          >
            {{ t.label }}
          </span>
        </div>
      </div>

      <div class="vignette" />
      <div class="noise" />
    </div>

    <!-- ✅ 大標題：置中靠上 -->
    <h1 class="heroTitle">
        <span class="title-we">WE</span><br />
        <span class="title-love">LOVE</span><br />
        <span class="title-buddha">BUDDHA</span>
    </h1>

    <!-- ✅ 右下角佛法圖（把圖放到 public/images/buddha.png） -->
    <img
      class="cornerArt"
      src="/images/jim.png"
      alt="佛法意象圖"
    />
  </section>
</template>


<script setup>
import { computed } from "vue";

// 你要跑的文字（想加就加）
const languages = [
  "南無本師釋迦牟尼佛",
  "南無過去七佛",
  "南無燃燈古佛",
  "南無毘盧遮那佛",
  "南無大日如來",
  "南無阿彌陀佛",
  "南無阿閦佛",
  "南無寶生佛",
  "南無不空成就佛",
  "南無藥師琉璃光如來",
  "南無無量壽佛",
  "南無無量光佛",
  "南無彌勒尊佛",
  "南無十方三世一切諸佛",
  "南無清淨法身毘盧遮那佛",
  "南無圓滿報身盧舍那佛",
  "南無千百億化身釋迦牟尼佛",
  "南無常住十方佛",
  "南無十方常住法",
  "南無十方常住僧"
];


// 顏色池：你可改成品牌色（這裡先做出「多彩」的感覺）
const palette = [
  "#7C3AED", "#22C55E", "#06B6D4", "#F97316", "#EF4444",
  "#EAB308", "#3B82F6", "#F472B6", "#A3E635", "#FB7185"
];

// 產生一個 token（語言 + 顏色）
function makeToken(label, seed) {
  // 用 seed 讓顏色穩定（同一語言每次都同色）
  const idx = Math.abs(hash(label + ":" + seed)) % palette.length;
  return { label, color: palette[idx] };
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

// 幾條跑馬燈（可調）
const ROW_COUNT = 32;

// 每一列內容：把 languages 打散重複塞滿，避免空隙
const rows = computed(() => {
  const out = [];
  for (let r = 0; r < ROW_COUNT; r++) {
    const shuffled = [...languages].sort((a, b) => hash(a + r) - hash(b + r));
    // 讓每列夠長：重複拼接幾次
    const repeated = [];
    for (let k = 0; k < 5; k++) repeated.push(...shuffled);
    out.push(repeated.map((x) => makeToken(x, r)));
  }
  return out;
});

// 每列速度/方向/透明度做些差異
function rowStyle(i) {
  // 越往後層：更慢、更淡、更小、更模糊
  const depth = i / (ROW_COUNT - 1); // 0~1

  const duration = 55 + i * 10; // 越深層越慢（可再加大）
  const reverse = i % 2 === 1;

  // ✅ 位置：用固定的 pseudo-random（不要每次 render 跳動）
  const rand = (seed) => {
    const x = Math.sin((i + 1) * 999 + seed) * 10000;
    return x - Math.floor(x);
  };

  const top = 8 + rand(1) * 84;             // 8% ~ 92%
  const scale = 1.25 - depth * 0.55 + (rand(2) - 0.5) * 0.12; // 近大遠小（含些微隨機）
  const opacity = 0.22 - depth * 0.14 + (rand(3) - 0.5) * 0.06; // 近實遠淡
  const blur = (depth * 1.2 + rand(4) * 0.6).toFixed(2) + "px"; // 遠更糊
  const skew = ((rand(5) - 0.5) * 8).toFixed(2) + "deg";        // 每列微微不同傾斜

  // ✅ 層級：近的在上面
  const z = Math.round(100 - depth * 60);

  return {
    "--duration": `${duration}s`,
    "--direction": reverse ? "reverse" : "normal",
    "--top": `${top}%`,
    "--scale": scale.toFixed(3),
    "--opacity": Math.max(0.05, Math.min(0.35, opacity)).toFixed(3),
    "--blur": blur,
    "--skew": skew,
    zIndex: z
  };
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  background: #ffffff;
  overflow: hidden;
}

/* ===== 背景跑馬燈 ===== */
.marqueeBg {
  position: absolute;
  inset: 0;
  /* 不要 grid，改成疊層容器 */
  pointer-events: none;
  transform: rotate(-10deg) scale(1.15);
  transform-origin: center;
}

.marqueeRow {
  position: absolute;
  left: -20%;
  right: -20%;
  top: var(--top);

  display: flex;
  opacity: var(--opacity);

  /* ✅ 景深感：scale + blur + skew */
  transform: translateY(-50%) scale(var(--scale)) skewX(var(--skew));
  filter: blur(var(--blur));

  /* 讓文字更密集、更像一片 */
  mix-blend-mode: multiply; /* 白底更有層次；不喜歡可刪 */
}

.track {
  display: inline-flex;
  gap: 10px;
  white-space: nowrap;
  animation: scroll var(--duration) linear infinite;
  animation-direction: var(--direction);
  padding-right: 10px;
}

/* ✅ 中文跑馬燈：不要 uppercase、字距小一點、陰影改黑色微陰影 */
.token {
  font-size: clamp(18px, 3vw, 38px);
  letter-spacing: 0.04em; /* 原本 0.08em */
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
  /* 刪掉 uppercase：中文不需要 */
  /* text-transform: uppercase; */
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* ✅ 白底暗角：淡淡灰就好（不要黑霧） */
.vignette {
  position: absolute;
  inset: -20%;
  background: radial-gradient(
    60% 60% at 50% 40%,
    rgba(255,255,255,0) 0%,
    rgba(0,0,0,0.06) 70%,
    rgba(0,0,0,0.10) 100%
  );
  pointer-events: none;
}

/* ✅ 雜訊：白底要很淡 */
.noise {
  position: absolute;
  inset: -30%;
  opacity: 0.05;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.title-buddha {
  /* 漸層本體 */
  background: linear-gradient(
    90deg,
    #ff7ac8,
    #ffb3d9,
    #6ee7e7,
    #4fd1c5
  );

  /* 讓漸層能移動 */
  background-size: 300% 300%;

  /* 把背景裁成文字 */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  /* 漸層流動動畫 */
  animation: buddhaFlow 6s ease-in-out infinite;

  /* 微微發光，讓字有靈性 */
  filter: drop-shadow(0 6px 18px rgba(255, 122, 200, 0.25));
}

/* ===== ✅ 大標題：置中靠上 ===== */
.heroTitle {
  position: relative;
  z-index: 3;
  margin: 0;
  text-align: center;

  /* 靠上位置（可微調：6~12vh 看你喜好） */
  padding-top: 8vh;

  font-size: clamp(64px, 10vw, 170px);
  line-height: 0.85;
  letter-spacing: -0.02em;
  font-weight: 900;

  color: #111;
}
.title-we,
.title-love,
.title-buddha {
  font-weight: 900;
}

.title-love {
  color: #E11D48;
  filter: drop-shadow(0 6px 18px rgba(225, 29, 72, 0.25));
}

/* ===== ✅ 右下角圖 ===== */
.cornerArt {
  position: absolute;
  right: 4vw;
  bottom: 4vh;
  z-index: 3;

  width: min(44vw, 560px);
  max-height: 72vh;
  object-fit: contain;

  filter: drop-shadow(0 18px 30px rgba(0,0,0,0.18));
  pointer-events: none;
  user-select: none;
}

/* 手機版：避免蓋到標題 */
@media (max-width: 640px) {
  .heroTitle {
    padding-top: 10vh;
    font-size: clamp(52px, 14vw, 120px);
    line-height: 0.9;
  }
  .cornerArt {
    width: min(70vw, 360px);
    right: 3vw;
    bottom: 3vh;
    opacity: 0.95;
  }
}

/* 減少動態偏好 */
@media (prefers-reduced-motion: reduce) {
  .track { animation: none; }
  .marqueeBg { transform: none; }
}

@keyframes buddhaFlow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

