import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getUserByIdQuery } from "next-auth-sanity/queries";
import * as argon2 from "argon2";

import { client } from "@/lib/sanity.client";
import { authOptions } from "../auth/[...nextauth]";

export default async function deleteUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") return res.status(404).send("Not found");

  console.log("Reached delete user handler");

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ status: "error", message: "You must be logged in" });
  }

  if (!session?.user?.id)
    return res.status(422).json({
      status: "error",
      message: "Unproccesable request, user id not found",
    });

  const user = await client.fetch(getUserByIdQuery, {
    userSchema: "user",
    id: session?.user?.id,
  });

  const { name, email, password, oldPassword, enlistment, ord } = req.body;

  // Check if old password is correct
  const isOldPasswordCorrect = await argon2.verify(user?.password, oldPassword);

  if (!isOldPasswordCorrect) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized, old password is incorrect",
    });
  }

  const hashedPassword = await argon2.hash(password);
  const clonedUser = {
    ...user,
    name,
    email,
    password: hashedPassword,
    enlistment,
    ord,
  };

  try {
    const newUser = await client.patch(user._id).set(clonedUser).commit();
    console.log(newUser);

    return res
      .status(200)
      .json({ status: "success", message: "Success, deleted user" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong" });
  }
}
