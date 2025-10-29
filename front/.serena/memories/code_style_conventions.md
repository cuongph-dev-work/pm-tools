# Code Style and Conventions

## File Naming

- **Pages**: `kebab-case.tsx` (e.g., `home.tsx`, `post.tsx`)
- **Components**: `PascalCase.tsx` (e.g., `LanguageSwitcher.tsx`)
- **Utils**: `camelCase.ts` (e.g., `i18n.ts`, `date.ts`, `file.ts`)
- **Types/Interfaces**: Defined in same file or separate with `PascalCase.ts`
- **Routes Config**: `routes.ts`

## Code Style

- **Formatting**: Prettier with default configuration
- **Linting**: ESLint with TypeScript, React, and Prettier plugins
- **Indentation**: 2 spaces
- **Quotes**: Single quotes preferred (check existing codebase)
- **Semicolons**: Yes (required by ESLint config)

## Naming Conventions

- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `EMAIL_REGEX`, `DATE_FORMATS`)
- **Types/Interfaces**: PascalCase
- **Hooks**: camelCase starting with `use` (e.g., `useTranslation`, `useForm`)
- **Props Types**: `ComponentNameProps` (e.g., `LanguageSwitcherProps`)

## TypeScript

- Strict mode enabled
- Explicit return types not required (inferred from config)
- No explicit `any` (warns instead of errors)
- Use `TFunction` type for translation functions

## Component Structure

Follows **Atomic Design Pattern**:

- **Atoms**: Smallest reusable components (`app/components/atoms/`)
- **Molecules**: Composed of atoms (`app/components/molecules/`)
- **Organisms**: Complex UI sections (`app/components/organism/`)

## Import Order

1. React and React Router imports
2. Third-party library imports
3. Internal utility imports
4. Type imports (using `type` keyword when applicable)
5. Relative imports (using `~/*` path alias for app directory)

## Component Patterns

- Default exports for page components
- Named exports for reusable components
- Functional components with hooks
- Props interfaces defined inline or above component
