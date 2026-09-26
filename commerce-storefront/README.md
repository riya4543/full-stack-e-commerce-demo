# CommerceCore Storefront

React + TypeScript storefront for the CommerceCore backend.

## Run locally

1. Start the backend at `http://localhost:4000`.
2. In this folder, run:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open the URL Vite displays (normally `http://localhost:5173`). Sign in using `admin@commercecore.dev` and `Admin123!`, add the seeded product to the cart, and choose Checkout.

## Deployment

Set `VITE_API_URL` to your deployed API URL plus `/api/v1`, for example `https://your-api.example.com/api/v1`, then run `npm run build`. Deploy the created `dist` folder as a static site.
