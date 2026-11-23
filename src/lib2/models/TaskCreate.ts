/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskStatus } from './TaskStatus';
export type TaskCreate = {
    code_id?: (number | null);
    project_id?: (string | null);
    label: string;
    cost_eur: (number | string);
    duration_months?: number;
    weight?: (number | string);
    status?: TaskStatus;
    predecessor_code_ids?: Array<number>;
};

