# Implementation Guideline - PM Tools Frontend

> Tài liệu hướng dẫn implement cho dự án React Boilerplate - PM Tools Frontend

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Cấu trúc dự án](#2-cấu-trúc-dự-án)
3. [Tech Stack](#3-tech-stack)
4. [Code Style & Conventions](#4-code-style--conventions)
5. [Patterns & Best Practices](#5-patterns--best-practices)
6. [Quy trình Development](#6-quy-trình-development)
7. [Các task thường gặp](#7-các-task-thường-gặp)
8. [Checklist hoàn thành](#8-checklist-hoàn-thành)

---

## 1. Tổng quan dự án

### Mục đích

Đây là một React application template hiện đại với các tính năng:

- Server-side rendering (SSR) có thể cấu hình
- TypeScript toàn bộ
- Routing dựa trên file structure
- Quản lý form với TanStack Form
- Validation với Valibot
- Đa ngôn ngữ (i18n) với react-i18next
- Styling với Tailwind CSS

### Trạng thái hiện tại

- **Mode**: SPA (Single Page Application) - `ssr: false`
- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Framework**: React Router v7

---

## 2. Cấu trúc dự án

```
front/
├── app/
│   ├── components/          # UI Components (Atomic Design)
│   │   ├── atoms/           # Component nhỏ nhất, tái sử dụng cao
│   │   ├── molecules/       # Kết hợp các atoms
│   │   └── organism/        # UI sections phức tạp
│   ├── layouts/             # Layout components
│   ├── locale/              # Translation files (JSON)
│   │   ├── en.json
│   │   └── ja.json
│   ├── pages/               # Page components (routing)
│   ├── utils/               # Utility functions
│   │   ├── date.ts          # Date utilities (dayjs)
│   │   ├── file.ts          # File utilities
│   │   ├── i18n.ts          # i18n config
│   │   └── validation/      # Validation schemas
│   ├── root.tsx             # Root component
│   └── routes.ts            # Route configuration
├── public/                  # Static assets
├── vite.config.ts
├── react-router.config.ts
├── tsconfig.json
└── package.json
```

### Path Aliases

- `~/*` → `app/*` (đã config trong `tsconfig.json`)

---

## 3. Tech Stack

| Category         | Technology          | Version |
| ---------------- | ------------------- | ------- |
| Framework        | React               | 19.1.0  |
| Routing          | React Router        | 7.7.1   |
| Language         | TypeScript          | 5.8.3   |
| Build Tool       | Vite                | 6.3.3   |
| Form             | TanStack Form       | 1.19.3  |
| Validation       | Valibot             | 1.1.0   |
| i18n             | react-i18next       | 15.7.3  |
| Styling          | Tailwind CSS        | 4.1.4   |
| UI Components    | Radix UI Themes     | 3.2.1   |
| UI Primitives    | Radix UI Primitives | latest  |
| Icons            | lucide-react        | 0.548.0 |
| State Management | Zustand             | 5.0.8   |
| Date             | dayjs               | 1.11.18 |
| Package Manager  | pnpm                | latest  |

---

## 4. Code Style & Conventions

### File Naming

- **Pages**: `kebab-case.tsx` (e.g., `home.tsx`, `post.tsx`)
- **Components**: `PascalCase.tsx` (e.g., `LanguageSwitcher.tsx`)
- **Utils**: `camelCase.ts` (e.g., `i18n.ts`, `date.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `EMAIL_REGEX`, `DATE_FORMATS`)

### Naming Conventions

- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Hooks**: `camelCase` bắt đầu với `use`
- **Props Types**: `ComponentNameProps`

### Import Order

```typescript
// 1. React imports
import { useState } from "react";
import { Link } from "react-router";

// 2. Third-party libraries
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";

// 3. Internal utilities (using path alias)
import { formatDate } from "~/utils/date";
import { createPostSchema } from "~/utils/validation/schema";

// 4. Type imports
import type { PostFormData } from "~/utils/validation/schema";
```

### TypeScript

- **Strict mode**: Enabled
- **Explicit return types**: Không bắt buộc (type inference)
- **`any` type**: Warning (tránh sử dụng)
- **Translation function type**: `TFunction` (từ `ReturnType<typeof useTranslation>["t"]`)

---

## 5. Patterns & Best Practices

### 5.1. Atomic Design Pattern

#### Atoms (`app/components/atoms/`)

- Component nhỏ nhất, không thể chia nhỏ
- Tái sử dụng cao
- Ít dependencies
- Ví dụ: Button, Input, Icon

```typescript
// app/components/atoms/Button.tsx
type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === "primary"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-800"
      }`}
    >
      {label}
    </button>
  );
}
```

#### Molecules (`app/components/molecules/`)

- Kết hợp nhiều atoms
- Có logic presentation cơ bản
- Ví dụ: FormField (Label + Input), SearchBar

```typescript
// app/components/molecules/FormField.tsx
import { Input } from "~/components/atoms/Input";
import { Label } from "~/components/atoms/Label";

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function FormField({ label, value, onChange, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
```

#### Organisms (`app/components/organism/`)

- UI sections phức tạp
- Kết hợp molecules và atoms
- Ví dụ: Header, Footer, ComplexForm

### 5.2. Form Handling Pattern

Luôn sử dụng **TanStack Form** và **Valibot**:

```typescript
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { createPostSchema, type PostFormData } from "~/utils/validation/schema";

export default function PostPage() {
  const { t } = useTranslation();
  const postSchema = createPostSchema(t);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    } as PostFormData,
    validators: {
      onSubmit: postSchema,
      onSubmitAsync: async (values) => {
        // API call here
        return {};
      },
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="title">
        {field => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors && (
              <p className="text-red-600">{field.state.meta.errors}</p>
            )}
          </div>
        )}
      </form.Field>
      {/* ... other fields */}
    </form>
  );
}
```

### 5.3. Validation Pattern

#### Tạo Validation Schema

1. **Schema chung** trong `app/utils/validation/common.ts`:

```typescript
export const createValidationSchemas = (t: TFunction) => {
  return {
    requiredString: (fieldName: string) =>
      v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, t("validation.required", { field: fieldName }))
      ),
    optionalString: () => v.optional(v.string()),
  };
};
```

2. **Schema cụ thể** trong `app/utils/validation/schema/`:

```typescript
// app/utils/validation/schema/post.schema.ts
export const createPostSchema = (t: TFunction) => {
  const baseSchemas = createValidationSchemas(t);

  return v.pipe(
    v.object({
      title: v.pipe(baseSchemas.requiredString("Title")),
      description: v.pipe(baseSchemas.requiredString("Description")),
    })
  );
};
```

#### Conditional Validation

```typescript
v.forward(
  v.partialCheck(
    [["visibility"], ["publicId"]],
    ({ visibility, publicId }) =>
      visibility === "public" && publicId !== undefined && publicId !== "",
    t("validation.required", { field: "Public ID" })
  ),
  ["publicId"]
);
```

### 5.4. Internationalization Pattern

#### Sử dụng Translation

```typescript
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("home.title")}</h1>
      <p>{t("validation.required", { field: "Title" })}</p>
    </div>
  );
}
```

#### Thêm Translation Keys

1. Thêm vào `app/locale/en.json`:

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

2. Thêm tương ứng vào `app/locale/ja.json`:

```json
{
  "myFeature": {
    "title": "マイ機能",
    "description": "機能の説明"
  }
}
```

#### Translation Namespaces

- `nav.*` - Navigation items
- `layout.*` - Layout text
- `home.*` - Homepage content
- `form.*` - Form labels/buttons
- `post.*` - Post-related content
- `common.*` - Common UI text
- `errors.*` - Error messages
- `validation.*` - Validation messages

### 5.5. Routing Pattern

#### Định nghĩa Routes

```typescript
// app/routes.ts
import { layout, route, index } from "@react-router/dev/routes";

export default [
  layout("./layouts/default.tsx", [
    index("./pages/home.tsx"),
    route("/post", "./pages/post.tsx"),
    route("/about", "./pages/about.tsx"),
    route("*", "./pages/not-found.tsx"),
  ]),
];
```

#### Sử dụng Navigation

```typescript
import { Link } from "react-router";

// Link navigation
<Link to="/post">Go to Post</Link>

// Programmatic navigation
import { useNavigate } from "react-router";
const navigate = useNavigate();
navigate("/post");
```

#### Layout với Outlet

```typescript
import { Outlet } from "react-router";

export default function DefaultLayout() {
  return (
    <div>
      <header>...</header>
      <main>
        <Outlet /> {/* Pages render here */}
      </main>
      <footer>...</footer>
    </div>
  );
}
```

### 5.6. Date Handling Pattern

**Luôn sử dụng utilities từ `app/utils/date.ts`:**

```typescript
import { formatDate, now, createDate, DEFAULT_TIMEZONE } from "~/utils/date";

// Format date
const formatted = formatDate(new Date(), "DISPLAY_DATE");

// Current date/time
const current = now();

// Create date with timezone
const date = createDate("2024-01-01", { timezone: DEFAULT_TIMEZONE });

// Relative time
import { getRelativeTime } from "~/utils/date";
const relative = getRelativeTime(someDate);
```

**Lưu ý**: Không dùng `Date` trực tiếp, luôn dùng `dayjs` qua utilities.

### 5.7. File Handling Pattern

```typescript
import {
  isImageFormat,
  isVideoFormat,
  getFileExtension,
  urlToBlob,
} from "~/utils/file";

// Check file type
const isValid = isImageFormat(file.name);

// Get extension
const ext = getFileExtension("image.jpg"); // "jpg"

// Convert URL to Blob
const blob = await urlToBlob("https://example.com/image.jpg");
```

### 5.8. Styling Pattern

#### Tailwind CSS

- **Color scheme**: `blue-600` cho primary, `gray` cho neutral
- **Responsive**: Mobile-first
- **Hover states**: `hover:bg-blue-700`
- **Focus states**: `focus:ring-2 focus:ring-blue-500`
- **Transitions**: `transition-colors` cho smooth transitions

#### Ví dụ styling:

```typescript
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
  Submit
</button>
```

### 5.9. State Management Pattern (Zustand)

Dự án sử dụng **Zustand** để quản lý global state. Zustand là một state management library nhỏ gọn, không cần boilerplate, và dễ sử dụng.

#### Store Structure

Tất cả Zustand stores được đặt trong `app/stores/`:

```
app/stores/
├── authStore.ts          # Authentication state
├── navigationStore.ts    # Navigation state
├── projectStore.ts       # Project state
├── taskStore.ts          # Tasks state
├── gitAlertStore.ts      # Git alerts state
└── index.ts              # Export all stores
```

#### Tạo Zustand Store

**Cấu trúc cơ bản:**

```typescript
// app/stores/exampleStore.ts
import { create } from "zustand";

interface ExampleState {
  data: string;
  setData: (data: string) => void;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>(set => ({
  data: "",
  setData: data => set({ data }),
  reset: () => set({ data: "" }),
}));
```

**Ví dụ phức tạp hơn với async actions:**

```typescript
import { create } from "zustand";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: tasks => set({ tasks }),

  addTask: task =>
    set(state => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: id =>
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id),
    })),

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      // API call
      const response = await fetch("/api/tasks");
      const tasks = await response.json();
      set({ tasks, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },
}));
```

#### Sử dụng Store trong Component

**Cách 1: Sử dụng hook wrapper (Recommended)**

```typescript
// app/hooks/useTasks.ts
import { useTaskStore } from "~/stores/taskStore";

export function useTasks() {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);

  return {
    tasks,
    addTask,
    updateTask,
  };
}

// Trong component
import { useTasks } from "~/hooks/useTasks";

export function MyComponent() {
  const { tasks, addTask } = useTasks();
  // ...
}
```

**Cách 2: Sử dụng store trực tiếp**

```typescript
import { useTaskStore } from "~/stores/taskStore";

export function MyComponent() {
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

**Optimize với selector:**

```typescript
// Chỉ re-render khi tasks thay đổi, không phải khi loading/error thay đổi
const tasks = useTaskStore(state => state.tasks);

// Custom selector để filter
const pendingTasks = useTaskStore(state =>
  state.tasks.filter(task => task.status === "todo")
);

// Multiple selectors (nếu cần cả tasks và loading)
const { tasks, loading } = useTaskStore(state => ({
  tasks: state.tasks,
  loading: state.loading,
}));
```

#### Best Practices với Zustand

1. **Tách store theo domain**: Mỗi store quản lý một domain cụ thể
   - `authStore` - Authentication
   - `navigationStore` - Navigation/routing state
   - `projectStore` - Project management
   - `taskStore` - Task management

2. **Sử dụng hooks wrapper**: Tạo custom hooks trong `app/hooks/` để:
   - Che giấu implementation details
   - Cung cấp consistent API
   - Dễ dàng refactor sau này

3. **TypeScript**: Luôn define interface cho state:

   ```typescript
   interface MyState {
     // State properties
     data: string;
     // Actions
     setData: (data: string) => void;
   }
   ```

4. **Immutable updates**: Luôn tạo new objects/arrays khi update:

   ```typescript
   // ✅ Good
   set(state => ({ tasks: [...state.tasks, newTask] }));

   // ❌ Bad
   state.tasks.push(newTask); // Mutating!
   ```

5. **Selector optimization**: Chỉ subscribe vào phần state cần thiết:

   ```typescript
   // ✅ Good - chỉ re-render khi tasks thay đổi
   const tasks = useTaskStore(state => state.tasks);

   // ❌ Bad - re-render khi bất kỳ state nào thay đổi
   const store = useTaskStore();
   ```

6. **Async actions**: Sử dụng async/await trong actions:
   ```typescript
   fetchData: async () => {
     set({ loading: true });
     try {
       const data = await api.getData();
       set({ data, loading: false });
     } catch (error) {
       set({ error, loading: false });
     }
   };
   ```

#### Stores đã có sẵn

Dự án đã có các stores sau:

- `authStore` - User authentication state
- `navigationStore` - Current page navigation
- `projectStore` - Current selected project
- `taskStore` - Tasks list và CRUD operations
- `gitAlertStore` - Git alerts và read status

Tất cả stores đều được export từ `app/stores/index.ts` và có hooks wrapper trong `app/hooks/`.

#### Tài liệu tham khảo

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)

### 5.10. Radix UI Components Pattern

Dự án sử dụng **Radix UI Primitives** để xây dựng các component accessible và có thể tùy chỉnh. Radix UI cung cấp unstyled, accessible components cho phép kiểm soát hoàn toàn về styling.

#### Packages đã cài đặt

Dự án đã cài đặt các Radix UI packages sau:

- `@radix-ui/react-dialog` - Dialog/Modal components
- `@radix-ui/react-dropdown-menu` - Dropdown menu components
- `@radix-ui/react-popover` - Popover components
- `@radix-ui/react-select` - Select dropdown components
- `@radix-ui/react-tooltip` - Tooltip components
- `@radix-ui/react-slot` - Utility cho component composition
- `lucide-react` - Icon library (sử dụng cùng với Radix UI)

#### Sử dụng Radix UI Themes

**Radix UI Themes** cung cấp các component được styled sẵn với design system hoàn chỉnh. Theme provider được setup trong `app/root.tsx`:

```typescript
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
```

**Ví dụ: Button Component từ Themes**

Button component đã được wrapper để tương thích với API hiện tại:

```typescript
import { Button } from "~/components/atoms/Button";

// Sử dụng với custom variants (backward compatible)
<Button variant="primary" size="md">Click me</Button>

// Hoặc sử dụng Radix Themes variants trực tiếp
<Button variant="solid" size="3" color="blue" radius="large">
  Click me
</Button>

// Với loading state
<Button loading variant="solid">Loading...</Button>

// Với asChild pattern
<Button asChild variant="outline">
  <Link to="/page">Go to Page</Link>
</Button>
```

**Các props hỗ trợ của Radix Themes Button:**

- `variant`: "solid" | "soft" | "surface" | "outline" | "classic" | "ghost"
- `size`: "1" | "2" | "3" | "4" (hoặc "sm", "md", "lg" - được map tự động)
- `color`: "gray" | "blue" | "green" | "red" | "yellow" | và nhiều màu khác
- `radius`: "none" | "small" | "medium" | "large" | "full"
- `loading`: boolean - Hiển thị loading spinner
- `asChild`: boolean - Merge props với child component
- `highContrast`: boolean - Tăng độ tương phản màu

Xem thêm: [Radix UI Themes Button Documentation](https://www.radix-ui.com/themes/docs/components/button)

#### Cài đặt Radix UI Component mới

Khi cần sử dụng component Radix UI mới:

```bash
# Ví dụ: cài đặt Accordion
pnpm add @radix-ui/react-accordion
```

#### Tạo Wrapper Component với Radix UI

Luôn tạo wrapper component trong `app/components/atoms/` để:

- Kiểm soát styling với Tailwind CSS
- Đảm bảo consistent API
- Thêm TypeScript types rõ ràng
- Tích hợp với design system của dự án

**Ví dụ: Dialog Component**

```typescript
// app/components/atoms/Dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const Dialog = ({ children, open, onOpenChange, trigger }: DialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}
      {children}
    </DialogPrimitive.Root>
  );
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(
  ({ title, description, children, className = "", ...props }, ref) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          ref={ref}
          className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg ${className}`}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export { Dialog, DialogContent };
```

**Ví dụ: DropdownMenu Component**

```typescript
// app/components/atoms/DropdownMenu.tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import React from "react";

const DropdownMenu = ({
  children,
  trigger,
  open,
  onOpenChange,
}: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      {children}
    </DropdownMenuPrimitive.Root>
  );
};

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, className = "", ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        className={`z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className}`}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem };
```

#### Sử dụng Radix UI Components

**Sử dụng Dialog:**

```typescript
import { Dialog, DialogContent, DialogHeader } from "~/components/atoms/Dialog";
import { Button } from "~/components/atoms/Button";

export function MyComponent() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} trigger={<Button>Open</Button>}>
      <DialogContent title="Dialog Title" description="Dialog description">
        <p>Dialog content here</p>
      </DialogContent>
    </Dialog>
  );
}
```

**Sử dụng DropdownMenu:**

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/atoms/DropdownMenu";
import { Button } from "~/components/atoms/Button";

export function MyComponent() {
  return (
    <DropdownMenu trigger={<Button>Menu</Button>}>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Item 1")}>
          Item 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Item 2")}>
          Item 2
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### Best Practices với Radix UI

1. **Luôn sử dụng `asChild` prop** khi có thể để merge props với child component:

   ```typescript
   <DialogPrimitive.Trigger asChild>
     <Button>Open</Button>
   </DialogPrimitive.Trigger>
   ```

2. **Sử dụng `forwardRef`** cho components cần ref forwarding:

   ```typescript
   const Component = React.forwardRef<HTMLDivElement, Props>(
     ({ className, ...props }, ref) => {
       // Implementation
     }
   );
   Component.displayName = "Component";
   ```

3. **Leverage data attributes** cho styling với Radix UI state:

   ```typescript
   className = "data-[state=open]:animate-in data-[state=closed]:animate-out";
   ```

4. **Accessibility**: Radix UI đã xử lý accessibility, nhưng luôn đảm bảo:
   - Có `sr-only` labels cho screen readers
   - Proper keyboard navigation
   - Focus management

5. **Styling**: Sử dụng Tailwind CSS với data attributes từ Radix UI:
   ```typescript
   className = "data-[state=open]:bg-blue-500 data-[disabled]:opacity-50";
   ```

#### Components đã có sẵn

Dự án đã có các Radix UI wrapper components trong `app/components/atoms/`:

- `Dialog.tsx` - Dialog/Modal component
- `DropdownMenu.tsx` - Dropdown menu component (có thể tạo thêm nếu cần)

Khi cần component mới, tạo file mới trong `app/components/atoms/` theo pattern trên.

#### Tài liệu tham khảo

- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Radix UI Components](https://www.radix-ui.com/primitives/docs/components)
- [Lucide Icons](https://lucide.dev/)

---

## 6. Quy trình Development

### Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
# App runs at http://localhost:5173
```

### Trước khi commit

```bash
# Run all checks
pnpm check-all

# Or individually:
pnpm lint      # Check linting
pnpm lint:fix  # Auto-fix linting issues
pnpm format    # Format code
pnpm typecheck # Type checking
```

### Build Production

```bash
pnpm build
pnpm start
```

---

## 7. Các task thường gặp

### 7.1. Tạo Page mới

1. **Tạo file page** trong `app/pages/`:

```typescript
// app/pages/about.tsx
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1>{t("about.title")}</h1>
    </div>
  );
}
```

2. **Thêm route** vào `app/routes.ts`:

```typescript
route("/about", "./pages/about.tsx"),
```

3. **Thêm translations** vào `en.json` và `ja.json`.

### 7.2. Tạo Component mới

#### Atom Component

```typescript
// app/components/atoms/Button.tsx
type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  label,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition-colors ${className} ${
        variant === "primary"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
    >
      {label}
    </button>
  );
}
```

### 7.3. Tạo Form với Validation

1. **Tạo schema** trong `app/utils/validation/schema/`:

```typescript
// app/utils/validation/schema/user.schema.ts
export const createUserSchema = (t: TFunction) => {
  const baseSchemas = createValidationSchemas(t);
  return v.pipe(
    v.object({
      name: v.pipe(baseSchemas.requiredString("Name")),
      email: v.pipe(v.string(), v.email(t("validation.emailInvalid"))),
    })
  );
};
```

2. **Sử dụng trong component**:

```typescript
const form = useForm({
  defaultValues: { name: "", email: "" },
  validators: {
    onSubmit: createUserSchema(t),
  },
});
```

### 7.4. Thêm Language mới

1. **Tạo file locale**: `app/locale/vi.json`
2. **Import vào** `app/utils/i18n.ts`:

```typescript
import viTranslations from "../locale/vi.json";

const resources = {
  // ... existing
  vi: { translation: viTranslations },
};
```

3. **Update language switcher** nếu cần.

---

## 8. Checklist hoàn thành

Trước khi mark task là complete, đảm bảo:

### Code Quality

- [ ] Code pass ESLint (`pnpm lint`)
- [ ] Code đã format với Prettier (`pnpm format`)
- [ ] TypeScript không có lỗi (`pnpm typecheck`)
- [ ] Không sử dụng `any` type (trừ khi thật sự cần)
- [ ] Tất cả imports đều được sử dụng

### Functionality

- [ ] Component hoạt động đúng như mong đợi
- [ ] Form validation hoạt động (nếu có)
- [ ] i18n keys đã thêm vào cả `en.json` và `ja.json`
- [ ] Error handling đã implement
- [ ] Loading states đã handle

### Code Organization

- [ ] Component đặt đúng directory (atoms/molecules/organism)
- [ ] Page component đặt trong `app/pages/`
- [ ] Routes đã config trong `app/routes.ts`
- [ ] Exports đúng structure

### Testing

- [ ] Đã test manual trong browser
- [ ] Test responsive (different screen sizes)
- [ ] Test i18n (different languages)

### Documentation

- [ ] Code comments cho logic phức tạp
- [ ] Type definitions rõ ràng
- [ ] Component props documented (nếu tạo component mới)

### Best Practices

- [ ] Follow Atomic Design pattern
- [ ] Sử dụng TanStack Form cho forms
- [ ] Sử dụng Valibot cho validation
- [ ] Sử dụng Tailwind CSS cho styling
- [ ] Sử dụng `useTranslation` cho i18n
- [ ] Date utilities dùng từ `app/utils/date.ts`

---

## Tài liệu tham khảo

- [React Router v7 Docs](https://reactrouter.com/)
- [TanStack Form Docs](https://tanstack.com/form)
- [Valibot Docs](https://valibot.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [React i18next Docs](https://react.i18next.com/)
- [Day.js Docs](https://day.js.org/)

---

**Lưu ý**: Tài liệu này sẽ được cập nhật khi có thay đổi trong dự án. Luôn kiểm tra memory files trong Serena để có thông tin mới nhất.
