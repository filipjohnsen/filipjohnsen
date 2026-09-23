# filipjohnsen.no

v1 of Filip Johnsen's personal site: direction B, "Build it yourself".

Next.js (App Router) + TypeScript, Tailwind v4, Motion, and Matter.js for the hero.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
npm run lint
```

## Content

Placeholder content lives in plain data files, so it can be swapped without touching components:

- `content/projects.ts`: selected work ("sets"). Set `placeholder: false` on real entries.
- `content/lab.ts`: Lab experiments.
- `content/site.ts`: name, e-mail, org.nr and navigation.
- The about-me steps and "work with me" copy sit at the top of their section components in `components/sections/`.

## Hero

`components/hero/` holds the snap-together toy. The assembled word is plain CSS (it renders on the
server, without JS, and for `prefers-reduced-motion`). Matter.js is loaded lazily on idle or on
first touch, and `brick-world.ts` only writes transforms while something is moving. Buttons cover
the keyboard path: scramble, place one piece, and rebuild. Sound is off by default.

The brick layout of the word is `components/hero/bricks.ts` (a 15×5 grid).

## Contact form

`app/actions.ts` validates the form on the server. Set `CONTACT_WEBHOOK_URL` to forward messages
as JSON (e.g. to a Slack, Zapier or Resend relay). Without it, messages are only logged.
