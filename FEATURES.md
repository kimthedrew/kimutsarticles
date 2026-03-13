# Real Estate Articles Platform - Features

## Recent Updates

### 1. Admin Settings & Password Management
- New settings page at `/admin/settings` with two tabs:
  - Homepage Content: Edit hero tag, title, and subtitle dynamically
  - Change Password: Secure password change with current password verification
- Logout now redirects to homepage instead of login page
- Password requirements: minimum 6 characters
- Real-time validation and error handling

### 2. Custom Background Images
- New admin page at `/admin/background` for managing homepage backgrounds
- Upload custom background images (max 5MB)
- Multiple images can be uploaded and stored
- Activate/deactivate images with one click
- Only one image can be active at a time
- Background shows through transparent gradient overlays
- Maintains the warm amber/orange color scheme with 75-80% opacity
- Applies to homepage, articles list, and individual article pages
- Recommended image size: 1920x1080 or larger for best quality

### 2. Password Visibility Toggle
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
✅ Change password functionality
✅ Editable homepage content (hero section)
✅ Custom background image management
✅ Upload and manage multiple background images
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
- Background Manager: `/admin/background`
- Settings: `/admin/settings` (Homepage content & password change)

## API Endpoints

### Public
- `GET /api/articles` - List published articles
- `GET /api/articles/[id]` - Get single article
- `POST /api/articles/[id]/likes` - Like article
- `DELETE /api/articles/[id]/likes` - Unlike article
- `GET /api/articles/[id]/comments` - Get approved comments
- `POST /api/articles/[id]/comments` - Submit comment
- `GET /api/background/active` - Get active background image

### Admin (requires JWT token)
- `POST /api/auth/login` - Admin login
- `POST /api/admin/change-password` - Change admin password
- `GET /api/admin/settings` - Get site settings
- `PATCH /api/admin/settings` - Update site settings
- `GET /api/admin/articles` - List all articles
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/[id]` - Update article
- `PATCH /api/admin/articles/[id]` - Partial update (toggle features)
- `DELETE /api/admin/articles/[id]` - Delete article
- `GET /api/admin/comments` - List all comments
- `PATCH /api/admin/comments/[id]` - Update comment status
- `DELETE /api/admin/comments/[id]` - Delete comment
- `GET /api/admin/background` - List all background images
- `POST /api/admin/background` - Upload background image
- `PATCH /api/admin/background/[id]` - Toggle image active status
- `DELETE /api/admin/background/[id]` - Delete background image

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

### BackgroundImage
- url (base64 data URL)
- filename
- fileSize
- isActive (boolean)
- uploadedAt

### SiteSettings
- heroTitle (homepage main title)
- heroSubtitle (homepage description)
- heroTag (homepage badge text)
- updatedAt
