# Astro View Transitions Test

This project includes test pages to demonstrate Astro's view transitions API with various HTML elements and morph animations.

## Features Tested

### 1. Morph Animations (`transition:name`)
- **Page titles and subtitles**: Smooth text transitions between pages
- **Images**: Hero images that morph between different sources
- **Cards**: Content cards that transform with new content
- **Buttons**: Call-to-action buttons that change color and text
- **Lists**: List items that update content while maintaining position
- **Form elements**: Input fields and textareas with transition names
- **Progress bars**: Visual progress indicators that morph

### 2. Persistent Elements (`transition:persist`)
- **Video elements**: Videos that continue playing during page transitions
- Video state (playback position, playing/paused) is preserved

### 3. Navigation
- Smooth navigation between test pages
- Different background colors to demonstrate transitions
- Responsive design with Tailwind CSS

## Test Pages

### Page 1 (`/page1`)
- Blue gradient background
- Hero section with image and text
- Two content cards
- Video with `transition:persist`
- List items with transition names

### Page 2 (`/page2`)
- Green gradient background
- Updated hero section with different content
- Three content cards (one new, two morphed)
- Same video with `transition:persist`
- Updated list items
- Additional form and progress elements

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
   - **Form elements**: Type in the input fields and textareas, then navigate to see the content preserved
   - **New elements**: Notice how elements without transition names fade in normally

## Key Astro View Transitions Concepts

### `transition:name`
- Creates morph animations between elements with the same name
- Elements smoothly transform from their old state to new state
- Useful for maintaining visual continuity during navigation

### `transition:persist`
- Preserves element state during page transitions
- Perfect for videos, audio players, or interactive elements
- Element continues functioning without interruption

### `ViewTransitions` Component
- Must be imported from `astro:transitions`
- Enables view transitions functionality
- Automatically handles the view transitions API

## Browser Support

View transitions are supported in:
- Chrome 111+
- Edge 111+
- Opera 97+

For unsupported browsers, navigation will work normally without animations.

## Customization

You can customize the transitions by:
1. Modifying the CSS in `src/styles/global.css`
2. Adding more `transition:name` attributes to elements
3. Using different transition names for different animation groups
4. Adjusting the `ViewTransitions` component options

## Files Structure

```
src/
├── layouts/
│   └── TransitionLayout.astro    # Layout with view transitions enabled
├── pages/
│   ├── index.astro               # Home page with navigation
│   ├── page1.astro               # First test page
│   └── page2.astro               # Second test page
└── styles/
    └── global.css                # Custom styles for transitions
```