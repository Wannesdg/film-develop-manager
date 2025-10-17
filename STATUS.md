# Film Develop Manager - Current Status

**Last Updated:** October 17, 2025

## Project Overview

Film Develop Manager is a Next.js web application designed to help film photographers manage their development workflow, track chemical inventory, organize recipes, and monitor their film roll collection. The application uses local storage for data persistence and provides a responsive, modern interface with light/dark theme support.

## Current Features

### 1. Film Rolls Management
Track and manage your film photography collection:
- **Core Information**: Film name, type, ISO, format (35mm, 120, 4x5, other)
- **Metadata**: Number of frames, shot date, developed date
- **Workflow Integration**: Link to recipes used, track chemicals used
- **Quality Tracking**: 5-star rating system
- **Notes**: Custom notes for each roll
- **Visual Status**: "Developed" vs "Not Developed" badges
- **Search & Filter**: Search by film name/type

### 2. Chemicals Management
Comprehensive chemical inventory tracking:
- **Basic Info**: Name, brand, type (developer, stop-bath, fixer, other)
- **Capacity Tracking**: Total capacity and amount used (in ml)
- **Visual Indicators**: Progress bars showing remaining quantity
- **Alerts**: Automatic "Low Stock" warning (<25% remaining)
- **Expiry Management**: Purchase and expiry date tracking
- **Status Badges**: "Expiring Soon" alerts (within 30 days)
- **Dilution**: Track dilution ratios
- **Cost Tracking**: Optional cost field
- **Search & Filter**: Search by name/brand, filter by type

### 3. Recipes Management
Store and organize development recipes:
- **Recipe Details**: Name, film type, developer name
- **Development Parameters**: Dilution ratio, temperature (°C), time (seconds)
- **Agitation Instructions**: Custom agitation patterns
- **Notes**: Additional recipe information
- **Search**: Search by name, film type, or developer

### 4. Statistics Dashboard
Comprehensive analytics of your development activity:
- **Overview Metrics**:
  - Total chemicals (with low stock count)
  - Total recipes
  - Film rolls (developed vs undeveloped)
  - Average rating across all rated rolls
- **Usage Insights**:
  - Most used film format
  - Most used recipe
- **Distributions**:
  - Films by format (with percentages)
  - Chemicals by type breakdown
- **Activity Timeline**:
  - Recent development activity (last 6 months)

### 5. General Features
- **Theme Support**: Light and dark mode with system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Persistence**: Local storage implementation
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Form Validation**: React Hook Form with Zod validation

## Tech Stack

### Core Framework
- **Next.js** 15.2.4 (App Router)
- **React** 19
- **TypeScript** 5

### Styling & UI
- **Tailwind CSS** 4.1.9
- **Radix UI** (Multiple components)
- **Lucide React** (Icons)
- **class-variance-authority** (Component variants)

### Forms & Validation
- **React Hook Form** 7.60.0
- **Zod** 3.25.76
- **@hookform/resolvers** 3.10.0

### Data Visualization
- **Recharts** 2.15.4

### Other Libraries
- **date-fns** 4.1.0 (Date manipulation)
- **next-themes** 0.4.6 (Theme management)
- **sonner** 1.7.4 (Toast notifications)

### Development
- **ESLint** (Code linting)
- **PostCSS** (CSS processing)

## Data Models

### Chemical
```typescript
interface Chemical {
  id: string
  name: string
  type: "developer" | "stop-bath" | "fixer" | "other"
  brand: string
  capacity: number        // in ml
  used: number           // in ml
  dilution?: string
  notes?: string
  purchaseDate: string
  expiryDate?: string
  cost?: number
}
```

### Recipe
```typescript
interface Recipe {
  id: string
  name: string
  filmType: string
  developer: string
  dilution: string
  temperature: number
  time: number           // in seconds
  agitation: string
  notes?: string
}
```

### FilmRoll
```typescript
interface FilmRoll {
  id: string
  filmName: string
  filmType: string
  iso: number
  format: "35mm" | "120" | "4x5" | "other"
  frames: number
  shotDate?: string
  developedDate?: string
  recipeId?: string
  chemicalsUsed?: string[]
  notes?: string
  rating?: number
}
```

## Known Issues

### Bugs
1. **Expired Chemical Label**: Chemicals past their expiry date still show "Expiring Soon" instead of "Expired"
   - Location: `components/chemical-card.tsx:20`
   - Logic only checks if within 30 days, doesn't check if already expired

2. **Date Format**: Dates display as "month/day/year" (US format) instead of "day/month/year" (European format)
   - Locations: Multiple components using `toLocaleDateString()`
   - Affects: Chemical cards, Film roll cards, Statistics page

### Current Limitations

1. **No Development Round Concept**: Users cannot group multiple rolls developed together in a single session

2. **Chemical State**: No distinction between concentrate and mixed/diluted chemicals

3. **Loose Recipe-Chemical Relationship**: Recipes reference chemicals by name (string) rather than linking to actual chemical inventory

4. **No Chemical-FilmRoll Link**: Can track that chemicals were used, but not how much was consumed or which specific chemical instances

5. **No Camera Tracking**: Cannot associate film rolls with specific cameras

6. **No Photo Management**: Cannot upload or view developed photos

7. **Manual Date Entry**: When adding film rolls, users can immediately set developed date (should start undeveloped)

8. **No Chemical Mixing Workflow**: No process to convert concentrates into working solutions

## Current Workflow

1. User adds chemicals to inventory (as purchased)
2. User adds recipes for development processes
3. User adds film rolls (can be marked as developed or not)
4. When editing a film roll, user can:
   - Link to a recipe (by ID)
   - Add chemicals used (by string array)
   - Set developed date
5. User views statistics to track activity

## Installation & Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Note**: The `--legacy-peer-deps` flag is required due to React 19 compatibility issues with the `vaul` package.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── chemicals/         # Chemical management
│   ├── film-rolls/        # Film roll tracking
│   ├── recipes/           # Recipe storage
│   ├── stats/             # Statistics dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components (Radix)
│   ├── chemical-card.tsx
│   ├── chemical-form.tsx
│   ├── film-roll-card.tsx
│   ├── film-roll-form.tsx
│   ├── recipe-card.tsx
│   ├── recipe-form.tsx
│   ├── navigation.tsx
│   └── settings-dialog.tsx
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript interfaces
│   ├── storage.ts        # Local storage functions
│   ├── utils.ts          # Helper utilities
│   ├── export.ts         # Export functionality
│   └── import.ts         # Import functionality
└── public/               # Static assets
```

## Development Status

The application is functional and usable for basic film development tracking. However, several enhancements and bug fixes are needed to improve the workflow and user experience. See ROADMAP.md for planned improvements.
