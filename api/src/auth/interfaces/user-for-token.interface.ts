import { Role } from '@prisma/client';

export interface UserForToken {
    id: string;
    email: string;
    role: Role;
}
