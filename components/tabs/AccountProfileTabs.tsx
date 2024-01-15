import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "../shared/profile/ThreadsTab";

interface Props {
  userId: string;
  userThreads: [];
  accountId: string;
  accountImage: string;
}

export default function AccountProfileTabs({
  userId,
  userThreads,
  accountId,
  accountImage,
}: Props) {
  return (
    <Tabs defaultValue="threads" className="w-full">
      <TabsList className="tab-list">
        {profileTabs.map((tab) => (
          <TabsTrigger
            key={tab.label}
            value={tab.value}
            className="tab-trigger"
          >
            <Image
              src={tab.icon}
              alt={tab.label}
              width={24}
              height={24}
              className="object-contain"
            />
            <p className="max-sm:hidden">{tab.label}</p>

            {tab.label === "Threads" && (
              <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                {userThreads.length ? userThreads.length : 0}
              </p>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {profileTabs.map((tab) => (
        <TabsContent
          key={`content-${tab.label}`}
          value={tab.value}
          className="w-full text-light-1"
        >
          <ThreadsTab
            currentLoggedInUserId={userId}
            accessedAccountId={accountId}
            accessedAccountImage={accountImage}
            accountThreads={userThreads}
            accountType="User"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
