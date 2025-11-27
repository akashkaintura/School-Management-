import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SchoolGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Allow unauthenticated requests (handled by AuthGuard)
        if (!user) {
            return true;
        }

        // Super Admin can access all schools
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }

        // All other users MUST have schoolId
        if (!user.schoolId) {
            throw new ForbiddenException(
                'Your account is not associated with any school. Please contact support.',
            );
        }

        return true;
    }
}
