import { useState } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { DatePicker } from "@mantine/dates";
import { isEmail, useForm } from "@mantine/form";
import {
  createStyles,
  Card,
  Title,
  SimpleGrid,
  TextInput,
  Button,
  Group,
  Container,
  PasswordInput,
} from "@mantine/core";

import { authOptions } from "./api/auth/[...nextauth]";
import { showNotification } from "@mantine/notifications";

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

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    lineHeight: 1,
  },

  form: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },
}));

export default function ProfilePage({ user }: { user: User }) {
  const { classes } = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      ord: new Date(),
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: isEmail("Invalid email"),
      password: (value) => checkPasswordValidation(value),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/sanity/updatePersonnel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        showNotification({
          title: "Error",
          message: "Cannot update profile, something went wrong",
        });
        return;
      } else {
        showNotification({
          title: "Success",
          message: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  return (
    <Container mt="lg">
      <SimpleGrid
        cols={2}
        spacing={50}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      >
        <div>
          <Title className={classes.title}>Profile Settings</Title>

          <Card shadow="sm" p="xl" mt="lg">
            <Card.Section>
              <Image
                src={user?.image || "/images/avatars/avatar-1.jpg"}
                alt="User avatar"
                width={450}
                height={450}
                className="rounded-full"
                style={{ objectFit: "cover" }}
              />
            </Card.Section>
          </Card>
        </div>
        <div className={classes.form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              mt="sm"
              label="Name"
              placeholder="Name"
              {...form.getInputProps("name")}
            />
            <TextInput
              mt="sm"
              label="Email"
              placeholder="Email"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              mt="sm"
              label="Password"
              placeholder="Password"
              {...form.getInputProps("password")}
            />

            <PasswordInput
              mt="sm"
              label="Confirm password"
              placeholder="Confirm password"
              {...form.getInputProps("confirmPassword")}
            />

            <DatePicker
              mt="sm"
              label="ORD date"
              placeholder="Pick date"
              firstDayOfWeek="sunday"
              {...form.getInputProps("ord")}
            />

            <Group position="right" mt={50}>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Group>
          </form>
        </div>
      </SimpleGrid>
    </Container>
  );
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { user } = session;
  if (user) {
    Object.keys(user).forEach(
      (key) =>
        user[key as keyof User] === undefined && delete user[key as keyof User]
    );
  }
  return {
    props: { user },
  };
}
