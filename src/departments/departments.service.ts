import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type CreateDepartmentDto } from './dto/create-department.dto';
import { type UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const departmentExist = await this.departmentRepository.findOneBy({
      name: createDepartmentDto.name,
    });

    if (departmentExist) {
      throw new ConflictException('Department already exists');
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOneBy({ id });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    await this.departmentRepository.update(id, updateDepartmentDto);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    await this.departmentRepository.delete(id);
  }
}
