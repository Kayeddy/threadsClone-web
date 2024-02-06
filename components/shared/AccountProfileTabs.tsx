import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "../tabs/ThreadsTab";
import MembersTab from "../tabs/MembersTab";

interface Props {
  userData: any;
  accountThreads: [];
  accountId: string;
  accountImage: string;
  tabList: any[];
  accountType: string;
  accountMembers?: any[] | null;
}

export default function AccountProfileTabs({
  userData,
  accountThreads,
  accountId,
  accountImage,
  tabList,
  accountType,
  accountMembers,
}: Props) {
  return (
    <Tabs defaultValue={tabList[0]?.value} className="w-full">
      <TabsList className="tab-list">
        {tabList.map((tab) => (
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
                {accountThreads.length ? accountThreads.length : 0}
              </p>
            )}

            {tab.label === "Members" && (
              <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                {accountMembers ? accountMembers.length : 0}
              </p>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabList.map((tab) => (
        <TabsContent
          key={`content-${tab.label}`}
          value={tab.value}
          className="w-full text-light-1"
        >
          {tab.value === "threads" && (
            <ThreadsTab
              currentLoggedInUserData={{
                id: userData._id,
                name: userData.name,
                username: userData.username,
                image: userData.image,
              }}
              accessedAccountId={accountId}
              accessedAccountImage={accountImage}
              accountThreads={accountThreads}
              accountType={accountType}
            />
          )}
          {tab.value === "replies" && null}
          {tab.value === "tagged" && null}
          {tab.value === "members" && (
            <MembersTab communityMembersList={accountMembers} />
          )}
          {tab.value === "requests" && null}
        </TabsContent>
      ))}
    </Tabs>
  );
}
