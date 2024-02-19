"use client";

import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar left-sidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname === link.route && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`left-sidebar_link transition-all duration-150 ease-in-out ${
                isActive
                  ? "bg-primary-500"
                  : "hover:bg-primary-500 hover:bg-opacity-40"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden"> {link.label} </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4 hover:bg-red-300 hover:bg-opacity-50 transition-all duration-150 ease-in-out rounded-lg">
              <Image
                src="/assets/logout.svg"
                alt="logout_icon"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Log out</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}
