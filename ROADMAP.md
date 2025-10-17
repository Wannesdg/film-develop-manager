# Film Develop Manager - Roadmap

**Last Updated:** October 17, 2025

This document catalogs all planned updates, improvements, and new features for the Film Develop Manager application, organized by priority.

## Priority Levels

- **Critical**: Bugs affecting core functionality or user experience
- **High**: Important features that significantly improve workflow
- **Medium**: Enhancements that add value but aren't blocking
- **Low**: Nice-to-have features for future consideration

---

## Critical Priority

### 1. Fix Expired Chemical Label Bug

**Issue**: Chemicals that are past their expiry date show "Expiring Soon" instead of "Expired"

**Current Behavior**:
- `components/chemical-card.tsx:19-20` only checks if expiry date is within 30 days
- Logic: `new Date(chemical.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)`
- Does not distinguish between "expiring soon" and "already expired"

**Expected Behavior**:
- Show "Expired" badge (red/destructive) if expiry date is in the past
- Show "Expiring Soon" badge (warning) if expiry date is within 30 days but not yet expired
- Update badge color and text accordingly

**Affected Files**:
- `components/chemical-card.tsx`

**Implementation Notes**:
```typescript
// Suggested logic
const now = new Date()
const expiryDate = new Date(chemical.expiryDate)
const isExpired = expiryDate < now
const isExpiringSoon = !isExpired && expiryDate < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
```

---

### 2. Fix Date Format (Month/Day/Year → Day/Month/Year)

**Issue**: All dates display in US format (month/day/year) instead of European format (day/month/year)

**Current Behavior**:
- Uses default `toLocaleDateString()` without locale specification
- Displays as: 10/17/2025 (month/day/year)

**Expected Behavior**:
- Display as: 17/10/2025 (day/month/year)
- Or use a more readable format: 17 Oct 2025

**Affected Files**:
- `components/chemical-card.tsx` (lines 81, 86)
- `components/film-roll-card.tsx` (lines 85, 92)
- `app/stats/page.tsx` (line 89)
- All other locations using `toLocaleDateString()`

**Implementation Options**:
1. Use locale parameter: `toLocaleDateString('en-GB')` for DD/MM/YYYY
2. Use date-fns (already in dependencies): `format(date, 'dd/MM/yyyy')` or `format(date, 'dd MMM yyyy')`
3. Create a utility function in `lib/utils.ts` for consistent date formatting across the app

**Recommended Approach**:
Use date-fns for consistency and create a utility function:
```typescript
// lib/utils.ts
export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  return format(new Date(date), formatStr)
}
```

---

## High Priority

### 3. Implement Development Rounds System

**Issue**: No way to group multiple rolls developed together in a single session

**Current State**:
- Film rolls are tracked individually
- No concept of a "development session" or "round"
- Cannot track batch processing

**Proposed Solution**:
Create a new "Development Round" entity that represents a single development session

**New Data Model**:
```typescript
interface DevelopmentRound {
  id: string
  date: string
  recipeId: string           // Link to recipe used
  filmRollIds: string[]      // Multiple rolls developed together
  chemicalsUsed: {
    chemicalId: string       // Link to actual chemical
    amountUsed: number       // Amount consumed in ml
    stateId?: string         // If mixed chemicals, link to mixed state
  }[]
  temperature: number        // Actual temperature used
  notes?: string
  duration?: number          // Total time in seconds
}
```

**Required Changes**:
1. Create new interface in `lib/types.ts`
2. Add storage functions in `lib/storage.ts`
3. Create new page: `app/development-rounds/page.tsx`
4. Create components:
   - `components/development-round-form.tsx`
   - `components/development-round-card.tsx`
5. Update navigation to include Development Rounds
6. Update film roll workflow to be created via development rounds
7. Update statistics to include development rounds data

**Workflow**:
1. User creates a development round
2. Selects recipe to use
3. Adds one or more film rolls to the round
4. Selects chemicals from inventory (actual chemical instances)
5. Records amount used from each chemical
6. System automatically updates chemical usage
7. System marks film rolls as developed with the round date

**Benefits**:
- Better tracking of chemical consumption
- Historical record of development sessions
- Improved statistics (sessions per month, average rolls per session)
- Supports the proposed workflow from UPDATE.md

---

### 4. Add Chemical State Management (Concentrate vs Mixed)

**Issue**: No distinction between concentrate chemicals and working solutions

**Current State**:
- All chemicals treated the same
- No way to track mixing concentrates into working solutions
- No tracking of mixed solution lifespans

**Proposed Solution**:
Add chemical state tracking with concentrate/mixed distinction

**Data Model Changes**:
```typescript
interface Chemical {
  id: string
  name: string
  type: "developer" | "stop-bath" | "fixer" | "other"
  brand: string
  capacity: number
  used: number
  dilution?: string
  notes?: string
  purchaseDate: string
  expiryDate?: string
  cost?: number

  // NEW FIELDS
  state: "concentrate" | "mixed"
  parentChemicalId?: string  // If mixed, link to concentrate source
  mixedDate?: string         // When solution was mixed
  workingExpiryDate?: string // Working solution expiry (different from concentrate)
}
```

**Required Changes**:
1. Update `Chemical` interface in `lib/types.ts`
2. Update `ChemicalForm` to include state selection
3. Update `ChemicalCard` to display state
4. Create mixing workflow:
   - New dialog/page for mixing chemicals
   - Select concentrate chemical
   - Specify dilution ratio
   - Specify amount to mix
   - Creates new "mixed" chemical entry
   - Deducts from concentrate inventory
5. Update filters to separate concentrates from mixed solutions
6. Add "Mix Chemical" action button on concentrate cards
7. Update statistics to show concentrates vs working solutions

**UI Changes**:
- Badge showing "Concentrate" or "Mixed" on chemical cards
- Filter option for state
- "Mix Solution" button on concentrate chemicals
- Working solution expiry tracking (e.g., "Mixed solution expires 24h after opening")

---

### 5. Link Film Rolls to Specific Chemicals

**Issue**: Film rolls track chemicals as string array, not actual chemical instances

**Current State**:
- `FilmRoll.chemicalsUsed?: string[]` is just text
- No tracking of which specific chemical was used
- No automatic deduction from chemical inventory
- No tracking of amount used

**Proposed Solution**:
This will be resolved by implementing Development Rounds (#3)

**Alternative (if not using Development Rounds)**:
Change the data model:
```typescript
interface FilmRoll {
  // ... existing fields
  chemicalsUsed?: {
    chemicalId: string
    amountUsed: number  // in ml
  }[]
}
```

**Required Changes**:
1. Update `FilmRoll` interface
2. Update `FilmRollForm` to select from actual chemicals inventory
3. Add amount used input
4. Automatically update chemical usage when film roll is saved
5. Show chemical details in film roll card

**Benefits**:
- Accurate chemical consumption tracking
- Automatic inventory updates
- Better statistics (which chemicals used most)
- Can alert when chemical runs out

---

### 6. Create Chemical Mixing Workflow

**Issue**: No process to mix concentrates into working solutions

**Current State**:
- Users manually track mixed solutions
- No linking between concentrate and mixed solution

**Proposed Solution**:
Create a guided mixing workflow (depends on #4)

**Workflow**:
1. From chemicals page, click "Mix Solution" on a concentrate
2. Dialog/page opens with mixing form:
   - Source concentrate (pre-filled)
   - Dilution ratio (e.g., 1:9, 1:4)
   - Amount to mix (in ml)
   - Working solution lifespan (e.g., "Use within 24 hours")
   - Optional: Custom name for mixed solution
3. System calculates:
   - Amount of concentrate needed
   - Amount of water needed
   - Total volume of working solution
4. On confirmation:
   - Creates new chemical entry (state: "mixed")
   - Links to parent concentrate
   - Deducts used amount from concentrate
   - Sets working expiry date
5. Mixed solution appears in chemicals list with different styling

**Required Components**:
- `components/mix-chemical-dialog.tsx` or `app/mix-chemical/page.tsx`
- Mixing calculator logic
- Visual flow showing the mixing process

**Validation**:
- Check if enough concentrate available
- Warn if concentrate is expired
- Prevent mixing if insufficient capacity

---

## Medium Priority

### 7. Add Expired Chemicals Section

**Issue**: Expired chemicals mixed in with active chemicals

**Current State**:
- All chemicals shown together
- Only a badge indicates expiry status
- Difficult to manage expired inventory

**Proposed Solution**:
Add tabbed interface or separate section for expired chemicals

**UI Options**:

**Option A - Tabs**:
```
[Active] [Expired]
```
- Active tab shows non-expired chemicals
- Expired tab shows expired chemicals
- Each maintains search/filter capabilities

**Option B - Collapsible Section**:
- Active chemicals shown by default
- "Show Expired (5)" collapsible section at bottom
- Expired chemicals have different styling (grayed out)

**Option C - Filter Toggle**:
- Add "Hide Expired" toggle button
- Defaults to hiding expired
- Can toggle to show/hide

**Required Changes**:
1. Update `app/chemicals/page.tsx` to add filtering logic
2. Add UI for tab/section/toggle
3. Consider adding "Archive" action to manually archive chemicals
4. Update statistics to show expired chemical count

**Recommended**: Option A (Tabs) for clearest separation

---

### 8. Integrate Recipes with Chemical Inventory

**Issue**: Recipes reference chemicals by name string, not actual inventory

**Current State**:
- `Recipe.developer: string` is just text
- No validation if chemical exists in inventory
- No indication if developer is in stock

**Proposed Solution**:
Link recipes to actual chemicals with availability checking

**Data Model Changes**:
```typescript
interface Recipe {
  id: string
  name: string
  filmType: string
  developerId: string        // CHANGED: Link to actual chemical
  dilution: string
  temperature: number
  time: number
  agitation: string
  notes?: string

  // NEW OPTIONAL FIELDS
  stopBathId?: string       // Optional stop bath chemical
  fixerId?: string          // Optional fixer chemical
  otherChemicalIds?: string[] // Any other chemicals needed
}
```

**Required Changes**:
1. Update `Recipe` interface in `lib/types.ts`
2. Update `RecipeForm` to:
   - Show dropdown of available developer chemicals
   - Optionally add other chemicals (stop bath, fixer)
   - Validate that chemicals exist
3. Update `RecipeCard` to:
   - Show chemical names from actual inventory
   - Display availability badges ("In Stock", "Low Stock", "Out of Stock")
   - Warn if linked chemicals are expired or missing
4. Add "Available" filter to recipes page
5. Update statistics to show recipe availability

**Benefits**:
- Know which recipes are currently usable
- See when chemicals for favorite recipes are running low
- Better development round planning

---

### 9. Add Camera Tracking for Film Rolls

**Issue**: Cannot associate film rolls with specific cameras

**Current State**:
- No camera information on film rolls
- Cannot filter/group by camera

**Proposed Solution**:
Add camera entity and link to film rolls

**New Data Model**:
```typescript
interface Camera {
  id: string
  name: string
  brand: string
  model: string
  format: "35mm" | "120" | "4x5" | "other"
  notes?: string
  purchaseDate?: string
  serialNumber?: string
}

interface FilmRoll {
  // ... existing fields
  cameraId?: string  // NEW: Link to camera
}
```

**Required Changes**:
1. Create `Camera` interface in `lib/types.ts`
2. Add camera storage functions in `lib/storage.ts`
3. Create new page: `app/cameras/page.tsx`
4. Create components:
   - `components/camera-form.tsx`
   - `components/camera-card.tsx`
5. Update `FilmRollForm` to include camera selection
6. Update `FilmRollCard` to display camera info
7. Add navigation item for cameras
8. Update statistics to include camera usage data

**Features**:
- Track all cameras in collection
- See which camera used for each roll
- Filter rolls by camera
- Statistics: rolls per camera, favorite camera

---

### 10. Improve Film Roll Creation Workflow

**Issue**: Can set developed date when creating a new roll (should start undeveloped)

**Current State**:
- `FilmRollForm` allows setting all fields including `developedDate`
- Workflow doesn't match real-world use case

**Proposed Solution**:
Separate creation and development workflows

**New Workflow**:

**Creating Film Roll**:
- User adds: name, type, ISO, format, frames, shot date, camera
- Cannot set: developed date, recipe, chemicals used, rating
- Roll starts as "Not Developed"

**Developing Film Roll** (Manual):
- User clicks "Mark as Developed" on film roll card
- Dialog opens with:
  - Developed date (defaults to today)
  - Recipe used (dropdown)
  - Chemicals used (multi-select)
  - Amount used per chemical
  - Rating
  - Notes
- On save, updates roll status to "Developed"

**Developing via Development Round** (Preferred):
- User creates development round
- Selects undeveloped rolls to include
- Development round handles all the details
- Rolls automatically marked as developed

**Required Changes**:
1. Update `FilmRollForm` to have create/edit modes
2. In create mode, hide development-related fields
3. Add "Mark as Developed" button to undeveloped film roll cards
4. Create `components/develop-film-dialog.tsx`
5. Update form validation accordingly

**Benefits**:
- Clearer workflow matching real usage
- Reduces user error
- Encourages use of development rounds

---

## Low Priority

### 11. Photo Upload and Viewing System

**Issue**: Cannot upload or view photos from developed rolls

**Current State**:
- No photo management functionality
- No visual reference for developed work

**Proposed Solution**:
Add comprehensive photo management system

**Data Model Changes**:
```typescript
interface Photo {
  id: string
  filmRollId: string
  cameraId?: string
  frameNumber?: number
  imageUrl: string        // Local storage or cloud URL
  thumbnail?: string
  title?: string
  notes?: string
  uploadDate: string
  exifData?: {
    shutterSpeed?: string
    aperture?: string
    lens?: string
  }
  tags?: string[]
}

interface FilmRoll {
  // ... existing fields
  photoCount?: number     // Number of uploaded photos
}
```

**Required Features**:

**Photo Upload**:
- Upload multiple images for a roll
- Automatic thumbnail generation
- Frame number assignment
- Optional EXIF data extraction
- Drag-and-drop support

**Photo Viewing**:
- Gallery view per film roll
- Lightbox for full-size viewing
- Grid layout with filtering
- Group by camera/roll/date

**Photo Organization**:
- Tag photos
- Search photos
- Filter by roll, camera, date, tags
- Sort by frame number, upload date

**Required Changes**:
1. Add `Photo` interface to `lib/types.ts`
2. Implement photo storage (local storage has limits, may need cloud)
3. Create `app/photos/page.tsx` for gallery
4. Create `app/film-rolls/[id]/photos/page.tsx` for per-roll gallery
5. Add upload functionality to film roll detail page
6. Implement image optimization/compression
7. Add components:
   - `components/photo-uploader.tsx`
   - `components/photo-gallery.tsx`
   - `components/photo-lightbox.tsx`

**Technical Considerations**:
- Local storage limited to ~5-10MB typically
- May need cloud storage (Cloudinary, AWS S3, Vercel Blob)
- Image optimization for web viewing
- Thumbnail generation
- Progressive loading for large galleries

**Challenges**:
- Storage limitations
- File upload size limits
- Performance with many photos
- Cost of cloud storage

---

### 12. Enhanced Statistics and History

**Issue**: Statistics are basic and don't show historical trends

**Current State**:
- Shows current counts and basic distributions
- Recent activity limited to 6 months
- No year-over-year comparisons
- No detailed chemical usage history

**Proposed Enhancements**:

**Development History**:
- Timeline view of all development sessions
- Calendar heatmap of activity
- Trends over time (rolls per month/year)

**Chemical Analytics**:
- Cost per roll calculation
- Chemical lifespan tracking
- Usage patterns (which chemicals used together)
- Waste tracking (expired before fully used)

**Recipe Analytics**:
- Success rate per recipe (based on ratings)
- Average development parameters
- Recipe usage over time
- Compare recipes side-by-side

**Camera Analytics**:
- Rolls per camera
- Favorite film types per camera
- Timeline of camera usage

**Export Reports**:
- PDF export of statistics
- CSV export for external analysis
- Print-friendly views

**Required Changes**:
1. Expand `app/stats/page.tsx` significantly
2. Add chart components (already have Recharts)
3. Create utility functions for complex calculations
4. Add date range selectors
5. Implement export functionality
6. Consider adding `lib/analytics.ts` for calculation logic

**Components Needed**:
- Timeline charts
- Heatmap calendar
- Comparison tables
- Export dialogs

---

### 13. Data Import/Export Improvements

**Current State**:
- Basic import/export exists (`lib/import.ts`, `lib/export.ts`)
- Likely JSON format only

**Proposed Enhancements**:

**Export Options**:
- JSON (full data backup)
- CSV (for spreadsheet analysis)
- PDF (print-friendly reports)
- Per-section export (just chemicals, just rolls, etc.)

**Import Options**:
- JSON restore from backup
- CSV import for bulk adding
- Migration from other apps
- Template downloads for CSV import

**Features**:
- Scheduled auto-backups to browser storage
- Export to cloud services (Google Drive, Dropbox)
- Import validation and error handling
- Duplicate detection
- Merge vs replace options

**Required Changes**:
1. Enhance `lib/export.ts` with multiple format support
2. Enhance `lib/import.ts` with validation
3. Add import/export UI in settings
4. Implement CSV parsing/generation
5. Add PDF generation library
6. Create backup scheduling system

---

## Implementation Notes

### Development Order Recommendation

**Phase 1 - Critical Fixes** (Immediate):
1. Fix expired chemical label bug
2. Fix date formatting

**Phase 2 - Core Workflow** (Next Sprint):
3. Add chemical state management (concentrate vs mixed)
4. Create chemical mixing workflow
5. Improve film roll creation workflow

**Phase 3 - Development Rounds** (Major Feature):
6. Implement development rounds system
7. Link film rolls to specific chemicals (via rounds)

**Phase 4 - Enhancements** (Polish):
8. Add expired chemicals section
9. Integrate recipes with chemical inventory
10. Add camera tracking

**Phase 5 - Future** (As Needed):
11. Photo upload and viewing
12. Enhanced statistics
13. Import/export improvements

### Testing Considerations

For each feature:
- Test with empty data (first-time user)
- Test with existing data (migration)
- Test edge cases (expired chemicals, zero stock, etc.)
- Test responsive design on mobile
- Test light/dark themes
- Validate form inputs
- Test data persistence across sessions

### Migration Strategy

When updating data models:
1. Create migration functions in `lib/storage.ts`
2. Check data version on app load
3. Automatically migrate old data to new schema
4. Maintain backwards compatibility where possible
5. Provide export before migration option

### Documentation Updates

After each feature:
- Update STATUS.md with new capabilities
- Update README.md if setup changes
- Add inline code comments
- Consider creating user guide/docs

---

## Feedback and Suggestions

This roadmap is based on the issues and feature requests in UPDATE.md. As development progresses and user feedback is gathered, priorities may shift and new items may be added.

For discussions or suggestions, please create an issue or update the UPDATE.md file with new proposals.
