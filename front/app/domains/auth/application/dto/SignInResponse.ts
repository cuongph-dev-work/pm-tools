export interface SignInResponse {
  iat: number;
  exp: number;
  sub: number;
  access_token: string;
  refresh_token: string;
}
