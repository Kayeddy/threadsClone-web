"use client";
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="bottom-bar">
      <div className="bottom-bar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottom-bar_link transition-all duration-150 ease-in-out ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
              />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+./)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
