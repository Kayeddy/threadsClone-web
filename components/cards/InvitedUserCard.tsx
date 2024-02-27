import Image from "next/image";
import { Button } from "../ui/button";

export default function InvitedUserCard({
  invitedUserEmail,
  invitedUserStatus,
}: {
  invitedUserEmail: string;
  invitedUserStatus: string;
}) {
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">
            {invitedUserEmail}
          </h4>
        </div>
      </div>
      <p
        className={`capitalize p-2 flex items-center justify-center rounded-lg bg-opacity-50 ${
          invitedUserStatus === "pending" ? "bg-red-300" : "bg-[#5ec995]"
        }`}
      >
        {invitedUserStatus}
      </p>
    </article>
  );
}
