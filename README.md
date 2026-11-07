# Claude Workspace — Netlify deployable

A private, browser-based Claude workspace. The Anthropic API key is used only by a Netlify serverless function and is never shipped to the browser.

## Features
- Open access (no sign-in required)
- Claude model selector
- Conversation history stored in the browser's local storage
- PDF, text, Markdown, CSV, JSON, and image attachments
- Optional Anthropic web search
- Browser voice dictation and read-aloud
- Local token and estimated-cost dashboard
- Responsive layout and dark mode

## Deploy on Netlify (no Python required)

### A. Put the project in GitHub
1. Create a GitHub account if you do not have one.
2. Create a new **private** repository.
3. Upload all files and folders from this project ZIP to the repository (extract the ZIP first).
4. Make sure `netlify.toml`, `package.json`, `index.html`, `app.js`, `style.css`, and `netlify/functions/chat.mjs` are in the repository root/paths shown.

### B. Connect Netlify
1. Sign in at https://app.netlify.com/
2. Choose **Add new site → Import an existing project**.
3. Connect GitHub and select your private repository.
4. Build settings: publish directory `.`; build command can be left blank (or `npm run build`).
5. Deploy the site.

### C. Add secrets in Netlify
Open your site → **Site configuration → Environment variables** and add:
- `ANTHROPIC_API_KEY` = your NEW Anthropic API key


Then trigger a new deploy so the function receives the variables.

Do not put either secret in `index.html`, `app.js`, GitHub, or any public file. Do not reuse the API key pasted into a previous chat; revoke it and generate a replacement first.

### D. Open your site
Netlify gives you a URL such as `https://your-site-name.netlify.app`. Open it and sign in using `APP_PASSWORD`.

## Local preview (optional)
Requires Node.js, not Python:
```bash
npm install
npx netlify dev
```

## Important notes / limitations
- This is a starter private platform, not a multi-user product. The shared password is sent to the serverless function per request; use a long password, keep the Netlify site/repository private where possible, and do not share the URL/password. For stronger production access control, add Netlify Identity or an identity-aware proxy.
- Conversation history and usage metrics are stored in the current browser's local storage. They are not synced across devices and can be lost if browser storage is cleared.
- Estimated cost uses illustrative rates in `app.js`, not official billing data. Check Anthropic's current pricing.
- Voice uses browser speech APIs and works best in Chrome/Edge.
- Web search requires Anthropic's web-search tool availability for the selected model/account.
- Model IDs can change or access can vary by account. If a model is unavailable, update the IDs in `app.js` and `netlify/functions/chat.mjs` to a model enabled for your Anthropic account.
- PDF upload uses Anthropic's document input. Very large PDFs may exceed API limits.
- This application does not train an AI model; it uses Anthropic-hosted Claude.
