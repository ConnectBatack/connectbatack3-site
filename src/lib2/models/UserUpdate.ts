/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type UserUpdate = {
    full_name?: (string | null);
    email?: (string | null);
    phone?: (string | null);
    role?: (UserRole | null);
    is_active?: (boolean | null);
    must_change_password?: (boolean | null);
};

