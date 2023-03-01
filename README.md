<br />
<p align="center">
  <a href="https://github.com/ISnackable/duty-roster/">
    <img src="https://media.istockphoto.com/id/870192016/vector/time-management-and-schedule-icon-for-upcoming-event.jpg?s=612x612&w=0&k=20&c=a2isfmvz1lDLFVwsakEZZih9lDrJJWdDBhCKp9uO-EE=" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Duty Roster</h3>

  <p align="center">
    A Duty Roster planner for the SAF. It's tailored for commando unit uses, however the code is highly customizable. MIT License.
    <br />
    <a href="https://afpn-cdo.vercel.app/"><strong>View Demo »</strong></a>
    <br />

  </p>
</p>

## About The Project

In SAF, soldiers are required to do duties, be it guard duty or 24hr ops duty. This project is tailored for commando unit, where they are required to do 24hr ops duty. The duty roster has these requirements:

1. The duty roster should be spread out in a month of a calendar
2. It is a 24-hour duty shift
3. There must be a duty personnel for each day from the start to the end of the month
4. There should not be any back-to-back duty for the same duty personnel.
5. There should be an equal number of duties for everyone if possible.
6. Personnel should be shuffled to avoid the first person always having the most number of duties
7. Personnel can have block out dates where they should not have duties on the date they have blocked out.

## Dependencies

To get started, the following tools/account should be installed/created:

- [NodeJS](https://nodejs.org/en/)
- [Sanity.io](https://www.sanity.io/login/sign-up)
- [hCaptcha](https://www.hcaptcha.com/)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

You should update npm to the latest version to improve the functionality or be obligatory for security purposes and install yarn as the package manager.

- npm

```sh
npm install -g npm@latest
npm install -g yarn
```

### Usage

1. Go to the `studio` folder
2. Create a `.env` file with a value for the enviroment variable. See `.env.example` for reference.

3. Repeat the step above for the `web` folder
4. Once enviroment variables are set, you can install the dependencies. Navigate back to the root of the folder and run the command below.

```sh
yarn install
```

5. Once the enviroment variables are set, and dependencies are installed. You can start the app in development mode.

```sh
yarn dev
```

6. Visit `http://localhost:3000` and `http://localhost:3333` on your web browser.
7. That's all.

## Deploy on Vercel / Sanity

#### Deploy `web`

The easiest way to deploy the app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out their [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

#### Deploy `studio`

To deploy the sanity studio, it is extremely simple to do so, check out their [sanity.io deployment documentation](https://www.sanity.io/docs/deployment) for more details. TLDR: `npx sanity deploy`

## License

Distributed under the **MIT** License. See `LICENSE` for more information.

## Acknowledgements

- [Mantine | React Component Library](https://mantine.dev/)
- [Sanity.io | Content Management System](https://www.sanity.io/)
- [NextAuth.js | Authentication for Next.js](https://next-auth.js.org/)
- [hCaptcha | Privacy focused Captcha solution](https://www.hcaptcha.com/)
