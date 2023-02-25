import React, { useEffect, useRef } from "react";
import Router from "next/router";
import { useSession, signIn } from "next-auth/react";
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

type NextAuthSanityResponse = {
  status?: "error" | "success";
  message?: string;
} & User;

function checkPasswordValidation(value: string) {
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

export default function AuthenticationForm(props: PaperProps) {
  const { status } = useSession();

  const hcaptchaRef = useRef<HCaptcha>(null);
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      name: "Testing Account 5",
      email: "testing5@email.com",
      password: "Password123",
    },

    validate: {
      name: (value) =>
        type === "register" && value.length < 2
          ? "Name must have at least 2 letters"
          : null,
      email: isEmail("Invalid email"),
      password: (val) => checkPasswordValidation(val),
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

    if (checkPasswordValidation(password) !== null) {
      showNotification({
        title: "Error",
        message: "Invalid password",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

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

      await signIn(
        "sanity-login",
        {
          redirect: false,
          email,
          password,
        },
        { callbackUrl: "/" }
      );
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      Router.push("/");
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

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

      <Paper radius="md" p="xl" mt={30} withBorder {...props}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === "register" && (
              <TextInput
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
            <Button type="submit">{upperFirst(type)}</Button>
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
