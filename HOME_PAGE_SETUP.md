# Home Page Setup Guide

## Overview
Your Sanity + Next.js project now includes a singleton Home Page setup that allows you to manage your home page content through the Sanity Studio.

## What Was Added

### 1. Home Page Schema (`studio/src/schemaTypes/singletons/homePage.ts`)
- **Singleton document** - Only one instance can exist
- **Hero section** with headline, subtitle, and image
- **Page Builder** with Info Section and Call-to-Action components
- **SEO fields** for meta description and Open Graph image

### 2. Updated Schema Index (`studio/src/schemaTypes/index.ts`)
- Added `homePage` import and included it in schema types

### 3. Updated Studio Structure (`studio/src/structure/index.ts`)
- Added Home Page to sidebar navigation with home icon
- Removed from document list to prevent multiple instances

### 4. Home Page Query (`web/sanity/lib/queries.ts`)
- Added `homePageQuery` to fetch home page data
- Includes all hero content, page builder sections, and SEO data

### 5. Updated Main Page (`web/app/page.tsx`)
- Fetches home page data instead of hardcoded content
- Renders hero section dynamically
- Uses BlockRenderer for page builder sections
- Maintains existing posts section

## How to Use

### 1. Access Sanity Studio
```bash
cd studio
npm run dev
```

### 2. Edit Home Page Content
- Navigate to "Home Page" in the studio sidebar
- Add hero headline and subtitle
- Upload a hero image
- Use Page Builder to add Info Sections and Call-to-Action blocks

### 3. View Changes
```bash
cd web
npm run dev
```

## Schema Structure

```typescript
homePage {
  title: string           // Browser tab title
  hero: {
    headline: string      // Main hero headline
    subtitle: text        // Hero subtitle/description
    image: image         // Hero background image
  }
  pageBuilder: array[     // Flexible content blocks
    infoSection | callToAction
  ]
  seo: {
    metaDescription: text // Meta description
    ogImage: image       // Social media image
  }
}
```

## Customization

### Adding New Page Builder Blocks
1. Create new object schema in `studio/src/schemaTypes/objects/`
2. Add to pageBuilder array in `homePage.ts`
3. Add corresponding React component
4. Update `BlockRenderer.tsx` to handle new block type

### Styling
- Hero section uses existing Tailwind classes
- Page builder sections inherit styling from Info Section and CTA components
- Global styles defined in `web/app/globals.scss`

## Benefits

✅ **Content Management**: Non-technical users can edit home page content  
✅ **Flexible Layout**: Page builder allows custom content arrangement  
✅ **SEO Ready**: Built-in meta description and Open Graph support  
✅ **Type Safe**: Full TypeScript support with generated types  
✅ **Live Preview**: Real-time content updates in Sanity Studio
