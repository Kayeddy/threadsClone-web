import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

interface tagaDataProps {}

export default function ({ tagData }: { tagData: any }) {
  return (
    <div className="thread-card">
      <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
          <Link
            href={`/profile/${tagData.taggedBy._id.toString()}`}
            className="relative h-11 w-11"
          >
            <Image
              src={tagData.taggedBy.image}
              alt="Thread Author Profile Image"
              fill
              sizes="32x32"
              className="cursor-pointer rounded-full"
            />
          </Link>
          <div className="thread-card_bar" />
        </div>

        <div className="flex w-full flex-col items-start justify-center">
          <Link
            href={`/profile/${tagData.taggedBy._id.toString()}`}
            className="w-fit"
          >
            <h4 className="cursor-pointer text-base-semibold text-light-1">
              {tagData.taggedBy.username}
            </h4>
          </Link>

          <div className="w-fit bg-dark-1 md:bg-glassmorphism mt-4 p-2 px-4 whitespace-pre-line break-all rounded-lg">
            <h4 className="text-small-regular">Tagged you in:</h4>

            <Link href={`/thread/${tagData.thread._id.toString()}`}>
              <p className="no-result hover:ml-2 hover:underline transition-all duration-200 ease-in-out">
                {tagData.thread.threadContent}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
