import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

async function Page({ params }: { params: { id: string } }) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const mongoUser = await fetchUser(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={mongoUser?.id}
        authUserId={clerkUser?.id}
        name={mongoUser?.name}
        username={mongoUser?.username}
        imgUrl={mongoUser?.image}
        bio={mongoUser?.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger value={tab.value} key={tab.label} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {mongoUser?.threads?.length ?? 0}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              <ThreadsTab
                currentUserId={mongoUser?.id}
                accountId={mongoUser?._id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
