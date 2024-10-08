## Developing

Configure a `.env` file using the `.env.example` file as a guide
Install dependencies with `npm install` (or `pnpm install` or `yarn`)
Create a database with `npx prisma db push`

start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Hosting 

To host a production version of your app:

```bash
npm run host
```