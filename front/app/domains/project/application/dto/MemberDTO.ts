export interface MemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner?: boolean;
  joinedAt?: string;
  avatarUrl?: string;
}
