import Link from 'next/link'
import Image from 'next/image'
import { Anchor, Container, Title, Text, List, Button, Group } from '@mantine/core'
import svgImage from '@/public/undraw_personal_information.svg'

PrivacyPage.title = 'Privacy Policy'

export default function PrivacyPage() {
  return (
    <>
      <section>
        <Container size="sm" my="xl">
          <Title order={1} mt="xl">
            Privacy policy
          </Title>
          <Text size="md" mb="xl">
            <em>Last updated: March 8, 2023</em>
          </Text>
          <div style={{ position: 'relative', height: '30vh' }}>
            <Image
              src={svgImage}
              fill={true}
              alt="Undraw personal information logo"
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
          <Title order={2} my="lg">
            In short
          </Title>
          <List withPadding>
            <List.Item>Personal information like name and email is collected</List.Item>
            <List.Item>
              Only neccessary cookies is stored in the browser, like authentication tokens
            </List.Item>
            <List.Item>No information is shared with, sent to or sold to third-parties</List.Item>
            <List.Item>No information is shared with advertising companies</List.Item>
            <List.Item>
              No information is mined and harvested for personal and behavioural trends
            </List.Item>
            <List.Item>No information is monetized</List.Item>
          </List>
          <Title order={2} id="what-I-collect-and-why" mt={30} mb="lg">
            What I collect and why
          </Title>
          <Text size="md" my="md">
            Our guiding principle is to collect only what I need. Here&apos;s what that means in
            practice:
          </Text>
          <Title order={3} id="website-interactions" my="lg">
            Account information
          </Title>
          <Text size="md" my="md">
            To use this application, users have to register an account, providing details such as
            their name and email address. This information is used to identify the user and to
            provide a personalized experience as well as to be used to generate a duty roster.
          </Text>
          <Title order={2} id="information-I-do-not-collect" my="lg">
            Information I do not collect
          </Title>
          <Text size="md" my="md">
            When you browse to my pages, your browser automatically shares certain information such
            as which operating system and browser version you are using. However, I{' '}
            <strong>do not</strong> track and collect that information.
          </Text>
          <Text size="md" my="md">
            I don&apos;t collect any characteristics of protected classifications including age,
            race, gender, religion, sexual orientation, gender identity, gender expression, or
            physical and mental abilities or disabilities.{' '}
            <strong>This website is not capable collecting such informations</strong>.
          </Text>
          <Title order={2} id="when-i-access-or-share-your-information" my="lg">
            When I access or share your information
          </Title>
          <Text size="md" my="md">
            Our default practice is to not access your information. I am not able to tie this
            information to you as an individual. The only times I&apos;ll ever access or share your
            info is:
          </Text>
          <List>
            <List.Item>
              <strong>For duty roster generation purposes.</strong> It is only used to view generate
              a duty roster, in such that the only information I would access is your name.
            </List.Item>
          </List>
          <Title order={2} id="how-I-secure-your-data" my="lg">
            How I secure your data
          </Title>
          <Text size="md" my="md">
            All data is encrypted via{' '}
            <Anchor
              href="https://en.wikipedia.org/wiki/Transport_Layer_Security"
              target="_blank"
              rel="noopener noreferrer"
            >
              SSL/TLS
            </Anchor>{' '}
            when transmitted from your browser to{' '}
            <Anchor href="https://www.sanity.io/" target="_blank" rel="noopener noreferrer">
              sanity.io
            </Anchor>{' '}
            and{' '}
            <Anchor href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
              vercel
            </Anchor>{' '}
            server.
          </Text>
          Account information is stored in a database hosted by{' '}
          <Anchor href="https://www.sanity.io/" target="_blank" rel="noopener noreferrer">
            sanity.io
          </Anchor>{' '}
          and is encrypted using{' '}
          <Anchor href="https://argon2.online/" target="_blank" rel="noopener noreferrer">
            argon2
          </Anchor>{' '}
          hashing algorithm.
          <Title order={2} id="changes-questions" my="lg">
            Changes &amp; questions
          </Title>
          <Text size="md" my="md">
            I may update this policy as needed to comply with relevant regulations and reflect any
            new practices.
          </Text>
          <Group position="center">
            <Button variant="subtle" size="md" component={Link} href="/login">
              Take me back to home page
            </Button>
          </Group>
        </Container>
      </section>
    </>
  )
}
