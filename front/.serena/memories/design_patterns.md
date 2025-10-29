# Design Patterns and Best Practices

## Atomic Design

The project follows Atomic Design methodology:

### Atoms (`app/components/atoms/`)

- Smallest, indivisible components
- Examples: Button, Input, Icon
- Highly reusable
- Minimal dependencies

### Molecules (`app/components/molecules/`)

- Composed of multiple atoms
- Examples: FormField (Label + Input), SearchBar
- Basic presentation logic
- Still reusable

### Organisms (`app/components/organism/`)

- Complex UI sections
- Composed of molecules and atoms
- Examples: Header, Footer, Form
- Usually appear as part of a layout/page

## Form Handling Pattern

1. Use TanStack Form (`@tanstack/react-form`)
2. Create validation schema with Valibot
3. Use `createValidationSchemas` helper for common patterns
4. Use `TFunction` type for translation-aware validation messages
5. Example:

```typescript
const schema = createPostSchema(t);
const form = useForm({
  defaultValues: { ... },
  validators: {
    onSubmit: schema,
    onSubmitAsync: asyncSubmitHandler,
  },
});
```

## Validation Pattern

1. Create schemas in `app/utils/validation/schema/`
2. Use `createValidationSchemas` for common patterns
3. Export schema creators that accept `TFunction`
4. Use Valibot's `v.pipe` for complex validations
5. Support conditional validation with `v.forward` and `v.partialCheck`

## Internationalization Pattern

1. Always use `useTranslation` hook from `react-i18next`
2. Add translation keys to both `en.json` and `ja.json`
3. Use namespaces: `nav.*`, `layout.*`, `home.*`, `form.*`, `post.*`, `common.*`, `errors.*`, `validation.*`
4. Translation function: `t("key", { field: "Field Name" })`

## Routing Pattern

1. Define routes in `app/routes.ts`
2. Use layout wrapper for shared UI
3. Page components in `app/pages/`
4. Use `<Link>` from `react-router` for navigation
5. Use `<Outlet />` in layouts for nested routes

## Date Handling Pattern

1. Always use utilities from `app/utils/date.ts`
2. Use `DEFAULT_TIMEZONE` (Asia/Tokyo)
3. Use predefined `DATE_FORMATS` constants
4. Never use native `Date` directly - use `dayjs` from utils

## File Handling Pattern

1. Use utilities from `app/utils/file.ts`
2. Check file types with `isImageFormat`, `isVideoFormat`, etc.
3. Use `getFileExtension` for file extension extraction
4. Use `urlToBlob` for fetching remote files

## Styling Pattern

1. Use Tailwind CSS utility classes
2. Follow existing color scheme (blue-600 for primary, gray for neutral)
3. Responsive: mobile-first approach
4. Hover states: `hover:bg-blue-700`
5. Focus states: `focus:ring-2 focus:ring-blue-500`

## Component Props Pattern

```typescript
type ComponentProps = {
  className?: string;
  variant?: "button" | "dropdown";
  // ... other props
};

export function Component({
  className = "",
  variant = "button",
}: ComponentProps) {
  // ...
}
```
