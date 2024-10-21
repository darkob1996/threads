import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import UserCard from "@/components/cards/UserCard";

async function Page() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const mongoUser = await fetchUser(clerkUser.id);
  if (!mongoUser?.onboarded) redirect("/onboarding");

  // Fetch users
  const { users, isNext } = await fetchUsers({
    userId: clerkUser.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {users.length === 0 ? (
          <p className="no-result">No users.</p>
        ) : (
          <>
            {users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default Page;
