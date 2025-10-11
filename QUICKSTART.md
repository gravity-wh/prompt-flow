# ⚡ Quick Start Guide

Get PromptFlow running in 10 minutes!

## 🎯 Prerequisites

- [Node.js 18+](https://nodejs.org/) installed
- A [Supabase](https://supabase.com) account (free!)
- A code editor (VS Code recommended)

## 🚀 5-Step Setup

### Step 1: Clone & Install (2 min)

```bash
git clone https://github.com/gravity-wh/prompt-flow.git
cd prompt-flow
npm install
```

### Step 2: Create Supabase Project (3 min)

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Choose a name, password, region
3. Wait for project to be ready (~2 min)

### Step 3: Setup Database (2 min)

1. In Supabase Dashboard → SQL Editor
2. Copy entire content of `supabase/schema.sql`
3. Paste and click "Run"
4. Wait for success message ✅

### Step 4: Create Storage Bucket (1 min)

1. In Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `prompts`
4. Public bucket: ✅ Enable
5. Click "Create"

### Step 5: Configure App (2 min)

1. In Supabase → Settings → API
2. Copy "Project URL" and "anon public" key
3. In your project:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Start the app:

```bash
npm run dev
```

6. Open http://localhost:3000 🎉

## 🎨 Add Sample Data (Optional)

To see prompts in the feed:

1. Sign up on your local app first (creates a user)
2. Get your user ID from Supabase SQL Editor:

```sql
SELECT id FROM profiles LIMIT 1;
```

3. Copy the UUID
4. Open `supabase/seed.sql`
5. Replace all `YOUR_USER_ID` with your actual UUID
6. Run the entire seed.sql in Supabase SQL Editor
7. Refresh your app → You'll see 5 sample prompts! 🎊

## 📱 Test the App

### Browse Feed
- Scroll up/down to see prompts
- Smooth TikTok-style navigation

### Like & Unlock
1. Click ❤️ "Like" on a prompt
2. Sign in with Google/GitHub
3. Prompt text appears!
4. Click "Copy" to use it

### Create Prompt
1. Click "Create" in navigation
2. Fill the form:
   - Title: Something catchy!
   - Model: e.g., "Midjourney v6"
   - Prompt: Your AI prompt
   - Image: Upload a cover
3. Click "Publish"
4. See it in the feed!

## 🚢 Deploy to Production (5 min)

### Deploy on Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import
3. Select your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"
6. Wait ~2 minutes
7. Your app is live! 🌍

**Important:** In Supabase → Authentication → URL Configuration, add your Vercel URL to "Redirect URLs"

Example: `https://your-app.vercel.app/auth/callback`

## 🆘 Troubleshooting

### "No prompts yet" message?

**Solution:** You need to add prompts first!
- Either create one via the app
- Or run the seed.sql (see "Add Sample Data" above)

### Can't sign in?

**Solution:** Check auth providers
1. Supabase → Authentication → Providers
2. Enable Google and/or GitHub
3. Add OAuth credentials (see Supabase docs)
4. Or use Email provider (no setup needed)

### Build errors?

**Solution:** 
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Can't upload images?

**Solution:** Check storage bucket
- Name must be exactly `prompts`
- Must be public
- Check storage policies in Supabase

### Environment variables not working?

**Solution:**
- Restart dev server after changing .env.local
- Check for typos in variable names
- Variables must start with `NEXT_PUBLIC_`

## 📚 Learn More

- **Full Setup:** See [README.md](README.md)
- **Development:** See [DEVELOPMENT.md](DEVELOPMENT.md)
- **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md)

## 🎓 Next Steps

Once running, try:

1. **Customize the UI**
   - Edit colors in `src/app/globals.css`
   - Modify components in `src/components/`

2. **Add Features**
   - User profiles
   - Comments
   - Search
   - Tags/categories

3. **Optimize**
   - Add image optimization
   - Implement caching
   - Add analytics

4. **Scale**
   - Upgrade Supabase plan
   - Add CDN
   - Optimize queries

## 💡 Tips

- Use the Navigation bar to create prompts
- Like prompts to unlock full details
- Upload high-quality images for better engagement
- Write clear, detailed prompts
- Check the seed.sql for prompt inspiration

## 🤝 Need Help?

- Check the [README](README.md) for detailed docs
- Read [DEVELOPMENT.md](DEVELOPMENT.md) for dev workflow
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Open an issue on GitHub

## ⭐ Enjoy PromptFlow!

Happy prompt sharing! 🚀
