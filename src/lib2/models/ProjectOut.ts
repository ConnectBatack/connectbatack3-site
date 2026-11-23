/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectStatus } from './ProjectStatus';
export type ProjectOut = {
    id: string;
    slug: string;
    category: Record<string, string>;
    title: Record<string, string>;
    tagline: Record<string, string>;
    description: Record<string, string>;
    photo_id: (string | null);
    photo_slug: (string | null);
    photo_url?: (string | null);
    target_amount_eur: string;
    collected_amount_eur: string;
    contributors_count: number;
    progress_percent?: number;
    is_featured_need: boolean;
    display_order: number;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
};

