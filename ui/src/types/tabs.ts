export const SETTINGS_TABS = ['listenbrainz', 'catalog', 'slskd', 'preview', 'auth', 'ui'] as const;
export type SettingsTab = typeof SETTINGS_TABS[number];

export const DOWNLOADS_TABS = ['active', 'completed', 'failed'] as const;
export type DownloadsTab = typeof DOWNLOADS_TABS[number];

export const LIBRARY_TABS = ['unorganized', 'configuration'] as const;
export type LibraryTab = typeof LIBRARY_TABS[number];
