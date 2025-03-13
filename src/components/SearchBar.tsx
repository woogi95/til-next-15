"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import style from "@/components/searchbox.module.css";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  // 동적 라우팅
  const router = useRouter(); // import 주의하자.
  const hanldeSearch = () => {
    if (!search) {
      return;
    }
    router.push(`/search?keyword=${search}`);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key = "Enter")) {
      hanldeSearch();
    }
  };
  return (
    <div className={style.container}>
      <input type="text" value={search} onChange={(e) => onChangeSearch(e)} onKeyDown={(e) => onKeyDown(e)} />
      <button onClick={hanldeSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
