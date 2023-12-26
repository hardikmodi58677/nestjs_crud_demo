import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if(!request.user) return false
    const user = request.user;
    const requiredRoles = this.reflector.get<Role>(ROLES_KEY, context.getHandler());
    if(requiredRoles.includes(user.role)) return true
    return false
  }
}