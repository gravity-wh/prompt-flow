# Development Guide

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
```

### 2. Setup Supabase

1. Create a Supabase project at https://supabase.com
2. Run the schema: Copy `supabase/schema.sql` and run it in the SQL Editor
3. Create a storage bucket:
   - Name: `prompts`
   - Public access: Enabled
4. Get your credentials from Project Settings > API
5. Add them to `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server Actions
│   ├── auth/              # Authentication routes
│   ├── create/            # Create prompt page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (feed)
├── components/            # React components
│   ├── AuthModal.tsx
│   ├── CreatePromptForm.tsx
│   ├── Navigation.tsx
│   ├── PromptCard.tsx
│   └── PromptFeed.tsx
├── lib/                   # Utilities
│   └── supabase/         # Supabase clients
└── types/                # TypeScript types
```

## Key Technologies

### Next.js 15 (App Router)
- Server Components by default
- Server Actions for mutations
- Built-in optimizations

### Supabase
- **Database**: PostgreSQL with Row Level Security
- **Auth**: Social login (Google, GitHub) + email/password
- **Storage**: File uploads for images
- **Realtime**: (Future: live updates)

### Tailwind CSS v4
- Utility-first CSS
- Responsive design
- Dark mode support

## Common Tasks

### Add a New Page

1. Create `src/app/your-page/page.tsx`
2. Export a default component
3. Server Components are async, Client Components need `'use client'`

### Create a Server Action

1. Add to `src/app/actions/` directory
2. Mark file with `'use server'`
3. Use `createClient()` from `@/lib/supabase/server`
4. Call `revalidatePath()` after mutations

### Add a New Component

1. Create in `src/components/`
2. Use `'use client'` if it needs interactivity
3. Import types from `@/types/database`

### Database Changes

1. Update `supabase/schema.sql`
2. Run the new SQL in Supabase SQL Editor
3. Update TypeScript types in `src/types/database.ts`

## Testing

### Manual Testing Checklist

- [ ] Browse prompts (scroll up/down)
- [ ] Like a prompt (should show auth modal if not logged in)
- [ ] Sign up/Sign in
- [ ] Like a prompt when authenticated (should unlock)
- [ ] Copy prompt to clipboard
- [ ] Create a new prompt
- [ ] Upload an image
- [ ] See your prompt in the feed

### Build Test

```bash
npm run build
```

Should complete with no errors.

### Lint Test

```bash
npm run lint
```

Should pass with no errors.

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository on Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Environment Variables

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Troubleshooting

### Build Errors

**Error: Cannot fetch Google Fonts**
- This is expected in restricted environments
- Fonts are removed and use system fonts instead

**Error: Supabase client not configured**
- Check `.env.local` exists
- Verify environment variables are set correctly
- Restart dev server after changing env vars

### Database Errors

**Error: relation "prompts" does not exist**
- Run `supabase/schema.sql` in SQL Editor

**Error: permission denied for table prompts**
- Check Row Level Security policies
- Make sure user is authenticated

### Storage Errors

**Error: Bucket not found**
- Create a bucket named `prompts`
- Make it public
- Verify bucket name in code matches

**Error: Upload failed**
- Check file size (< 50MB)
- Check file type (images only)
- Verify storage permissions

## Best Practices

### Performance

- Use Server Components when possible
- Optimize images with Next.js `<Image>`
- Lazy load components with `dynamic()`
- Use `revalidatePath()` after mutations

### Security

- Never expose Supabase `service_role` key
- Use RLS policies for data access
- Validate all user inputs
- Sanitize data before display

### Code Style

- Use TypeScript strictly
- Follow ESLint rules
- Use Tailwind for styling
- Keep components small and focused

## Future Enhancements

### Planned Features

- [ ] User profiles
- [ ] Follow system
- [ ] Comments
- [ ] Search & filters
- [ ] Trending section
- [ ] Categories/tags
- [ ] Bookmarks
- [ ] Social sharing

### Technical Improvements

- [ ] Add unit tests (Jest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement infinite scroll
- [ ] Add loading skeletons
- [ ] Optimize images (WebP)
- [ ] Add PWA support
- [ ] Implement caching strategy
- [ ] Add analytics

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
