# PM Tools Frontend - Project Rules & Conventions

## 🎯 Tổng Quan Dự Án

**Loại dự án**: React SPA với Clean Architecture + Domain-Driven Design
**Framework chính**: React Router v7.7.1, React 19.1.0
**State Management**: Zustand 5.0.8, TanStack Query 5.90.6
**Form Handling**: TanStack Form 1.19.3
**Validation**: Valibot 1.1.0
**Internationalization**: react-i18next 15.7.3
**UI Components**: Radix UI + Tailwind CSS 4.1.4
**Build Tool**: Vite 6.3.3
**Package Manager**: pnpm

---

## 📁 Cấu Trúc Dự Án (Clean Architecture)

```
app/
├── domains/                    # Business domains (DDD)
│   ├── {domain}/
│   │   ├── domain/            # Domain Layer - Pure business logic
│   │   │   ├── entities/      # Domain entities với business rules
│   │   │   ├── repositories/  # Repository interfaces (contracts)
│   │   │   └── validation/    # Validation schemas với Valibot
│   │   ├── application/       # Application Layer - Use cases
│   │   │   ├── use-cases/     # Business use cases
│   │   │   ├── hooks/         # Custom hooks cho domain
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   └── mappers/       # Entity <-> DTO converters
│   │   ├── infrastructure/    # Infrastructure Layer - External adapters
│   │   │   ├── repositories/  # Repository implementations (API, Fake)
│   │   │   └── endpoints.ts   # API endpoint constants
│   │   └── ui/                # Presentation Layer
│   │       ├── screens/       # Page components cho domain
│   │       └── components/    # Domain-specific components (atoms/molecules)
│   │           ├── atoms/
│   │           └── molecules/
│
├── shared/                     # Shared kernel - Cross-cutting concerns
│   ├── components/            # Shared UI components (Atomic Design)
│   │   ├── atoms/             # Basic components: Button, Input, Select...
│   │   ├── molecules/         # Composed components: FormField, Dialog...
│   │   └── layout/            # Layout components: Header, Sidebar...
│   ├── hooks/                 # Shared custom hooks
│   ├── utils/                 # Utility functions
│   │   ├── api.ts             # API client configuration
│   │   ├── i18n.ts            # i18n configuration
│   │   └── validation/        # Common validation utilities
│   ├── types/                 # Shared TypeScript types
│   ├── constants/             # Global constants
│   ├── stores/                # Global Zustand stores
│   └── layouts/               # Page layout wrappers
│
├── locale/                    # Translation files
│   └── vi.json                # Vietnamese translations
├── routes.ts                  # Route configuration
├── root.tsx                   # Root component
└── app.css                    # Global styles
```

---

## 🏗️ Quy Tắc Kiến Trúc (Architecture Rules)

### 1. Clean Architecture Layers

**🔴 CRITICAL - Dependency Rule**: Dependencies chỉ chảy từ ngoài vào trong

```
UI → Application → Domain ← Infrastructure
     ↓             ↓
     └─────────────┘
```

- **Domain Layer** (Innermost):
  - ❌ KHÔNG được import từ bất kỳ layer nào khác
  - ✅ Pure business logic, entities, interfaces
  - ✅ Chỉ phụ thuộc vào Valibot cho validation

- **Application Layer**:
  - ✅ Có thể import từ Domain
  - ❌ KHÔNG được import trực tiếp từ Infrastructure
  - ✅ Use cases, hooks, DTOs, mappers

- **Infrastructure Layer**:
  - ✅ Implement các interfaces từ Domain
  - ✅ Có thể import từ Domain và Application
  - ✅ API calls, external services

- **UI Layer**:
  - ✅ Import từ Application và Shared
  - ❌ KHÔNG được import trực tiếp từ Infrastructure
  - ✅ Screens và domain-specific components

### 2. Domain-Driven Design Patterns

**Entities**:

```typescript
// app/domains/{domain}/domain/entities/{Entity}.ts
export type {Entity}Id = string;

export interface {Entity}Props {
  id: {Entity}Id;
  // ... properties
}

export class {Entity}Entity {
  private constructor(private props: {Entity}Props) {}

  static create(props: {Entity}Props): {Entity}Entity {
    return new {Entity}Entity(props);
  }

  // Getters
  get id() { return this.props.id; }

  // Business methods
  public someBusinessLogic(): void {
    // Domain logic here
  }
}
```

**Repository Pattern**:

```typescript
// Domain: Define interface
export interface {Entity}Repository {
  findById(id: string): Promise<{Entity}Entity | null>;
  save(entity: {Entity}Entity): Promise<void>;
}

// Infrastructure: Implement
export class Api{Entity}Repository implements {Entity}Repository {
  async findById(id: string): Promise<{Entity}Entity | null> {
    // API implementation
  }
}
```

**Use Cases**:

```typescript
// app/domains/{domain}/application/use-cases/{Action}{Entity}.ts
export class {Action}{Entity}UseCase {
  constructor(private repository: {Entity}Repository) {}

  async execute(input: {Input}DTO): Promise<{Output}DTO> {
    // Business logic orchestration
  }
}
```

### 3. Cross-Domain Communication

**🟡 IMPORTANT Rules**:

- ✅ Domains có thể gọi use cases của domain khác qua Application Layer
- ✅ Sử dụng DTOs để truyền data giữa domains
- ❌ KHÔNG truy cập trực tiếp entities của domain khác
- ❌ KHÔNG share UI components giữa domains (dùng shared/ thay vào đó)

---

## 🎨 Component Organization (Atomic Design)

### Shared Components Structure

**Atoms** (`app/shared/components/atoms/`):

- Basic HTML elements với styling
- Không chứa business logic
- Highly reusable
- Examples: Button, TextInput, Select, DatePicker, Card

**Molecules** (`app/shared/components/molecules/`):

- Kết hợp nhiều atoms
- Logic đơn giản, tái sử dụng cao
- Examples: FormFieldInput, FormFieldSelect, ConfirmDeleteButton

**Layout** (`app/shared/components/layout/`):

- Structural components
- Examples: AppHeader, AppSidebar

### Domain-Specific Components

**Placement Rule**:

- ✅ Component dùng cho 1 domain → `app/domains/{domain}/ui/components/`
- ✅ Component dùng cho nhiều domains → `app/shared/components/`
- ✅ Follow Atomic Design: atoms/ và molecules/ trong domain

---

## 📝 Naming Conventions

### Files & Directories

```yaml
Domains: kebab-case
  ✅ app/domains/auth/
  ✅ app/domains/backlog/
  ❌ app/domains/Auth/

Screens: PascalCase.tsx
  ✅ Login.tsx
  ✅ TaskBacklog.tsx
  ❌ login.tsx

Components: PascalCase.tsx
  ✅ LoginForm.tsx
  ✅ TaskCard.tsx
  ❌ login-form.tsx

Utils & Configs: camelCase.ts
  ✅ api.ts
  ✅ i18n.ts
  ❌ API.ts

Types: PascalCase.ts hoặc trong cùng file
  ✅ SignInDto.ts
  ✅ TaskDTO.ts

Schemas: kebab-case.schema.ts
  ✅ auth.schema.ts
  ✅ task.schema.ts

Hooks: camelCase.ts với prefix "use"
  ✅ useLoginForm.ts
  ✅ useListTasks.ts

Use Cases: PascalCase.ts
  ✅ SignInUseCase.ts
  ✅ ListTasks.ts

Repositories: PascalCase.ts với suffix "Repository"
  ✅ ApiAuthRepository.ts
  ✅ FakeTaskRepository.ts

Endpoints: endpoints.ts (trong mỗi domain infrastructure)
```

### Code Naming

```typescript
// Components: PascalCase
export function LoginForm() {}
export const TaskCard = () => {};

// Functions: camelCase
function handleSubmit() {}
const calculateTotal = () => {};

// Constants: UPPER_SNAKE_CASE
export const API_BASE_URL = "...";
export const DATE_FORMAT = "...";

// Types/Interfaces: PascalCase
export interface UserProps {}
export type TaskId = string;

// Props Types: {ComponentName}Props
type LoginFormProps = {};
interface TaskCardProps {}

// Hooks: camelCase với "use" prefix
export function useLoginForm() {}
export const useListTasks = () => {};

// Classes: PascalCase
export class SignInUseCase {}
export class TaskEntity {}

// Repository Interfaces: {Entity}Repository
export interface AuthRepository {}
export interface TaskRepository {}

// Repository Implementations: {Type}{Entity}Repository
export class ApiAuthRepository implements AuthRepository {}
export class FakeTaskRepository implements TaskRepository {}

// DTOs: {Entity}DTO hoặc {Action}Request/Response
export interface TaskDTO {}
export interface SignInRequest {}
export interface SignInResponse {}

// Entities: {Entity}Entity
export class TaskEntity {}
export class ProjectEntity {}

// Mappers: {Entity}Mapper
export class TaskMapper {}
```

---

## 🎯 Form Handling Pattern

### 1. Validation với Valibot

**Schema Location**:

```
app/domains/{domain}/domain/validation/{domain}.schema.ts
```

**Schema Pattern**:

```typescript
import * as v from "valibot";
import type { TFunction } from "i18next";

// Form data type
export type LoginFormData = v.InferOutput<ReturnType<typeof createLoginSchema>>;

// Schema creator với i18n support
export const createLoginSchema = (t: TFunction) => {
  return v.object({
    email: v.pipe(
      v.string(t("validation.required", { field: t("auth.email") })),
      v.email(t("validation.email", { field: t("auth.email") }))
    ),
    password: v.pipe(
      v.string(t("validation.required", { field: t("auth.password") })),
      v.minLength(
        8,
        t("validation.minLength", { field: t("auth.password"), min: 8 })
      )
    ),
  });
};
```

**Common Validation Utilities**:

```typescript
// app/shared/utils/validation/common.ts
import {
  createValidationSchemas,
  createValidationMessages,
} from "~/shared/utils/validation/common";

// Usage
const messages = createValidationMessages(t);
const schemas = createValidationSchemas(t);
```

### 2. Form Hook Pattern

**Hook Location**: `app/domains/{domain}/application/hooks/use{Action}Form.ts`

```typescript
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import {
  createLoginSchema,
  type LoginFormData,
} from "~/domains/auth/domain/validation/auth.schema";

export function useLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormData,
    validatorAdapter: valibotValidator(),
    validators: {
      onSubmit: createLoginSchema(t),
    },
    onSubmit: async ({ value }) => {
      // Call use case
      await signInUseCase.execute(value);
      navigate("/dashboard");
    },
  });

  return { form };
}
```

### 3. Form Component Pattern

```typescript
export function LoginForm() {
  const { form } = useLoginForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <FormFieldInput
            label={t("auth.email")}
            field={field}
            type="email"
          />
        )}
      </form.Field>

      <Button type="submit">
        {t("auth.signIn")}
      </Button>
    </form>
  );
}
```

---

## 🌐 Internationalization (i18n)

### Translation Keys Structure

**Format**: `{namespace}.{key}`

```json
{
  "auth": {
    "signIn": "Sign In",
    "email": "Email",
    "password": "Password"
  },
  "validation": {
    "required": "{{field}} is required",
    "email": "{{field}} must be a valid email",
    "minLength": "{{field}} must be at least {{min}} characters"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  }
}
```

### Usage Pattern

```typescript
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("auth.signIn")}</h1>
      <p>{t("validation.required", { field: t("auth.email") })}</p>
    </>
  );
}
```

### Translation Rules

**🟡 IMPORTANT**:

- ✅ LUÔN dùng `useTranslation` hook, không hardcode text
- ✅ Use meaningful namespaces: auth, validation, common, errors
- ✅ Support interpolation với `{{ variable }}`
- ✅ Hiện tại chỉ có `vi.json` (Vietnamese)
- ❌ KHÔNG mix languages trong cùng một component

---

## 🔌 API Integration Pattern

### 1. Endpoint Definition

```typescript
// app/domains/{domain}/infrastructure/endpoints.ts
export const AUTH_ENDPOINTS = {
  SIGN_IN: "/auth/sign-in",
  SIGN_OUT: "/auth/sign-out",
  REFRESH: "/auth/refresh",
} as const;
```

### 2. Repository Implementation

```typescript
// app/domains/{domain}/infrastructure/repositories/Api{Entity}Repository.ts
import { apiClient } from "~/shared/utils/api";
import { AUTH_ENDPOINTS } from "../endpoints";

export class ApiAuthRepository implements AuthRepository {
  async signIn(credentials: SignInDto): Promise<SignInResponse> {
    const response = await apiClient.post(AUTH_ENDPOINTS.SIGN_IN, credentials);
    return response.data;
  }
}
```

### 3. API Client Configuration

**Base Client**: `app/shared/utils/api.ts`

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors
apiClient.interceptors.request.use(/* auth token */);
apiClient.interceptors.response.use(/* error handling */);
```

---

## 🪝 Custom Hooks Patterns

### Query Hook (TanStack Query)

```typescript
// app/domains/{domain}/application/hooks/use{Action}Query.ts
import { useQuery } from "@tanstack/react-query";

export function useListTasksQuery(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => listTasksUseCase.execute(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Business Logic Hook

```typescript
// app/domains/{domain}/application/hooks/use{Action}.ts
export function useFilterTasks() {
  const [filters, setFilters] = useState<TaskFilters>({});
  const { data: tasks } = useListTasksQuery();

  const filteredTasks = useMemo(() => {
    return tasks?.filter(/* filtering logic */);
  }, [tasks, filters]);

  return { filteredTasks, filters, setFilters };
}
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Conventions

**🟡 IMPORTANT Rules**:

```typescript
// ✅ Sử dụng utility classes
<div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-md">

// ✅ Responsive design: mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">

// ✅ Hover và focus states
<button className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">

// ✅ Dark mode support (nếu cần)
<div className="bg-white dark:bg-gray-800">

// ✅ Custom classes trong app.css cho repeated patterns
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
  }
}

// ❌ KHÔNG inline styles trừ khi thực sự cần thiết
<div style={{ width: "100px" }}> // Avoid
```

### Radix UI Integration

```typescript
// ✅ Sử dụng Radix UI components từ @radix-ui/*
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

// ✅ Wrap trong shared components với styling
export function CustomDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 ...">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

---

## 🚀 Development Workflow

### Commands

```bash
# Development
pnpm dev              # Start dev server

# Quality Checks
pnpm check-all        # Run all checks (lint + format + typecheck)
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier format
pnpm format:check     # Prettier check
pnpm typecheck        # TypeScript check

# Build
pnpm build            # Production build
pnpm start            # Start production server
```

### Pre-commit Checklist

**🟡 IMPORTANT - Chạy trước khi commit**:

```bash
pnpm check-all
```

### Code Review Checklist

- [ ] Tuân thủ Clean Architecture layers
- [ ] Dependency rule được giữ đúng
- [ ] Components đặt đúng atomic level
- [ ] Validation schemas sử dụng Valibot
- [ ] i18n được áp dụng cho tất cả text
- [ ] TypeScript types đầy đủ, không dùng `any`
- [ ] Naming conventions đúng chuẩn
- [ ] Tests passed (khi có)
- [ ] `pnpm check-all` passed

---

## 🚫 Anti-Patterns (Tránh Sử Dụng)

### Architecture Anti-Patterns

```typescript
// ❌ BAD: Domain import từ Infrastructure
// app/domains/auth/domain/entities/User.ts
import { apiClient } from "~/shared/utils/api"; // WRONG!

// ❌ BAD: UI import trực tiếp từ Infrastructure
// app/domains/auth/ui/screens/Login.tsx
import { ApiAuthRepository } from "../../infrastructure/repositories/ApiAuthRepository"; // WRONG!

// ✅ GOOD: UI → Application → Infrastructure
// app/domains/auth/ui/screens/Login.tsx
import { useLoginForm } from "../../application/hooks/useLoginForm"; // CORRECT!
```

### Component Anti-Patterns

```typescript
// ❌ BAD: Business logic trong UI component
export function TaskCard({ task }: Props) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // Complex filtering logic here - WRONG!
  }, [task]);
}

// ✅ GOOD: Business logic trong hook hoặc use case
export function TaskCard({ task }: Props) {
  const { filteredTask } = useFilterTask(task); // Move logic to hook
}

// ❌ BAD: Hardcoded text
<button>Sign In</button>

// ✅ GOOD: i18n
<button>{t("auth.signIn")}</button>

// ❌ BAD: Inline styles
<div style={{ padding: "16px", margin: "8px" }}>

// ✅ GOOD: Tailwind classes
<div className="p-4 m-2">
```

### Form Anti-Patterns

```typescript
// ❌ BAD: Validation logic trong component
const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  if (!email.includes("@")) return "Invalid email";
};

// ✅ GOOD: Validation trong schema
export const createLoginSchema = (t: TFunction) => {
  return v.object({
    email: v.pipe(
      v.string(t("validation.required")),
      v.email(t("validation.email"))
    ),
  });
};
```

---

## 📦 Import Organization

**Thứ tự import**:

```typescript
// 1. React và React Router
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// 3. Domain imports (use cases, entities, repositories)
import { SignInUseCase } from "~/domains/auth/application/use-cases/SignInUseCase";
import type { TaskEntity } from "~/domains/backlog/domain/entities/Task";

// 4. Shared utilities và types
import { apiClient } from "~/shared/utils/api";
import type { ApiResponse } from "~/shared/types/api";

// 5. Components
import { Button } from "~/shared/components/atoms/Button";
import { LoginForm } from "../components/molecules/LoginForm";

// 6. Styles (nếu có)
import "./styles.css";
```

**Path Alias**: `~/` maps to `app/`

---

## 🎯 TypeScript Guidelines

### Type Inference & Explicit Types

```typescript
// ✅ GOOD: Infer return types when obvious
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

// ✅ GOOD: Explicit types for complex returns
function processUser(data: UserData): Promise<ProcessedUser> {
  // ...
}

// ✅ GOOD: Explicit types for props
interface TaskCardProps {
  task: TaskEntity;
  onDelete: (id: string) => void;
}

// ❌ BAD: Don't use `any`
function process(data: any) {} // WRONG!

// ✅ GOOD: Use proper types or `unknown`
function process(data: unknown) {}
```

### Type vs Interface

```typescript
// ✅ Use `type` for unions, primitives, utilities
export type TaskId = string;
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskFormData = v.InferOutput<typeof schema>;

// ✅ Use `interface` for object shapes, especially props
export interface TaskCardProps {
  task: TaskEntity;
  onEdit: () => void;
}

// ✅ Use `interface` for extensibility
export interface BaseEntity {
  id: string;
  createdAt: Date;
}

export interface TaskEntity extends BaseEntity {
  title: string;
}
```

---

## 🧪 Testing Strategy (Future)

**Khi implement tests, follow**:

```typescript
// Unit Tests: Domain logic
describe("TaskEntity", () => {
  it("should create valid task", () => {});
});

// Integration Tests: Use cases
describe("CreateTaskUseCase", () => {
  it("should create task with valid data", () => {});
});

// Component Tests: UI interactions
describe("TaskCard", () => {
  it("should render task information", () => {});
  it("should call onDelete when delete button clicked", () => {});
});

// E2E Tests: User flows
describe("Task Management Flow", () => {
  it("should create, edit, and delete task", () => {});
});
```

---

## ✨ Best Practices Summary

### 🔴 CRITICAL (Never Compromise)

1. **Clean Architecture**: Tuân thủ dependency rule nghiêm ngặt
2. **Type Safety**: Không dùng `any`, explicit types cho public APIs
3. **i18n**: Không hardcode text, luôn dùng translation
4. **Validation**: Schema ở Domain layer, không validate trong UI

### 🟡 IMPORTANT (Strong Preference)

1. **DRY Principle**: Tránh duplicate code, extract shared logic
2. **Single Responsibility**: Mỗi file/function/class có 1 mục đích rõ ràng
3. **Naming Consistency**: Follow conventions nghiêm ngặt
4. **Component Composition**: Prefer composition over inheritance
5. **Error Handling**: Proper error boundaries và user feedback

### 🟢 RECOMMENDED (Apply When Practical)

1. **Performance**: Memoization với `useMemo`/`useCallback` khi cần
2. **Accessibility**: ARIA labels, keyboard navigation
3. **Documentation**: JSDoc cho complex functions
4. **Code Comments**: Explain "why", not "what"

---

## 🔍 Common Patterns Reference

### Create New Domain

```bash
app/domains/{new-domain}/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── validation/
├── application/
│   ├── use-cases/
│   ├── hooks/
│   ├── dto/
│   └── mappers/
├── infrastructure/
│   ├── repositories/
│   └── endpoints.ts
└── ui/
    ├── screens/
    └── components/
```

### Add New Feature Checklist

- [ ] Define entity trong `domain/entities/`
- [ ] Create repository interface trong `domain/repositories/`
- [ ] Create validation schema trong `domain/validation/`
- [ ] Implement repository trong `infrastructure/repositories/`
- [ ] Define endpoints trong `infrastructure/endpoints.ts`
- [ ] Create DTOs trong `application/dto/`
- [ ] Create mapper trong `application/mappers/`
- [ ] Implement use case trong `application/use-cases/`
- [ ] Create custom hook trong `application/hooks/`
- [ ] Create UI components trong `ui/components/`
- [ ] Create screen trong `ui/screens/`
- [ ] Add routes trong `app/routes.ts`
- [ ] Add translations trong `app/locale/vi.json`

---

## 📚 Resources & References

- [React Router v7 Docs](https://reactrouter.com)
- [TanStack Form](https://tanstack.com/form)
- [TanStack Query](https://tanstack.com/query)
- [Valibot](https://valibot.dev)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

---

**Last Updated**: 2025-11-03
**Project Version**: 1.0.0
