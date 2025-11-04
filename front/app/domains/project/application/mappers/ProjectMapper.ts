import {
  ProjectEntity,
  type ProjectOwner,
} from "../../domain/entities/Project";
import { ProjectListItemEntity } from "../../domain/entities/ProjectListItem";
import type {
  ProjectDTO,
  ProjectListItemDTO,
  ProjectOwnerDTO,
  CreateProjectRequestDTO,
  UpdateProjectRequestDTO,
} from "../dto/ProjectDTO";
import type {
  CreateProjectFormData,
  UpdateProjectFormData,
} from "../../domain/validation/project.schema";

export class ProjectMapper {
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
      tags: formData.tags,
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
      tags: formData.tags,
      status: formData.status,
      start_date: formData.startDate,
      end_date: formData.endDate,
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
}
