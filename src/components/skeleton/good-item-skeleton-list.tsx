import GoodItemSkeleton from "./good-item-skeleton";

export default function GoodItemSkeletonList({ count }: { count: number }) {
  const arr = new Array(count).fill(0);
  return (
    <>
      {arr.map((_, index) => (
        <GoodItemSkeleton key={index} />
      ))}
    </>
  );
}
