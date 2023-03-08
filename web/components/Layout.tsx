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
  Group,
  Footer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMathFunctionY, IconMoonStars, IconSun } from "@tabler/icons-react";
import { NavbarMin } from "@/components/Navbar";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  innerHeader: {
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

  innerFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { close, toggle }] = useDisclosure(true);
  const { asPath } = useRouter();

  const dark = colorScheme === "dark";

  useEffect(() => {
    close();
  }, [close, asPath]);

  return (
    <AppShell
      padding="md"
      navbar={
        <NavbarMin
          width={{ sm: 300 }}
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
        />
      }
      header={
        <Header height={60} p="xs">
          <div className={classes.innerHeader}>
            <Burger onClick={toggle} opened={opened} />
            <div className={classes.innerTwo}>
              <IconMathFunctionY size={38} />
              <Text
                span
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                fz="xl"
                ml="sm"
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
      footer={
        <Footer height={60} p="md">
          <div className={classes.innerFooter}>
            <IconMathFunctionY size={28} />
            <Group>
              <Link href="/">Home</Link>
              <Link href="/privacy">Privacy</Link>
            </Group>
          </div>
        </Footer>
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
