<br />
<p align="center">
  <a href="https://github.com/ISnackable/duty-roster/">
    <img src="./public/icons/icon512_rounded.png" alt="Logo" width="96" height="96">
  </a>

  <h3 align="center">SAF Duty Roster</h3>

  <p align="center">
    A Duty Roster planner for the SAF. It's tailored for unit uses, however the code is customizable. GPL-3.0 License.
    <br />
    <a href="https://afpn-cdo.vercel.app/"><strong>View Demo »</strong></a>
    <br />

  </p>
</p>

## About The Project

In SAF, soldiers are required to do duties, be it guard duty or 24hr ops duty. This project is tailored for unit, where they are required to do 24hr ops duty. The duty roster has these requirements:

1. The duty roster should be spread out in a month of a calendar
2. It is a 24-hour duty shift
3. There must be a duty personnel for each day from the start to the end of the month
4. There should not be any back-to-back duty for the same duty personnel.
5. There should be an equal number of duties for everyone if possible.
6. Personnel should be shuffled to avoid the first person always having the most number of duties
7. Personnel can have block out dates where they should not have duties on the date they have blocked out.

<br/>

![preview](./images/preview.png)

## Features

- Duty roster generation with points algorithm
- Blockout dates management for personnel to avoid duties
- Duty swap request with another personnel
- Push notifications for reminders of duty and swap requests

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new).

### Clone and run locally

1. Clone this project with Git

   ```bash
   git clone https://github.com/ISnackable/saf-duty
   ```

2. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `SUPABASE_API_URL` and `SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api) or by running `npx supabase status`.

3. Configure the vault secrets using the database studio SQL editor. Replace the keys with the appropriate values. Take note, `SUPABASE_ROLE_KEY` is different from `SUPABASE_ANON_KEY`. Do not mix them up.

   ```sql
   insert into vault.secrets (secret, name, description) values ('[INSERT SUPABASE PROJECT URL]', 'project_url'), ('[INSERT SUPABASE ROLE KEY]', 'service_role_key');
   ```

4. You can now run the Next.js local development server:

   ```bash
   pnpm dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000/).

## Configuration

As much as this project aims to set up as seamlessly as possible, due to some limitation to Supabase, there are some config that has to be done manually.

### Create vault secrets (Required)

Navigate to [Project Vault settings](https://supabase.com/dashboard/project/_/settings/vault/secrets) in your Supabase Dashboard or.

1. Create a new secret with the name `project_url`.
1. The secret value should be your project's url, you can find the it through the [Project API settings](https://supabase.com/dashboard/project/_/settings/api).
1. Repeat for the secret `service_role_key`.

### Push Notification (Optional)

To Enable Push Notification with [Web Push](https://web.dev/articles/push-notifications-web-push-protocol). You will need to deploy the Supabase Edge Function and create the database webhook manually.

#### 1. Deploy the Supabase Edge Function

The database webhook handler to send push notifications is located in `supabase/functions/push/index.ts`. Deploy the function to your linked project and set the `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` & `WEB_PUSH_EMAIL` secret.

1. `supabase functions deploy push`
2. `supabase secrets set --env-file .env.local`

_Note: The Public and Private keys secrets must be generated using the [alastaircoote/webpush-webcrypto](https://github.com/alastaircoote/webpush-webcrypto/) package._

#### 2. Create the database webhook

Navigate to the [Database Webhooks settings](https://supabase.com/dashboard/project/_/database/hooks) in your Supabase Dashboard.

1. Enable and create a new hook with the name `on_after_notifications_created`.
1. Conditions to fire webhook: Select the `notifications` table and tick the `Insert` event.
1. Webhook configuration: Supabase Edge Functions.
1. Edge Function: Select the `push` edge function and leave the method as `POST` and timeout as `1000`.
1. HTTP Headers: Click "Add new header" > "Add auth header with service key" and leave Content-type: `application/json`.
1. Click "Create webhook".

#### 3. Sending a push notification

When a new row is added in your notifications table, a push notification will be sent to the user who has subscribed to push notification.

- _Note: There's also a cron job for [daily duty reminder](./supabase/migrations/20240130130803_enable_extensions.sql) if a user is subscribed to push notification._

  ```sql
   -- View all scheduled job.
   select * from cron.job;

   -- Or unschedule it if you want to disable it.
   select cron.unschedule('daily-roster-reminder');
  ```

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. Any contributions you make are greatly appreciated.

I recommend you to use [GitHub Codespaces](https://github.com/features/codespaces) for ease of development. Below lists the steps on how you can get started.

1. Fork the Project

2. Create a GitHub Codespace instance<br/>
   <img src="https://docs.github.com/assets/cb-49943/images/help/codespaces/who-will-pay.png" alt="How to create a GitHub Codespaces" width="250"/>

3. Start the local database (If it hasn't already been started already)

   ```sh
   npx supabase start
   ```

   The database should now be running and the supabase studio is at [localhost:54323](http://localhost:54323/).

4. Follow this [section](#clone-and-run-locally) starting from part 2 onwards.

## License

Distributed under the **GNU General Public License v3.0** License. See `LICENSE` for more information.

## Acknowledgements

- [supabase | Postgres Database & Authentication](https://supabase.com/)
- [shadcn/ui | React Component Library](https://ui.shadcn.com/)
- [unDraw](https://undraw.co/license)
