# Three Moves

Local-first daily reflection web app.

## Local development

```bash
npm run dev
```

Open `http://localhost:3000`.

The app uses the Node version declared in [.nvmrc](./.nvmrc) and `package.json` `engines`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Keep the default build command `npm run build`.
4. Keep the default output directory.
5. Deploy the preview and open the preview URL on iPhone Safari.

## Mobile checks

- Open the deployed site in iPhone Safari.
- Refresh `Today` and confirm saved data remains.
- Close the page and reopen it from Safari history or the home screen icon.
- Confirm `Today`, `Night`, and `History` all render normally.
- Open `/install` and confirm the iPhone install steps are readable.
