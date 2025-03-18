export default function Page() {
  const 서버액션 = async (formData: FormData) => {
    "use server";

    const nickName = formData.get("nickname");
    console.log(nickName);
    // awiat 서버기능호출(nicName)
    // await sql`INSERT INTO NickName (nickname) VALUES (${nickname})`;
  };

  return (
    <>
      <form action={서버액션}>
        <input type="text" name="nickname" />
        <button type="submit">입력</button>
      </form>
    </>
  );
}
