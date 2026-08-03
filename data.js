/* =========================================================================
 *  아기 미디어 앱 – 콘텐츠 데이터
 *  -----------------------------------------------------------------------
 *  모든 영상은 각 프로그램의 "공식 유튜브 채널" 재생목록을 그대로 불러옵니다.
 *  (앱이 영상을 저장/재배포하지 않습니다. 공식 채널의 무료 공개 영상만 보여줘요.)
 *
 *  ▶ 시즌을 추가하거나 재생목록을 바꾸려면 아래 데이터만 수정하면 됩니다.
 *    - list.ko / list.en : 유튜브 재생목록 ID  (주소의  list=XXXX  부분)
 *      예) https://www.youtube.com/playlist?list=PL9swKX1PviEr9UfByZqJYiN8KX3AXqyXm
 *          → 재생목록 ID 는  PL9swKX1PviEr9UfByZqJYiN8KX3AXqyXm
 *    - list 값이 없는 시즌은 자동으로 "공식 채널/검색으로 열기" 버튼이 나옵니다.
 * ========================================================================= */

const SHOWS = [
  /* ---------------------------------------------------------------- 넘버블럭스 */
  {
    id: "numberblocks",
    title: { ko: "넘버블럭스", en: "Numberblocks" },
    tagline: { ko: "숫자를 배우는 블록 친구들", en: "Little blocks, big number fun" },
    emoji: "🔢",
    color: "#ff5a5f",
    langs: ["ko", "en"],
    channels: {
      ko: "https://www.youtube.com/@numberblocks_kr",
      en: "https://www.youtube.com/@Numberblocks",
    },
    seasons: [
      { n: 1, title: { ko: "시즌 1", en: "Series 1" },
        list: { en: "PL9swKX1PviEr9UfByZqJYiN8KX3AXqyXm", ko: "PL2Yy6Y2dBOuNw0F4_LmDkMH0axdpugon3" } },
      { n: 2, title: { ko: "시즌 2", en: "Series 2" },
        list: { en: "PLcnbVz-1b_hpkpMrSmWc6QXkV1y0xNyuv" } },
      { n: 3, title: { ko: "시즌 3", en: "Series 3" } },
      { n: 4, title: { ko: "시즌 4", en: "Series 4" } },
      { n: 5, title: { ko: "시즌 5", en: "Series 5" } },
      { n: 6, title: { ko: "시즌 6", en: "Series 6" } },
    ],
  },

  /* ---------------------------------------------------------------- 알파블럭스 */
  {
    id: "alphablocks",
    title: { ko: "알파블럭스", en: "Alphablocks" },
    tagline: { ko: "알파벳으로 읽기를 배워요", en: "Learn to read with letters" },
    emoji: "🔤",
    color: "#ffb703",
    langs: ["en"],
    channels: {
      en: "https://www.youtube.com/@officialalphablocks",
    },
    seasons: [
      { n: 1, title: { ko: "시즌 1", en: "Series 1" },
        list: { en: "PLSW2D61TnopT9wHulLTwjgBJITX3eqQ-x" } },
      { n: 2, title: { ko: "시즌 2", en: "Series 2" } },
      { n: 3, title: { ko: "시즌 3", en: "Series 3" } },
      { n: 4, title: { ko: "시즌 4", en: "Series 4" } },
    ],
  },

  /* ---------------------------------------------------------------- 페파피그 */
  {
    id: "peppa",
    title: { ko: "페파피그", en: "Peppa Pig" },
    tagline: { ko: "페파네 가족의 즐거운 하루", en: "Peppa and her family's fun days" },
    emoji: "🐷",
    color: "#ff85c2",
    langs: ["ko", "en"],
    channels: {
      ko: "https://www.youtube.com/@PeppaPigKoreanOfficial",
      en: "https://www.youtube.com/@PeppaPigOfficial",
    },
    seasons: [
      { n: 1, title: { ko: "시즌 1", en: "Series 1" },
        list: { en: "PL9H5wl7jyq4RW3I86ECokGqzESs4SrY0Z", ko: "PLHw-mSVlGl__dyZHwdoiVk4e0mrlvMNkV" } },
      { n: 2, title: { ko: "시즌 2", en: "Series 2" } },
      { n: 3, title: { ko: "시즌 3", en: "Series 3" } },
      { n: 4, title: { ko: "시즌 4", en: "Series 4" } },
      { n: 5, title: { ko: "시즌 5", en: "Series 5" } },
    ],
  },

  /* ---------------------------------------------------------------- 뽀로로 */
  {
    id: "pororo",
    title: { ko: "뽀롱뽀롱 뽀로로", en: "Pororo" },
    tagline: { ko: "노는 게 제일 좋아, 뽀로로!", en: "Pororo the Little Penguin" },
    emoji: "🐧",
    color: "#4d96ff",
    langs: ["ko", "en"],
    channels: {
      ko: "https://www.youtube.com/channel/UCPUeGC_AL-OnDQORKhRm6iA",
      en: "https://www.youtube.com/channel/UCAmia3u27mHY-Y6c-lwakAQ",
    },
    seasons: [
      { n: 1, title: { ko: "시즌 1", en: "Season 1" } },
      { n: 2, title: { ko: "시즌 2", en: "Season 2" } },
      { n: 3, title: { ko: "시즌 3", en: "Season 3" } },
      { n: 4, title: { ko: "시즌 4", en: "Season 4" } },
      { n: 5, title: { ko: "시즌 5", en: "Season 5" } },
      { n: 6, title: { ko: "시즌 6", en: "Season 6" } },
      { n: 7, title: { ko: "시즌 7", en: "Season 7" } },
    ],
  },

  /* ---------------------------------------------------------------- 코코멜론 */
  {
    id: "cocomelon",
    title: { ko: "코코멜론", en: "Cocomelon" },
    tagline: { ko: "신나는 동요와 이야기", en: "Nursery rhymes for kids" },
    emoji: "🎵",
    color: "#38b000",
    langs: ["en"],
    channels: {
      en: "https://www.youtube.com/channel/UCbCmjCuTUZos6Inko4u57UQ",
    },
    seasons: [
      { n: 1, title: { ko: "전체 에피소드", en: "Full Episodes" },
        list: { en: "PLfgXFyQLOmUQuV8dpbftnL23Kv0xBEWOh" } },
    ],
  },

  /* ---------------------------------------------------------------- 핑크퐁·아기상어 */
  {
    id: "pinkfong",
    title: { ko: "핑크퐁 · 아기상어", en: "Pinkfong · Baby Shark" },
    tagline: { ko: "아기상어 뚜루루뚜루~", en: "Baby Shark & kids songs" },
    emoji: "🦈",
    color: "#00b4d8",
    langs: ["ko", "en"],
    channels: {
      ko: "https://www.youtube.com/@pinkfong_kr",
      en: "https://www.youtube.com/@Pinkfong",
    },
    seasons: [
      { n: 1, title: { ko: "인기 동요 모음", en: "Popular Songs" } },
    ],
  },

  /* ---------------------------------------------------------------- 블루이 */
  {
    id: "bluey",
    title: { ko: "블루이", en: "Bluey" },
    tagline: { ko: "블루이네 가족의 놀이 이야기", en: "Bluey's family adventures" },
    emoji: "🐶",
    color: "#7b6cf6",
    langs: ["en"],
    channels: {
      en: "https://www.youtube.com/@Bluey_Official",
    },
    seasons: [
      { n: 1, title: { ko: "시즌 1", en: "Season 1" } },
      { n: 2, title: { ko: "시즌 2", en: "Season 2" } },
      { n: 3, title: { ko: "시즌 3", en: "Season 3" } },
    ],
  },

  /* ---------------------------------------------------------------- 퍼피 구조대 */
  {
    id: "pawpatrol",
    title: { ko: "퍼피 구조대", en: "PAW Patrol" },
    tagline: { ko: "언제나 출동! 퍼피 구조대", en: "No job is too big!" },
    emoji: "🐾",
    color: "#e63946",
    langs: ["ko", "en"],
    channels: {
      ko: "https://www.youtube.com/@PAWPatrolKorea",
      en: "https://www.youtube.com/@pawpatrol",
    },
    seasons: [
      { n: 1, title: { ko: "시즌 1", en: "Season 1" } },
      { n: 2, title: { ko: "시즌 2", en: "Season 2" } },
      { n: 3, title: { ko: "시즌 3", en: "Season 3" } },
      { n: 4, title: { ko: "시즌 4", en: "Season 4" } },
    ],
  },
];
