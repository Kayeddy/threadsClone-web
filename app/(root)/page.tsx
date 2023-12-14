import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/" />
      <h1 className="head-text text-left">Home</h1>
    </div>
  );
}
