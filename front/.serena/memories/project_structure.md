# Project Structure

```
front/
├── app/
│   ├── components/          # Reusable UI components (Atomic Design)
│   │   ├── atoms/           # Smallest components (Button, Input, etc.)
│   │   ├── molecules/       # Combined atoms (SearchBar, FormField, etc.)
│   │   └── organism/        # Complex sections (Header, Footer, etc.)
│   ├── layouts/             # Layout components (wrappers for pages)
│   │   └── default.tsx      # Default layout with header, footer
│   ├── locale/              # Translation files (JSON)
│   │   ├── en.json          # English translations
│   │   └── ja.json          # Japanese translations
│   ├── pages/               # Page components (route handlers)
│   │   ├── home.tsx         # Homepage
│   │   ├── post.tsx         # Post creation/editing page
│   │   └── not-found.tsx    # 404 page
│   ├── utils/               # Utility functions
│   │   ├── date.ts          # Date manipulation utilities (dayjs)
│   │   ├── file.ts          # File handling utilities
│   │   ├── i18n.ts          # i18n configuration
│   │   └── validation/      # Validation schemas and utilities
│   │       ├── common.ts    # Common validation patterns
│   │       ├── index.ts     # Validation exports
│   │       └── schema/      # Domain-specific schemas
│   │           ├── index.ts # Schema exports
│   │           └── post.schema.ts # Post validation schema
│   ├── app.css              # Global styles
│   ├── root.tsx             # Root component and layout
│   └── routes.ts            # Route configuration
├── public/                  # Static assets
├── .react-router/           # Generated React Router types (gitignored)
├── build/                   # Build output (gitignored)
├── vite.config.ts           # Vite configuration
├── react-router.config.ts   # React Router configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
└── package.json             # Dependencies and scripts
```

## Path Aliases

- `~/*` maps to `app/*` (configured in `tsconfig.json`)

## Key Directories

### Components (`app/components/`)

Follows Atomic Design methodology:

- **Atoms**: Basic building blocks (buttons, inputs, icons)
- **Molecules**: Simple combinations of atoms (form fields, search bars)
- **Organisms**: Complex UI blocks (headers, forms, lists)

### Pages (`app/pages/`)

Each file represents a route. Pages use layouts and contain page-specific logic.

### Utils (`app/utils/`)

- **date.ts**: Comprehensive date utilities using dayjs
- **file.ts**: File type checking and manipulation
- **i18n.ts**: i18next configuration
- **validation/**: Validation schemas using Valibot

### Locale (`app/locale/`)

JSON files containing translation keys organized by namespace (nav, layout, home, form, post, common, errors, validation).
