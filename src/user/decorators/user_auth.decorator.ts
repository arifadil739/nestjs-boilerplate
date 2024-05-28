import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';

export const AuthUser = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
