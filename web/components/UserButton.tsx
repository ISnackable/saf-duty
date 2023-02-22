import { forwardRef } from "react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronRight,
  IconSettings,
  IconTrash,
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconPlayerPause,
  IconSwitchHorizontal,
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

export function UserButtonMenu(props: UserButtonProps) {
  const { image, name, email, icon } = props;
  const theme = useMantineTheme();

  return (
    <Group position="center">
      <Menu withArrow width={260} transition="pop-top-right">
        <Menu.Target>
          <UserButton image={image} name={name} email={email} icon={icon} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={
              <IconHeart size={14} color={theme.colors.red[6]} stroke={1.5} />
            }
          >
            Liked posts
          </Menu.Item>
          <Menu.Item
            icon={
              <IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5} />
            }
          >
            Saved posts
          </Menu.Item>
          <Menu.Item
            icon={
              <IconMessage
                size={14}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            }
          >
            Your comments
          </Menu.Item>

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>
            Account settings
          </Menu.Item>
          <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>
            Change account
          </Menu.Item>
          <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>
            Logout
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item icon={<IconPlayerPause size={14} stroke={1.5} />}>
            Pause subscription
          </Menu.Item>
          <Menu.Item color="red" icon={<IconTrash size={14} stroke={1.5} />}>
            Delete account
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
