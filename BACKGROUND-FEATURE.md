# Custom Background Image Feature

## Overview
Admins can now upload custom background images that display across the entire site while maintaining the existing warm color scheme through transparent overlays.

## How It Works

### For Admins
1. Navigate to `/admin/background` from the dashboard
2. Click "Choose image" to upload a background (max 5MB)
3. Supported formats: JPG, PNG, WebP, etc.
4. Multiple images can be uploaded
5. Click "Activate" on any image to make it the active background
6. Only one image can be active at a time
7. Delete unwanted images anytime

### Technical Implementation
- Background images are stored as base64 data URLs in MongoDB
- File size limit: 5MB to ensure good performance
- Recommended dimensions: 1920x1080 or larger
- Images are displayed with `background-size: cover` for responsive scaling
- The existing gradient overlays are now 75-80% opaque, allowing the background to show through
- Active background is fetched via `/api/background/active` endpoint

### Pages with Background Support
- Homepage (`/`)
- Articles list page (`/articles`)
- Individual article pages (`/articles/[id]`)

### Design Considerations
- The warm amber/orange gradient is preserved with transparency
- Background images enhance rather than replace the existing design
- White content cards remain fully opaque for readability
- Navigation bars use backdrop blur for a modern glass effect

## API Endpoints

### Public
- `GET /api/background/active` - Returns the currently active background image

### Admin (requires authentication)
- `GET /api/admin/background` - List all uploaded images
- `POST /api/admin/background` - Upload new image (multipart/form-data)
- `PATCH /api/admin/background/[id]` - Toggle active status
- `DELETE /api/admin/background/[id]` - Delete image

## Database Schema

```typescript
BackgroundImage {
  url: string;          // Base64 data URL
  filename: string;     // Original filename
  fileSize: number;     // Size in bytes
  isActive: boolean;    // Only one can be true
  uploadedAt: Date;     // Upload timestamp
}
```

## Future Enhancements (Optional)
- Cloud storage integration (S3, Cloudinary) instead of base64
- Image optimization and compression
- Multiple active images with rotation/slideshow
- Per-page background customization
- Image cropping/editing tools
