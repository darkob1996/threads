import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";

async function Home() {
  const clerkUser = await currentUser();
  const result = await fetchPosts(1, 30);

  if (!clerkUser) redirect("/sign-in");

  const mongoUser = await fetchUser(clerkUser?.id);

  if (!mongoUser) redirect("/onboarding");

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result?.posts?.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                clerkUserId={post?.author?.id}
                mongoUserId={mongoUser._id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
