"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import User from "@/database/models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "@/database/models/thread.model";

interface Props {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Props): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (err: any) {
    throw new Error(`Failed to create/update suer: ${err.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    let findQuery = {
      id: userId, // kada radimo query, ne pisemo _id, nego samo id
    };

    const user = await User.findOne(findQuery);
    // .populate({
    //   path: "communities",
    //   model: Community
    // });

    return user;
  } catch (err) {
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  connectToDB();

  try {
    // find all threads authored by user with the given user id

    // TODO: populate the community
    const user = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });

    return user;
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  connectToDB();

  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const filter: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      filter.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(filter)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(filter);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function getActivity(userId: string) {
  connectToDB();

  try {
    // find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread IDs (replies) from the "children" field
    const childThreadIDs = userThreads.reduce((acc, userThread) => {
      return [...acc, ...userThread.children];
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIDs },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (err: any) {
    console.log(err.message);
  }
}
