import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.action";
import Comment from "@/components/forms/Comment";

async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const mongoUser = await fetchUser(clerkUser.id);

  if (!mongoUser.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  console.log(
    params.id,
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  );

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          clerkUserId={clerkUser?.id}
          mongoUserId={mongoUser._id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImage={mongoUser.image}
          currentUserId={JSON.stringify(mongoUser._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childItem: any) => {
          return (
            <ThreadCard
              key={childItem._id}
              id={childItem._id}
              clerkUserId={clerkUser?.id}
              mongoUserId={mongoUser._id}
              parentId={childItem.parentId}
              content={childItem.text}
              author={childItem.author}
              community={childItem.community}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              likes={childItem.likes}
              isComment
            />
          );
        })}
      </div>
    </section>
  );
}

export default Page;
