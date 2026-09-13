import { Pages } from '../interfaces/pages';

export const PAGE_PATHS: Record<Pages, string> = {
  [Pages.Home]: '',
  [Pages.AudioEngineering]: 'audio-engineering',
  [Pages.Software]: 'software',
  [Pages.AIDesloppification]: 'ai-desloppification',
};

const PATH_TO_PAGE: Record<string, Pages> = {
  '': Pages.Home,
  'audio-engineering': Pages.AudioEngineering,
  'detroit-audio-engineering': Pages.AudioEngineering,
  'software': Pages.Software,
  'software-lab': Pages.Software,
  'ai-desloppification': Pages.AIDesloppification,
};

/**
 * Parses the current pathname into a Pages enum, handling Vite base URL.
 */
export function getPageFromPath(
  pathname: string = typeof window !== 'undefined'
    ? window.location.pathname
    : '/',
  base: string = import.meta.env.BASE_URL || '/',
): Pages {
  const cleanBase = base.replace(/^\/+|\/+$/g, '');
  let cleanPath = pathname.replace(/^\/+|\/+$/g, '');

  if (cleanBase && cleanPath.startsWith(cleanBase)) {
    cleanPath = cleanPath.slice(cleanBase.length).replace(/^\/+/, '');
  }

  const segment = cleanPath.split('/')[0] || '';
  return PATH_TO_PAGE[segment] ?? Pages.Home;
}

/**
 * Returns the full pathname for a given page, respecting Vite base URL.
 */
export function getPathForPage(
  page: Pages,
  base: string = import.meta.env.BASE_URL || '/',
): string {
  const pagePath = PAGE_PATHS[page];
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return pagePath ? `${normalizedBase}${pagePath}` : normalizedBase;
}
