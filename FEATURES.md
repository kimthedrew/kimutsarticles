# Real Estate Articles Platform - Features

## Recent Updates

### 1. Password Visibility Toggle
- Added eye icon to password field on login page
- Click to toggle between showing/hiding password
- Improved user experience with visual feedback

### 2. Admin Engagement Management
- New dedicated page at `/admin/engagement`
- Two main tabs:
  - **Comments Tab**: View and manage all comments
    - Pending comments section with approve/reject actions
    - Approved comments list with delete option
    - Real-time comment count badges
  - **Visibility Settings Tab**: Control article features
    - Toggle likes visibility per article
    - Toggle comments visibility per article
    - Visual indicators showing current state

### 3. Enhanced UI Design
- Modern gradient backgrounds
- Improved card designs with hover effects
- Better color scheme (blue/indigo/purple)
- Smooth transitions and animations
- Responsive design for all screen sizes
- Professional navigation with backdrop blur
- Icon-enhanced feature cards

### 4. Admin Dashboard Improvements
- Added "Manage Engagement" button
- Better layout and organization
- Quick access to all admin features

## Complete Feature List

### Admin Features
✅ Secure login with JWT authentication
✅ Password visibility toggle
✅ Rich text editor (React Quill)
✅ Auto-save drafts every 30 seconds
✅ Draft management (create, edit, delete)
✅ Publish/unpublish articles
✅ View article analytics (views, likes, comments)
✅ Comment moderation (approve/reject/delete)
✅ Toggle likes visibility per article
✅ Toggle comments visibility per article
✅ Centralized engagement management

### Reader Features
✅ Modern, responsive homepage
✅ Browse all published articles
✅ Read full articles with formatted content
✅ Like articles (IP-based tracking)
✅ Comment on articles (requires approval)
✅ View counter for articles
✅ Clean, professional design

### Technical Features
✅ Next.js 14 with App Router
✅ TypeScript for type safety
✅ MongoDB Atlas cloud database
✅ Mongoose ODM
✅ JWT authentication
✅ Tailwind CSS styling
✅ Server-side rendering
✅ API routes for all operations

## Admin Access

**URL**: http://localhost:3000/admin/login

**Default Credentials**:
- Email: admin@example.com
- Password: admin123

**Admin Pages**:
- Dashboard: `/admin/dashboard`
- Article Editor: `/admin/editor`
- Engagement Management: `/admin/engagement`

## API Endpoints

### Public
- `GET /api/articles` - List published articles
- `GET /api/articles/[id]` - Get single article
- `POST /api/articles/[id]/likes` - Like article
- `DELETE /api/articles/[id]/likes` - Unlike article
- `GET /api/articles/[id]/comments` - Get approved comments
- `POST /api/articles/[id]/comments` - Submit comment

### Admin (requires JWT token)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/articles` - List all articles
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/[id]` - Update article
- `PATCH /api/admin/articles/[id]` - Partial update (toggle features)
- `DELETE /api/admin/articles/[id]` - Delete article
- `GET /api/admin/comments` - List all comments
- `PATCH /api/admin/comments/[id]` - Update comment status
- `DELETE /api/admin/comments/[id]` - Delete comment

## Database Models

### Article
- title, content, excerpt
- status (draft/published)
- category, tags
- likesEnabled, commentsEnabled
- views, author
- timestamps

### Comment
- article reference
- author, email, content
- status (pending/approved/rejected)
- timestamp

### Like
- article reference
- ipAddress
- timestamp

### User
- email, password (hashed)
- role (admin)
- timestamp
