"use client";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Renders the bottom navigation bar with dynamic links. Highlights the current active link.
 * Utilizes the updated Next.js `Link` component structure for navigation.
 *
 * @returns {JSX.Element} The component for the bottom navigation bar.
 */
export default function BottomBar() {
  const pathname = usePathname();

  // Function to check if a link is active based on the current pathname
  const isActiveLink = (route: string) => {
    return (pathname.includes(route) && route.length > 1) || pathname === route;
  };

  return (
    <nav className="bottom-bar">
      <div className="bottom-bar_container">
        {sidebarLinks.map((link) => {
          const isActive = isActiveLink(link.route);
          // Adjusted to use only the Link component for navigation without <a> tags
          return (
            <Link href={link.route} key={link.label}>
              <div className={`bottom-bar_link ${isActive ? "active" : ""}`}>
                {/* Using span to indirectly include image and text within Link */}
                <img
                  src={link.imgURL}
                  alt={link.label}
                  width={20}
                  height={20}
                />
                <p className="text-subtle-medium text-light-1 max-sm:hidden">
                  {link.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
