/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AhpCriterionIn } from './AhpCriterionIn';
export type AhpSessionSaveRequest = {
    name: string;
    criteres: Array<AhpCriterionIn>;
    curseurs?: (Record<string, number> | null);
    matrice?: (Array<Array<number>> | null);
    notes?: Record<string, number>;
    tache_ids?: Array<number>;
    apply_immediately?: boolean;
};

