import { Injectable } from '@nestjs/common';
import { type CreateDepartmentDto } from './dto/create-department.dto';
import { type UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { type DeleteResult, Repository, type UpdateResult } from 'typeorm';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async findOne(id: string): Promise<Department> {
    return await this.departmentRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<UpdateResult> {
    return await this.departmentRepository.update(id, updateDepartmentDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.departmentRepository.delete(id);
  }
}
