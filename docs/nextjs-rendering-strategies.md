# Next.js App Router 렌더링 완벽 가이드

Next.js App Router의 렌더링 모델을 실제 코드와 빌드 결과물을 통해 심층 분석합니다.

## 목차

1. [SSR vs CSR: 큰 그림](#ssr-vs-csr-큰-그림)
2. [Next.js의 3가지 렌더링 타이밍](#nextjs의-3가지-렌더링-타이밍)
3. [빌드 기호란?](#빌드-기호란)
4. [dynamic 설정](#dynamic-설정)
5. [fetch 옵션](#fetch-옵션)
6. [Route Segment Config](#route-segment-config)
7. [흔한 오해와 진실](#흔한-오해와-진실)

---

## SSR vs CSR: 큰 그림

Next.js의 렌더링은 **SSR(Server-Side Rendering)**과 **CSR(Client-Side Rendering)**의 조합입니다.

## Next.js의 3가지 렌더링 타이밍

Next.js에서 렌더링 시점은 **3가지**입니다.
개발자는 nextjs api를 활용해 각 렌더 타이밍에 어떤 세부 동작을 시킬지 지정합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js 렌더링 타이밍                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ 빌드 타임 (Build Time)                                      │
│     ─────────────────────────────                                │
│     next build 실행 시 HTML 생성                                │
│                                                                 │
│  2️⃣ 서버 런타임 (Server Runtime)                                │
│     ─────────────────────────────                                │
│     요청이 들어왔을 때 서버에서 HTML 생성                        │
│     → 동적 함수 사용 또는 generateStaticParams 없음             │
│                                                                 │
│  3️⃣ 브라우저 런타임 (Browser Runtime) = CSR                     │
│     ─────────────────────────────                                │
│     클라이언트에서 JavaScript로 UI 업데이트                      │
│  • 하이드레이션 (onClick, onChange 등 이벤트 연결)              │
│  • useState, useEffect 기반 상태 관리                           │
│  • 클라이언트 전용 데이터 페칭 (사용자별 실시간 데이터)          │
│  • 사용자 인터랙션 후 동적 UI 업데이트                          │     │
└─────────────────────────────────────────────────────────────────┘
```

### 빌드 기호란?

**빌드 기호는 빌드 타임에 렌더링이 어떻게 처리되었는지만 표시합니다.**

```
○ = 페이지 캐싱 사용. 고정경로에서 빌드 타임에 미리 html 생성. 동적 경로에서는 미리 html 생성X
● = 페이지 캐싱 사용. 동적 경로에서 일부 경로 미리 html 생성 (동적 경로 + generateStaticParams)
ƒ = 페이지 캐싱 미사용 (매 요청마다 HTML 생성)
```

페이지 캐싱? 서버에서 파일시스템에 html을 파일을 직접 들고 있는 것을 의미합니다.

### 빌드 기호 예시

```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB        89.5 kB
├ ○ /about                               312 B         85.6 kB
├ ○ /blog                                1.2 kB        86.5 kB
├ ● /blog/[id]                           1.5 kB        87.2 kB
│ ├ /blog/1
│ ├ /blog/2
│ └ [+25 more paths]
├ ƒ /dashboard                           2.1 kB        88.4 kB
└ ƒ /api/posts                           0 B           85.3 kB

```

f는 요청이 들어올 때마다 서버에서 html을 생성하는 것을 의미합니다. (페이지 캐싱 X)
성능 측면에서 ƒ (Dynamic)가 적을 수록 좋습니다.

f가 아닌 route는 static을 의미합니다. ○ 또는 ●
페이지 캐싱을 사용하며, 빌드 타임 또는 런타임에 생성된 페이지들을 캐싱한다는 것입니다.
.next/server/app 하위 라우트에서 런타임에 실제 캐싱되는 html들을 확인할 수 있습니다.

---

### dynamic 설정

export const dynamic = 'auto' | 'force-dynamic' | 'force-static' | 'error';

dynamic을 지정하지 않으면 dynamic = 'auto'가 기본값입니다.

---

### dynamic = 'auto'에서 페이지 렌더링 모드 결정 흐름

```
1단계: 라우트 구조 결정
├── 고정 경로 (/about) → 기본 Static ○
└── 동적 경로 (/blog/[id]) → 기본 Dynamic ƒ generateStaticParams있으면 ●

2단계: 동적 요인으로 Dynamic 강제 (한 방향만 가능)
├── cookies(), headers() 사용
├── searchParams, params await
└── fetch cache: 'no-store'
    ↓
    ƒ Dynamic으로 격하

```

### dynamic = 'auto'에서 특정 라우트를 Static으로 유도하는법

1. 고정경로 사용
2. 동적경로 + generateStaticParams

- 동적 요인을 미사용해야함.

동적 요인을 안쓴다고 Dynamic(ƒ)이 Static이 되는 것은 아니지만
동적 요인은 dynamic = 'auto'에서 Static을 Dynamic(ƒ)으로 만듦

## ※ generateStaticParams는 Static 강제가 아님!

---

### Dynamic → Static 강제 방법

└── dynamic = 'force-static' (유일한 방법)

⚠️ **`force-static` 권장되지 않는 이유**:

- 동적 데이터(cookies, headers 등)가 빈 값/기본값으로 대체됨
- 실제로 동적 데이터가 필요한 페이지에서 예상치 못한 동작 발생
- 근본적인 해결이 아닌 우회책 - 페이지 구조를 재설계하는 것이 바람직

---

기본값 dynamic = 'auto'에서

### dynamic = 'auto'에서 Static렌더가 기본인 페이지를 ƒ (Dynamic)로 만드는 조건

```
┌─────────────────────────────────────────────────────────────────┐
│     static으로 예상되는  ○/● 페이지를 Dynamic(ƒ)로 만드는 동적 요인들     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ 동적 함수 사용 (요청 시점에만 알 수 있는 정보)                         │
│     • cookies()      - 클라이언트가 보낸 쿠키 읽기                      │
│     • headers()      - 클라이언트가 보낸 요청 헤더 읽기                  │
│     • draftMode()    - CMS 프리뷰 모드 확인                          │
│     • searchParams   - URL 쿼리 파라미터 (?page=1&sort=asc)         │
│     • await params   - 동적 경로에서 params await (Next.js 15+)     │
│     • useSearchParams() - Suspense 없으면 전체 페이지 Dynamic       │
│                                                                 │
│  2️⃣ fetch (데이터 캐시 비활성화)                                     │
│     • cache: 'no-store'                                         │
│     • next: { revalidate: 0 }                                   │
│                                                                 │
│  3️⃣ Route Segment Config (페이지 캐시 비활성화)                       │
│     • export const dynamic = 'force-dynamic'                    │
│     • export const revalidate = 0                               │
│     • export const fetchCache = 'force-no-store'                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

> 💡 **동적 함수란?** 요청이 들어와야만 알 수 있는 정보를 읽는 함수입니다.
> 빌드 시점에는 어떤 사용자가 어떤 쿠키/헤더/쿼리로 요청할지 알 수 없기 때문에
> 이 함수들을 사용하면 서버 런타임에 렌더링해야 합니다.

---

## fetch 옵션

dynamic = 'auto'에서 `fetch`는 Static -> Dynamic으로 만들기도 합니다.
• cache: 'no-store'
• next: { revalidate: 0 }  
는 고정경로 페이지나 동적경로+generateStaticParams페이지를 Dynamic으로 만듭니다.

### fetch 옵션 종류

```tsx
// 1. 영구 캐시 (기본값) - Static Rendering
fetch(url, { cache: 'force-cache' });
fetch(url); // 기본값이 force-cache

// 2. 캐시 없음 - Dynamic Rendering
fetch(url, { cache: 'no-store' });

// 3. 시간 기반 재검증
fetch(url, { next: { revalidate: 60 } }); // 60초마다 재검증

// 4. 태그 기반 재검증 (On-demand)
fetch(url, { next: { tags: ['posts'] } });
// + revalidateTag('posts') 호출로 수동 재검증
```

---

## Route Segment Config

페이지/레이아웃 파일에서 export하여 동작을 제어합니다.
dynamic또한 Route Segment Config 중 하나입니다.
dynamic = 'auto'에서 `revalidate`는 Static -> Dynamic으로 만들기도 합니다.

- export const revalidate = 0

### 주요 설정

```tsx
// page.tsx 또는 layout.tsx

// 렌더링 모드 강제
export const dynamic = 'auto' | 'force-dynamic' | 'force-static' | 'error';

// 빌드타임에 생성 안 된 경로 런타임 처리
export const dynamicParams = true | false;

// 전체 라우트 재검증 시간
export const revalidate = false | 0 | number;

// 페이지 내 모든 fetch의 기본 캐시 동작
export const fetchCache = 'auto' | 'force-cache' | 'force-no-store' | ...;
```

---

## 흔한 오해와 진실

### 오해 1: "빌드 기호 ●는 재갱신이 없다는 뜻이다"

❌ **틀림**

빌드 기호는 오직 **빌드타임 생성 여부**만 나타냅니다.
재갱신(revalidate), 런타임 생성(dynamicParams) 여부는 빌드 기호로 알 수 없습니다.

```tsx
// 둘 다 빌드 기호는 ●

// Case 1: 재갱신 없음 (영구 캐시)
export async function generateStaticParams() { ... }
fetch(url, { cache: 'force-cache' });

// Case 2: 60초마다 재갱신
export async function generateStaticParams() { ... }
fetch(url, { next: { revalidate: 60 } });
```

| 기호 | 의미                                              |
| ---- | ------------------------------------------------- |
| ○    | 빌드 시 생성됨 (고정 경로)                        |
| ●    | 빌드 시 생성됨 (동적 경로 + generateStaticParams) |
| ƒ    | 요청 시 생성됨                                    |

> 💡 **정리**: 모든 페이지는 SSR을 거칩니다. CSR은 SSR 이후에 클라이언트에서
> 하이드레이션과 추가 데이터 페칭을 처리하는 것입니다.

### 오해 2: "dynamicParams = false면 빌드 기호가 ○"

❌ **틀림**

빌드 기호는 **경로 유형**으로 결정됩니다:

- ○ = 고정 경로 (`/about`, `/blog/new`)
- ● = 동적 경로 + `generateStaticParams` (`/blog/[id]`)
- ƒ = Dynamic Rendering

`dynamicParams`는 **런타임 동작**을 결정하며, 빌드 기호에 영향을 주지 않습니다.

```tsx
// 둘 다 빌드 기호는 ●
export async function generateStaticParams() { ... }
export const dynamicParams = false;  // 빌드 기호: ●

export async function generateStaticParams() { ... }
// dynamicParams = true (기본값)    // 빌드 기호: ●
```

### 오해 3: "'use client'는 클라이언트에서만 실행된다"

❌ **틀림**

`'use client'` 컴포넌트는:

1. **서버에서 Pre-render** (초기 HTML 생성)
2. **클라이언트에서 하이드레이션** (이벤트 연결)

```tsx
'use client';

const Counter = () => {
  const [count, setCount] = useState(0);
  // ↑ 서버에서도 실행됨! count = 0으로 HTML 생성

  return <p>Count: {count}</p>;
  // ↑ 서버: <p>Count: 0</p> HTML 생성
};
```

### 오해 5: "useSearchParams()를 쓰면 무조건 Dynamic"

⚠️ **조건부로 맞음**

`useSearchParams()`를 **Suspense 없이** 사용하면 전체 페이지가 Dynamic이 됩니다.
하지만 **Suspense로 감싸면** 해당 영역만 클라이언트에서 렌더링되고, 나머지는 Static 가능합니다.

```tsx
// ❌ 전체 페이지 Dynamic
'use client';
const Page = () => {
  const searchParams = useSearchParams();
  return <div>...</div>;
};

// ✅ Suspense 바깥은 Static 가능
const Page = () => {
  return (
    <div>
      <h1>검색</h1> {/* Static */}
      <Suspense fallback={<Spinner />}>
        <SearchResults /> {/* 클라이언트 렌더링 */}
      </Suspense>
    </div>
  );
};
```

**Suspense 사용 시:**

- Suspense 바깥: 빌드 시 Pre-render (Static)
- Suspense 안쪽: 클라이언트에서 렌더링 (fallback 먼저 표시)

### 오해 6: "fetch 없이 데이터를 가져오면 캐시가 안 된다"

⚠️ **부분적으로 맞음**

Next.js의 확장된 `fetch`만 캐시 옵션이 적용됩니다.
다른 방법(axios, ORM 직접 호출 등)은 `unstable_cache` 또는 Route Segment Config로 제어해야 합니다.

```tsx
// fetch - 자동 캐시 제어
const data = await fetch(url, { next: { revalidate: 60 } });

// axios, prisma 등 - 별도 캐시 필요
import { unstable_cache } from 'next/cache';

const getCachedPosts = unstable_cache(
  async () => {
    return prisma.post.findMany();
  },
  ['posts'],
  { revalidate: 60 },
);
```

---

## 결론

### 핵심 요약

1. **모든 페이지는 SSR을 거친다**
   - Server Component든 Client Component든 서버에서 초기 HTML 생성
   - CSR은 하이드레이션과 이후 상태 관리를 담당

2. **빌드 기호는 빌드 시점의 처리 방식만 표시**
   - ○ / ● = 페이지 캐싱 사용 (Static)
   - ƒ = 매 요청마다 HTML 생성 (Dynamic)
   - 재검증 여부는 빌드 기호로 알 수 없음

3. **Static이 기본, Dynamic은 필요할 때만**
   - 성능상 Static (○/●)이 유리
   - 동적 함수(`cookies`, `headers`, `searchParams`)나 캐시 비활성화 시에만 Dynamic

4. **`generateStaticParams`는 Static 강제가 아님**
   - 동적 경로에서 빌드 시점에 생성할 경로를 지정
   - 동적 요인이 있으면 여전히 ƒ가 될 수 있음

5. **`'use client'`도 서버에서 Pre-render됨**
   - 서버에서 초기 HTML 생성 후 클라이언트에서 하이드레이션

### 권장 패턴

```
최적화 우선순위:

1️⃣ Static + 영구 캐시 (변하지 않는 콘텐츠)
2️⃣ Static + revalidate (주기적 업데이트)
3️⃣ Static + on-demand revalidation (이벤트 기반 갱신)
4️⃣ Dynamic (사용자별/실시간 필수인 경우만)
```

> 💡 **기억할 것**: 빌드 결과에서 ƒ가 적을수록 성능이 좋습니다.
> 가능하면 Static을 유지하고, 꼭 필요한 경우에만 Dynamic을 사용하세요.
