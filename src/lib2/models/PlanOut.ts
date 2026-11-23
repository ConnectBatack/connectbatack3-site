/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlanStatus } from './PlanStatus';
export type PlanOut = {
    id: string;
    name: string;
    instance_data: Record<string, any>;
    solver_result: Record<string, any>;
    status: PlanStatus;
    created_by_id: (string | null);
    validated_by_id: (string | null);
    validated_at: (string | null);
    created_at: string;
};

