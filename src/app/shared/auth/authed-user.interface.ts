import { UserRole } from "./user-role.interface";

export interface AuthedUser {
    email: string;
    name: string;
    isVerified: boolean;
    roles: UserRole[];
}
