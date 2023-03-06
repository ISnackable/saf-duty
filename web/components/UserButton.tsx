import { forwardRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Group, Avatar, Text, Menu, UnstyledButton } from "@mantine/core";
import {
  IconChevronRight,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronRight size={16} />}
      </Group>
    </UnstyledButton>
  )
);

UserButton.displayName = "UserButton";

export function UserButtonMenu(props: UserButtonProps) {
  const { image, name, email, icon } = props;

  return (
    <Group position="center">
      <Menu
        withArrow
        width={260}
        transitionProps={{ transition: "pop-top-right" }}
      >
        <Menu.Target>
          <UserButton image={image} name={name} email={email} icon={icon} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Settings</Menu.Label>
          <Menu.Item
            icon={<IconSettings size={14} stroke={1.5} />}
            component={Link}
            href="/profile"
          >
            Profile
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<IconLogout size={14} stroke={1.5} />}
            onClick={() => signOut()}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
