/* =========================================================
   script.js — 이 파일은 "동작"을 담당해요.
   버튼을 눌렀을 때 무슨 일이 일어날지 여기에 적습니다.

   자주 쓰는 문법 2개만 기억하면 돼요.
     1) document.querySelector("#id")  → 화면에서 그 요소를 찾아요
     2) addEventListener("click", 함수)  → "클릭되면 이 함수를 실행해" 라는 뜻
   ========================================================= */

/* ---------------------------------------------------------
   0) 도우미 함수
   --------------------------------------------------------- */

// localStorage에 값을 저장해요. (브라우저가 기억하는 작은 창고)
// 저장이 안 되는 환경(시크릿 모드 등)에서도 사이트가 멈추지 않게 감싸 둡니다.
function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // 저장에 실패해도 그냥 넘어가요.
  }
}

// localStorage에서 값을 읽어요. 없으면 null을 돌려줍니다.
function load(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

/* ---------------------------------------------------------
   1) 다크 모드 / 라이트 모드 전환
   --------------------------------------------------------- */

const themeButton = document.querySelector("#theme-btn");

// 지금 테마를 적용하는 함수예요. "dark" 또는 "light" 를 받습니다.
function applyTheme(theme) {
  // <html> 태그에 data-theme="dark" 를 붙이거나 뗍니다.
  // CSS는 이 값을 보고 색을 바꿔요.
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  // 버튼 글자도 지금 상태에 맞게 바꿔 줍니다.
  themeButton.textContent = theme === "dark" ? "☀️ 라이트" : "🌙 다크";
}

// 처음 화면을 열었을 때: 저장된 테마가 있으면 그걸 쓰고,
// 없으면 컴퓨터(휴대폰)의 설정을 따라가요.
const savedTheme = load("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

// 버튼을 누르면 지금 테마의 반대로 바꾸고 저장해요.
themeButton.addEventListener("click", function () {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";

  applyTheme(nextTheme);
  save("theme", nextTheme);
});

/* ---------------------------------------------------------
   2) 인사말 바꾸기
   --------------------------------------------------------- */

const greetingText = document.querySelector("#greeting");
const greetingButton = document.querySelector("#greeting-btn");

// 보여 줄 인사말을 배열(목록)로 준비해요.
const greetings = [
  "안녕하세요, 서준입니다 👋",
  "오늘도 코딩 한 줄! 💻",
  "HTML은 뼈대, CSS는 옷, JS는 두뇌 🧠",
  "버그는 친구, 고치면 실력이 늘어요 🐛",
  "첫 웹사이트 완성! 🎉",
  "궁금한 건 직접 만들어 보면 제일 빨라요 ⚡"
];

let greetingIndex = 0;

greetingButton.addEventListener("click", function () {
  // 다음 인사말로 넘어가요. 마지막이면 다시 처음으로 돌아갑니다.
  greetingIndex = (greetingIndex + 1) % greetings.length;
  greetingText.textContent = greetings[greetingIndex];
});

/* ---------------------------------------------------------
   3) 클릭 카운터
   --------------------------------------------------------- */

const countText = document.querySelector("#count");
const countButton = document.querySelector("#count-btn");
const resetButton = document.querySelector("#reset-btn");

// 저장된 숫자를 읽어요. 글자로 저장되어 있으니 Number()로 숫자로 바꿔요.
// || 0 은 "값이 없으면 0으로 해줘" 라는 뜻이에요.
let count = Number(load("count")) || 0;

// 화면의 숫자를 현재 count 값과 똑같이 맞춰 주는 함수예요.
function showCount() {
  countText.textContent = count;

  // .pop 효과를 잠깐 붙였다가 떼서 숫자가 살짝 커졌다 돌아오게 해요.
  countText.classList.remove("pop");
  void countText.offsetWidth; // 이 줄은 효과를 다시 시작시키는 작은 꼼수예요.
  countText.classList.add("pop");

  save("count", count);
}

showCount(); // 페이지를 열면 저장된 숫자를 먼저 보여 줘요.

countButton.addEventListener("click", function () {
  count = count + 1;
  showCount();
});

resetButton.addEventListener("click", function () {
  count = 0;
  showCount();
});

/* ---------------------------------------------------------
   4) 스크롤하면 부드럽게 나타나기
   --------------------------------------------------------- */

// 화면에 나타날 부분들을 모두 찾아요.
const sections = document.querySelectorAll(".section, .hero");
sections.forEach(function (section) {
  section.classList.add("reveal");
});

// IntersectionObserver는 "이 요소가 화면 안에 들어왔는지" 알려 주는 기능이에요.
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // 한 번 나타나면 더 볼 필요 없어요.
      }
    });
  },
  { threshold: 0.12 } // 요소의 12%가 보이면 나타나기 시작해요.
);

sections.forEach(function (section) {
  observer.observe(section);
});

// 맨 위 첫 화면은 바로 보이게 해요.
const hero = document.querySelector(".hero");
if (hero) {
  hero.classList.add("visible");
}
