# 🧩 Atoms

**Atoms** are the smallest UI components that cannot be broken down further.
They are the fundamental building blocks for creating interfaces in **Atomic Design**.

---

## ✨ Characteristics

- Simple and highly reusable.
- Minimal dependencies on other components.
- Usually HTML elements or small wrappers.

---

## 📌 Examples

### Button.tsx

```tsx
import React from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```
