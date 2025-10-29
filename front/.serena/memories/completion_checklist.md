# Task Completion Checklist

Before considering a task complete, ensure the following:

## Code Quality

- [ ] Code follows ESLint rules (run `pnpm lint`)
- [ ] Code is formatted with Prettier (run `pnpm format`)
- [ ] TypeScript types are correct (run `pnpm typecheck`)
- [ ] No `any` types used (only when absolutely necessary)
- [ ] All imports are used

## Functionality

- [ ] Component works as expected
- [ ] Form validation works correctly (if applicable)
- [ ] Internationalization keys are added to both `en.json` and `ja.json`
- [ ] Error handling is implemented
- [ ] Loading states are handled

## Code Organization

- [ ] Component is placed in correct directory (atoms/molecules/organism)
- [ ] Page component is placed in `app/pages/`
- [ ] Utilities are placed in `app/utils/`
- [ ] Routes are properly configured in `app/routes.ts`
- [ ] Exports are properly structured

## Testing

- [ ] Manual testing in browser
- [ ] Different screen sizes tested (responsive)
- [ ] Different languages tested (i18n)

## Documentation

- [ ] Code comments for complex logic
- [ ] Type definitions are clear
- [ ] Component props are documented (if creating new component)

## Best Practices

- [ ] Follows Atomic Design pattern
- [ ] Uses TanStack Form for forms
- [ ] Uses Valibot for validation
- [ ] Uses Tailwind CSS for styling
- [ ] Uses `useTranslation` hook for i18n
- [ ] Date utilities use `dayjs` functions from `app/utils/date.ts`
