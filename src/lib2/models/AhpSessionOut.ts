/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AhpSessionOut = {
    id: string;
    name: string;
    criteria: Array<Record<string, any>>;
    comparison_matrix: Array<Array<number>>;
    criteria_weights: Array<number>;
    consistency_ratio: string;
    is_consistent: boolean;
    task_scores: Record<string, number>;
    applied_to_tasks: boolean;
    created_by_id: (string | null);
    created_at: string;
};

