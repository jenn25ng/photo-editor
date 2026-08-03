/* =========================================================================
 *  아기랑 – 아기 미디어 앱 로직
 *  홈(프로그램) → 상세(시즌) → 플레이어(공식 재생목록 임베드)
 * ========================================================================= */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const views = {
    home: $("#home"),
    detail: $("#showDetail"),
    player: $("#player"),
  };

  // 현재 상태
  const state = {
    show: null, // 선택한 프로그램
    lang: "ko", // 현재 언어
  };

  const langLabel = { ko: "한국어", en: "English" };

  /* ---------------------------------------------------------------- 화면 전환 */
  function show(viewName) {
    Object.values(views).forEach((v) => v.classList.add("hidden"));
    views[viewName].classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* ---------------------------------------------------------------- 유틸 */
  // 특정 언어로 볼 수 있는지 (채널이 있으면 가능)
  function hasLang(showObj, lang) {
    return showObj.langs.includes(lang) && !!showObj.channels[lang];
  }

  // 프로그램의 기본 언어(한국어 우선, 없으면 첫 지원 언어)
  function defaultLang(showObj) {
    return showObj.langs.includes("ko") ? "ko" : showObj.langs[0];
  }

  // 유튜브 검색 URL (재생목록 ID가 없을 때의 안전한 대체 링크)
  function youtubeSearch(showObj, season, lang) {
    const name = showObj.title[lang] || showObj.title.en || showObj.title.ko;
    const seasonWord = lang === "ko" ? "전체 에피소드" : "full episodes";
    const q = `${name} ${season.title[lang] || ""} ${seasonWord}`.trim();
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  }

  /* ---------------------------------------------------------------- 홈 렌더 */
  function renderHome() {
    const grid = $("#showGrid");
    grid.innerHTML = "";

    SHOWS.forEach((s) => {
      const card = document.createElement("button");
      card.className = "show-card";
      card.style.setProperty("--card-color", s.color);
      card.setAttribute("aria-label", s.title.ko);

      const langBadges = s.langs
        .map((l) => `<span class="badge">${l === "ko" ? "한국어" : "영어"}</span>`)
        .join("");

      card.innerHTML = `
        <div class="show-emoji">${s.emoji}</div>
        <div class="show-name">${s.title.ko}</div>
        <div class="show-sub">${s.title.en}</div>
        <div class="show-tagline">${s.tagline.ko}</div>
        <div class="show-badges">${langBadges}</div>
      `;
      card.addEventListener("click", () => openShow(s));
      grid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------------- 상세 렌더 */
  function openShow(showObj) {
    state.show = showObj;
    state.lang = defaultLang(showObj);
    renderDetail();
    show("detail");
  }

  function renderDetail() {
    const s = state.show;
    $("#detailEmoji").textContent = s.emoji;
    $("#detailTitle").textContent = `${s.title.ko} · ${s.title.en}`;
    $("#detailTagline").textContent = s.tagline.ko;

    // 언어 토글 (지원 언어가 2개 이상일 때만)
    const toggle = $("#langToggle");
    toggle.innerHTML = "";
    if (s.langs.length > 1) {
      s.langs.forEach((l) => {
        const btn = document.createElement("button");
        btn.className = "lang-btn" + (l === state.lang ? " active" : "");
        btn.textContent = langLabel[l];
        btn.addEventListener("click", () => {
          state.lang = l;
          renderDetail();
        });
        toggle.appendChild(btn);
      });
    }

    renderSeasons();
  }

  function renderSeasons() {
    const s = state.show;
    const lang = state.lang;
    const listEl = $("#seasonList");
    listEl.innerHTML = "";

    s.seasons.forEach((season) => {
      const hasList = !!(season.list && season.list[lang]);
      const row = document.createElement("button");
      row.className = "season-row" + (hasList ? "" : " season-row--fallback");
      row.style.setProperty("--card-color", s.color);

      const label = hasList
        ? `<span class="season-play">▶</span>`
        : `<span class="season-play season-play--ext">↗</span>`;

      const note = hasList
        ? `<span class="season-note">앱에서 순서대로 재생</span>`
        : `<span class="season-note">유튜브 공식 채널에서 보기</span>`;

      row.innerHTML = `
        ${label}
        <span class="season-text">
          <span class="season-title">${season.title[lang] || season.title.ko}</span>
          ${note}
        </span>
      `;

      row.addEventListener("click", () => {
        if (hasList) {
          openPlayer(season);
        } else {
          // 재생목록 ID가 없으면 공식 채널 또는 검색으로 이동
          const url = s.channels[lang] || youtubeSearch(s, season, lang);
          window.open(url, "_blank", "noopener");
        }
      });
      listEl.appendChild(row);
    });
  }

  /* ---------------------------------------------------------------- 플레이어 */
  function openPlayer(season) {
    const s = state.show;
    const lang = state.lang;
    const listId = season.list[lang];

    $("#playerTitle").textContent =
      `${s.title[lang] || s.title.ko} – ${season.title[lang] || season.title.ko}`;

    const slot = $("#playerSlot");
    slot.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src =
      `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&rel=0&modestbranding=1`;
    iframe.title = $("#playerTitle").textContent;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.setAttribute("loading", "lazy");
    slot.appendChild(iframe);

    $("#openYoutube").href = `https://www.youtube.com/playlist?list=${listId}`;

    show("player");
  }

  function closePlayer() {
    // iframe 제거로 재생 중지
    $("#playerSlot").innerHTML = "";
  }

  /* ---------------------------------------------------------------- 이벤트 위임 */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "home") {
      show("home");
    } else if (action === "back-to-detail") {
      closePlayer();
      show("detail");
    }
  });

  /* ---------------------------------------------------------------- 시작 */
  renderHome();
  show("home");
})();
