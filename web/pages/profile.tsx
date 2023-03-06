import { useState } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { DatePickerInput } from "@mantine/dates";
import { isEmail, useForm } from "@mantine/form";
import {
  createStyles,
  Card,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Button,
  Group,
  Container,
  PasswordInput,
  AspectRatio,
  FileButton,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconSettings,
  IconUpload,
  IconX,
} from "@tabler/icons-react";

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

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    lineHeight: 1,
    textTransform: "uppercase",
  },

  titleWrapper: {
    display: "flex",
    alignItems: "center",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing.sm,
    },
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
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openDeleteModal = () =>
    openConfirmModal({
      title: "Delete your profile",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your profile? This action is
          destructive and you will have to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: "Delete account", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });

  const form = useForm({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      oldPassword: "",
      password: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: isEmail("Invalid email"),
      password: (value) => checkPasswordValidation(value),
      oldPassword: (value) => checkPasswordValidation(value),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/sanity/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
        cache: "no-cache",
      });
      const data = await res.json();

      if (data?.status === "error") {
        showNotification({
          title: "Error",
          message:
            data?.message || "Cannot update profile, something went wrong",
          color: "red",
          icon: <IconX />,
        });
      } else {
        showNotification({
          title: "Success",
          message: "Profile updated successfully",
          color: "green",
          icon: <IconCheck />,
        });
      }
    } catch (error) {
      console.error(error);
    }

    setIsSubmitting(false);
  };

  const imageUrl = file ? URL.createObjectURL(file) : user?.image;

  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconSettings size={48} />
        <Title className={classes.title}>Profile Settings</Title>
      </div>

      <Text color="dimmed" mt="md">
        Update your profile information and settings here. You can also change
        your password. Enlistment and ORD are optional but recommended.
      </Text>

      <SimpleGrid
        cols={2}
        spacing={50}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt="xl"
      >
        <div>
          <Card shadow="sm" mt="lg">
            <Card.Section>
              <AspectRatio ratio={350 / 350} sx={{ maxWidth: 350 }} mx="auto">
                <Image
                  priority
                  src={imageUrl || "/images/avatars/avatar-1.jpg"}
                  alt="User avatar"
                  width={350}
                  height={350}
                  className="rounded-full"
                  style={{ objectFit: "cover" }}
                />
              </AspectRatio>
            </Card.Section>
          </Card>

          <Group position="left" mt="lg">
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Button {...props} leftIcon={<IconUpload size={14} />}>
                  Upload image
                </Button>
              )}
            </FileButton>
          </Group>
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
              label="Old password"
              placeholder="Old password"
              {...form.getInputProps("oldPassword")}
            />

            <PasswordInput
              mt="sm"
              label="New Password"
              placeholder="New Password"
              {...form.getInputProps("password")}
            />

            <DatePickerInput
              clearable
              mt="sm"
              label="Enlistment date"
              placeholder="Pick date"
              {...form.getInputProps("enlistment")}
            />

            <DatePickerInput
              clearable
              mt="sm"
              label="ORD date"
              placeholder="Pick date"
              {...form.getInputProps("ord")}
            />

            <Group position="apart" mt="lg">
              <Button onClick={openDeleteModal} color="red">
                Delete account
              </Button>
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
