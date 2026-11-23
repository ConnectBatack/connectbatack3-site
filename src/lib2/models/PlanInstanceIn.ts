/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SolverTaskIn } from './SolverTaskIn';
export type PlanInstanceIn = {
    nom?: string;
    'h': number;
    S0: number;
    Smin: number;
    delta: number;
    'D': Array<number>;
    taches: Array<SolverTaskIn>;
    precedences?: Array<Array<number>>;
    limite_temps_s?: number;
};

