import { Administrator } from '@entities/administrator.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdministratorRepository } from './administrator.repository';
import { CreateAdministratorDto } from './dtos/create-administrator.dto';
import { UpdateAdministratorDto } from './dtos/update-administrator.dto';

@Injectable()
export class AdministratorService {
  constructor(private readonly repository: AdministratorRepository) {}

  async create(createDto: CreateAdministratorDto): Promise<{ id: string }> {
    const existingAdmin = await this.repository.findByEmail(createDto.email);
    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    return await this.repository.createNewAdministrator({
      ...createDto,
      password: hashedPassword,
    });
  }

  async findAll(query: any) {
    return await this.repository.getAdministrators(query);
  }

  async findById(id: string): Promise<Administrator> {
    const admin = await this.repository.findById(id);
    if (!admin) {
      throw new NotFoundException('Administrator not found');
    }
    return admin;
  }

  async update(
    id: string,
    updateDto: UpdateAdministratorDto,
  ): Promise<{ id: string }> {
    const admin = await this.findById(id);

    if (updateDto.email && updateDto.email !== admin.email) {
      const existingAdmin = await this.repository.findByEmail(updateDto.email);
      if (existingAdmin) {
        throw new ConflictException('Email already exists');
      }
    }

    return await this.repository.updateAdministrator(admin, updateDto);
  }

  async delete(id: string): Promise<void> {
    const admin = await this.findById(id);
    await this.repository.deleteAdministrator(admin);
  }
}
