import { ConfirmSignupTemplate } from '@repo/email/templates/confirm-signup';
import { site } from '@repo/site-config';

const ExampleConfirmSignupEmail = () => (
  <ConfirmSignupTemplate
    username="Jane Smith"
    sitename={site.name}
    signupLink="https://example.com/signup?token=123456"
  />
);

export default ExampleConfirmSignupEmail;
