# Railway Deployment Guide for Delicious Planet

This project uses Next.js with Payload CMS and PostgreSQL. Here's how to deploy to Railway:

## Prerequisites

1. **Railway Account** — Sign up at [railway.app](https://railway.app)
2. **Git Repository** — Your project should be in a git repository (GitHub, GitLab, etc.)
3. **GitHub/GitLab Connected** — Link your Railway account to your Git provider

## Step-by-Step Deployment

### 1. Push to Git

Ensure all your code is committed and pushed to GitHub (or your Git provider):

```bash
git add .
git commit -m "feat: delicious planet coming soon page"
git push origin main
```

### 2. Login to Railway

Visit [railway.app](https://railway.app) and login with your GitHub/GitLab account.

### 3. Create New Project

- Click **"Create New Project"**
- Select **"Deploy from GitHub"**
- Select your repository (`delicious` or whatever it's named)
- Click **"Deploy"**

### 4. Railway Auto-Detects Next.js

Railway will automatically:
- Detect `pnpm` as the package manager (via `pnpm-lock.yaml`)
- Set up the build command: `pnpm run build`
- Set up the start command: `pnpm start`

### 5. Add PostgreSQL Database

In your Railway project dashboard:
- Click **"+ Create New"** → **"Database"** → **"PostgreSQL"**
- This creates an instance and automatically sets `DATABASE_URL` environment variable

### 6. Set Environment Variables

In your Railway project, go to **Variables**:

Add these environment variables:

```
PAYLOAD_SECRET=<generate-a-secure-random-32+char-string>
NODE_ENV=production
```

**To generate PAYLOAD_SECRET**, run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then copy-paste the output into Railway's `PAYLOAD_SECRET` variable.

### 7. Deploy

Once variables are set, Railway will automatically:
- Install dependencies with `pnpm install`
- Build the project with `pnpm run build`
- Start the server with `pnpm start`

The deployment should complete in 2-3 minutes. You'll get a public URL like `https://delicious-production-xxxx.up.railway.app`

### 8. Custom Domain (Optional)

To add a custom domain:
- Go to **Deployments** → Your domain settings
- Add your custom domain (e.g., `delicious-planet.com`)
- Update DNS records as Railway instructs

## Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Set automatically by Railway PostgreSQL |
| `PAYLOAD_SECRET` | Yes | 32-char random hex string |
| `NODE_ENV` | Optional | `production` |
| `PAYLOAD_ADMIN_URL` | Optional | Your Railway app URL |

## Troubleshooting

### Build Fails

If the build fails, check:
1. Node version compatibility (requires `^18.20.2 || >=20.9.0`)
2. All dependencies are in `package.json`
3. TypeScript compiles: `npx tsc --noEmit`

### Database Connection Issues

- Ensure `DATABASE_URL` is set correctly
- Railway PostgreSQL is automatically accessible within the project
- Migrations run automatically on deploy

### Port Issues

Railway automatically assigns a port via `PORT` environment variable. Next.js respects this automatically.

## Useful Railway Commands

Once infrastructure is running on Railway, you can use Railway CLI for local development:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link your project
railway link

# Run locally with Railway environment
railway run pnpm dev

# View logs
railway logs
```

## Need Help?

- Railway Docs: https://docs.railway.app
- Payload CMS Deployment: https://payloadcms.com/docs/production/deployment
- Next.js Deployment: https://nextjs.org/docs/deployment

Good luck launching Delicious Planet! 🚀
