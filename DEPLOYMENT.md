# Deployment Guide - Vercel + MongoDB Atlas

## Prerequisites
- GitHub account (to connect your repository)
- MongoDB Atlas account (free tier)
- Vercel account (free tier)

## Step 1: Set Up MongoDB Atlas

1. **Create Account**: Go to https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**:
   - Choose "Free Shared" (M0)
   - Select a cloud provider and region close to you
   - Click "Create Cluster"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Save username and password securely
4. **Whitelist IPs**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Vercel's dynamic IPs
5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `real-estate-articles`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/real-estate-articles?retryWrites=true&w=majority`

## Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. **Sign Up**: Go to https://vercel.com/signup
2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
3. **Configure Environment Variables**:
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/real-estate-articles?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your-secure-admin-password
   ```

   **Important**: Generate a strong JWT_SECRET (use a random 64-character string)

4. **Deploy**: Click "Deploy"

## Step 4: Create Admin User

After deployment, you need to create an admin user:

1. **Option A - Using Vercel CLI** (recommended):
   ```bash
   npm i -g vercel
   vercel login
   vercel env pull .env.local
   node scripts/create-admin.js
   ```

2. **Option B - Direct MongoDB Access**:
   - Connect to MongoDB Atlas using MongoDB Compass or CLI
   - Run the create-admin script locally with production connection string

## Step 5: Access Your App

- Your app will be live at: `https://your-project-name.vercel.app`
- Admin panel: `https://your-project-name.vercel.app/admin/login`

## Automatic Deployments

Every push to your `main` branch will automatically deploy to Vercel!

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project → "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring & Logs

- View logs in Vercel dashboard under "Deployments"
- Monitor MongoDB usage in Atlas dashboard

## Free Tier Limits

**Vercel Free Tier**:
- 100GB bandwidth/month
- Unlimited deployments
- Serverless function execution: 100GB-hours

**MongoDB Atlas Free Tier**:
- 512MB storage
- Shared RAM
- No backup/restore

## Troubleshooting

**Build Fails**: Check Vercel logs for errors
**Database Connection Issues**: Verify MongoDB connection string and IP whitelist
**Environment Variables**: Ensure all variables are set in Vercel dashboard

## Security Notes

- Never commit `.env.local` to git (already in .gitignore)
- Use strong passwords for admin and JWT_SECRET
- Regularly update dependencies: `npm audit fix`
