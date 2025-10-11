# PromptFlow Architecture

## System Overview

PromptFlow is built on a modern, serverless architecture using Next.js 15 and Supabase.

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                      (Next.js 15)                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Feed Page  │  │ Create Page  │  │  Auth Modal  │    │
│  │              │  │              │  │              │    │
│  │  PromptFeed  │  │ CreateForm   │  │  Supabase    │    │
│  │  PromptCard  │  │              │  │  Auth UI     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │            Server Actions (API Layer)               │  │
│  │  • likePrompt()    • createPrompt()                 │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
                    (HTTP/WebSocket)
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                             │
│                    (Backend as a Service)                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │    │
│  │              │  │              │  │              │    │
│  │  • prompts   │  │  • Google    │  │  • Images    │    │
│  │  • profiles  │  │  • GitHub    │  │  • Avatars   │    │
│  │  • likes     │  │  • Email     │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Viewing Prompts (Feed)

```
User Opens App
     ↓
Next.js Server Component (page.tsx)
     ↓
Supabase Server Client
     ↓
Query Prompts Table (with profiles join)
     ↓
Check User's Likes
     ↓
Return Prompts with user_liked flag
     ↓
Render PromptFeed (Client Component)
     ↓
Render Multiple PromptCards
     ↓
User Scrolls (CSS Snap Scroll)
```

### 2. Liking a Prompt

```
User Clicks "Like"
     ↓
Check if Authenticated → No → Show Auth Modal
     ↓ Yes
Call Server Action (likePrompt)
     ↓
Verify User Session
     ↓
Check Existing Like
     ↓ No Like Found
Insert into likes table
     ↓
Fetch Prompt Details (model + prompt_text)
     ↓
Revalidate Path
     ↓
Return Prompt Details
     ↓
Update UI (Show Prompt + Copy Button)
```

### 3. Creating a Prompt

```
User Navigates to /create
     ↓
Check Authentication → Not Logged In → Redirect to /
     ↓ Logged In
Show CreatePromptForm
     ↓
User Fills Form + Uploads Image
     ↓
Submit Form
     ↓
Call Server Action (createPrompt)
     ↓
Verify User Session
     ↓
Upload Image to Supabase Storage
     ↓
Get Public URL for Image
     ↓
Insert into prompts table
     ↓
Revalidate Path
     ↓
Redirect to Home
```

## Component Hierarchy

```
App Layout (layout.tsx)
│
├─ Home Page (page.tsx) [Server Component]
│  └─ PromptFeed [Client Component]
│     ├─ Navigation [Client Component]
│     ├─ PromptCard (x N) [Client Component]
│     └─ AuthModal [Client Component]
│
└─ Create Page (create/page.tsx) [Server Component]
   └─ CreatePromptForm [Client Component]
```

## Database Schema

### Tables

```sql
profiles
├─ id (uuid, PK) → auth.users.id
├─ username (text)
└─ created_at (timestamp)

prompts
├─ id (bigint, PK)
├─ creator_id (uuid, FK → profiles.id)
├─ title (text)
├─ cover_image_url (text)
├─ model (text)
├─ prompt_text (text)
└─ created_at (timestamp)

likes
├─ id (bigint, PK)
├─ user_id (uuid, FK → profiles.id)
├─ prompt_id (bigint, FK → prompts.id)
└─ created_at (timestamp)
└─ UNIQUE(user_id, prompt_id)
```

### Relationships

```
profiles (1) ←─── (N) prompts
profiles (1) ←─── (N) likes
prompts  (1) ←─── (N) likes
```

## Security Model

### Row Level Security (RLS)

**Profiles:**
- ✓ Anyone can read profiles
- ✓ Users can update their own profile

**Prompts:**
- ✓ Anyone can read prompts
- ✓ Authenticated users can create prompts
- ✓ Users can update/delete their own prompts

**Likes:**
- ✓ Anyone can read likes
- ✓ Authenticated users can create likes
- ✓ Users can delete their own likes

### Authentication Flow

```
User Clicks "Sign In"
     ↓
AuthModal Opens (Supabase Auth UI)
     ↓
User Chooses Provider (Google/GitHub/Email)
     ↓
OAuth Flow / Email Verification
     ↓
Supabase Creates auth.users Record
     ↓
Trigger: handle_new_user()
     ↓
Creates profiles Record
     ↓
Redirect to /auth/callback
     ↓
Exchange Code for Session
     ↓
Set Cookie
     ↓
Redirect to Home (/)
```

## State Management

### Server State
- Fetched in Server Components
- Cached by Next.js
- Revalidated with `revalidatePath()`

### Client State
- React useState for UI state
- Local state in components
- No global state management (yet)

### Example: Like State

```typescript
// Server: Get initial state
const userLikes = await supabase.from('likes')...
const promptsWithLikes = prompts.map(p => ({
  ...p,
  user_liked: likedPromptIds.has(p.id)
}))

// Client: Manage UI state
const [isLiked, setIsLiked] = useState(prompt.user_liked)
const [showPrompt, setShowPrompt] = useState(false)

// Action: Update server + revalidate
await likePrompt(promptId)
revalidatePath('/')
```

## Performance Optimizations

### Next.js Features

1. **Server Components**: Default, reduces JS bundle
2. **Image Optimization**: Automatic with next/image
3. **Route Prefetching**: Automatic on hover
4. **Static Generation**: Where possible
5. **Code Splitting**: Automatic per route

### CSS Optimizations

1. **Tailwind CSS**: JIT compiler, minimal CSS
2. **CSS Scroll Snap**: Native browser feature
3. **GPU Acceleration**: transform, opacity for animations

### Database Optimizations

1. **Indexes**: On creator_id, created_at, user_id, prompt_id
2. **Joins**: Efficient with foreign keys
3. **Limits**: Fetch only 10 prompts initially
4. **RLS**: Enforced at database level

## Deployment Architecture

```
GitHub Repository
     ↓ (git push)
Vercel Build
     ↓
├─ Build Next.js App
├─ Optimize Images
├─ Generate Static Pages
└─ Create Serverless Functions
     ↓
Deploy to Edge Network
     ↓
┌─────────────────────────────────┐
│   Vercel Edge Network (CDN)     │
│   • Static Assets               │
│   • Image Optimization          │
│   • Route Caching               │
└─────────────────────────────────┘
     ↓ ↑
User Requests
```

### Environment Variables

```
Build Time:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Runtime:
- Same (exposed to client safely)
```

## Scalability Considerations

### Current Capacity

- **Database**: Supabase free tier (500MB, can scale to TB+)
- **Storage**: 1GB free (can scale to TB+)
- **Serverless**: Unlimited with Vercel Pro
- **CDN**: Global edge network

### Scaling Strategy

**Phase 1 (Current)**: Free tiers, MVP
- 500 users
- 1000 prompts
- 10K requests/day

**Phase 2**: Paid tiers, optimizations
- 10K users
- 100K prompts
- 1M requests/day
- Add caching layer (Redis)
- Add search index (Algolia/Meilisearch)

**Phase 3**: Enterprise
- 100K+ users
- 1M+ prompts
- 10M+ requests/day
- Microservices architecture
- Multiple database replicas
- CDN optimization

## Technology Choices

### Why Next.js 15?

- ✓ Server Components reduce client JS
- ✓ Server Actions simplify mutations
- ✓ Built-in optimizations
- ✓ Great DX (Developer Experience)
- ✓ Easy deployment (Vercel)

### Why Supabase?

- ✓ Open source (PostgreSQL)
- ✓ All-in-one (DB + Auth + Storage)
- ✓ Generous free tier
- ✓ Built-in security (RLS)
- ✓ Real-time capabilities (future)

### Why Tailwind CSS?

- ✓ Utility-first, fast development
- ✓ Small production bundle
- ✓ Great mobile support
- ✓ Easy theming
- ✓ No CSS conflicts

## Future Architecture

### Planned Additions

1. **Realtime Features**
   - Live like counts
   - Real-time comments
   - Online user presence

2. **Search & Discovery**
   - Full-text search (PostgreSQL)
   - Advanced filters
   - Recommendation engine

3. **Caching Layer**
   - Redis for hot data
   - CDN for images
   - Query caching

4. **Analytics**
   - View tracking
   - Engagement metrics
   - A/B testing

5. **API**
   - REST API for mobile
   - GraphQL (optional)
   - Webhooks

## Monitoring & Observability

### Current

- Vercel Analytics (basic)
- Supabase Dashboard (queries, storage)
- Next.js Build Logs

### Planned

- Error tracking (Sentry)
- Performance monitoring (Vercel Speed Insights)
- Custom analytics (PostHog)
- Logging (LogFlare)
