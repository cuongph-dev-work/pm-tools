// Domain-specific API endpoints for Auth
// Keep path-only strings; baseURL is configured in the axios client

export const AUTH_ENDPOINTS = {
  signIn: "/auth/sign-in",
  me: "/auth/me",
};

export type AuthEndpointKey = keyof typeof AUTH_ENDPOINTS;
