import { PartialType } from '@nestjs/swagger';
import { CreateDuacoderDto } from './create-duacoder.dto';

export class UpdateDuacoderDto extends PartialType(CreateDuacoderDto) {}
