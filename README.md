# Image 컴포넌트

- https://velog.io/@apparatus1/next-image
- https://nextjs.org/docs/pages/api-reference/components/image
- webp, AVIF 등의 이미지 포맷으로 자동 변환을 지원
- 디바이스에 맞도록 이미지를 생성해서 적용 지원
- 레이지 로딩 등도 지원함.
- 블러 효과로 이미지를 사전에 흐린 이미지로 로딩 후 완료시 선명한 이미지로 대체

## 외부 URL 이미지 활용하기

- next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com", // 호스트 주소
      },
    ],
  },
};

export default nextConfig;
```

## Image 컴포넌트 사용법

```tsx
import Image from "next/image";
<Image src={경로} width={너비} height={높이} alt={설명} />;
```

# SEO 적용하기

- 메타데이터 설정을 통해 진행.

## 실습

- `favicon.ico` 는 `/src/app 폴더`에 배치
- /src/app/(with-search)/page.tsx 적용

```tsx
// SEO 적용
export const metadata: Metadata = {
  title: "상품 홍보 페이지",
  description: "상품 홍보 페이지입니다.",
  openGraph: {
    title: "상품 홍보 페이지",
    description: "상품 홍보 페이지입니다.",
  },
};
```

- /src/app/(with-search)/search/page.tsx 적용

```tsx
export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) => {
  const { keyword } = await searchParams;
  return {
    title: `상품 ${keyword} 검색 페이지`,
    description: `상품 ${keyword} 검색 페이지입니다.`,
    openGraph: {
      title: `상품 ${keyword} 검색 페이지`,
      description: `상품 ${keyword} 검색 페이지입니다.`,
      images: [{ url: "/thumbnail.png" }],
    },
  };
};
```

- /src/app/good/[id]/page.tsx

```tsx
// SEO
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );
    const good: GoodDataType = await res.json();
    const { title, description, image } = good;
    return {
      title: `상품 ${title} 상세 페이지`,
      description: `상품 설명 - ${description}`,
      openGraph: {
        title: `상품 ${title} 상세 페이지`,
        description: `상품 설명 - ${description}`,
        images: [{ url: image }],
      },
    };
  } catch (error) {
    console.log(error);
  }
};
```

# Deploy 실행하기(Vercel)

- `npm run build`로 오류 발견시 제거 및 수정
