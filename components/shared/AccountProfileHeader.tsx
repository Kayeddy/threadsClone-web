import Image from "next/image";

interface Props {
  accessedAccountUserId: string;
  currentLoggedInUserId: string;
  accessedAccountName: string;
  accessedAccountUsername: string;
  accessedAccountProfileImage: string;
  accessedAccountBio: string;
  type?: string;
}

/**
 * Displays the header for an account profile including the profile image,
 * account name, username, and bio.
 * @param {Props} props The props for this component.
 */
export default function AccountProfileHeader({
  accessedAccountName,
  accessedAccountUsername,
  accessedAccountProfileImage,
  accessedAccountBio,
}: Props) {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={accessedAccountProfileImage}
              alt={`${accessedAccountName}'s profile image`}
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {accessedAccountName}
            </h2>
            <p className="text-base-medium text-gray-1">
              @{accessedAccountUsername}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">
        {accessedAccountBio}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}
