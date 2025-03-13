import { GoodDataType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import style from "@/components/GoodItem.module.css";

const GoodItem = ({ id, title, image, category, rating }: GoodDataType) => {
  return (
    <Link href={`/good/${id}`} className={style.container}>
      <Image src={image} width={80} height={115} alt={title} />
      <div>
        <div className={style.title}>{title}</div>
        <div className={style.category}>{category}</div>
        <br />
        <div className={style.rating}>
          Rating: {rating.rate} | {rating.count}
        </div>
        <div></div>
      </div>
    </Link>
  );
};

export default GoodItem;
