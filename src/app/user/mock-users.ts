import { AuthedUser } from "../shared/auth/authed-user.interface";
import { UserRole } from "../shared/auth/user-role.interface";

export const mockAuthUsers: AuthedUser[] = [
    {
        email: 'test@test.com',
        name: 'Test Test',
        isVerified: true,
        roles: [UserRole.User]
    },
    {
        email: 'test2@test.com',
        name: 'Test2 Test2',
        isVerified: false,
        roles: [UserRole.Admin]
    },
];