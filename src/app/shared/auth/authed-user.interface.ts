import { UserRole } from "./user-role.interface";

export interface AuthedUser {
    uid?: string;
    email: string;
    name: string;
    isVerified: boolean;
    roles: UserRole[];
}
