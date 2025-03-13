# error

- Next.js 에서 에러를 담당하는 error.tsx 가 있음
- `/src/app/(with-search)/error.tsx 파일` 생성

## 주의사항

- 반드시 서버 뿐만아니라 클라이언트도 처리해 주도록 지시해야 한다.
- "use client" 지시자를 사용한다.

```tsx
"use client";
export default function Error() {
  return (
    <div>
      <h3>에러가 발생했습니다.</h3>
    </div>
  );
}
```

## 에러의 메시지를 출력하는 경우

- 자동으로 props 로 정보를 전달해줌.

```tsx
"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
    </div>
  );
}
```

## 에러시 다시 실행하도록 함수를 props 로 전달

- 본인의 경우는 reset 보다는 `웹브라우저 새로 고침을 권장`.
- reset 함수 : 컴포넌트 리랜더링을 시도함

```tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
```

## 에러시 웹브라우저 새로 고침 적용한다면

- window.location.reload()

```tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={() => reset()}>다시 시도</button> */}
      <button onClick={() => window.location.reload()}>다시 시도</button>
    </div>
  );
}
```

## 새로고침 없이 Next 에서 제공하는 기능 활용하기

- Next 서버에 다시 자료 호출
- 컴포넌트의 리랜더링까지 같이 진행

```tsx
"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={() => reset()}>다시 시도</button> */}
      {/* <button onClick={() => window.location.reload()}>다시 시도</button> */}
      <button
        onClick={() => {
          // react 18 버전에 추가
          startTransition(() => {
            router.refresh(); // 서버 컴포넌트 다시 실행하기를 요청
            reset(); // 컴포넌트 새로고침
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
```
