import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

/**
 * TopBar component - Renders the top navigation bar of the application,
 * including the site logo, a link to the home page, and user authentication controls.
 *
 * Uses Clerk for authentication elements (SignOutButton, OrganizationSwitcher) and
 * supports responsive design.
 */
export default function TopBar() {
  return (
    <nav className="top-bar flex justify-between items-center p-4">
      {/* Logo and Home Link */}
      <Link href="/">
        <div className="flex items-center gap-1 max-lg:ml-3">
          <Image src="/assets/logov2.svg" alt="logo" width={28} height={28} />
          <p className="text-heading3-bold text-light-1 max-lg:hidden">
            hreadsy
          </p>
        </div>
      </Link>

      {/* Authentication and Organization Controls */}
      <div className="flex items-center gap-1">
        {/* SignOut Button for Mobile */}
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout_icon"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* Organization Switcher */}
        <div className="w-fit h-fit xl:bg-glassmorphism border-transparent rounded-lg">
          <OrganizationSwitcher
            appearance={{
              baseTheme: dark,
              elements: {
                organizationSwitcherTrigger: "py-2 px-4",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
}
