"use client";
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Input } from "../ui/input";

interface User {
  _id: string;
  username: string;
  image: string;
}

interface SelectedUserProps {
  userId: string;
  username: string;
}

interface CustomUserTagSelectorProps {
  userList: User[];
  selectedUserIds: string[]; // Add this line
  onSelectionChange: (selectedIds: SelectedUserProps[]) => void;
}

const CustomUserTagSelector: React.FC<CustomUserTagSelectorProps> = ({
  userList,
  selectedUserIds,
  onSelectionChange,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<SelectedUserProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);

  const toggleUserSelection = async (selectedUser: SelectedUserProps) => {
    const isAlreadySelected = selectedUsers.some(
      (user) => user.userId === selectedUser.userId
    );
    const updatedSelectedUsers = isAlreadySelected
      ? selectedUsers.filter((user) => user.userId !== selectedUser.userId)
      : [...selectedUsers, selectedUser];

    onSelectionChange(updatedSelectedUsers);
    setPopoverVisible(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUserList = userList.filter(
    (user) =>
      !selectedUserIds.includes(user._id) &&
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Popover placement="right" isOpen={popoverVisible}>
        <PopoverTrigger>
          <Button
            className="flex flex-row gap-2 items-center justify-center bg-primary-500"
            onClick={() => setPopoverVisible(!popoverVisible)}
          >
            Tag users
            <PlusIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-dark-2 rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <div className="search-bar flex items-center gap-2">
              <Image
                src="/assets/search-gray.svg"
                alt="search icon"
                width={14}
                height={14}
                className="object-contain"
              />
              <Input
                id="search-input"
                onChange={handleSearchChange}
                placeholder="Search users"
                className="no-focus border-none border-b-2 bg-transparent text-base-regular outline-none text-white"
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-4 p-4">
              {filteredUserList.length > 0 ? (
                filteredUserList.map((user) => (
                  <Button
                    key={user._id}
                    onClick={() =>
                      toggleUserSelection({
                        userId: user._id,
                        username: user.username,
                      })
                    }
                    className="flex flex-row gap-4 items-center justify-start hover:bg-gray-600 w-full p-2 rounded-lg transition-all duration-200 ease-in-out cursor-pointer bg-glassmorphism"
                  >
                    <Image
                      src={user.image}
                      alt="user_tag_image"
                      width={24}
                      height={24}
                      className="object-contain rounded-full"
                    />
                    <p className="font-small-regular text-white">
                      @{user.username}
                    </p>
                  </Button>
                ))
              ) : (
                <p className="text-white">No users found</p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomUserTagSelector;
