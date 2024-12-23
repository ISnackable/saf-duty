import { Separator } from '@repo/design-system/components/ui/separator';
import { AccountForm } from '../../components/account-form';

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Account</h3>
        <p className="text-muted-foreground text-sm">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
