"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";
import Loader from "./ContentLoader";

export default function Searchbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [routeType, setRouteType] = useState("author");
  const [routeTypeChangeLoading, setRouteTypeChangeLoading] = useState(false);

  const handleRouteTypeChange = (type: string) => {
    setRouteTypeChangeLoading(true);
    router.push(`/search?loading=true`);
    setRouteType(type);
  };

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/search?${routeType}=` + search);
      } else {
        router.push(`/search?${routeType}`);
      }
      setRouteTypeChangeLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  useEffect(() => {
    router.push(`/search?${routeType}`);
  }, []);

  return (
    <div className="search-bar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "author" ? "Search communities" : "Search creators"
        }`}
        className="no-focus search-bar_input"
      />
      {!routeTypeChangeLoading ? (
        <div className="flex flex-row h-full justify-center items-center gap-2 rounded-sm">
          <span
            className={`${routeType === "author" && "bg-primary-500"} ${
              routeTypeChangeLoading && "bg-gray-600 cursor-not-allowed"
            } rounded-sm p-1 md:p-2 cursor-pointer transition-all duration-200 ease-in-out`}
            onClick={
              !routeTypeChangeLoading
                ? () => handleRouteTypeChange("author")
                : undefined
            }
          >
            <Image
              src="/assets/user.svg"
              alt="search"
              width={20}
              height={20}
              className="object-contain"
              layout="responsive"
            />
          </span>
          <div className="h-4 w-[0.5px] bg-light-1" />
          <span
            className={`${routeType === "community" && "bg-primary-500"} ${
              routeTypeChangeLoading && "bg-gray-600 cursor-not-allowed"
            } rounded-sm p-1 md:p-2 cursor-pointer transition-all duration-200 ease-in-out`}
            onClick={
              !routeTypeChangeLoading
                ? () => handleRouteTypeChange("community")
                : undefined
            }
          >
            <Image
              src="/assets/community.svg"
              alt="search"
              width={20}
              height={20}
              className="object-contain"
              layout="responsive"
            />
          </span>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
