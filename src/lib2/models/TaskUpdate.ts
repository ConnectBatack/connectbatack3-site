/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskStatus } from './TaskStatus';
export type TaskUpdate = {
    project_id?: (string | null);
    label?: (string | null);
    cost_eur?: (number | string | null);
    duration_months?: (number | null);
    weight?: (number | string | null);
    status?: (TaskStatus | null);
    predecessor_code_ids?: (Array<number> | null);
};

