# Mock Test Platform

## Free deployment
1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. Copy Project URL and anon/publishable key into `.env.local`.
4. Install Node.js, then run `npm install` and `npm run dev`.
5. Push this project to GitHub.
6. Import the GitHub repo into Vercel and add the same environment variables.
7. Deploy. Vercel gives a free public URL.

## Important
The included admin page is a starter. For production, implement server-side admin role/RLS before allowing question/test management from the public internet.
PDF/OCR import is intentionally the next module because scanned Bengali PDFs need an OCR pipeline; do not trust automatic extraction without admin review.
