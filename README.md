# Real Estate Articles Platform

A full-featured article publishing platform for real estate content with admin controls and reader engagement.

## Features

### Admin Features
- Rich text editor for writing articles
- Auto-save drafts every 30 seconds
- Draft management (create, edit, delete)
- Publish/unpublish articles
- Toggle likes and comments visibility per article
- View article analytics (views, likes, comments)

### Reader Features
- Browse published articles
- Read full articles with formatted content
- Like articles (tracked by IP)
- Comment on articles (requires approval)
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- React Quill (Rich Text Editor)
- Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
MONGODB_URI=mongodb://localhost:27017/real-estate-articles
JWT_SECRET=your-secret-key-change-this
```

3. Start MongoDB (if running locally)

4. Run development server:
```bash
npm run dev
```

5. Create admin user (run once):
```bash
node scripts/create-admin.js
```

6. Access the app:
- Homepage: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Articles: http://localhost:3000/articles

## Project Structure

```
├── app/
│   ├── admin/          # Admin pages
│   ├── articles/       # Public article pages
│   ├── api/            # API routes
│   └── layout.tsx
├── models/             # Mongoose models
├── lib/                # Utilities (auth, db)
└── public/
```

## Default Admin Credentials

After running the setup script:
- Email: admin@example.com
- Password: admin123

Change these in production!
