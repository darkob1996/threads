"use client";

import { likeThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  currentUserId: string;
  threadId: string;
  likes: string[];
  alreadyLiked: boolean;
}

function LikeButton({ currentUserId, threadId, likes, alreadyLiked }: Props) {
  const pathname = usePathname();

  const handleLikeThread = async () => {
    await likeThread(currentUserId, threadId, pathname, alreadyLiked);
  };

  if (likes.length > 0 && likes.includes(currentUserId))
    return (
      <Image
        src="/assets/heart.svg"
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
        onClick={handleLikeThread}
      />
    );

  return (
    <Image
      src="/assets/heart-gray.svg"
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
      onClick={handleLikeThread}
    />
  );
}

export default LikeButton;
