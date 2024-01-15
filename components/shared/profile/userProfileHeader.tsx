import Image from "next/image";

interface Props {
  accessedAccountUserId: string;
  currentLoggedInUserId: string;
  accessedAccountName: string;
  accessedAcountUsername: string;
  accessedAcountProfileImage: string;
  accessedAccountBio: string;
}

export default function UserProfileHeader({
  accessedAccountUserId,
  currentLoggedInUserId,
  accessedAccountName,
  accessedAcountUsername,
  accessedAcountProfileImage,
  accessedAccountBio,
}: Props) {
  return (
    <div className="flex w-ffull flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={accessedAcountProfileImage}
              alt="Account_Profile-Image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {accessedAccountName}
            </h2>
            <p className="text-base-medium text-gray-1">
              @{accessedAcountUsername}
            </p>
          </div>
        </div>
      </div>

      {/** TODO: comunnity */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">
        {accessedAccountBio}
      </p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
}
