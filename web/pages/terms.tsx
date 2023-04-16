import Image from 'next/image'
import { Anchor, Container, Title, Text, List, Button, Group } from '@mantine/core'
import svgImage from '@/public/undraw_personal_information.svg'
import Link from 'next/link'

TermsPage.title = 'Terms and Conditions'

export default function TermsPage() {
  return (
    <section>
      <Container size="sm" my="xl">
        <Title order={1} mt="xl">
          Terms and Conditions
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

        <Title order={2} id="website-interactions" my="lg">
          Accepting these Terms
        </Title>
        <Text size="md" my="md">
          If you access or use the Service, it means you agree to be bound by all of the terms
          below. So, before you use the Service, please read all of the terms. If you don&apos;t
          agree to all of the terms below, please do not use the Service
        </Text>

        <List withPadding>
          <List.Item>You are responsible for your own actions and any consequences</List.Item>
          <List.Item>
            You agree to maintain the security of your password and accept all risks of unauthorized
            access to any data or other information you provide to the Service.
          </List.Item>
          <List.Item>
            You agree not to impersonate or post on behalf of any person or entity or otherwise
            misrepresent your affiliation with a person or entity;
          </List.Item>
          <List.Item>
            You agree not to not upload any image that is obscene or inappropriate as the service
            allows you to upload an avatar image.
          </List.Item>
          <List.Item>
            You agree not to circumvent or attempt to circumvent any filtering, security measures,
            rate limits or other features designed to protect the Service, users of the Service, or
            third parties.
          </List.Item>
        </List>

        <Title order={3} my="lg">
          Privacy Policy
        </Title>
        <Text size="md" my="md">
          You may want to also read the{' '}
          <Anchor component={Link} href="/privacy" prefetch={false}>
            privacy policy
          </Anchor>{' '}
          page.
        </Text>

        <Title order={3} my="lg">
          Changes to these Terms
        </Title>
        <Text size="md" my="md">
          I may update this Terms as needed to comply with relevant regulations and reflect any new
          practices at any time.
        </Text>

        <Group position="center">
          <Button variant="subtle" size="md" component={Link} href="/" prefetch={false}>
            Take me back to home page
          </Button>
        </Group>
      </Container>
    </section>
  )
}
