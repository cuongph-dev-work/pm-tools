# UI Implementation Guidelines

Hướng dẫn chi tiết để implement UI components và features trong PM Tools Frontend.

---

## 🎯 Quy Trình Implement Feature Mới

### Bước 1: Phân Tích Requirements

**Xác định rõ**:

- [ ] Feature thuộc domain nào? (auth, backlog, project, ...)
- [ ] Có cần entities mới không?
- [ ] Có cần API integration không?
- [ ] UI components nào cần thiết?
- [ ] Form handling và validation rules
- [ ] i18n keys cần thêm

### Bước 2: Domain Layer Setup

**2.1. Tạo Entity** (nếu cần):

```typescript
// app/domains/{domain}/domain/entities/{Entity}.ts
export type {Entity}Id = string;

export interface {Entity}Props {
  id: {Entity}Id;
  name: string;
  // ... other properties
  createdAt: Date;
  updatedAt: Date;
}

export class {Entity}Entity {
  private constructor(private readonly props: {Entity}Props) {}

  static create(props: {Entity}Props): {Entity}Entity {
    return new {Entity}Entity(props);
  }

  // Getters
  get id(): {Entity}Id {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  // Business methods
  public canBeDeleted(): boolean {
    // Business logic here
    return true;
  }

  public toJSON(): {Entity}Props {
    return { ...this.props };
  }
}
```

**2.2. Tạo Repository Interface**:

```typescript
// app/domains/{domain}/domain/repositories/{Entity}Repository.ts
import type { {Entity}Entity } from "../entities/{Entity}";

export interface {Entity}Repository {
  findById(id: string): Promise<{Entity}Entity | null>;
  findAll(): Promise<{Entity}Entity[]>;
  save(entity: {Entity}Entity): Promise<void>;
  delete(id: string): Promise<void>;
}
```

**2.3. Tạo Validation Schema**:

```typescript
// app/domains/{domain}/domain/validation/{domain}.schema.ts
import * as v from "valibot";
import type { TFunction } from "i18next";

export type Create{Entity}FormData = v.InferOutput<
  ReturnType<typeof createCreate{Entity}Schema>
>;

export const createCreate{Entity}Schema = (t: TFunction) => {
  return v.object({
    name: v.pipe(
      v.string(t("validation.required", { field: t("{domain}.name") })),
      v.minLength(3, t("validation.minLength", { field: t("{domain}.name"), min: 3 })),
      v.maxLength(100, t("validation.maxLength", { field: t("{domain}.name"), max: 100 }))
    ),
    description: v.optional(
      v.pipe(
        v.string(),
        v.maxLength(500, t("validation.maxLength", { field: t("{domain}.description"), max: 500 }))
      )
    ),
    // ... other fields
  });
};
```

### Bước 3: Application Layer Setup

**3.1. Tạo DTOs**:

```typescript
// app/domains/{domain}/application/dto/{Entity}DTO.ts
export interface {Entity}DTO {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface Create{Entity}Request {
  name: string;
  description?: string;
}

export interface Update{Entity}Request {
  name?: string;
  description?: string;
}
```

**3.2. Tạo Mapper**:

```typescript
// app/domains/{domain}/application/mappers/{Entity}Mapper.ts
import { {Entity}Entity } from "~/domains/{domain}/domain/entities/{Entity}";
import type { {Entity}DTO } from "../dto/{Entity}DTO";

export class {Entity}Mapper {
  static toEntity(dto: {Entity}DTO): {Entity}Entity {
    return {Entity}Entity.create({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }

  static toDTO(entity: {Entity}Entity): {Entity}DTO {
    const props = entity.toJSON();
    return {
      id: props.id,
      name: props.name,
      description: props.description,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
    };
  }

  static toDTOList(entities: {Entity}Entity[]): {Entity}DTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
```

**3.3. Tạo Use Cases**:

```typescript
// app/domains/{domain}/application/use-cases/Create{Entity}.ts
import type { {Entity}Repository } from "~/domains/{domain}/domain/repositories/{Entity}Repository";
import { {Entity}Entity } from "~/domains/{domain}/domain/entities/{Entity}";
import type { Create{Entity}Request, {Entity}DTO } from "../dto/{Entity}DTO";
import { {Entity}Mapper } from "../mappers/{Entity}Mapper";

export class Create{Entity}UseCase {
  constructor(private readonly repository: {Entity}Repository) {}

  async execute(request: Create{Entity}Request): Promise<{Entity}DTO> {
    // Create entity
    const entity = {Entity}Entity.create({
      id: crypto.randomUUID(),
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to repository
    await this.repository.save(entity);

    // Return DTO
    return {Entity}Mapper.toDTO(entity);
  }
}
```

```typescript
// app/domains/{domain}/application/use-cases/List{Entity}s.ts
export class List{Entity}sUseCase {
  constructor(private readonly repository: {Entity}Repository) {}

  async execute(): Promise<{Entity}DTO[]> {
    const entities = await this.repository.findAll();
    return {Entity}Mapper.toDTOList(entities);
  }
}
```

**3.4. Tạo Custom Hooks**:

**Query Hook**:

```typescript
// app/domains/{domain}/application/hooks/useList{Entity}sQuery.ts
import { useQuery } from "@tanstack/react-query";
import { list{Entity}sUseCase } from "../use-cases";

export function useList{Entity}sQuery() {
  return useQuery({
    queryKey: ["{entity}s"],
    queryFn: () => list{Entity}sUseCase.execute(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Mutation Hook**:

```typescript
// app/domains/{domain}/application/hooks/useCreate{Entity}Mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create{Entity}UseCase } from "../use-cases";
import type { Create{Entity}Request } from "../dto/{Entity}DTO";

export function useCreate{Entity}Mutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Create{Entity}Request) =>
      create{Entity}UseCase.execute(request),
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["{entity}s"] });
    },
  });
}
```

**Form Hook**:

```typescript
// app/domains/{domain}/application/hooks/useCreate{Entity}Form.ts
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { createCreate{Entity}Schema, type Create{Entity}FormData } from "~/domains/{domain}/domain/validation/{domain}.schema";
import { useCreate{Entity}Mutation } from "./useCreate{Entity}Mutation";

export function useCreate{Entity}Form() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreate{Entity}Mutation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    } as Create{Entity}FormData,
    validatorAdapter: valibotValidator(),
    validators: {
      onSubmit: createCreate{Entity}Schema(t),
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync(value);
        navigate("/{entity}s");
      } catch (error) {
        console.error("Failed to create {entity}:", error);
      }
    },
  });

  return {
    form,
    isSubmitting: createMutation.isPending,
    error: createMutation.error,
  };
}
```

### Bước 4: Infrastructure Layer Setup

**4.1. Define Endpoints**:

```typescript
// app/domains/{domain}/infrastructure/endpoints.ts
export const {DOMAIN}_ENDPOINTS = {
  LIST: "/{entity}s",
  GET: "/{entity}s/:id",
  CREATE: "/{entity}s",
  UPDATE: "/{entity}s/:id",
  DELETE: "/{entity}s/:id",
} as const;
```

**4.2. Implement API Repository**:

```typescript
// app/domains/{domain}/infrastructure/repositories/Api{Entity}Repository.ts
import type { {Entity}Repository } from "~/domains/{domain}/domain/repositories/{Entity}Repository";
import type { {Entity}Entity } from "~/domains/{domain}/domain/entities/{Entity}";
import type { {Entity}DTO } from "~/domains/{domain}/application/dto/{Entity}DTO";
import { {Entity}Mapper } from "~/domains/{domain}/application/mappers/{Entity}Mapper";
import { apiClient } from "~/shared/utils/api";
import { {DOMAIN}_ENDPOINTS } from "../endpoints";

export class Api{Entity}Repository implements {Entity}Repository {
  async findById(id: string): Promise<{Entity}Entity | null> {
    try {
      const response = await apiClient.get<{Entity}DTO>(
        {DOMAIN}_ENDPOINTS.GET.replace(":id", id)
      );
      return {Entity}Mapper.toEntity(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findAll(): Promise<{Entity}Entity[]> {
    const response = await apiClient.get<{Entity}DTO[]>({DOMAIN}_ENDPOINTS.LIST);
    return response.data.map((dto) => {Entity}Mapper.toEntity(dto));
  }

  async save(entity: {Entity}Entity): Promise<void> {
    const dto = {Entity}Mapper.toDTO(entity);
    await apiClient.post({DOMAIN}_ENDPOINTS.CREATE, dto);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete({DOMAIN}_ENDPOINTS.DELETE.replace(":id", id));
  }
}
```

**4.3. Create Fake Repository (cho development)**:

```typescript
// app/domains/{domain}/infrastructure/repositories/Fake{Entity}Repository.ts
import type { {Entity}Repository } from "~/domains/{domain}/domain/repositories/{Entity}Repository";
import type { {Entity}Entity } from "~/domains/{domain}/domain/entities/{Entity}";

export class Fake{Entity}Repository implements {Entity}Repository {
  private entities: Map<string, {Entity}Entity> = new Map();

  async findById(id: string): Promise<{Entity}Entity | null> {
    return this.entities.get(id) ?? null;
  }

  async findAll(): Promise<{Entity}Entity[]> {
    return Array.from(this.entities.values());
  }

  async save(entity: {Entity}Entity): Promise<void> {
    this.entities.set(entity.id, entity);
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
  }
}
```

### Bước 5: UI Layer Implementation

**5.1. Tạo Atoms** (nếu cần components mới):

```typescript
// app/shared/components/atoms/{ComponentName}.tsx
interface {ComponentName}Props {
  // Props definition
  className?: string;
}

export function {ComponentName}({ className, ...props }: {ComponentName}Props) {
  return (
    <div className={className}>
      {/* Component implementation */}
    </div>
  );
}
```

**5.2. Tạo Domain-Specific Components**:

**Card Component**:

```typescript
// app/domains/{domain}/ui/components/atoms/{Entity}Card.tsx
import { Card } from "~/shared/components/atoms/Card";
import { Button } from "~/shared/components/atoms/Button";
import type { {Entity}DTO } from "~/domains/{domain}/application/dto/{Entity}DTO";

interface {Entity}CardProps {
  {entity}: {Entity}DTO;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function {Entity}Card({ {entity}, onEdit, onDelete }: {Entity}CardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{entity}.name</h3>
      {entity}.description && (
        <p className="text-gray-600 mt-2">{entity}.description</p>
      )}

      <div className="flex gap-2 mt-4">
        {onEdit && (
          <Button variant="outline" onClick={() => onEdit({entity}.id)}>
            {t("common.edit")}
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={() => onDelete({entity}.id)}>
            {t("common.delete")}
          </Button>
        )}
      </div>
    </Card>
  );
}
```

**List Component**:

```typescript
// app/domains/{domain}/ui/components/molecules/{Entity}List.tsx
import { {Entity}Card } from "../atoms/{Entity}Card";
import type { {Entity}DTO } from "~/domains/{domain}/application/dto/{Entity}DTO";

interface {Entity}ListProps {
  {entity}s: {Entity}DTO[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function {Entity}List({ {entity}s, onEdit, onDelete }: {Entity}ListProps) {
  if ({entity}s.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t("{domain}.noItemsFound")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {{entity}s.map(({entity}) => (
        <{Entity}Card
          key={{entity}.id}
          {entity}={{entity}}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

**Form Component**:

```typescript
// app/domains/{domain}/ui/components/molecules/Create{Entity}Form.tsx
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import { FormFieldInput } from "~/shared/components/molecules/form-field/FormFieldInput";
import { FormFieldTextarea } from "~/shared/components/molecules/form-field/FormFieldTextarea";
import { useCreate{Entity}Form } from "~/domains/{domain}/application/hooks/useCreate{Entity}Form";

export function Create{Entity}Form() {
  const { t } = useTranslation();
  const { form, isSubmitting } = useCreate{Entity}Form();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="name">
        {(field) => (
          <FormFieldInput
            label={t("{domain}.name")}
            field={field}
            required
          />
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <FormFieldTextarea
            label={t("{domain}.description")}
            field={field}
            rows={4}
          />
        )}
      </form.Field>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("common.saving") : t("common.save")}
        </Button>
      </div>
    </form>
  );
}
```

**5.3. Tạo Screens**:

**List Screen**:

```typescript
// app/domains/{domain}/ui/screens/{Entity}List.tsx
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "~/shared/components/atoms/Button";
import { {Entity}List } from "../components/molecules/{Entity}List";
import { useList{Entity}sQuery } from "~/domains/{domain}/application/hooks/useList{Entity}sQuery";
import { useDelete{Entity}Mutation } from "~/domains/{domain}/application/hooks/useDelete{Entity}Mutation";

export default function {Entity}ListScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: {entity}s, isLoading, error } = useList{Entity}sQuery();
  const deleteMutation = useDelete{Entity}Mutation();

  const handleEdit = (id: string) => {
    navigate(`/{entity}s/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("{domain}.confirmDelete"))) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCreate = () => {
    navigate("/{entity}s/create");
  };

  if (isLoading) {
    return <div className="text-center py-8">{t("common.loading")}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{t("common.error")}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("{domain}.title")}</h1>
        <Button onClick={handleCreate}>
          {t("{domain}.create")}
        </Button>
      </div>

      <{Entity}List
        {entity}s={{entity}s || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

**Create/Edit Screen**:

```typescript
// app/domains/{domain}/ui/screens/Create{Entity}.tsx
import { useTranslation } from "react-i18next";
import { Card } from "~/shared/components/atoms/Card";
import { Create{Entity}Form } from "../components/molecules/Create{Entity}Form";

export default function Create{Entity}Screen() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t("{domain}.create")}</h1>

      <Card className="p-6">
        <Create{Entity}Form />
      </Card>
    </div>
  );
}
```

### Bước 6: Routing & Navigation

**6.1. Add Routes**:

```typescript
// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // ... existing routes

  route("/{entity}s", "./domains/{domain}/ui/screens/{Entity}List.tsx"),
  route(
    "/{entity}s/create",
    "./domains/{domain}/ui/screens/Create{Entity}.tsx"
  ),
  route(
    "/{entity}s/:id/edit",
    "./domains/{domain}/ui/screens/Edit{Entity}.tsx"
  ),
] satisfies RouteConfig;
```

**6.2. Add Navigation Links**:

```typescript
// app/shared/components/layout/AppSidebar.tsx (hoặc AppHeader)
<Link to="/{entity}s" className="nav-link">
  {t("{domain}.title")}
</Link>
```

### Bước 7: Internationalization

**Add Translation Keys**:

```json
// app/locale/vi.json
{
  "{domain}": {
    "title": "Tiêu đề",
    "create": "Tạo mới",
    "edit": "Chỉnh sửa",
    "delete": "Xóa",
    "confirmDelete": "Bạn có chắc muốn xóa?",
    "name": "Tên",
    "description": "Mô tả",
    "noItemsFound": "Không tìm thấy dữ liệu",
    "createdSuccessfully": "Tạo thành công",
    "updatedSuccessfully": "Cập nhật thành công",
    "deletedSuccessfully": "Xóa thành công"
  }
}
```

### Bước 8: Testing & Quality Check

```bash
# Run quality checks
pnpm check-all

# Kiểm tra:
# - ESLint: No errors
# - Prettier: Formatted correctly
# - TypeScript: No type errors
```

---

## 🎨 UI Component Patterns

### Form Field với TanStack Form

**Basic Input**:

```typescript
<form.Field name="fieldName">
  {(field) => (
    <FormFieldInput
      label={t("label")}
      field={field}
      type="text"
      placeholder={t("placeholder")}
      required
    />
  )}
</form.Field>
```

**Textarea**:

```typescript
<form.Field name="description">
  {(field) => (
    <FormFieldTextarea
      label={t("description")}
      field={field}
      rows={4}
      placeholder={t("descriptionPlaceholder")}
    />
  )}
</form.Field>
```

**Select**:

```typescript
<form.Field name="status">
  {(field) => (
    <FormFieldSelect
      label={t("status")}
      field={field}
      options={[
        { value: "todo", label: t("status.todo") },
        { value: "in-progress", label: t("status.inProgress") },
        { value: "done", label: t("status.done") },
      ]}
    />
  )}
</form.Field>
```

**Date Picker**:

```typescript
<form.Field name="dueDate">
  {(field) => (
    <FormFieldDatePicker
      label={t("dueDate")}
      field={field}
    />
  )}
</form.Field>
```

### Dialog Pattern

```typescript
import * as Dialog from "@radix-ui/react-dialog";

export function Create{Entity}Dialog({ open, onOpenChange }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">
            {t("{domain}.create")}
          </Dialog.Title>

          <Create{Entity}Form />

          <Dialog.Close className="absolute top-4 right-4">
            <X className="w-5 h-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Confirm Delete Pattern

```typescript
import { ConfirmDeleteButton } from "~/shared/components/molecules/ConfirmDeleteButton";

<ConfirmDeleteButton
  onConfirm={() => handleDelete(id)}
  title={t("{domain}.confirmDelete")}
  description={t("{domain}.confirmDeleteDescription")}
  isLoading={deleteMutation.isPending}
>
  {t("common.delete")}
</ConfirmDeleteButton>
```

### Loading State

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-gray-500">{t("common.loading")}</div>
    </div>
  );
}
```

### Error State

```typescript
if (error) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-red-500">
        {t("common.error")}: {error.message}
      </div>
    </div>
  );
}
```

### Empty State

```typescript
if (items.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <p className="text-lg mb-4">{t("{domain}.noItems")}</p>
      <Button onClick={handleCreate}>
        {t("{domain}.createFirst")}
      </Button>
    </div>
  );
}
```

---

## 🎯 Responsive Design Guidelines

### Breakpoints (Tailwind)

```typescript
// Mobile First Approach
<div className="
  w-full          // Mobile (< 640px)
  sm:w-1/2        // Small (≥ 640px)
  md:w-1/3        // Medium (≥ 768px)
  lg:w-1/4        // Large (≥ 1024px)
  xl:w-1/5        // Extra Large (≥ 1280px)
">
```

### Grid Layouts

```typescript
// Responsive grid
<div className="
  grid
  grid-cols-1       // 1 column on mobile
  md:grid-cols-2    // 2 columns on tablet
  lg:grid-cols-3    // 3 columns on desktop
  gap-4
">
```

### Flex Layouts

```typescript
// Stack on mobile, row on desktop
<div className="
  flex
  flex-col           // Column on mobile
  md:flex-row        // Row on tablet+
  gap-4
">
```

### Hidden/Show Responsive

```typescript
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>
```

---

## ✅ Implementation Checklist

Khi implement feature mới, check tất cả các items sau:

### Domain Layer

- [ ] Entity created with business logic
- [ ] Repository interface defined
- [ ] Validation schema created with i18n

### Application Layer

- [ ] DTOs defined (Request/Response)
- [ ] Mapper created (Entity ↔ DTO)
- [ ] Use cases implemented
- [ ] Query hook created (với TanStack Query)
- [ ] Mutation hook created (với TanStack Query)
- [ ] Form hook created (với TanStack Form)

### Infrastructure Layer

- [ ] Endpoints defined
- [ ] API Repository implemented
- [ ] Fake Repository created (cho dev)

### UI Layer

- [ ] Atoms created (nếu cần)
- [ ] Domain components created (Card, List, Form)
- [ ] Screens created (List, Create, Edit)
- [ ] Responsive design applied
- [ ] Loading/Error/Empty states handled

### Integration

- [ ] Routes added to `app/routes.ts`
- [ ] Navigation links added
- [ ] Translation keys added to `app/locale/vi.json`

### Quality

- [ ] `pnpm check-all` passed
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code formatted với Prettier
- [ ] Follow naming conventions
- [ ] Clean Architecture maintained

---

## 🚀 Quick Start Templates

### Minimal Feature (Read-Only List)

Nếu chỉ cần hiển thị danh sách đơn giản:

1. **Domain**: Entity + Repository Interface
2. **Application**: DTO + Mapper + ListUseCase + QueryHook
3. **Infrastructure**: API Repository
4. **UI**: Card + List + ListScreen

### Full CRUD Feature

Nếu cần đầy đủ Create/Read/Update/Delete:

1. **Domain**: Entity + Repository Interface + ValidationSchema
2. **Application**: All DTOs + Mapper + All UseCases + All Hooks
3. **Infrastructure**: API Repository + Endpoints
4. **UI**: All Components + All Screens

### Form-Heavy Feature

Nếu feature chủ yếu là forms:

1. Focus vào **ValidationSchema** (Domain)
2. **FormHook** với TanStack Form (Application)
3. **FormComponents** với FormFields (UI)
4. Reuse shared FormField components

---

## 📚 Common Pitfalls & Solutions

### ❌ Pitfall 1: Business Logic trong UI

**Wrong**:

```typescript
// In component
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  // Complex filtering logic
}, [tasks]);
```

**Right**:

```typescript
// Move to hook
const { filteredTasks } = useFilterTasks(tasks);
```

### ❌ Pitfall 2: Direct API Calls trong Component

**Wrong**:

```typescript
// In component
const handleSubmit = async () => {
  await axios.post("/api/tasks", data);
};
```

**Right**:

```typescript
// Use hook → use case → repository
const { mutate } = useCreateTaskMutation();
const handleSubmit = () => mutate(data);
```

### ❌ Pitfall 3: Hardcoded Strings

**Wrong**:

```typescript
<button>Create Task</button>
```

**Right**:

```typescript
<button>{t("task.create")}</button>
```

### ❌ Pitfall 4: Missing Error Handling

**Wrong**:

```typescript
const { data } = useQuery();
return <List items={data} />; // data might be undefined
```

**Right**:

```typescript
const { data, isLoading, error } = useQuery();
if (isLoading) return <Loading />;
if (error) return <Error />;
return <List items={data || []} />;
```

---

## 🎓 Learning Resources

### Internal References

- Check existing domains: `auth`, `backlog`, `project`
- Reuse patterns from shared components
- Follow established validation patterns

### External Resources

- [TanStack Form Docs](https://tanstack.com/form)
- [TanStack Query Docs](https://tanstack.com/query)
- [Valibot Docs](https://valibot.dev)
- [Radix UI Docs](https://www.radix-ui.com)

---

**Happy Coding! 🚀**
