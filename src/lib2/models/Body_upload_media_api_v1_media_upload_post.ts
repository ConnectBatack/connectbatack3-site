/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCategory } from './MediaCategory';
export type Body_upload_media_api_v1_media_upload_post = {
    file: string;
    category?: MediaCategory;
    slug?: (string | null);
    alt_texts?: (string | null);
    captions?: (string | null);
    is_public?: (boolean | null);
};

