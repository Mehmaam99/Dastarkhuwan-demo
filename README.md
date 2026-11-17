# DASTARKHWAN — Restaurant Website Demo

A premium Pakistani restaurant website demo built with React, TypeScript, Vite, and Tailwind CSS. This is a **location-neutral master demo** intended to be customized for restaurants anywhere in Pakistan.

## Run locally

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Customize for a restaurant

Update `src/config/restaurant.ts` before presenting a client-specific version:

- `name`: restaurant name shown in the logo
- `city` and `address`: verified restaurant location
- `phone`, `whatsapp`, and `email`: real contact channels
- `hoursPrimary` and `hoursValet`: accurate service hours and optional details
- `mapUrl`: verified map link for the restaurant
- `isDemo`: demo-mode flag for future integration work

Also review the menu, dish prices, food photography, gallery, sample testimonials, and restaurant-specific copy in `src/DastarkhwanApp.tsx`. Replace all sample content with information approved by the restaurant before launch.

## Important: demo behavior

The reservation and concierge forms currently perform **client-side demo validation and preview only**. They do not send data, create real bookings, or notify restaurant staff. The confirmation panels explicitly identify this as a demo.

Before a client launch, connect the forms to a real booking/CRM/email endpoint (or a verified WhatsApp flow), add server-side validation and spam protection, and test the full submission flow. Do not advertise a booking as confirmed until the restaurant's booking system confirms it.

## Deployment

The project is Vite-based and can be deployed to Vercel. The build command is `npm run build`; the output directory is `dist`.
