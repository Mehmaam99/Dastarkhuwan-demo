# DASTARKHWAN Phase 3 setup
## Initial scope
Dine-in QR ordering first. Database and API are takeaway-compatible, but takeaway stays disabled until explicitly enabled for a restaurant.
## Supabase
1. Create a Supabase project.
2. Run supabase/migrations/202611120001_phase3_ordering.sql in SQL Editor.
3. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel project environment variables and local development.
4. Never expose the service-role key in browser code or a VITE_ variable.
## Current implementation boundary
This branch starts the database and API foundation. Menu seeding, atomic order transaction RPC, QR provisioning/download, mobile menu/cart UI, authenticated order-status updates, rate limiting and end-to-end verification remain implementation tasks. Do not enable public ordering until those tasks and real restaurant data are complete.
