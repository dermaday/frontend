# AGENTS.md

Vite + React 19 + TypeScript + Tailwind v3 저장소. Figma MCP로 디자인을 퍼블리싱한다.

---

## 1. 퍼블리싱은 type-based 구조로 판별해서 만든다

Figma 노드 트리를 **그대로 마크업으로 옮기지 않는다.** 각 노드가 무슨 **역할(type)** 인지
먼저 판별하고, 그 type에 해당하는 타입 정의된 컴포넌트를 만들어 조합한다.

### 판별표

| Figma 노드 (이름/형태)          | type          | 산출물                              |
| ------------------------------- | ------------- | ----------------------------------- |
| `~ 버튼`, 채워진 라운드 박스+텍스트 | Button        | `src/components/Button.tsx`         |
| `~ 입력창`, 보더 박스+placeholder   | TextField     | `src/components/TextField.tsx`      |
| 입력창 + Eye 아이콘             | PasswordField | `src/components/PasswordField.tsx`  |
| 브랜드색 + 마크 + 라벨 버튼     | SocialButton  | `src/components/SocialButton.tsx`   |
| `상단 앱바`                     | TopAppBar     | `src/components/TopAppBar.tsx`      |
| `하단 탭바`                     | HomeIndicator | `src/components/HomeIndicator.tsx`  |
| 아이콘만 있는 tappable 노드     | IconButton    | `src/components/*.tsx`              |
| 화면 프레임 (`A-01`, `A-02` …)  | Page          | `src/pages/*Page.tsx`               |

판별표에 없는 노드가 나오면 **새 type을 정해서 표에 추가**하고 진행한다.

### 규칙

- 모든 컴포넌트는 `props` 인터페이스를 **export** 한다. `any` 금지.
- 변형은 문자열 union type으로 선언한다. `variant?: 'primary' | 'secondary'`
- 네이티브 요소를 감싸면 해당 속성 타입을 확장한다.
  `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`
- 같은 type이 **2번 이상** 등장하면 무조건 컴포넌트로 분리한다.
- 페이지는 **조합 + 상태**만 담당한다. 치수·색 같은 스타일 세부값은 컴포넌트 안에 둔다.
- 색상·폰트는 `tailwind.config.js` 토큰을 쓴다. 하드코딩 hex 금지.
  (`brand`, `kakao`, `naver`, `gray-200/300/400/500/800/950`, `font-sans`.
  예외: 시안 전용 플레이스홀더 `#d9d9d9` 등)
- 컴포넌트 상단 JSDoc에 원본 노드 ID를 남긴다. `/** Figma \`로그인 버튼\` (node 5:3562) */`

---

## 2. 이미지 처리 규칙

Figma MCP가 내보내는 이미지 URL은 **임시 CDN 링크로 7일 후 만료되고 느리다.**
반드시 아래 순서로 처리한다.

### 2-1. 이미지 다운로드

```bash
curl -L "Figma asset URL" -o "src/assets/icons/파일명.svg"
```

### 2-2. 정적 import로 교체

```tsx
// 사용 금지
<img src="https://www.figma.com/api/mcp/asset/..." />
source={{ uri: "https://www.figma.com/api/mcp/asset/..." }}

// 항상 이렇게 — 웹 (Vite, 이 저장소)
import kakaoIcon from '../assets/icons/kakao.svg'
<img src={kakaoIcon} alt="" width={50} height={50} className="h-[50px] w-[50px]" />

// 항상 이렇게 — React Native / Expo
source={require("@/assets/images/파일명.png")}
```

### 2-3. 불가피하게 원격 URL을 써야 할 때 (서버 이미지 등)

```tsx
// React Native / Expo
<Image
  source={{ uri: url }}
  cachePolicy="memory-disk"
  transition={200}
  placeholder={{ color: "#E8E0F7" }}
/>

// 웹 — 레이아웃 시프트 방지를 위해 width/height 필수
<img src={url} alt="" width={50} height={50} loading="lazy" decoding="async" />
```

### 2-4. 내보낸 SVG 정리

Figma export SVG에는 배경 사각형이 섞여 나온다. 아이콘 도형만 남기고 **반드시 제거**한다.

- `<rect ... fill="#F0F0F0"/>` — 내보내기 배경
- `<rect width="402" height="874" ... fill="white"/>` — 페이지 프레임
- `<rect ... fill="#D9D9D9"/>`, 입력창 보더 `<rect ... stroke=...>` — 주변 레이어

제거 후 `<g>` 여닫음 개수가 맞는지 확인한다.

### 2-5. 크기 명시

모든 `<img>`에 `width`/`height` 속성과 **동일한 값의** Tailwind 클래스를 둘 다 준다.
외곽 박스와 내부 아이콘의 치수를 각각 보존한다. (예: 로고 박스 118×118 / 내부 아이콘 48×48)

---

## 3. 시스템 UI는 생략한다

시안 상단의 **상태바 전체 — 시간(`9:41`) · 와이파이 · 배터리 · 셀룰러 안테나 —** 는
실제 기기에서 OS가 그린다. 시안에 있어도 **다운로드도 렌더링도 하지 않는다.**

- 대상 노드: `Status bar` 및 그 하위 전부
  (`Time`, `Levels`, `Wifi`, `Battery`, `Cellular Connection`, `Dynamic Island`)
- 상단 여백은 상태바 대신 `pt-[calc(16px+env(safe-area-inset-top))]`로 확보한다.
  데스크톱 브라우저에서는 inset이 0이라 시안보다 콘텐츠가 위로 붙는데, 정상이다.
- 하단 홈 인디케이터는 시안 대조용으로 유지한다.

---

## 4. 반응형

- 프레임 폭: `w-full max-w-[402px]` — 고정 폭(`w-[402px]`) 금지
- 높이: `min-h-[100dvh]` — `100vh`는 모바일에서 튄다
- 노치/홈바: `env(safe-area-inset-top|bottom)`, `index.html`에 `viewport-fit=cover`
- 세로 치수·폰트 크기는 고정 px로 둔다 (모바일 UI 관례)

---

## 5. 검증

```bash
npx tsc -b && npm run build && npx eslint .
```

시안 대조는 헤드리스 크롬 스크린샷으로 한다.

```bash
npx vite --port 5199 --strictPort
chrome.exe --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=800,1000 \
  --screenshot=out.png "http://localhost:5199/login"
```

주의: `--window-size`의 폭이 **500px 미만이면 무시**된다. 좁은 폭을 확인하려면
`<iframe width="320">`으로 감싼 HTML을 만들어 넓은 창에서 캡처한다.
