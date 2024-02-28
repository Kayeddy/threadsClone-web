"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Loader from "./ContentLoader";

/**
 * Represents a search bar allowing users to search for authors or communities.
 * The search operation is debounced to reduce the number of queries.
 *
 * @returns {JSX.Element} The Searchbar component.
 */
export default function Searchbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [routeType, setRouteType] = useState("author");
  const [routeTypeChangeLoading, setRouteTypeChangeLoading] = useState(false);

  /**
   * Handles the change of route type (author/community) for the search.
   * Initiates a loading state before updating the route type.
   *
   * @param {string} type The new route type.
   */
  const handleRouteTypeChange = (type: string) => {
    if (type === routeType) return; // Prevent unnecessary updates

    setRouteTypeChangeLoading(true);
    setTimeout(() => {
      setRouteType(type);
      setRouteTypeChangeLoading(false);
      // Navigate to indicate a change in route type, but avoid actual search until input
      router.push(
        `/search?${type}=${search ? encodeURIComponent(search) : ""}`
      );
    }, 300); // Simulate a loading delay for UX
  };

  // Debounce the search query input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim()) {
        router.push(`/search?${routeType}=${encodeURIComponent(search)}`);
      }
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType, router]);

  return (
    <div className="search-bar">
      <Image
        src="/assets/search-gray.svg"
        alt="search icon"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={
          routeType !== "author" ? "Search communities" : "Search creators"
        }
        className="no-focus search-bar_input"
      />
      {!routeTypeChangeLoading ? (
        <div className="flex flex-row h-full justify-center items-center gap-2 rounded-sm">
          {/* Toggle buttons for selecting the search type */}
          <button
            onClick={() => handleRouteTypeChange("author")}
            className={`cursor-pointer p-1 rounded-lg ${
              routeType === "author" ? "bg-primary-500" : ""
            }`}
          >
            <Image
              src="/assets/user.svg"
              alt="author search"
              width={20}
              height={20}
              className="object-contain"
            />
          </button>
          <div className="h-4 w-[0.5px] bg-light-1" />
          <button
            onClick={() => handleRouteTypeChange("community")}
            className={`cursor-pointer p-1 rounded-lg ${
              routeType === "community" ? "bg-primary-500" : ""
            }`}
          >
            <Image
              src="/assets/community.svg"
              alt="community search"
              width={20}
              height={20}
              className="object-contain"
            />
          </button>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
