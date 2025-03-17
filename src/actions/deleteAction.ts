/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteAction(_: any, formData: FormData) {
  const goodId = formData.get("goodid") as string;
  if (!goodId) {
    return {
      status: false,
      message: `해당하는 ${goodId}가 없습니다.`,
    };
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${goodId}`,
      { method: "DELETE" }
    );
    const { id } = await res.json();

    revalidatePath(`/good/${goodId}`);
    revalidateTag(`good-${id}`);
    return {
      status: true,
      message: `${goodId} 삭제에 성공하였습니다.`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: `해당하는 ${goodId}가 삭제에 실패하였습니다. 다시 시도해주세요.`,
    };
  }
}
