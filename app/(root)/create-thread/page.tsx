import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";

async function Page() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const mongoUser = await fetchUser(clerkUser.id);

  if (!mongoUser?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={mongoUser._id} />
    </>
  );
}

export default Page;
