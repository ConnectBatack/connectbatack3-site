/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectStatus } from './ProjectStatus';
export type ProjectCreate = {
    slug?: (string | null);
    category?: Record<string, string>;
    title: Record<string, string>;
    tagline?: Record<string, string>;
    description?: Record<string, string>;
    photo_id?: (string | null);
    photo_slug?: (string | null);
    target_amount_eur: (number | string);
    is_featured_need?: boolean;
    display_order?: number;
    status?: ProjectStatus;
    source_language?: ('fr' | 'en' | 'es' | 'nl' | null);
    auto_translate?: boolean;
    overwrite_translations?: boolean;
};
