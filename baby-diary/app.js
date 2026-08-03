/* =========================================================
   오늘의 아이 — 하루 기록 카드
   입력 → 감성 카드 자동 생성(시안 3종) → 캡션 자동 → 저장/인스타 공유
   ========================================================= */
(() => {
  "use strict";

  const RATIOS = { "4:5": { w: 1080, h: 1350 }, "9:16": { w: 1080, h: 1920 } };
  const MOODS = ["😊", "🥰", "😆", "😌", "😴", "😭", "🤒", "😳"];
  const WEATHERS = ["☀️", "⛅", "☁️", "🌧️", "⛈️", "❄️", "🌈", "🌙"];

  const SANS  = '"Noto Sans KR",sans-serif';
  const SUB   = '"Noto Sans KR",sans-serif';

  // 글씨 무드: 이름(name) / 포인트 한마디(point)
  const FONT_THEMES = {
    serif:  { nameFam: '"Noto Serif KR",serif',    nameW: 600, ptFam: '"Gowun Batang","Noto Serif KR",serif', ptW: 700, ptScale: 0.92 },
    hand:   { nameFam: '"Jua",sans-serif',         nameW: 400, ptFam: '"Gaegu",cursive',                      ptW: 700, ptScale: 1.04 },
    gothic: { nameFam: '"Gowun Dodum",sans-serif', nameW: 400, ptFam: '"Gowun Dodum",sans-serif',             ptW: 400, ptScale: 0.8 },
  };
  let TH = FONT_THEMES.serif;
  const fName  = (s) => `${TH.nameW} ${Math.round(s)}px ${TH.nameFam}`;
  const fPoint = (s) => `${TH.ptW} ${Math.round(s * TH.ptScale)}px ${TH.ptFam}`;
  const fSub   = (s, w = 600) => `${w} ${Math.round(s)}px ${SUB}`;

  const INK = "#3b342b", MUTED = "#9a8f7d", PAPER = "#faf6ee", CARD = "#fffdf9";
  const ACCENT = "#7f9469";

  const $ = (id) => document.getElementById(id);
  const canvas = $("card"), ctx = canvas.getContext("2d");

  const state = {
    ratio: "4:5", layout: "band", fontMood: "serif",
    photo: null, name: "", birth: "", mood: "😊", weather: "☀️", point: "", memo: "",
  };
  let W = 1080, H = 1350;

  // ---------- 초기화 ----------
  function init() {
    buildPicker($("moodPick"), MOODS, "mood");
    buildPicker($("weatherPick"), WEATHERS, "weather");
    bindUI();
    render();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render).catch(() => {});
  }

  function buildPicker(box, list, key) {
    box.innerHTML = "";
    list.forEach((em) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "emoji-btn" + (state[key] === em ? " is-active" : "");
      b.textContent = em;
      b.addEventListener("click", () => {
        state[key] = em;
        Array.from(box.children).forEach((c) => c.classList.toggle("is-active", c === b));
        render();
      });
      box.appendChild(b);
    });
  }

  function bindUI() {
    $("fileInput").addEventListener("change", onFile);
    $("nameInput").addEventListener("input", (e) => { state.name = e.target.value; render(); });
    $("birthInput").addEventListener("input", (e) => { state.birth = e.target.value; render(); });
    $("pointInput").addEventListener("input", (e) => { state.point = e.target.value; render(); });
    $("memoInput").addEventListener("input", (e) => { state.memo = e.target.value; buildCaption(); });

    document.querySelectorAll("[data-ratio]").forEach((b) =>
      b.addEventListener("click", () => {
        state.ratio = b.dataset.ratio;
        setActive(b, "[data-ratio]");
        render();
      }));
    document.querySelectorAll("[data-layout]").forEach((b) =>
      b.addEventListener("click", () => {
        state.layout = b.dataset.layout;
        setActive(b, "[data-layout]");
        render();
      }));
    document.querySelectorAll("[data-font]").forEach((b) =>
      b.addEventListener("click", () => {
        state.fontMood = b.dataset.font;
        setActive(b, "[data-font]");
        render();
      }));

    $("downloadBtn").addEventListener("click", download);
    $("shareBtn").addEventListener("click", share);
    $("copyBtn").addEventListener("click", copyCaption);
  }
  function setActive(btn, sel) {
    document.querySelectorAll(sel).forEach((x) => x.classList.toggle("is-active", x === btn));
  }

  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { state.photo = img; $("fileBtnLabel").textContent = "사진 바꾸기"; render(); };
    img.src = URL.createObjectURL(file);
    e.target.value = "";
  }

  // ---------- 날짜/나이 ----------
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }
  function ageParts() {
    if (!state.birth) return null;
    const b = new Date(state.birth + "T00:00:00");
    const t = new Date(); t.setHours(0, 0, 0, 0);
    if (isNaN(b) || b > t) return null;
    const days = Math.floor((t - b) / 86400000) + 1;   // 생일=1일차 (100일 문화)
    let months = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
    let dd = t.getDate() - b.getDate();
    if (dd < 0) { months--; dd += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    return { days, months, dd };
  }
  function nameOr() { return state.name.trim() || "우리 아기"; }
  function ageShort() {
    const a = ageParts();
    return a ? `생후 ${a.days}일` : "";
  }
  function ageLong() {
    const a = ageParts();
    return a ? `생후 ${a.days}일 · ${a.months}개월 ${a.dd}일` : "";
  }

  // ---------- 렌더 ----------
  function render() {
    TH = FONT_THEMES[state.fontMood] || FONT_THEMES.serif;
    const r = RATIOS[state.ratio]; W = r.w; H = r.h;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    if (state.layout === "minimal") layoutMinimal();
    else if (state.layout === "diary") layoutDiary();
    else layoutBand();
    buildCaption();
  }

  // 공통 유틸
  function roundRectPath(x, y, w, h, rad) {
    const r = Math.min(rad, w / 2, h / 2);
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawCover(img, x, y, w, h, rad) {
    ctx.save();
    if (rad) { roundRectPath(x, y, w, h, rad); ctx.clip(); } else { ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }
    const ir = img.width / img.height, rr = w / h; let dw, dh;
    if (ir > rr) { dh = h; dw = h * ir; } else { dw = w; dh = w / ir; }
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
  }
  function placeholder(x, y, w, h, rad) {
    ctx.save();
    if (rad) { roundRectPath(x, y, w, h, rad); ctx.clip(); }
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, "#eef1e6"); g.addColorStop(1, "#e3ddce");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#b9b1a0"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${Math.round(w * 0.09)}px ${SANS}`;
    ctx.fillText("🐣", x + w / 2, y + h / 2 - w * 0.04);
    ctx.font = `${Math.round(w * 0.035)}px ${SANS}`;
    ctx.fillText("사진을 올려주세요", x + w / 2, y + h / 2 + w * 0.06);
    ctx.restore();
  }
  function wrapLines(text, maxW, max) {
    const out = [];
    String(text).split("\n").forEach((par) => {
      let cur = "";
      for (const ch of par) {
        const test = cur + ch;
        if (ctx.measureText(test).width > maxW && cur) { out.push(cur); cur = ch; }
        else cur = test;
      }
      out.push(cur);
    });
    return max ? out.slice(0, max) : out;
  }
  function shadowOn() { ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 1; }
  function shadowOff() { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }
  function fillPaper() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#fbf8f1"); g.addColorStop(1, PAPER);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function emojiPair() { return `${state.mood} ${state.weather}`; }

  // 크레파스 질감: 통통한 손글씨(개구) + 알갱이(grain) 패턴으로 채우기
  const crayonFont = (s) => `700 ${Math.round(s)}px "Gaegu","Nanum Pen Script",cursive`;
  const _crayonCache = {};
  function crayonPattern(r, g, b) {
    const key = r + "," + g + "," + b;
    if (_crayonCache[key]) return _crayonCache[key];
    const n = document.createElement("canvas"); n.width = n.height = 110;
    const c = n.getContext("2d");
    const img = c.createImageData(110, 110); const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = r; d[i + 1] = g; d[i + 2] = b;
      // 알갱이: 일부 픽셀은 비워 종이가 비치게 → 왁스 질감
      d[i + 3] = Math.random() < 0.22 ? Math.floor(Math.random() * 70) : 200 + Math.floor(Math.random() * 55);
    }
    c.putImageData(img, 0, 0);
    return (_crayonCache[key] = ctx.createPattern(n, "repeat"));
  }

  // ---------- 레이아웃: 밴드 ----------
  function layoutBand() {
    if (state.photo) drawCover(state.photo, 0, 0, W, H); else placeholder(0, 0, W, H);

    let g = ctx.createLinearGradient(0, H * 0.42, 0, H);
    g.addColorStop(0, "rgba(30,26,20,0)"); g.addColorStop(1, "rgba(25,21,16,0.62)");
    ctx.fillStyle = g; ctx.fillRect(0, H * 0.42, W, H * 0.58);
    let gt = ctx.createLinearGradient(0, 0, 0, H * 0.2);
    gt.addColorStop(0, "rgba(25,21,16,0.3)"); gt.addColorStop(1, "rgba(25,21,16,0)");
    ctx.fillStyle = gt; ctx.fillRect(0, 0, W, H * 0.2);

    const pad = 76;
    drawPill(pad, pad, todayStr());

    ctx.textAlign = "left";
    shadowOn();
    // 이름 · 나이 · 기분/날씨 (한 줄, 맨 아래)
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = fSub(40, 700);
    const info = nameOr() + (ageShort() ? "  ·  " + ageShort() : "") + "   " + emojiPair();
    ctx.fillText(info, pad, H - pad);
    // 포인트 한마디 (무드 폰트, 위로)
    ctx.fillStyle = "#fff";
    ctx.font = fPoint(102);
    const lh = Math.round(102 * TH.ptScale * 1.06);
    const lines = wrapLines(state.point || "오늘도 사랑스러운 하루", W - pad * 2, 2);
    let y = H - pad - 62;
    for (let i = lines.length - 1; i >= 0; i--) { ctx.fillText(lines[i], pad, y); y -= lh; }
    shadowOff();
  }
  function drawPill(x, y, text) {
    ctx.font = `600 30px ${SANS}`;
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    const padX = 22, padY = 13, tw = ctx.measureText(text).width;
    roundRectPath(x, y, tw + padX * 2, 30 + padY * 2, 999);
    ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.fill();
    ctx.fillStyle = INK; ctx.fillText(text, x + padX, y + padY + 1);
  }

  // ---------- 레이아웃: 미니멀 ----------
  function layoutMinimal() {
    fillPaper();
    const pad = W * 0.09;
    const pw = W - pad * 2, ph = pw;   // 정사각 사진
    const py = pad;
    if (state.photo) drawCover(state.photo, pad, py, pw, ph, 26);
    else placeholder(pad, py, pw, ph, 26);
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(59,52,43,0.10)";
    roundRectPath(pad, py, pw, ph, 26); ctx.stroke();

    let ty = py + ph + pad * 0.72;
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    // 날짜 · 기분/날씨 (한 줄)
    ctx.fillStyle = MUTED; ctx.font = fSub(30, 500);
    ctx.fillText(todayStr() + "     " + emojiPair(), pad, ty);
    ty += 78;
    // 이름 (무드 폰트)
    ctx.fillStyle = INK; ctx.font = fName(66);
    ctx.fillText(nameOr(), pad, ty);
    ty += 54;
    // 나이
    if (ageLong()) {
      ctx.fillStyle = ACCENT; ctx.font = fSub(32, 600);
      ctx.fillText(ageLong(), pad, ty); ty += 62;
    } else { ty += 22; }
    // 포인트 (무드 폰트)
    ctx.fillStyle = INK; ctx.font = fPoint(70);
    const lh = Math.round(70 * TH.ptScale * 1.08);
    wrapLines(state.point || "오늘도 사랑스러운 하루", pw, 2).forEach((ln) => {
      ctx.fillText(ln, pad, ty); ty += lh;
    });
  }

  // ---------- 레이아웃: 그림일기 (옛날 그림일기장 양식) ----------
  function layoutDiary() {
    fillPaper();
    const pad = W * 0.07;
    const right = W - pad;
    let y = pad;

    // 헤더 박스: 날짜·요일 | 날씨 | 기분
    const headH = W * 0.135;
    ctx.strokeStyle = "rgba(59,52,43,0.30)"; ctx.lineWidth = 3;
    roundRectPath(pad, y, W - pad * 2, headH, 14); ctx.stroke();
    const x1 = pad + (W - pad * 2) * 0.56, x2 = pad + (W - pad * 2) * 0.78;
    ctx.beginPath();
    ctx.moveTo(x1, y + 10); ctx.lineTo(x1, y + headH - 10);
    ctx.moveTo(x2, y + 10); ctx.lineTo(x2, y + headH - 10); ctx.stroke();
    // 날짜/요일
    const d = new Date(); const dow = "일월화수목금토"[d.getDay()];
    ctx.fillStyle = INK; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.font = fSub(36, 600);
    ctx.fillText(`${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${dow})`, pad + 28, y + headH / 2);
    // 날씨 / 기분
    ctx.textAlign = "center";
    const cellMid1 = (x1 + x2) / 2, cellMid2 = (x2 + right) / 2;
    ctx.fillStyle = MUTED; ctx.font = fSub(24, 700);
    ctx.fillText("날씨", cellMid1, y + headH * 0.32);
    ctx.fillText("기분", cellMid2, y + headH * 0.32);
    ctx.fillStyle = INK; ctx.font = `44px ${SANS}`;
    ctx.fillText(state.weather, cellMid1, y + headH * 0.66);
    ctx.fillText(state.mood, cellMid2, y + headH * 0.66);
    y += headH + pad * 0.5;

    // 이름 · 나이
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ACCENT; ctx.font = fSub(30, 700);
    ctx.fillText(nameOr() + (ageShort() ? "  ·  " + ageShort() : ""), pad, y + 22);
    y += 50;

    // 그림(사진) 칸
    const picH = W * 0.54;
    if (state.photo) drawCover(state.photo, pad, y, W - pad * 2, picH, 12);
    else placeholder(pad, y, W - pad * 2, picH, 12);
    ctx.strokeStyle = "rgba(59,52,43,0.30)"; ctx.lineWidth = 3;
    roundRectPath(pad, y, W - pad * 2, picH, 12); ctx.stroke();
    y += picH + pad * 0.5;

    // 제목(포인트 한마디) — 코랄 크레파스
    if (state.point.trim()) {
      ctx.font = crayonFont(60); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = crayonPattern(206, 96, 78);
      ctx.fillText("“" + state.point.trim() + "”", pad, y + 46);
      y += 82;
    }

    // 줄 친 글쓰기 칸 + 메모 — 갈색 크레파스 손글씨
    const gap = 66;
    ctx.font = crayonFont(44);
    const memo = state.memo.trim();
    const lines = wrapLines(memo || "오늘 우리 아이의 하루를 적어보세요", W - pad * 2, 30);
    let ly = y, li = 0;
    while (ly + gap <= H - pad * 0.7) {
      ctx.strokeStyle = "rgba(59,52,43,0.13)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pad, ly + gap * 0.78); ctx.lineTo(right, ly + gap * 0.78); ctx.stroke();
      if (li < lines.length && lines[li]) {
        ctx.font = crayonFont(44);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = memo ? crayonPattern(96, 72, 54) : "rgba(154,143,125,0.65)";
        ctx.fillText(lines[li], pad + 6, ly + gap * 0.56);
      }
      li++; ly += gap;
    }
  }

  // ---------- 캡션 ----------
  function buildCaption() {
    const L = [];
    const head = `👶 ${nameOr()}` + (ageLong() ? ` · ${ageLong()}` : "");
    L.push(head);
    L.push(`${state.mood} 오늘의 기분   ${state.weather} 날씨`);
    if (state.point.trim()) L.push(`✎ ${state.point.trim()}`);
    L.push("");
    if (state.memo.trim()) { L.push(state.memo.trim()); L.push(""); }
    const tags = ["#육아일기", "#오늘의아이", "#" + nameOr().replace(/\s+/g, "")];
    const a = ageParts();
    if (a) tags.push(`#생후${a.days}일`, `#${a.months}개월아기`);
    L.push(tags.join(" "));
    $("captionOut").value = L.join("\n");
  }

  // ---------- 저장 / 공유 / 복사 ----------
  async function fontsReady() {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (_) {} }
  }
  function fileName() { return `오늘의아이_${todayStr().replace(/\./g, "")}.png`; }
  async function toBlob() { await fontsReady(); render(); return new Promise((r) => canvas.toBlob(r, "image/png")); }

  async function download() {
    const blob = await toBlob();
    const a = document.createElement("a");
    a.download = fileName(); a.href = URL.createObjectURL(blob); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function share() {
    const blob = await toBlob();
    if (!blob) { alert("카드를 만들지 못했어요. 다시 시도해주세요."); return; }
    const file = new File([blob], fileName(), { type: "image/png" });
    const caption = $("captionOut").value;
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: caption, title: "오늘의 아이" });
      } catch (err) { if (err && err.name !== "AbortError") saveFallback(blob); }
    } else {
      saveFallback(blob);
      alert("이 브라우저는 바로 공유가 안 돼요. 저장된 카드를 인스타에 올리고, 캡션은 복사해서 붙여주세요! (아이폰 사파리 권장)");
    }
  }
  function saveFallback(blob) {
    const a = document.createElement("a");
    a.download = fileName(); a.href = URL.createObjectURL(blob); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function copyCaption() {
    const text = $("captionOut").value;
    try { await navigator.clipboard.writeText(text); flash($("copyBtn"), "복사됨!"); }
    catch (_) {
      const ta = $("captionOut"); ta.removeAttribute("readonly"); ta.select();
      try { document.execCommand("copy"); flash($("copyBtn"), "복사됨!"); } catch (e) {}
      ta.setAttribute("readonly", "true"); window.getSelection().removeAllRanges();
    }
  }
  function flash(btn, txt) {
    const old = btn.textContent; btn.textContent = txt;
    setTimeout(() => { btn.textContent = old; }, 1200);
  }

  init();
})();
