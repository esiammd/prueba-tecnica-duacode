import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ActiveDuacoder = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.duacoder;
  },
);
