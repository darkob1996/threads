import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchUser, getActivity } from "@/lib/actions/user.action";
import Link from "next/link";
import Image from "next/image";

async function Page() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const mongoUser = await fetchUser(clerkUser.id);
  if (!mongoUser?.onboarded) redirect("/onboarding");

  // Get activities / notifications
  const activity = await getActivity(mongoUser._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-6">
        {activity && activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="Profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet.</p>
        )}
      </section>
    </section>
  );
}

export default Page;
