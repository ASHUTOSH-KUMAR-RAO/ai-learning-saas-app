"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SearchInput = () => {
  const pathName = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [query, setQuery] = useState("");

  useEffect(() => {

    const delayDebounce = setTimeout(() =>{
        if (query) {
          const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "topic",
            value: query,
          });
          router.push(newUrl, { scroll: false });
        } else {
          if (pathName === "/Companions") {
            const newUrl = removeKeysFromUrlQuery({
              params: searchParams.toString(),
              keysToRemove: ["topic"],
            });
          }
        }
    }, 600);
  }, [query, pathName, router, setQuery]);

  return (
    <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out">
      <Image src="/icons/search.svg" alt="search icon" width={20} height={20} />

      <input
        type="text"
        placeholder="Search Companions..."
        className="outline-none bg-transparent w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
