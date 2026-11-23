/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectStatus } from './ProjectStatus';
export type ProjectUpdate = {
    category?: (Record<string, string> | null);
    title?: (Record<string, string> | null);
    tagline?: (Record<string, string> | null);
    description?: (Record<string, string> | null);
    photo_id?: (string | null);
    photo_slug?: (string | null);
    target_amount_eur?: (number | string | null);
    is_featured_need?: (boolean | null);
    display_order?: (number | null);
    status?: (ProjectStatus | null);
    source_language?: ('fr' | 'en' | 'es' | 'nl' | null);
    auto_translate?: boolean;
    overwrite_translations?: boolean;
};
