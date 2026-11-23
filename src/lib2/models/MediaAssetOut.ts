/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCategory } from './MediaCategory';
export type MediaAssetOut = {
    id: string;
    slug: (string | null);
    category: MediaCategory;
    filename: string;
    original_filename: string;
    storage_path: string;
    mime_type: string;
    size_bytes: number;
    sha256: string;
    width: (number | null);
    height: (number | null);
    alt_texts: Record<string, string>;
    captions: Record<string, string>;
    is_public: boolean;
    file_url: string;
    uploaded_by_id: (string | null);
    created_at: string;
    updated_at: string;
};

