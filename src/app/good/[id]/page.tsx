import { GoodDataType } from "@/types/types";
import style from "@/app/good/[id]/page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

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
    // return <div>존재하지 않는 상품입니다.</div>;
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
