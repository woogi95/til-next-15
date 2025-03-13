# Data Fetching

- 사용자 페이지 요청시 데이터를 사전에 호출하여 처리함.

## 복습

### 흐름

- 사용자 라우터 요청 > Next 서버가 html 에 필요한 데이터 > BE 요청
- Next 서버가 완성된 html 을 반환하고 > 만약, 클라이언트 컴포넌트가 있다면
- 클라이언트 컴포넌트만 번들링한 js 를 돌려주고, 다시 Hydratin 과정으로 진행

### Pages Router 에서는

- SSR (Server Side Rendering) : getServerSideProps 함수
- SSG (Server Static Generation) : getStaticProps 함수
- ISR (Incremental Static Regeneration) : SSG, revalidate 를 이용해서 갱신
- 동적 라우터를 위해 필요한 함수(/good/1, /good/2..) : getStaticPaths 함수

#### 단점

- 위의 함수들은 무조건 라우터 경로에 맞는 페이지에만 작성할 수 있다.
  `http://localhost:3000/setting` ===> /src/pages/setting.tsx
- 일반 컴포넌트는 Props 로 전달받는 방법 또는 Context 를 이용하는 방법으로 활용.

### App Router 에서는

- 서버 컴포넌트라면 마음대로 데이터를 패칭할 수 있도록 적용함.

## index 페이지 데이터 패칭 적용

- /src/app/(with-search)/page.tsx

```tsx
import style from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/good-item";
import { GoodDataType } from "@/types/types";

export default async function Home() {
  const res = await fetch("https://fakestoreapi.com/products");
  const allGoods: GoodDataType[] = await res.json();
  console.log(allGoods);

  const resRandom = await fetch("https://fakestoreapi.com/products");
  const randomGoods: GoodDataType[] = await resRandom.json();
  console.log(randomGoods);

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        {randomGoods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </section>
      <section>
        <h3>전체 상품</h3>
        {allGoods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </section>
    </div>
  );
}
```

- 이제 페이지가 아닌 컴포넌트에서도 데이터 패칭이 가능하다.
- /src/components/all-goods.tsx 생성

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function AllGoods() {
  const res = await fetch("https://fakestoreapi.com/products?limit=10");
  const allGoods: GoodDataType[] = await res.json();
  console.log(allGoods);
  return (
    <>
      {allGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

- /src/components/random-goods.tsx 생성

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function RandomGoods() {
  const resRandom = await fetch("https://fakestoreapi.com/products?limit=3");
  const randomGoods: GoodDataType[] = await resRandom.json();
  console.log(randomGoods);

  return (
    <>
      {randomGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

- 컴포넌트 배치
- /src/app/(with-search)/page.tsx

```tsx
import style from "@/app/(with-search)/page.module.css";
import { AllGoods } from "@/components/all-goods";
import { RandomGoods } from "@/components/random-goods";

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <RandomGoods />
      </section>
      <section>
        <h3>전체 상품</h3>
        <AllGoods />
      </section>
    </div>
  );
}
```

- BE 의 API 주소를 `.env`에 환경설정파일로 저장

  - 환경설정 파일이 웹브라우저에 노출이 되는 경우
    `NEXT_PUBLIC_API_URL=https://fakestoreapi.com`

  - 환경설정 파일이 서버에서만 활용되는 경우
    `API_URL=https://fakestoreapi.com`

- 환경 설정 파일 적용
- /src/components/random-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function RandomGoods() {
  let randomGoods: GoodDataType[] = [];
  try {
    const resRandom = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`);
    randomGoods = await resRandom.json();
    // console.log(randomGoods);
  } catch (error) {
    console.log(error);
  }
  if (randomGoods.length === 0) {
    return <div>상품이 없습니다.</div>;
  }
  return (
    <>
      {randomGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

- /src/components/all-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function AllGoods() {
  let allGoods: GoodDataType[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`);
    allGoods = await res.json();
    //console.log(allGoods);
  } catch (error) {
    console.log(error);
  }
  return (
    <>
      {allGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

## search 페이지 데이터 패칭 적용

- search 는 사용자가 무엇을 검색할지 모르므로 데이터 패칭은 부적합.
- /src/app/(with-search)/search/page.tsx

```tsx
import style from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/good-item";

import { GoodDataType } from "@/types/types";
// 쿼리 처리하기
// 아래 페이지는 쿼리를 서버에서 읽어들여서 처리함.
// http://localhost:3000/search?keword=iu
export default async function Page({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const { keyword } = await searchParams;
  // console.log(keyword);
  // 제품 카테고리 검색으로 진행하겠습니다.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`);
  const goods: GoodDataType[] = await res.json();
  if (goods.length === 0) {
    return <div>{keyword} 카테고리에 해당하는 제품이 없습니다.</div>;
  }

  return (
    <div className={style.container}>
      <h4>
        카테고리명 : <strong>{keyword}</strong> 검색페이지
      </h4>
      <div>
        {goods.map((good) => (
          <GoodItem key={good.id} {...good} />
        ))}
      </div>
    </div>
  );
}
```

## 상세 페이지 데이터 패칭 적용

- /src/app/good/[id]/page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";

const mockData: GoodDataType = {
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  price: 109.95,
  description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  rating: { rate: 3.9, count: 120 },
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // console.log(id);

  let good: GoodDataType | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.image} style={{ backgroundImage: `url(${image})` }}>
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <div className={style.category}>{category}</div>
      <div className={style.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
```

# Data Cashing

- 서버가 실행되는 동안에 요청된 데이터를 서버에 보관하는 것.

## 전제조건

- Next.js 의 fetch 를 사용한다.
- fetch("API", {Cash 옵션} )

## 종류

- `{ cache: "no-store" }` : 보관하지 말아라
- `{ cache: "force-cache" }` : 무조건 보관하라
- `{ next: {revalidate: 3} }` : 요청시 3초 동안만 유지하고 갱신
- `{ next: {tags: ['num'] } }` : 특정 태그로 강제 요청

## 실제 Next 서버에서 API 호출을 하는 과정을 출력

- `next.config.ts` 설정

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
  // BE API 호출시 과정 및 Data Cash 정보
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
```

### 무조건 캐싱하기

- /src/components/all-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function AllGoods() {
  let allGoods: GoodDataType[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`, { cache: "force-cache" });
    allGoods = await res.json();
    //console.log(allGoods);
  } catch (error) {
    console.log(error);
  }
  return (
    <>
      {allGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

### 시간으로 데이터 갱신 캐싱하기

- /src/components/random-goods.tsx

```tsx
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";

export async function RandomGoods() {
  let randomGoods: GoodDataType[] = [];
  try {
    const resRandom = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`, { next: { revalidate: 3 } });
    randomGoods = await resRandom.json();
    // console.log(randomGoods);
  } catch (error) {
    console.log(error);
  }
  if (randomGoods.length === 0) {
    return <div>상품이 없습니다.</div>;
  }
  return (
    <>
      {randomGoods.map((good) => (
        <GoodItem key={good.id} {...good} />
      ))}
    </>
  );
}
```

### 동적 라우팅 페이지

- /src/app/good/[id]/page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // console.log(id);

  let good: GoodDataType | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      cache: "force-cache",
    });
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.image} style={{ backgroundImage: `url(${image})` }}>
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <div className={style.category}>{category}</div>
      <div className={style.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
```

# Full Route Cache

- `npm run build` 시 생성
- 이후로 요청시 사전랜더링 없이 바로 Cache 된 내용을 리턴

## 페이지 종류

- Static Page : Full Route Cache 적용됨.
- Dynamic Page : 동적 생성

## Dynamic Page 로 되는 경우

- 요청 마다 결과 내용이 다를 때 (Data Fetching 을 한다면)
- 쿼리 또는 파라메터를 전달 받는 경우

## Static Page 로 되는 경우

- 동적함수 없고, 데이터 캐시가 적용된 경우

## 동적 라우터 페이지를 Static Page 로 만들기

- /src/app/good/[id]/page.tsx

```tsx
import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";

// 특정한 페이지를 Static Page 로 생성
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // console.log(id);

  let good: GoodDataType | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      cache: "force-cache",
    });
    good = await res.json();
    // console.log(good);
  } catch (error) {
    console.log(error);
  }

  if (!good) {
    // 404 띄우기
    notFound();
    return <div>존재하지 않는 상품입니다.</div>;
  }

  const { title, image, category, rating, description } = good;

  return (
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.image} style={{ backgroundImage: `url(${image})` }}>
        <Image src={image} width={245} height={350} alt={title} />
      </div>
      <div className={style.category}>{category}</div>
      <div className={style.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
}
```
