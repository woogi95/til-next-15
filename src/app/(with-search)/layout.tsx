import SearchBar from "@/components/searchbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SearchBar />
      <div>{children}</div>
    </>
  );
}
