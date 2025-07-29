# Scroll Area Component

A lightweight, accessible scroll wrapper component for Astro that provides custom scrollbars with hover behavior, inspired by Radix UI's scroll area but much simpler.

## Features

- ✅ **Native Scrolling**: Uses native browser scrolling, no CSS transformations
- ✅ **Hover Behavior**: Scrollbars appear on hover and disappear after a configurable delay
- ✅ **RTL Support**: Full right-to-left language support
- ✅ **Customizable**: Style scrollbars and thumbs with CSS classes
- ✅ **Accessible**: Proper ARIA attributes and keyboard support
- ✅ **Responsive**: Automatically adjusts to content changes
- ✅ **Lightweight**: No external dependencies, pure vanilla JavaScript

## Basic Usage

```astro
---
import ScrollArea from "../components/ScrollArea.astro";
---

<ScrollArea class="h-64 rounded border">
	<div class="p-4">
		<!-- Your content here -->
	</div>
</ScrollArea>
```

## Props

| Prop              | Type             | Default | Description                                    |
| ----------------- | ---------------- | ------- | ---------------------------------------------- |
| `class`           | `string`         | `''`    | CSS classes for the scroll area container      |
| `style`           | `string`         | `''`    | Inline styles for the scroll area container    |
| `dir`             | `'ltr' \| 'rtl'` | `'ltr'` | Text direction                                 |
| `scrollHideDelay` | `number`         | `600`   | Delay in milliseconds before hiding scrollbars |
| `hideScrollbar`   | `boolean`        | `false` | Whether to hide scrollbars completely          |
| `viewportClass`   | `string`         | `''`    | CSS classes for the viewport element           |
| `viewportStyle`   | `string`         | `''`    | Inline styles for the viewport element         |
| `scrollbarClass`  | `string`         | `''`    | CSS classes for scrollbar elements             |
| `scrollbarStyle`  | `string`         | `''`    | Inline styles for scrollbar elements           |
| `thumbClass`      | `string`         | `''`    | CSS classes for thumb elements                 |
| `thumbStyle`      | `string`         | `''`    | Inline styles for thumb elements               |

## Examples

### Custom Styled Scrollbars

```astro
<ScrollArea
	class="h-64 rounded border"
	scrollbarClass="bg-blue-200 rounded-full"
	thumbClass="bg-blue-600 rounded-full"
	scrollHideDelay={800}
>
	<div class="p-4">
		<!-- Content -->
	</div>
</ScrollArea>
```

### RTL Support

```astro
<ScrollArea class="h-64" dir="rtl">
	<div class="p-4">
		<!-- RTL content -->
	</div>
</ScrollArea>
```

### Hidden Scrollbars

```astro
<ScrollArea class="h-64" hideScrollbar={true}>
	<div class="p-4">
		<!-- Content with invisible scrollbar -->
	</div>
</ScrollArea>
```

### Horizontal Scrolling

```astro
<ScrollArea class="h-32">
	<div class="flex space-x-4" style="width: max-content;">
		<div class="min-w-48 bg-gray-100 p-4">Card 1</div>
		<div class="min-w-48 bg-gray-100 p-4">Card 2</div>
		<div class="min-w-48 bg-gray-100 p-4">Card 3</div>
		<!-- More cards... -->
	</div>
</ScrollArea>
```

## CSS Classes

The component uses the following CSS classes that you can override:

- `.scroll-area` - Main container
- `.scroll-area-viewport` - Scrollable viewport
- `.scroll-area-content` - Content wrapper
- `.scroll-area-scrollbar` - Scrollbar container
- `.scroll-area-scrollbar-y` - Vertical scrollbar
- `.scroll-area-scrollbar-x` - Horizontal scrollbar
- `.scroll-area-thumb` - Scrollbar thumb

## Accessibility

The component includes proper ARIA attributes:

- `role="scrollbar"` on scrollbar elements
- `aria-orientation` to indicate scroll direction
- `aria-controls` to associate scrollbars with viewport

## Browser Support

- Modern browsers with ES6+ support
- ResizeObserver API (with fallback)
- Pointer events API

## Demo

Visit `/scroll-demo` to see the component in action with various examples and configurations.
