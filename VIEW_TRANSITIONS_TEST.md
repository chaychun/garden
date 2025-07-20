# Astro View Transitions Test

This project includes test pages to demonstrate Astro's view transitions API with various HTML elements and morph animations.

## Features Tested

### 1. Morph Animations (`transition:name`)
- **Page titles and subtitles**: Smooth text transitions between pages
- **Cards**: Content cards that transform with new content
- **List items**: List items that update content while maintaining position

### 2. Persistent Elements (`transition:persist`)
- **Video element**: Same video on both pages that continues playing during transitions
- Video state (playback position, playing/paused) is preserved

### 3. Navigation
- Smooth navigation between test pages
- Different background colors to demonstrate transitions
- Compact layout that fits in one view (no scrolling required)

## Test Pages

### Page 1 (`/page1`)
- Blue gradient background
- Video with `transition:persist` at the top
- Two content cards with transition names
- Compact list items

### Page 2 (`/page2`)
- Green gradient background
- Same video with `transition:persist` (continues playing)
- Three content cards (two morphed, one new)
- Updated list items with one new item

## How to Test

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the test pages**:
   - Visit `/page1` to start
   - Click "Navigate to Page 2" to see transitions
   - Click "Navigate to Page 1" to return

3. **Test specific features**:
   - **Morph animations**: Watch how elements with matching `transition:name` smoothly transform
   - **Video persistence**: Start playing the video on one page, then navigate to see it continue playing
   - **Compact layout**: Everything fits in one view without scrolling

## Key Astro View Transitions Concepts

### `transition:name`
- Creates morph animations between elements with the same name
- Elements smoothly transform from their old state to new state
- Useful for maintaining visual continuity during navigation

### `transition:persist`
- Preserves element state during page transitions
- Perfect for videos, audio players, or interactive elements
- Element continues functioning without interruption

### `ClientRouter` Component
- Must be imported from `astro:transitions`
- Enables view transitions functionality
- Automatically handles the view transitions API
- **Note**: This replaces the deprecated `ViewTransitions` component

## Browser Support

View transitions are supported in:
- Chrome 111+
- Edge 111+
- Opera 97+

For unsupported browsers, navigation will work normally without animations.

## Layout Features

- **Compact design**: All content fits in one view (~1200px wide)
- **No scrolling required**: Optimized for immediate visibility
- **Responsive**: Works on different screen sizes
- **Same video source**: Uses Big Buck Bunny sample video on both pages
- **Visual feedback**: Different background colors and content to demonstrate transitions

## Files Structure

```
src/
├── layouts/
│   └── TransitionLayout.astro    # Layout with ClientRouter enabled
├── pages/
│   ├── index.astro               # Home page with navigation
│   ├── page1.astro               # First test page (compact)
│   └── page2.astro               # Second test page (compact)
└── styles/
    └── global.css                # Custom styles for transitions
```

## Recent Updates

- ✅ Updated to use `ClientRouter` instead of deprecated `ViewTransitions`
- ✅ Same video source on both pages for proper `transition:persist` testing
- ✅ Compact layout that fits in one view without scrolling
- ✅ Removed unnecessary elements to focus on core functionality
- ✅ Video positioned at the top for better visibility