/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuditLogOut = {
    id: string;
    actor_id: (string | null);
    actor_email: (string | null);
    actor_role: (string | null);
    action: string;
    resource_type: string;
    resource_id: (string | null);
    ip_address: (string | null);
    details: (Record<string, any> | null);
    created_at: string;
};

