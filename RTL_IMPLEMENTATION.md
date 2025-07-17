# RTL (Right-to-Left) Implementation Guide

This document outlines the complete RTL support implementation for the Madar application, enabling seamless bidirectional user interface experience.

## Overview

The application now supports both LTR (English) and RTL (Arabic) layouts with dynamic language switching. The implementation follows modern CSS logical properties and provides a robust foundation for multilingual support.

## Key Features Implemented

### 1. Typography System

- **English Fonts**:
  - Headings: Funnel Display
  - Body: Inter
- **Arabic Font**: IBM Plex Sans Arabic
- Dynamic font switching based on language selection
- Proper font weight support (300, 400, 500, 600, 700)

### 2. Language Switching

- Dynamic language switching with `useLanguage()` hook
- Automatic direction changes (RTL/LTR)
- Persistent language preference in localStorage
- Real-time DOM attribute updates (`lang` and `dir`)

### 3. CSS Logical Properties

All components updated to use logical properties:

- `margin-inline-start/end` instead of `margin-left/right`
- `padding-inline-start/end` instead of `padding-left/right`
- `inset-inline-start/end` instead of `left/right`
- `border-inline-start/end` instead of `border-left/right`
- `text-start/end` instead of `text-left/right`

### 4. Component Updates

Updated components for RTL support:

- Dialog (close button positioning)
- DropdownMenu (chevron icons, padding, positioning)
- NavigationMenu (spacing, positioning)
- Breadcrumb (separator icons)
- Sheet (side panels, close button)
- All page components (Index, Gallery, Login)

## File Structure

```
client/
├── hooks/
│   └── use-language.ts          # Language switching hook
├── components/
│   └── LanguageSwitcher.tsx     # Language switcher component
├── lib/
│   └── rtl-utils.ts            # RTL utility functions
├── global.css                  # Updated with RTL support
└── pages/                      # All pages updated for RTL
```

## Usage

### Language Hook

```tsx
import { useLanguage } from "@/hooks/use-language";

function MyComponent() {
  const { language, isRTL, toggleLanguage, setLanguage } = useLanguage();

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      Current language: {language}
      <button onClick={toggleLanguage}>Switch Language</button>
    </div>
  );
}
```

### RTL Utilities

```tsx
import { getDirectionalMargin, getFontFamily } from "@/lib/rtl-utils";

function MyComponent() {
  const { language } = useLanguage();

  return (
    <div
      className={getDirectionalMargin(language, "start", "4")}
      style={{ fontFamily: getFontFamily(language, "heading") }}
    >
      Content
    </div>
  );
}
```

### CSS Classes Available

#### Logical Properties

- `.start-0`, `.end-0`, `.start-2`, `.end-2`, `.start-4`, `.end-4`
- `.ms-auto`, `.me-auto`
- `.ps-2`, `.pe-2`, `.ps-3`, `.pe-3`, `.ps-4`, `.pe-4`
- `.border-s`, `.border-e`, `.border-s-2`, `.border-e-2`
- `.text-start`, `.text-end`

#### RTL Utilities

- `.flip-for-rtl` - Flips icons horizontally in RTL mode
- `.font-arabic` - Applies Arabic font family
- `.font-heading` - Applies English heading font
- `.font-body` - Applies English body font

## Best Practices

### 1. Use Logical Properties

Always use logical properties instead of directional ones:

```css
/* ✅ Good */
margin-inline-start: 1rem;
padding-inline-end: 0.5rem;

/* ❌ Avoid */
margin-left: 1rem;
padding-right: 0.5rem;
```

### 2. Icon Handling

Add `flip-for-rtl` class to directional icons:

```tsx
/* ✅ Directional icons (arrows, chevrons) */
<ChevronRight className="flip-for-rtl" />

/* ✅ Non-directional icons (don't flip) */
<Star className="w-4 h-4" />
```

### 3. Spacing

Use gap instead of directional margins when possible:

```tsx
/* ✅ Preferred */
<div className="flex gap-2">

/* ✅ When gap isn't suitable */
<Icon className="me-2" />
```

### 4. Text Alignment

```tsx
/* ✅ Good */
<div className="text-start">
<div className="text-end">
<div className="text-center"> {/* Always OK */}

/* ❌ Avoid */
<div className="text-left">
<div className="text-right">
```

## Testing Checklist

For each component/page, verify:

- [ ] Layout maintains integrity when switching to RTL
- [ ] Text direction changes appropriately
- [ ] Spacing and margins flip correctly
- [ ] Icons that indicate direction are mirrored
- [ ] Forms and inputs work correctly in RTL
- [ ] Dropdown menus open in the correct direction
- [ ] Modals and overlays position correctly
- [ ] Navigation menus flow properly
- [ ] Scrollbars appear on the correct side
- [ ] Animations and transitions work in both directions

## Browser Support

This implementation uses modern CSS logical properties with excellent browser support:

- Chrome 69+
- Firefox 66+
- Safari 12+
- Edge 79+

## Performance Notes

- Font loading is optimized with `display=swap`
- CSS logical properties have no performance overhead
- Language preference is cached in localStorage
- No runtime style calculations needed

## Future Enhancements

1. **Content Translation**: Add i18n support for text content
2. **Date/Time Formatting**: Implement locale-aware formatting
3. **Number Formatting**: Add RTL number formatting
4. **Additional Languages**: Support for other RTL languages
5. **Advanced Typography**: OpenType features for Arabic text

## Troubleshooting

### Common Issues

1. **Layout Breaking**: Check for hardcoded `left/right` properties
2. **Icons Not Flipping**: Ensure `flip-for-rtl` class is applied
3. **Font Not Loading**: Verify font imports in global.css
4. **Direction Not Changing**: Check if `useLanguage()` hook is initialized

### Debug Mode

Add this to see current language state:

```tsx
const { language, isRTL } = useLanguage();
console.log({ language, isRTL, dir: document.dir });
```

## Conclusion

The RTL implementation provides a solid foundation for bilingual support. The system is designed to be maintainable, performant, and easily extensible for future requirements.
