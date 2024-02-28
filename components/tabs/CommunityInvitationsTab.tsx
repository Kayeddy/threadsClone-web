"use client";

import { useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import InvitedUserCard from "../cards/InvitedUserCard";

/**
 * CommunityInvitationsTab - A component for displaying a list of pending invitations
 * within the community or organization. It utilizes Clerk's `useOrganization` to fetch
 * and manage organization-related data.
 */
export default function CommunityInvitationsTab() {
  const [organizationPendingInvites, setOrganizationPendingInvites]: any[] =
    useState([]);
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      (async () => {
        const invites = await organization.getInvitations();
        setOrganizationPendingInvites(invites.data);
      })();
    }
  }, []);

  if (!organization || !organizationPendingInvites) {
    return <div>Loading</div>;
  } else {
    return (
      <section className="mt-9 flex flex-col gap-10">
        {organizationPendingInvites.map((invitedUser: any) => (
          <InvitedUserCard
            key={invitedUser.emailAddress}
            invitedUserEmail={invitedUser.emailAddress}
            invitedUserStatus={invitedUser.status}
          />
        ))}
      </section>
    );
  }
}
