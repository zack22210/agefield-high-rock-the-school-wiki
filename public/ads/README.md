# Adsterra banner configuration

Fixed-size banner pages are generated before `dev` and `build` by
`scripts/sync-ad-html.mjs`. The script reads `NEXT_PUBLIC_AD_*` values from the
process environment, `.env.local`, `.env.production`, `.env.development`, or
`.env`, in that priority order.

Run the generator manually with:

```bash
bun run ads:sync
```

The generated `banner-*.html` and `sidebar-*.html` files embed the public banner
keys and are safe to deploy as static assets. Native Banner uses its own
`effectivecpmnetwork.com` loader and is not rewritten by the generator.

This configuration does not control placement. React components under
`src/components/ads/` retain the project's existing layout and visibility rules.
