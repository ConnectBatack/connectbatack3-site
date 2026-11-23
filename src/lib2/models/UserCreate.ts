/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type UserCreate = {
    email: string;
    full_name: string;
    role: UserRole;
    password: string;
    must_change_password?: boolean;
};

