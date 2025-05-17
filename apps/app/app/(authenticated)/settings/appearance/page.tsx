import { Separator } from '@repo/design-system/components/ui/separator';
import { AppearanceForm } from '../../components/appearance-form';

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Appearance</h3>
        <p className="text-muted-foreground text-sm">
          Customize the appearance of the app.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
