import { v4 as uuidv4 } from "uuid";
import type { Tag } from "~/shared/components/atoms/TagInput";
import {
  ProjectEntity,
  type ProjectOwner,
} from "../../domain/entities/Project";
import { ProjectListItemEntity } from "../../domain/entities/ProjectListItem";
import type {
  CreateProjectFormData,
  UpdateProjectFormData,
} from "../../domain/validation/project.schema";
import type { MemberDTO, MemberResponseDTO } from "../dto/MemberDTO";
import type {
  CreateProjectRequestDTO,
  ProjectDTO,
  ProjectListItemDTO,
  ProjectOwnerDTO,
  UpdateProjectRequestDTO,
} from "../dto/ProjectDTO";

export class ProjectMapper {
  // Helper: Convert API string[] tags to Tag[] for form
  private static tagsToTagObjects(tags?: string[]): Tag[] {
    if (!tags || tags.length === 0) return [];
    return tags.map(tag => ({
      id: uuidv4(),
      value: tag,
    }));
  }

  // Helper: Convert Tag[] to comma-separated string for API
  private static tagObjectsToString(tags?: Tag[]): string | undefined {
    if (!tags || tags.length === 0) return undefined;
    return tags.map(tag => tag.value).join(", ");
  }

  // List Item DTO to List Item Entity
  static toListItemEntity(dto: ProjectListItemDTO): ProjectListItemEntity {
    return new ProjectListItemEntity({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      tags: dto.tags,
      status: dto.status,
      startDate: dto.start_date,
      endDate: dto.end_date,
      owner: this.mapOwner(dto.owner),
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      memberCount: dto.member_count,
      inviteCount: dto.invite_count,
    });
  }

  // DTO to Entity (for detail with member_count and invite_count)
  static toEntity(dto: ProjectDTO): ProjectEntity {
    return new ProjectEntity({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      tags: dto.tags,
      status: dto.status,
      startDate: dto.start_date,
      endDate: dto.end_date,
      owner: this.mapOwner(dto.owner),
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      memberCount: dto.member_count,
      inviteCount: dto.invite_count,
    });
  }

  // Entity to DTO
  static toDTO(entity: ProjectEntity): ProjectDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      tags: entity.tags,
      status: entity.status,
      start_date: entity.startDate,
      end_date: entity.endDate,
      owner: this.mapOwnerToDTO(entity.owner),
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      member_count: entity.memberCount,
      invite_count: entity.inviteCount,
    };
  }

  // Form Data to Create Request DTO
  static toCreateRequestDTO(
    formData: CreateProjectFormData
  ): CreateProjectRequestDTO {
    return {
      name: formData.name,
      description: formData.description,
      tags: this.tagObjectsToString(formData.tags),
      start_date: formData.startDate,
      end_date: formData.endDate,
    };
  }

  // Form Data to Update Request DTO
  static toUpdateRequestDTO(
    formData: UpdateProjectFormData
  ): UpdateProjectRequestDTO {
    return {
      name: formData.name,
      description: formData.description,
      tags: this.tagObjectsToString(formData.tags),
      status: formData.status,
      start_date: formData.startDate,
      end_date: formData.endDate,
    };
  }

  // DTO to Form Data (for editing)
  static toUpdateFormData(dto: ProjectDTO): UpdateProjectFormData {
    return {
      name: dto.name,
      description: dto.description,
      tags: this.tagsToTagObjects(dto.tags),
      status: dto.status,
      startDate: dto.start_date || "",
      endDate: dto.end_date || "",
    };
  }

  // Helper: Map Owner DTO to Domain
  private static mapOwner(dto: ProjectOwnerDTO): ProjectOwner {
    return {
      id: dto.id,
      email: dto.email,
      firstName: dto.first_name,
      lastName: dto.last_name,
      fullName: dto.fullName,
    };
  }

  // Helper: Map Owner Domain to DTO
  private static mapOwnerToDTO(owner: ProjectOwner): ProjectOwnerDTO {
    return {
      id: owner.id,
      email: owner.email,
      first_name: owner.firstName,
      last_name: owner.lastName,
      fullName: owner.fullName,
    };
  }

  // Batch mapping for list items
  static toListItemEntityList(
    dtos: ProjectListItemDTO[]
  ): ProjectListItemEntity[] {
    return dtos.map(dto => this.toListItemEntity(dto));
  }

  // Batch mapping for detail entities
  static toEntityList(dtos: ProjectDTO[]): ProjectEntity[] {
    return dtos.map(dto => this.toEntity(dto));
  }

  static toDTOList(entities: ProjectEntity[]): ProjectDTO[] {
    return entities.map(entity => this.toDTO(entity));
  }

  // Member Response DTO to Member DTO
  static toMemberDTO(dto: MemberResponseDTO, ownerId?: string): MemberDTO {
    return {
      id: dto.id,
      name: dto.user.fullName,
      email: dto.user.email,
      role: dto.role,
      status: dto.status,
      isOwner: ownerId ? dto.user.id === ownerId : undefined,
      joinedAt: dto.joined_at,
      leftAt: dto.left_at,
      avatarUrl: undefined, // TODO: Add avatar_url if available in API
    };
  }

  // Batch mapping for members
  static toMemberDTOList(
    dtos: MemberResponseDTO[],
    ownerId?: string
  ): MemberDTO[] {
    return dtos.map(dto => this.toMemberDTO(dto, ownerId));
  }
}
