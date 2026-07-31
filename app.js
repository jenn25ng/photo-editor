/* =========================================================
   꾸미사진 — 인스타 꾸미기 에디터
   - 배경(사진/색) + 손글씨(펜) + 개체(텍스트/이모지/기호/스티커)
   - 개체는 드래그로 이동, 코너 핸들로 크기·회전
   - 저장은 1080px 기준 고해상도 PNG
   ========================================================= */
(() => {
  "use strict";

  // ---------- 상수 ----------
  const RATIOS = {
    "4:5": { w: 1080, h: 1350 },
    "9:16": { w: 1080, h: 1920 },
  };
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const SYMBOL_FONT = '"Noto Sans KR","Apple SD Gothic Neo",sans-serif';

  // 이모지 (아이폰에서는 애플 이모지로 렌더됨) — 카테고리별
  const EMOJI_CATS = {
    "표정": ["😀","😄","😆","🥹","😍","🥰","😘","😗","😙","😚","🤗","🤭","😎","🤩",
      "🥳","😏","😉","😜","😋","🤔","🙄","😶","😴","😪","😭","😢","🥺","😳","😱","🤯","😤","🥱","🙈","🙉","🙊"],
    "하트": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖","💗","💓","💞","💕",
      "💘","💝","💟","❣️","💔","♥️","♡","💌","💋","😻"],
    "반짝": ["✨","⭐","🌟","💫","⚡","🔥","🌈","☀️","🌙","⛅","☁️","❄️","💥","💦","💨","🎆","🎇","🪄","👑","💎"],
    "자연": ["🌸","🌺","🌷","🌹","🌻","🌼","💐","🌿","🍀","🍃","🌱","🌴","🌊","🍄","🐚","🌍","🌝","🌚","🪷"],
    "음식": ["🍓","🍒","🍑","🍎","🍊","🍋","🍉","🍇","🍏","🥝","🍰","🧁","🍩","🍪","🍭","🍬","🍫","🍦","☕","🧋","🍾","🥂","🍷"],
    "동물": ["🐶","🐱","🐰","🐻","🐼","🐨","🦊","🐯","🦁","🐸","🐥","🐤","🐧","🦋","🐝","🐬","🐳","🦄","🐢"],
    "기타": ["🎀","🎁","🎉","🎊","🎈","💯","✅","❌","❗","❓","💤","💢","🎧","🎵","🎶","📸","📷","👍","👏","🙌","🤳","✌️","🤟","💪"],
  };

  // 감성 특수문자 템플릿 (유니코드 조합, 자유 사용 가능) — 카테고리별
  const TEMPLATES = {
    "하트": ["♡","❤","♥","❥","ღ","❣","ꨄ","♡⃛","˚ʚ♡ɞ˚","˚₊· ͟͟͞͞➳❥","♡( ◡‿◡ )",
      "(♡ᴗ♡)","˚｡⋆♡","・゚♡",".ᐟ♡","♡‧₊˚","ღ˘‿˘ღ","꒰♡꒱","•♡•","ᥫᩣ","𖹭"],
    "별·반짝": ["⭐","★","☆","✦","✧","✩","⋆","˚","✨","💫","⭒","⋆｡°✩","⋆౨ৎ˚",
      "‧₊˚✧","˚ ✦ ·","⋆⭒˚｡⋆","｡ﾟ✧","⟡","⊹˚","✦ ˚ · .","˖⁺‧₊","｡₊✩","·˚ ✧"],
    "꽃": ["❀","✿","✾","❁","⚘","🌸","🌷","𖥔","❀.｡.:*","✿ ⋆","‧₊˚✿","◌ ⑅ ◌",
      "𓆸","🌿","🍃","❀◟","花","⌘⋆","✽","❃"],
    "라인": ["•┈┈♡┈┈•","˚｡⋆୨୧˚","꒰ঌ ໒꒱","─── ・ 。゚☆","•°• ✩ •°•","╰┈➤","➶","↳",
      "「 」","『 』","≡","⋆˚꩜｡","•̩̩͙⊰•̩̩͙","◜◝","◞◟","┈┈┈┈","⊹ ࣪ ˖","▸","◂","꒷꒦"],
    "얼굴": ["♡(˘▾˘)♡","(｡•̀ᴗ-)✧","꒰⍢꒱","ദ്ദി ˶ᵔ ᵕ ᵔ˶","(๑˃ᴗ˂)ﻭ","٩(◕‿◕)۶","(・∀・)",
      "(>ω<)","(っ˘ω˘ς )","(｡♡‿♡｡)","(◍•ᴗ•◍)","( ˶ˆ꒳ˆ˵ )","ʕ•ᴥ•ʔ","(*ˊᵕˋ*)","(◡‿◡)","˶ᵔ ᵕ ᵔ˶","( ｡•̀ ᴗ - )✧","꒰๑ ᵔ ᵕ ᵔ ๑꒱","(⑉˃̶᷄꒳˂̶᷅⑉)"],
    "감성": ["⊹ ࣪ ˖","࣪ ˖ ✿","‧₊˚ ⋅","˚ ༘ ೀ⋆｡˚","𓂃 ࣪˖","ꕥ","๑","⌇","❪ ❫","⸝⸝",".ᐟ",
      "ᯓ★","⟢","⟣","𓄼","𓏸","𓂅","◠‿◠","❥•*¨*•.¸¸♪","·͙*̩̩͙˚̩̥̩̥*̩̩̥͙"],
  };

  // 스티커 (장식용 이모지/기호)
  const STICKER_CATS = {
    "기본": ["💯","✅","❌","⭕","❗","❓","💤","💢","💦","💨","🕊️","🌊","🎧","🎵","🎶",
      "📸","📷","🎂","🍾","🥂","🎈","🪄","🩷","🫧","🌷","🔖","💬","🗯️"],
    "기호": ["★","☆","♥","♡","✦","✧","❤","➳","➤","♪","♫","☑","✔","✿","❀","⚘","❁",
      "☾","☼","✪","⌘","☕","❄","✵","✷","❖","◆","◇","♢"],
  };

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const bgCanvas = $("bgCanvas"), drawCanvas = $("drawCanvas");
  const bgCtx = bgCanvas.getContext("2d");
  const dctx = drawCanvas.getContext("2d");
  const stageInner = $("stageInner"), stageWrap = $("stageWrap"), stageScroll = $("stageScroll");
  const objectsLayer = $("objectsLayer"), emptyHint = $("emptyHint");

  const fileInput = $("fileInput"), bgColorInput = $("bgColorInput");
  const penColor = $("penColor"), penSize = $("penSize"), penSizeLabel = $("penSizeLabel"), penEraser = $("penEraser");
  const addTextBtn = $("addTextBtn"), fontSelect = $("fontSelect"), textColor = $("textColor");
  const trayItems = $("trayItems"), trayCats = $("trayCats");
  const objSize = $("objSize"), objRotate = $("objRotate");
  const objEdit = $("objEdit"), objFront = $("objFront"), objDelete = $("objDelete");
  const objColor = $("objColor"), objColorWrap = $("objColorWrap");

  const panels = {
    pen: $("panel-pen"), text: $("panel-text"), tray: $("panel-tray"), selected: $("panel-selected"),
  };
  const modeBtns = Array.from(document.querySelectorAll(".mode-btn"));
  const segBtns = Array.from(document.querySelectorAll(".seg-btn"));

  // ---------- 상태 ----------
  const state = {
    ratio: "4:5",
    mode: "select",
    penColor: "#ff2d6b",
    penSize: 14,
    eraser: false,
    font: "Nanum Pen Script",
    textColor: "#222222",
    bgColor: "#ffffff",
    bgImage: null,
    objects: [],
    selectedId: null,
    seq: 0,
    addOffset: 0,
    hasBg: false,
    trayCat: { emoji: "표정", kaomoji: "하트", sticker: "기본" },
  };
  const TRAY_DATA = { emoji: EMOJI_CATS, kaomoji: TEMPLATES, sticker: STICKER_CATS };
  const history = [];
  const HISTORY_LIMIT = 15;

  let CW = RATIOS[state.ratio].w;
  let CH = RATIOS[state.ratio].h;

  // =========================================================
  //  초기화
  // =========================================================
  function init() {
    applyRatio(state.ratio, true);
    buildTray("emoji");
    bindUI();
    setMode("select");
    fitStage();
    window.addEventListener("resize", fitStage);
  }

  function applyRatio(ratio, first) {
    const oldW = CW, oldH = CH;
    state.ratio = ratio;
    CW = RATIOS[ratio].w; CH = RATIOS[ratio].h;

    // 그림 레이어 내용 보존(스케일)
    let prevDraw = null;
    if (!first) {
      prevDraw = document.createElement("canvas");
      prevDraw.width = oldW; prevDraw.height = oldH;
      prevDraw.getContext("2d").drawImage(drawCanvas, 0, 0);
    }

    [bgCanvas, drawCanvas].forEach((c) => { c.width = CW; c.height = CH; });
    stageInner.style.width = CW + "px";
    stageInner.style.height = CH + "px";

    redrawBg();

    if (prevDraw) {
      dctx.drawImage(prevDraw, 0, 0, oldW, oldH, 0, 0, CW, CH);
      // 개체 위치/크기 비율 보정
      const rx = CW / oldW, ry = CH / oldH;
      state.objects.forEach((o) => { o.x *= rx; o.y *= ry; o.size *= rx; });
      renderObjects();
    }
    fitStage();
  }

  function fitStage() {
    const pad = 26;
    const availW = Math.min((stageScroll.clientWidth || window.innerWidth) - pad, 520);
    const availH = Math.max(window.innerHeight - 300, 320);
    const scale = Math.min(availW / CW, availH / CH);
    stageInner.style.transform = `scale(${scale})`;
    stageInner.style.setProperty("--stage-scale", scale);
    stageWrap.style.width = CW * scale + "px";
    stageWrap.style.height = CH * scale + "px";
  }

  function redrawBg() {
    bgCtx.clearRect(0, 0, CW, CH);
    bgCtx.fillStyle = state.bgColor;
    bgCtx.fillRect(0, 0, CW, CH);
    if (state.bgImage) drawCover(bgCtx, state.bgImage, CW, CH);
  }

  function drawCover(ctx, img, w, h) {
    const ir = img.width / img.height, cr = w / h;
    let dw, dh, dx, dy;
    if (ir > cr) { dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0; }
    else { dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // =========================================================
  //  UI 바인딩
  // =========================================================
  function bindUI() {
    fileInput.addEventListener("change", onFile);
    bgColorInput.addEventListener("input", (e) => {
      pushHistory();
      state.bgColor = e.target.value; redrawBg(); markBg();
    });

    segBtns.forEach((b) => b.addEventListener("click", () => {
      segBtns.forEach((x) => x.classList.toggle("is-active", x === b));
      applyRatio(b.dataset.ratio, false);
    }));

    modeBtns.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

    // 펜
    penColor.addEventListener("input", (e) => { state.penColor = e.target.value; state.eraser = false; syncEraserBtn(); });
    penSize.addEventListener("input", (e) => { state.penSize = +e.target.value; penSizeLabel.textContent = "굵기 " + state.penSize; });
    penEraser.addEventListener("click", () => { state.eraser = !state.eraser; syncEraserBtn(); });

    // 텍스트
    addTextBtn.addEventListener("click", addText);
    fontSelect.addEventListener("change", (e) => {
      state.font = e.target.value;
      const o = selected();
      if (o && o.kind === "text") { pushHistory(); o.font = e.target.value; updateEl(o); }
    });
    textColor.addEventListener("input", (e) => {
      state.textColor = e.target.value;
      const o = selected();
      if (o && o.kind === "text") { o.color = e.target.value; updateEl(o); }
    });

    // 선택된 개체 조작
    objSize.addEventListener("input", (e) => { const o = selected(); if (o) { o.size = +e.target.value; updateEl(o); } });
    objSize.addEventListener("change", pushHistory);
    objRotate.addEventListener("input", (e) => { const o = selected(); if (o) { o.rotation = +e.target.value; updateEl(o); } });
    objRotate.addEventListener("change", pushHistory);
    objColor.addEventListener("input", (e) => { const o = selected(); if (o && o.kind !== "emoji") { o.color = e.target.value; updateEl(o); } });
    objColor.addEventListener("change", pushHistory);
    objEdit.addEventListener("click", editSelectedText);
    objFront.addEventListener("click", bringFront);
    objDelete.addEventListener("click", deleteSelected);

    // 공통
    $("undoBtn").addEventListener("click", undo);
    $("clearBtn").addEventListener("click", clearAll);
    $("downloadBtn").addEventListener("click", download);
    $("shareBtn").addEventListener("click", share);

    // 펜 드로잉
    drawCanvas.addEventListener("pointerdown", penDown);
    drawCanvas.addEventListener("pointermove", penMove);
    window.addEventListener("pointerup", penUp);

    // 빈 곳 탭 → 선택 해제
    stageScroll.addEventListener("pointerdown", (e) => {
      if (e.target === stageScroll || e.target === stageWrap || e.target === objectsLayer) selectObject(null);
    });
  }

  function syncEraserBtn() {
    penEraser.classList.toggle("is-active", state.eraser);
    penEraser.style.background = state.eraser ? "#ffe0ea" : "";
  }

  // =========================================================
  //  모드 & 패널
  // =========================================================
  function setMode(mode) {
    state.mode = mode;
    modeBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.mode === mode));

    Object.values(panels).forEach((p) => (p.hidden = true));
    if (mode === "pen") panels.pen.hidden = false;
    else if (mode === "text") panels.text.hidden = false;
    else if (mode === "emoji" || mode === "kaomoji" || mode === "sticker") {
      panels.tray.hidden = false;
      buildTray(mode);
    }

    // 손글씨 모드에서만 캔버스가 입력을 받고, 그 외엔 개체 조작 가능
    drawCanvas.style.pointerEvents = mode === "pen" ? "auto" : "none";
    objectsLayer.style.pointerEvents = mode === "select" ? "auto" : "none";

    if (mode !== "select") selectObject(null);
    else if (state.selectedId) panels.selected.hidden = false;
  }

  function buildTray(kind) {
    const data = TRAY_DATA[kind];
    const cats = Object.keys(data);
    let active = state.trayCat[kind];
    if (!data[active]) active = cats[0];
    state.trayCat[kind] = active;

    // 카테고리 칩
    trayCats.innerHTML = "";
    cats.forEach((c) => {
      const chip = document.createElement("button");
      chip.className = "cat-chip" + (c === active ? " is-active" : "");
      chip.textContent = c;
      chip.type = "button";
      chip.addEventListener("click", () => { state.trayCat[kind] = c; buildTray(kind); });
      trayCats.appendChild(chip);
    });
    trayCats.hidden = cats.length <= 1;

    // 항목
    trayItems.innerHTML = "";
    data[active].forEach((ch) => {
      const b = document.createElement("button");
      b.className = "tray-item" + (kind === "kaomoji" ? " wide" : "");
      b.textContent = ch;
      b.type = "button";
      b.addEventListener("click", () => addDeco(ch, kind));
      trayItems.appendChild(b);
    });
  }

  // =========================================================
  //  개체 추가
  // =========================================================
  function nextPos() {
    const o = (state.addOffset = (state.addOffset + 1) % 6);
    return { x: CW / 2 + (o - 2.5) * 40, y: CH / 2 + (o - 2.5) * 40 };
  }

  function addText() {
    const txt = window.prompt("텍스트를 입력하세요", "내용을 입력");
    if (txt == null || txt.trim() === "") return;
    pushHistory();
    const p = nextPos();
    const obj = {
      id: ++state.seq, kind: "text", text: txt,
      font: state.font, color: state.textColor,
      x: p.x, y: p.y, size: 120, rotation: 0,
    };
    state.objects.push(obj);
    renderObjects();
    markBg();
    setMode("select");
    selectObject(obj.id);
  }

  function addDeco(ch, kind) {
    pushHistory();
    const p = nextPos();
    const obj = {
      id: ++state.seq, kind: kind === "emoji" || kind === "sticker" ? "emoji" : "symbol",
      text: ch,
      font: kind === "kaomoji" ? SYMBOL_FONT : EMOJI_FONT,
      color: "#222222",
      x: p.x, y: p.y, size: kind === "kaomoji" ? 90 : 150, rotation: 0,
    };
    state.objects.push(obj);
    renderObjects();
    markBg();
  }

  // =========================================================
  //  개체 렌더링
  // =========================================================
  function renderObjects() {
    objectsLayer.innerHTML = "";
    state.objects.forEach((o) => objectsLayer.appendChild(buildEl(o)));
    // 선택 상태 유지
    if (state.selectedId) {
      const o = selected();
      if (o && o._el) o._el.classList.add("selected");
    }
  }

  function buildEl(o) {
    const el = document.createElement("div");
    el.className = "obj";
    el.dataset.id = o.id;
    o._el = el;

    const span = document.createElement("span");
    span.className = "obj-text";
    el.appendChild(span);

    const frame = document.createElement("div");
    frame.className = "frame";
    el.appendChild(frame);

    const del = document.createElement("div");
    del.className = "handle del"; del.textContent = "✕";
    el.appendChild(del);

    const tr = document.createElement("div");
    tr.className = "handle transform"; tr.textContent = "⤢";
    el.appendChild(tr);

    // 이벤트
    el.addEventListener("pointerdown", (e) => onObjDown(e, o));
    el.addEventListener("dblclick", () => { if (o.kind === "text") { selectObject(o.id); editSelectedText(); } });
    del.addEventListener("pointerdown", (e) => { e.stopPropagation(); selectObject(o.id); deleteSelected(); });
    tr.addEventListener("pointerdown", (e) => onTransformDown(e, o));

    updateEl(o, el);
    return el;
  }

  function updateEl(o, el) {
    el = el || o._el;
    if (!el) return;
    const span = el.querySelector(".obj-text");
    span.textContent = o.text;
    el.style.left = o.x + "px";
    el.style.top = o.y + "px";
    el.style.fontFamily = o.font;
    el.style.fontSize = o.size + "px";
    el.style.color = o.color;
    el.style.transform = `translate(-50%,-50%) rotate(${o.rotation}deg)`;
  }

  // =========================================================
  //  선택
  // =========================================================
  const selected = () => state.objects.find((o) => o.id === state.selectedId) || null;

  function selectObject(id) {
    state.selectedId = id;
    state.objects.forEach((o) => o._el && o._el.classList.toggle("selected", o.id === id));
    const o = selected();
    if (o && state.mode === "select") {
      panels.selected.hidden = false;
      objSize.value = Math.round(o.size);
      objRotate.value = Math.round(o.rotation);
      objEdit.hidden = o.kind !== "text";
      objColorWrap.hidden = o.kind === "emoji";
      if (o.kind !== "emoji") objColor.value = toHex(o.color);
    } else {
      panels.selected.hidden = true;
    }
  }

  // =========================================================
  //  개체 드래그(이동)
  // =========================================================
  function toCanvas(e) {
    const r = stageInner.getBoundingClientRect();
    const s = r.width / CW;
    return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  }

  let drag = null;
  function onObjDown(e, o) {
    if (state.mode !== "select") return;
    if (e.target.classList.contains("handle")) return; // 핸들은 별도 처리
    e.stopPropagation();
    selectObject(o.id);
    pushHistory();
    const p = toCanvas(e);
    drag = { o, dx: o.x - p.x, dy: o.y - p.y };
    o._el.classList.add("dragging");
    o._el.setPointerCapture && o._el.setPointerCapture(e.pointerId);
    o._el.addEventListener("pointermove", onObjMove);
    o._el.addEventListener("pointerup", onObjUp);
  }
  function onObjMove(e) {
    if (!drag) return;
    const p = toCanvas(e);
    drag.o.x = clamp(p.x + drag.dx, 0, CW);
    drag.o.y = clamp(p.y + drag.dy, 0, CH);
    updateEl(drag.o);
  }
  function onObjUp(e) {
    if (!drag) return;
    drag.o._el.classList.remove("dragging");
    drag.o._el.removeEventListener("pointermove", onObjMove);
    drag.o._el.removeEventListener("pointerup", onObjUp);
    drag = null;
  }

  // =========================================================
  //  크기 + 회전 (코너 핸들)
  // =========================================================
  let tf = null;
  function onTransformDown(e, o) {
    e.stopPropagation();
    selectObject(o.id);
    pushHistory();
    const p = toCanvas(e);
    const cx = o.x, cy = o.y;
    tf = {
      o, cx, cy,
      startSize: o.size, startRot: o.rotation,
      startDist: Math.hypot(p.x - cx, p.y - cy) || 1,
      startAngle: Math.atan2(p.y - cy, p.x - cx),
    };
    const el = o._el;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    window.addEventListener("pointermove", onTransformMove);
    window.addEventListener("pointerup", onTransformUp);
  }
  function onTransformMove(e) {
    if (!tf) return;
    const p = toCanvas(e);
    const dist = Math.hypot(p.x - tf.cx, p.y - tf.cy);
    const ang = Math.atan2(p.y - tf.cy, p.x - tf.cx);
    tf.o.size = clamp(tf.startSize * (dist / tf.startDist), 16, 2000);
    tf.o.rotation = tf.startRot + (ang - tf.startAngle) * 180 / Math.PI;
    updateEl(tf.o);
    objSize.value = Math.round(tf.o.size);
    objRotate.value = Math.round(((tf.o.rotation + 180) % 360 + 360) % 360 - 180);
  }
  function onTransformUp() {
    tf = null;
    window.removeEventListener("pointermove", onTransformMove);
    window.removeEventListener("pointerup", onTransformUp);
  }

  // =========================================================
  //  개체 편집/삭제/순서
  // =========================================================
  function editSelectedText() {
    const o = selected();
    if (!o || o.kind !== "text") return;
    const txt = window.prompt("텍스트 수정", o.text);
    if (txt == null) return;
    pushHistory();
    o.text = txt; updateEl(o);
  }
  function deleteSelected() {
    const o = selected();
    if (!o) return;
    pushHistory();
    state.objects = state.objects.filter((x) => x.id !== o.id);
    state.selectedId = null;
    renderObjects();
    panels.selected.hidden = true;
  }
  function bringFront() {
    const o = selected();
    if (!o) return;
    pushHistory();
    state.objects = state.objects.filter((x) => x.id !== o.id);
    state.objects.push(o);
    renderObjects();
    selectObject(o.id);
  }

  // =========================================================
  //  손글씨(펜)
  // =========================================================
  let pen = null;
  function penDown(e) {
    if (state.mode !== "pen") return;
    e.preventDefault();
    pushHistory();
    const p = toCanvas(e);
    pen = { x: p.x, y: p.y };
    strokeSeg(p.x, p.y, p.x, p.y);
    markBg();
    drawCanvas.setPointerCapture && drawCanvas.setPointerCapture(e.pointerId);
  }
  function penMove(e) {
    if (!pen) return;
    const p = toCanvas(e);
    strokeSeg(pen.x, pen.y, p.x, p.y);
    pen.x = p.x; pen.y = p.y;
  }
  function penUp() { pen = null; }

  function strokeSeg(x1, y1, x2, y2) {
    dctx.lineJoin = dctx.lineCap = "round";
    dctx.lineWidth = state.penSize;
    if (state.eraser) {
      dctx.globalCompositeOperation = "destination-out";
      dctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      dctx.globalCompositeOperation = "source-over";
      dctx.strokeStyle = state.penColor;
    }
    dctx.beginPath();
    dctx.moveTo(x1, y1); dctx.lineTo(x2, y2); dctx.stroke();
    dctx.globalCompositeOperation = "source-over";
  }

  // =========================================================
  //  파일 업로드
  // =========================================================
  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      pushHistory();
      state.bgImage = img;
      redrawBg(); markBg();
    };
    img.src = URL.createObjectURL(file);
    fileInput.value = "";
  }

  // =========================================================
  //  되돌리기 / 전체 지우기
  // =========================================================
  function snapshot() {
    return {
      bgColor: state.bgColor,
      bgImageSrc: state.bgImage ? state.bgImage.src : null,
      drawURL: drawCanvas.toDataURL(),
      objects: state.objects.map(({ _el, ...o }) => ({ ...o })),
    };
  }
  function pushHistory() {
    try {
      history.push(snapshot());
      if (history.length > HISTORY_LIMIT) history.shift();
    } catch (_) {}
  }
  function undo() {
    const s = history.pop();
    if (!s) return;
    state.bgColor = s.bgColor;
    bgColorInput.value = s.bgColor;
    state.objects = s.objects.map((o) => ({ ...o }));
    state.selectedId = null;
    panels.selected.hidden = true;

    const restoreDraw = () => {
      const im = new Image();
      im.onload = () => { dctx.clearRect(0, 0, CW, CH); dctx.drawImage(im, 0, 0); };
      im.src = s.drawURL;
    };
    if (s.bgImageSrc) {
      const bi = new Image();
      bi.onload = () => { state.bgImage = bi; redrawBg(); };
      bi.src = s.bgImageSrc;
    } else { state.bgImage = null; redrawBg(); }
    restoreDraw();
    renderObjects();
  }
  function clearAll() {
    if (!confirm("모든 편집 내용을 지울까요? (배경 사진 포함)")) return;
    pushHistory();
    state.objects = []; state.selectedId = null; state.bgImage = null;
    dctx.clearRect(0, 0, CW, CH);
    redrawBg(); renderObjects();
    panels.selected.hidden = true;
    stageInner.classList.remove("has-bg"); state.hasBg = false;
  }

  function markBg() {
    if (!state.hasBg) { state.hasBg = true; stageInner.classList.add("has-bg"); }
  }

  // =========================================================
  //  내보내기 (배경 + 손글씨 + 개체 → 고해상도 캔버스 합성)
  // =========================================================
  async function buildExportCanvas() {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (_) {} }
    selectObject(null);

    const out = document.createElement("canvas");
    out.width = CW; out.height = CH;
    const octx = out.getContext("2d");
    octx.drawImage(bgCanvas, 0, 0);
    octx.drawImage(drawCanvas, 0, 0);

    state.objects.forEach((o) => {
      octx.save();
      octx.translate(o.x, o.y);
      octx.rotate(o.rotation * Math.PI / 180);
      octx.font = `${o.size}px ${o.kind === "text" ? '"' + o.font + '"' : o.font}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = o.color;
      octx.fillText(o.text, 0, 0);
      octx.restore();
    });
    return out;
  }

  const fileName = () => `꾸미사진_${state.ratio.replace(":", "x")}.png`;

  // 저장 (PNG 다운로드)
  async function download() {
    const out = await buildExportCanvas();
    const link = document.createElement("a");
    link.download = fileName();
    link.href = out.toDataURL("image/png");
    link.click();
  }

  // 인스타 공유 (Web Share API → 아이폰 공유시트에서 인스타 선택)
  async function share() {
    const out = await buildExportCanvas();
    const blob = await new Promise((res) => out.toBlob(res, "image/png"));
    if (!blob) { alert("이미지를 만들지 못했어요. 다시 시도해주세요."); return; }

    const file = new File([blob], fileName(), { type: "image/png" });
    // 파일 공유 지원 여부 확인
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "꾸미사진",
          text: "꾸미사진으로 꾸민 사진 ✨",
        });
      } catch (err) {
        // 사용자가 취소한 경우는 조용히 무시
        if (err && err.name !== "AbortError") fallbackSave(out);
      }
    } else {
      fallbackSave(out);
      alert("이 브라우저는 바로 공유가 안 돼요. 저장된 사진을 인스타 스토리/게시물에 올려주세요! (아이폰 사파리 권장)");
    }
  }
  function fallbackSave(out) {
    const link = document.createElement("a");
    link.download = fileName();
    link.href = out.toDataURL("image/png");
    link.click();
  }

  // ---------- util ----------
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function toHex(c) { return /^#[0-9a-fA-F]{6}$/.test(c || "") ? c : "#222222"; }

  init();
})();
