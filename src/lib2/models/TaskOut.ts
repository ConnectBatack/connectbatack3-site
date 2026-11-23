/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskStatus } from './TaskStatus';
export type TaskOut = {
    id: string;
    code_id: number;
    project_id: (string | null);
    label: string;
    cost_eur: string;
    duration_months: number;
    weight: string;
    status: TaskStatus;
    predecessor_code_ids?: Array<number>;
    created_at: string;
    updated_at: string;
};

