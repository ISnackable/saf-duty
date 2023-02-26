import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { Middleware } from "next-api-route-middleware";
import { use } from "next-api-route-middleware";
import { getUserByIdQuery } from "next-auth-sanity/queries";
import * as argon2 from "argon2";

import { client } from "@/lib/sanity.client";
import {
  checkEmailValidation,
  checkNameValidation,
  checkPasswordValidation,
} from "@/pages/api/sanity/signUp";
import { authOptions } from "../auth/[...nextauth]";

const updatePersonnelHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "PUT") return res.status(404).send("Not found");

  console.log("Reached update personnel handler");

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
    userSchema: "personnel",
    id: session?.user?.id,
  });

  const { name, email, password, ord } = req.body;

  const hashedPassword = await argon2.hash(password);
  const clonedUser = { ...user, name, email, password: hashedPassword, ord };

  try {
    const newUser = await client.patch(user._id).set(clonedUser).commit();
    console.log(newUser);

    return res
      .status(200)
      .json({ status: "success", message: "Updated personnel" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong" });
  }
};

export const validateFields: Middleware = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  console.log(checkPasswordValidation(password));
  console.log(checkEmailValidation(email));
  console.log(checkNameValidation(name));

  if (
    checkPasswordValidation(password) === null &&
    checkEmailValidation(email) === null &&
    checkNameValidation(name) === null &&
    password === confirmPassword
  ) {
    return await next();
  } else {
    return res.status(422).json({
      status: "error",
      message: "Unproccesable request, fields are missing or invalid",
    });
  }
};

export default use(validateFields, updatePersonnelHandler);
