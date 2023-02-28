import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  createStyles,
  AppShell,
  Header,
  Text,
  Burger,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconBulb, IconMoonStars, IconSun } from "@tabler/icons-react";
import { NavbarMin } from "@/components/Navbar";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  innerTwo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { open, close, toggle }] = useDisclosure(true);
  const matches = useMediaQuery("(min-width: 900px)");
  const { asPath } = useRouter();

  const dark = colorScheme === "dark";

  useEffect(() => {
    if (matches) {
      open();
    } else {
      close();
    }
  }, [matches, open, close, asPath]);

  return (
    <AppShell
      padding="md"
      navbar={opened ? <NavbarMin /> : undefined}
      header={
        <Header height={60} p="xs">
          <div className={classes.inner}>
            <Burger onClick={toggle} opened={opened} />
            <div className={classes.innerTwo}>
              <IconBulb size={38} />
              <Text
                span
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                fz="xl"
              >
                Duty Roster
              </Text>
            </div>
            <ActionIcon
              size={30}
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={20} /> : <IconMoonStars size={20} />}
            </ActionIcon>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
