import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ThreadsTab from "../tabs/ThreadsTab";
import MembersTab from "../tabs/MembersTab";
import PostCommunityThreadForm from "../forms/PostCommunityThreadForm";
import CommunityInvitationsTab from "../tabs/CommunityInvitationsTab";

interface Props {
  userId: string;
  accountThreads: [] | any;
  accountId: string;
  accountImage: string;
  tabList: any[];
  accountType: string;
  accountMembers?: any[] | null;
  isInCommunity?: boolean;
  isUserFromCommunity?: boolean;
  renderCardInteractions: boolean;
}

/**
 * Renders the profile tabs component, showing different sections like threads,
 * members, and invites based on the selected tab. This component is designed
 * to be used within user or community profiles to display relevant information
 * in a tabbed interface.
 *
 * @component
 * @param {Object} props The component props.
 * @param {string} props.userId The ID of the current user.
 * @param {Array} props.accountThreads A list of threads associated with the account.
 * @param {string} props.accountId The ID of the account.
 * @param {string} props.accountImage The profile image URL of the account.
 * @param {Array} props.tabList A list of tabs to be rendered, each with a label, value, and icon.
 * @param {string} props.accountType The type of the account (e.g., personal, community).
 * @param {Array} [props.accountMembers=null] Optional. A list of members associated with the account, if applicable.
 * @param {boolean} props.renderCardInteractions Flag indicating if card interactions should be rendered.
 * @param {boolean} [props.isUserFromCommunity=false] Optional. Flag indicating if the user is from the community.
 * @returns {JSX.Element} The AccountProfileTabs component.
 */
export default function AccountProfileTabs({
  userId,
  accountThreads,
  accountId,
  accountImage,
  tabList,
  accountType,
  accountMembers = null,
  renderCardInteractions,
  isUserFromCommunity = false,
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
            <div className="flex flex-col">
              {isUserFromCommunity && (
                <PostCommunityThreadForm
                  userId={userId}
                  clerkCommunityId={accountId}
                />
              )}
              <ThreadsTab
                currentLoggedInUserId={userId}
                accessedAccountId={accountId}
                accessedAccountImage={accountImage}
                accountThreads={accountThreads}
                accountType={accountType}
                renderCardInteractions={renderCardInteractions}
              />
            </div>
          )}
          {tab.value === "replies" && null}
          {tab.value === "tagged" && null}
          {tab.value === "members" && (
            <MembersTab
              communityMembersList={accountMembers}
              currentUserId={userId}
            />
          )}
          {tab.value === "invites" && <CommunityInvitationsTab />}
        </TabsContent>
      ))}
    </Tabs>
  );
}
