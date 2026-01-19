import type { LibraryOrganizeConfig } from '@/types';

import { computed } from 'vue';
import { useLibraryStore } from '@/stores/library';

export function useLibrary() {
  const store = useLibraryStore();

  const status = computed(() => store.status);
  const config = computed(() => store.config);

  const unorganizedTasks = computed(() => store.unorganizedTasks);
  const unorganizedTotal = computed(() => store.unorganizedTotal);

  const loading = computed(() => store.loading);
  const configLoading = computed(() => store.configLoading);
  const savingConfig = computed(() => store.savingConfig);
  const organizing = computed(() => store.organizing);

  const organizeProgress = computed(() => store.organizeProgress);
  const hasMoreUnorganized = computed(() => store.hasMoreUnorganized);
  const error = computed(() => store.error);

  async function fetchStatus() {
    return store.fetchStatus();
  }

  async function fetchConfig() {
    return store.fetchConfig();
  }

  async function updateConfig(config: LibraryOrganizeConfig) {
    return store.updateConfig(config);
  }

  async function fetchUnorganizedTasks(append = false) {
    return store.fetchUnorganizedTasks(append);
  }

  function loadMoreUnorganized() {
    return store.loadMoreUnorganized();
  }

  async function triggerOrganize() {
    return store.triggerOrganize();
  }

  function reset() {
    store.reset();
  }

  return {
    status,
    config,
    unorganizedTasks,
    unorganizedTotal,
    loading,
    configLoading,
    savingConfig,
    organizing,
    organizeProgress,
    hasMoreUnorganized,
    error,

    fetchStatus,
    fetchConfig,
    updateConfig,
    fetchUnorganizedTasks,
    loadMoreUnorganized,
    triggerOrganize,
    reset,
  };
}

