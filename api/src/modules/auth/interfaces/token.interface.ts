export class TokenPayload {
  sub: string; // subject (user ID)
  email: string;
  role: string;
  iat?: number; // issued at
  exp?: number; // expiration time
  jti?: string; // JWT ID
  iss?: string; // issuer
  aud?: string; // audience
  avatarUrl?: string; // optional user avatar
}
