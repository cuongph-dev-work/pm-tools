# ⚛️ Molecules

**Molecules** are combinations of **Atoms** that form more complex components.
They begin to demonstrate **interactions** between multiple atoms.

---

## ✨ Characteristics

- Composed of multiple **Atoms** combined together.
- Have basic presentation logic while maintaining reusability.
- Examples: FormField (Label + Input), SearchBar (Input + Button).

---

## 📌 Examples

### SearchBar.tsx

```tsx
import React from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

type SearchBarProps = {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  onSearch,
}) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Input value={query} onChange={onChange} />
      <Button label="Search" onClick={onSearch} />
    </div>
  );
};
```
