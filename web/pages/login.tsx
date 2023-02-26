import React, { useEffect, useRef, useState } from "react";
import type { GetServerSidePropsContext } from "next";
import Router from "next/router";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import type { User } from "next-auth";
import { signUp } from "next-auth-sanity/client";
import { useToggle, upperFirst } from "@mantine/hooks";
import { isEmail, useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
  Container,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { IconCheck, IconX } from "@tabler/icons-react";

import { authOptions } from "./api/auth/[...nextauth]";

// Function that checks if the password is valid, returns an error message if not
export function checkPasswordValidation(value: string) {
  const isWhitespace = /^(?=.*\s)/;
  if (isWhitespace.test(value)) {
    return "Password must not contain Whitespaces.";
  }

  const isContainsUppercase = /^(?=.*[A-Z])/;
  if (!isContainsUppercase.test(value)) {
    return "Password must have at least one Uppercase Character.";
  }

  const isContainsLowercase = /^(?=.*[a-z])/;
  if (!isContainsLowercase.test(value)) {
    return "Password must have at least one Lowercase Character.";
  }

  const isContainsNumber = /^(?=.*[0-9])/;
  if (!isContainsNumber.test(value)) {
    return "Password must contain at least one Digit.";
  }

  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
  if (!isContainsSymbol.test(value)) {
    return "Password must contain at least one Special Symbol.";
  }

  const isValidLength = /^.{10,16}$/;
  if (!isValidLength.test(value)) {
    return "Password must be 10-16 Characters Long.";
  }
  return null;
}

type NextAuthSanityResponse = {
  status?: "error" | "success";
  message?: string;
} & User;

export default function AuthenticationForm() {
  const hcaptchaRef = useRef<HCaptcha>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      name: "testuser",
      email: "testuser@email.com",
      password: "$00pU*2KE1X3",
    },

    validate: {
      name: (value) =>
        type === "register" && value.length < 2
          ? "Name must have at least 2 letters"
          : null,
      email: isEmail("Invalid email"),
      password: (value) =>
        type === "register" && checkPasswordValidation(value),
    },

    validateInputOnChange: ["password"],
  });

  const handleSubmit = async () => {
    // Execute the hCaptcha when the form is submitted
    if (hcaptchaRef.current !== null) {
      hcaptchaRef.current.execute();
    }
  };

  const onHCaptchaChange = async (captchaCode: string | null | undefined) => {
    const { name, email, password } = form.values;
    // If the hCaptcha code is null or undefined indicating that
    // the hCaptcha was expired then return early
    if (!captchaCode || (type === "register" && !name) || !email || !password) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (type === "register") {
        const response: NextAuthSanityResponse = await signUp({
          email,
          password,
          name,
          captcha: captchaCode,
        });

        if (response?.status === "error") {
          showNotification({
            title: "Error",
            message: response?.message || "Something went wrong",
            color: "red",
            icon: <IconX />,
          });
          return;
        }

        showNotification({
          title: "Success",
          message: "Account has been created",
          color: "teal",
          icon: <IconCheck />,
        });
      }

      const loginStatus = await signIn("sanity-login", {
        email,
        password,
        redirect: false,
      });

      // If the user is not authenticated, it will return an object with the ok property set to false
      if (!loginStatus?.ok) {
        showNotification({
          title: "Error",
          message: "Invalid credentials",
          color: "red",
          icon: <IconX />,
        });
      } else {
        // If the user is authenticated, redirect to the home page
        Router.push("/");
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>

      <Paper radius="md" p="xl" mt={30} withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === "register" && (
              <TextInput
                required={type === "register"}
                label="Name"
                placeholder="Your name"
                {...form.getInputProps("name")}
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              {...form.getInputProps("password")}
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" disabled={isSubmitting}>
              {upperFirst(type)}
            </Button>
          </Group>

          <HCaptcha
            size="invisible"
            ref={hcaptchaRef}
            sitekey={
              process.env.NODE_ENV === "development"
                ? "10000000-ffff-ffff-ffff-000000000001"
                : process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!
            }
            onVerify={onHCaptchaChange}
            onExpire={() => onHCaptchaChange(null)}
            onError={(err) => {
              onHCaptchaChange(null);
              showNotification({
                title: "Error",
                message: "Cannot verify captcha",
              });
              console.error(err);
            }}
          />
        </form>
      </Paper>
    </Container>
  );
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  return {
    props: {},
  };
}
