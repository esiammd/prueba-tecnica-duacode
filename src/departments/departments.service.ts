import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, type ObjectLiteral, Repository } from 'typeorm';

import { type CreateDepartmentDto } from './dto/create-department.dto';
import { type UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { type DepartmentFilterDto } from './dto/department-filter.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    await this.validateDepartment(createDepartmentDto.name);

    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async findAll({
    limit,
    offset,
    ...filters
  }: DepartmentFilterDto): Promise<Department[]> {
    const { name } = filters;
    const whereObj: ObjectLiteral = {};

    if (name) {
      whereObj.name = Like(`%${name}%`);
    }

    return await this.departmentRepository
      .createQueryBuilder('department')
      .where(whereObj)
      .orderBy('department.name', 'ASC')
      .offset(offset)
      .limit(limit)
      .getMany();
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

    await this.compareDepartment(updateDepartmentDto.name, department.name);

    await this.departmentRepository.update(id, updateDepartmentDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.departmentRepository.delete(id);
  }

  private async validateDepartment(name: string): Promise<void> {
    const departmentExist = await this.departmentRepository.findOneBy({ name });

    if (departmentExist) {
      throw new ConflictException('Department already exists');
    }
  }

  private async compareDepartment(
    newDepartment: string,
    oldDepartment: string,
  ): Promise<void> {
    if (newDepartment && newDepartment !== oldDepartment) {
      const departmentExists = await this.departmentRepository.findOneBy({
        name: newDepartment,
      });

      if (departmentExists) {
        throw new ConflictException('Department belongs to another duacode');
      }
    }
  }
}
