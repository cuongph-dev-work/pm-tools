// Export post validation schema
export * from "./post.schema";

// Re-export common validation utilities
export * from "../common";

// Individual schema creators for post
import { createPostSchema } from "./post.schema";

import { useTranslation } from "react-i18next";

/**
 * Hook to get post-related schemas with current translation context
 * Usage: const postSchemas = usePostSchemas();
 */
export const usePostSchemas = () => {
  const { t } = useTranslation();
  return {
    post: createPostSchema(t),
  };
};
