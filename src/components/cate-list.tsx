import style from "@/components/cate-list.module.css";
import { GoodDataType } from "@/types/types";
import GoodItem from "./good-item";
import DeleteBt from "./delete-bt";
export default async function CateList({ id }: { id: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  const good: GoodDataType = await res.json();
  const { category } = good;

  const resCate = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${category}`
  );
  const goods: GoodDataType[] = await resCate.json();

  return (
    <div className={style.cate_container}>
      <h3>
        <strong>{category}</strong> 상품 목록
      </h3>
      <div>
        {goods.map((item) => (
          <div key={item.id}>
            <GoodItem {...item} />
            <DeleteBt {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
