import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ConfirmSignupEmailProps {
  username?: string;
  sitename?: string;
  signupLink?: string;
}

export const ConfirmSignupTemplate = ({
  username,
  sitename,
  signupLink,
}: ConfirmSignupEmailProps) => {
  const previewText = `Confirm your email address to join ${sitename}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[28px] text-black">
              🪄 <strong>{sitename}</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello <strong> {username}</strong>, verify your email account by
              clicking the button below to continue the sign up process.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={signupLink}
              >
                Confirm Email
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={signupLink} className="text-blue-600 no-underline">
                {signupLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This confirmation email was intended for{' '}
              <span className="text-black">{username}</span>. If you were not
              expecting this confirmation, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmSignupTemplate;
