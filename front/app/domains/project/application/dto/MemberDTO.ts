// API Response DTO (snake_case from backend)
export interface MemberUserDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
}

export interface MemberResponseDTO {
  id: string;
  user: MemberUserDTO;
  role: string;
  status: string;
  joined_at: string;
  left_at: string | null;
  created_at: string;
}

// Domain DTO (camelCase for frontend)
export interface MemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isOwner?: boolean;
  joinedAt?: string;
  leftAt?: string | null;
  avatarUrl?: string;
}
