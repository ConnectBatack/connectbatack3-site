/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type UserOut = {
    id: string;
    email: string;
    full_name: string;
    phone?: (string | null);
    role: UserRole;
    is_active: boolean;
    must_change_password: boolean;
    totp_enabled: boolean;
    last_login_at: (string | null);
    created_at: string;
    updated_at: string;
};

