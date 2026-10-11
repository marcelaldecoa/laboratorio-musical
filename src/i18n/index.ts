import { en } from './en';
import { pt, type Dict } from './pt';

export type Lang = 'pt' | 'en';
export const DICTS: Record<Lang, Dict> = { pt, en };
export type { Dict };
