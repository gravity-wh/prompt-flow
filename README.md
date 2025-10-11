# PromptFlow

PromptFlow is the next-generation, community-driven platform designed to make sharing and discovering high-quality AI generative ideas (Prompts) as effortless and addictive as browsing TikTok. We are building the "GitHub for Prompts," specifically optimized for mass consumer adoption and rapid content discovery.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Database & Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Lucide React icons
- **Deployment**: Vercel

## Features

### Phase 1: Core Feed (Implemented)
- ✅ TikTok-style full-screen scrollable feed
- ✅ Smooth CSS scroll snap navigation
- ✅ Beautiful prompt cards with cover images
- ✅ Server-side rendering for optimal performance

### Phase 2: Like & Auth (Implemented)
- ✅ User authentication with Supabase Auth
- ✅ "Like to unlock" functionality
- ✅ Show full prompt after liking
- ✅ Copy prompt to clipboard
- ✅ Social auth providers (Google, GitHub)

### Phase 3: Create & Share (Implemented)
- ✅ Create new prompt ideas
- ✅ Image upload to Supabase Storage
- ✅ Form validation
- ✅ Protected routes (auth required)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great!)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gravity-wh/prompt-flow.git
cd prompt-flow
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:

   a. Go to [supabase.com](https://supabase.com) and create a new project
   
   b. In the SQL Editor, run the schema from `supabase/schema.sql`
   
   c. Create a storage bucket named `prompts`:
      - Go to Storage
      - Click "New bucket"
      - Name it `prompts`
      - Make it public
   
   d. Get your API credentials:
      - Go to Project Settings > API
      - Copy the Project URL and anon/public key

4. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. (Optional) Add sample data:
   - Sign up on your local app first to create a user
   - Get your user ID: `SELECT id FROM profiles LIMIT 1;` in Supabase SQL Editor
   - Edit `supabase/seed.sql` and replace `YOUR_USER_ID` with your actual user ID
   - Run the seed file in Supabase SQL Editor

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
prompt-flow/
├── src/
│   ├── app/
│   │   ├── actions/         # Server Actions
│   │   │   ├── likes.ts     # Like functionality
│   │   │   └── prompts.ts   # Create prompt functionality
│   │   ├── auth/
│   │   │   └── callback/    # Auth callback handler
│   │   ├── create/          # Create prompt page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page (feed)
│   ├── components/
│   │   ├── AuthModal.tsx           # Login/signup modal
│   │   ├── CreatePromptForm.tsx    # Form to create prompts
│   │   ├── Navigation.tsx          # Top navigation bar
│   │   ├── PromptCard.tsx          # Individual prompt card
│   │   └── PromptFeed.tsx          # Main feed container
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts    # Browser Supabase client
│   │       └── server.ts    # Server Supabase client
│   └── types/
│       └── database.ts      # TypeScript types
├── supabase/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample data
└── public/                 # Static assets
```

## Database Schema

### Tables

**profiles**
- `id` (uuid, primary key) - References auth.users
- `username` (text)
- `created_at` (timestamp)

**prompts**
- `id` (bigint, primary key)
- `creator_id` (uuid) - References profiles
- `title` (text) - Catchy description
- `cover_image_url` (text) - Image URL
- `model` (text) - AI model name
- `prompt_text` (text) - The actual prompt
- `created_at` (timestamp)

**likes**
- `id` (bigint, primary key)
- `user_id` (uuid) - References profiles
- `prompt_id` (bigint) - References prompts
- `created_at` (timestamp)

## Usage

### Browsing Prompts
1. Open the app
2. Scroll up/down to browse prompts (TikTok-style)
3. Click "Like" to unlock the full prompt
4. Copy the prompt to use with your favorite AI tool

### Creating Prompts
1. Sign in with Google or GitHub
2. Click "Create" in the navigation
3. Fill in the form:
   - Title: A catchy description
   - Model: Which AI model to use
   - Prompt: The actual prompt text
   - Image: Upload a cover image
4. Click "Publish"

## Development

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (same as `.env.local`)
5. Deploy!

Vercel will automatically:
- Build your Next.js app
- Deploy to a global CDN
- Set up automatic deployments on push

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for your own purposes!

## Roadmap

- [ ] User profiles
- [ ] Following system
- [ ] Comments on prompts
- [ ] Search and filter
- [ ] Trending/popular prompts
- [ ] Categories/tags
- [ ] Bookmarks/favorites
- [ ] Share to social media
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations