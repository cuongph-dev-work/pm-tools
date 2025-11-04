# PM Tools Frontend

Ứng dụng frontend quản lý dự án được xây dựng với React Router v7, tuân thủ Clean Architecture và Domain-Driven Design.

## Tech Stack

- **Framework**: React 19.1.0
- **Routing**: React Router v7.7.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 6.3.3
- **Form Management**: TanStack Form 1.19.3
- **Validation**: Valibot 1.1.0
- **Internationalization**: react-i18next 15.7.3, i18next 25.5.0
- **Styling**: Tailwind CSS 4.1.4
- **UI Components**: Radix UI
- **Date Handling**: dayjs 1.11.18
- **State Management**: Zustand 5.0.8
- **Package Manager**: pnpm

## Cấu trúc Dự án

Dự án áp dụng **Domain-Driven Design (DDD)** kết hợp với **Clean Architecture**:

```
front/
├── app/
│   ├── domains/              # Domain modules (DDD)
│   │   ├── project/          # Project domain module
│   │   │   ├── domain/       # Domain layer: entities, repositories (ports)
│   │   │   ├── application/  # Application layer: use-cases, DTOs, mappers, hooks
│   │   │   ├── infrastructure/ # Infrastructure layer: repository implementations
│   │   │   └── ui/           # UI layer: screens, components
│   │   ├── home/             # Home domain
│   │   └── error/            # Error domain
│   ├── shared/               # Shared code across domains
│   │   ├── components/       # Reusable UI components (Atomic Design)
│   │   │   ├── atoms/        # Smallest components (Button, Input, Avatar, etc.)
│   │   │   ├── molecules/    # Composed atoms (FormField, ConfirmDeleteButton, etc.)
│   │   │   └── layout/       # Layout components (AppHeader, AppSidebar)
│   │   ├── hooks/            # Shared React hooks
│   │   ├── stores/           # Zustand stores
│   │   ├── layouts/          # Page layouts
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Utility functions
│   ├── locale/               # Translation files (i18n)
│   │   ├── en.json           # English
│   │   ├── ja.json           # Japanese
│   │   └── vi.json           # Vietnamese
│   ├── app.css               # Global CSS
│   ├── root.tsx              # Root component
│   └── routes.ts             # Route configuration
├── public/                   # Static assets
├── vite.config.ts            # Vite configuration
├── react-router.config.ts    # React Router configuration
└── tsconfig.json             # TypeScript configuration
```

## Kiến trúc

### Domain Layer (`domain/`)

- **Entities**: Domain objects với business logic
- **Repositories**: Interface (ports) định nghĩa contracts cho data access
- **Value Objects**: Immutable domain values

### Application Layer (`application/`)

- **Use Cases**: Business logic use cases
- **DTOs**: Data Transfer Objects cho communication với UI
- **Mappers**: Convert giữa Entities và DTOs
- **Hooks**: React hooks để sử dụng use cases trong components

### Infrastructure Layer (`infrastructure/`)

- **Repositories**: Implementation của repository interfaces (adapters)
- Có thể thêm HTTP clients, storage adapters, etc.

### UI Layer (`ui/`)

- **Screens**: Page-level components
- **Components**: Domain-specific UI components
  - `atoms/`: Basic components
  - `molecules/`: Composed components
- **Hooks**: UI-specific hooks

## Design Patterns

### 1. Clean Architecture / Hexagonal Architecture

Tách biệt rõ ràng giữa các layers:

- Domain độc lập với framework và UI
- Application layer orchestrate use cases
- Infrastructure implement các ports
- UI layer chỉ phụ thuộc vào Application layer

### 2. Repository Pattern

```typescript
// Domain: Repository interface (port)
interface ProjectRepository {
  list(): Promise<ProjectEntity[]>;
  getById(id: ProjectId): Promise<ProjectEntity | null>;
}

// Infrastructure: Implementation (adapter)
class FakeProjectRepository implements ProjectRepository {
  // ...
}
```

### 3. Use Case Pattern

```typescript
export class ListProjectsUseCase {
  constructor(private repository: ProjectRepository) {}

  async execute(): Promise<ProjectDTO[]> {
    const entities = await this.repository.list();
    return entities.map(ProjectMapper.toDTO);
  }
}
```

### 4. Atomic Design (UI Components)

- **Atoms**: Button, Input, Avatar, Dialog, Tabs, etc.
- **Molecules**: FormField, ConfirmDeleteButton, ProjectInfoCard, etc.
- **Organisms**: Layout components (AppHeader, AppSidebar)

### 5. State Management (Zustand)

Stores trong `shared/stores/`:

- `authStore.ts`: Authentication state
- `projectStore.ts`: Project state
- `taskStore.ts`: Task state
- `navigationStore.ts`: Navigation state

## Conventions

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `ProjectList.tsx`)
- **Hooks**: `camelCase.ts` với prefix `use` (e.g., `useListProjects.ts`)
- **Utilities**: `camelCase.ts` (e.g., `date.ts`, `i18n.ts`)
- **Types/Interfaces**: `PascalCase.ts` hoặc inline
- **Stores**: `camelCase.ts` với suffix `Store` (e.g., `authStore.ts`)

### Code Style

- **Indentation**: 2 spaces
- **Formatting**: Prettier
- **Linting**: ESLint với TypeScript, React plugins
- **Quotes**: Single quotes preferred

### Component Props

```typescript
interface ComponentProps {
  className?: string;  // Luôn cho phép custom className
  // ... other props
}

export function Component({ className = "", ... }: ComponentProps) {
  return <div className={cn("base-styles", className)}>...</div>;
}
```

## Internationalization (i18n)

- Sử dụng `react-i18next` và `useTranslation` hook
- Translation keys trong `app/locale/` (en.json, ja.json, vi.json)
- **Quan trọng**: Tất cả text trên UI phải qua i18n, không hardcode

### Namespaces

- `nav.*`: Navigation
- `layout.*`: Layout components
- `home.*`: Home page
- `form.*`: Form fields
- `common.*`: Common messages
- `errors.*`: Error messages
- `validation.*`: Validation messages

## Form Handling

1. Sử dụng **TanStack Form** (`@tanstack/react-form`)
2. Validation với **Valibot**
3. Tạo validation schemas trong `app/shared/utils/validation/schema/`
4. Validation schemas nhận `TFunction` để support i18n

## Validation Pattern

1. Schemas trong `app/shared/utils/validation/schema/`
2. Sử dụng `createValidationSchemas` helper
3. Export schema creators nhận `TFunction`
4. Sử dụng Valibot's `v.pipe` cho complex validations

## UI Component Guidelines

### Radix UI

- **Ưu tiên sử dụng Radix UI components** cho atoms và molecules
- Đảm bảo accessibility và consistency
- Cho phép truyền `className` để custom styling

### Atomic Design

- **Atoms**: Basic building blocks, tái sử dụng cao
- **Molecules**: Kết hợp nhiều atoms, có logic đơn giản
- **Organisms**: Layout components và complex sections

### Component Structure

- Tái sử dụng tối đa atoms và molecules
- Tách logic và UI rõ ràng
- Hỗ trợ className để custom

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Application sẽ chạy tại `http://localhost:5173`.

### Build

```bash
pnpm build
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

### Formatting

```bash
pnpm format
pnpm format:check
```

### Check All

```bash
pnpm check-all
```

## Path Aliases

- `~/*` maps to `app/*` (configured in `tsconfig.json`)

## Deployment

### Docker

```bash
docker build -t pm-tools-frontend .

docker run -p 3000:3000 pm-tools-frontend
```

### Production Build

Build output:

```
build/
├── client/    # Static assets
└── server/    # Server-side code
```

---

Built with ❤️ using React Router.
