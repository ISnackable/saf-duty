<br />
<p align="center">
  <a href="https://github.com/ISnackable/duty-roster/">
    <img src="./public/icons/icon512_rounded.png" alt="Logo" width="96" height="96">
  </a>

  <h3 align="center">SAF Duty Roster</h3>

  <p align="center">
    A Duty Roster planner for the SAF. It's tailored for unit uses, however the code is customizable. MIT License.
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

## Dependencies

To get started, the following tools/account should be installed/created:

- [NodeJS](https://nodejs.org/en/)
- [Sanity.io](https://supabase.com/)

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app -e with-supabase
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## License

Distributed under the **MIT** License. See `LICENSE` for more information.

## Acknowledgements

- [supabase | Postgres Database & Authentication](https://supabase.com/)
- [shadcn/ui | React Component Library](https://mantine.dev/)

## Features

**To Enable Push Notification with web-push. You will need to deploy Deploy the Supabase Edge Function and Create the database webhook manually.**

### Deploy the Supabase Edge Function

The database webhook handler to send push notifications is located in `supabase/functions/push/index.ts`. Deploy the function to your linked project and set the `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY` & `WEB_PUSH_EMAIL` secret.

1. `supabase functions deploy push`
2. `supabase secrets set --env-file .env.local`

### Create the database webhook

Navigate to the [Database Webhooks settings](https://supabase.com/dashboard/project/_/database/hooks) in your Supabase Dashboard.

1. Enable and create a new hook.
1. Conditions to fire webhook: Select the `notifications` table and tick the `Insert` event.
1. Webhook configuration: Supabase Edge Functions.
1. Edge Function: Select the `push` edge function and leave the method as `POST` and timeout as `1000`.
1. HTTP Headers: Click "Add new header" > "Add auth header with service key" and leave Content-type: `application/json`.
1. Click "Create webhook".

### Send push notification

When a new row is added in your notifications table, a push notification will be sent to the user whom has subscribed to push notification.

- _Note: There's a cron job for daily duty reminder if a user is subscribed to push notification._
