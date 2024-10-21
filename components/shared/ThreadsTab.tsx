import { fetchUserPosts } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  let user = await fetchUserPosts(currentUserId);

  if (!user) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {user.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          clerkUserId={currentUserId}
          mongoUserId={accountId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: user.name, image: user.image, _id: user.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  _id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;
