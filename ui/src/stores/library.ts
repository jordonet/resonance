import type {
  LibraryOrganizeConfig,
  LibraryOrganizeStatus,
  OrganizeProgress,
  UnorganizedTask,
} from '@/types';

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import * as libraryApi from '@/services/library';
import { useToast } from '@/composables/useToast';

export const useLibraryStore = defineStore('library', () => {
  const { showSuccess, showError } = useToast();

  const status = ref<LibraryOrganizeStatus | null>(null);
  const config = ref<LibraryOrganizeConfig | null>(null);

  const unorganizedTasks = ref<UnorganizedTask[]>([]);
  const unorganizedTotal = ref(0);

  const loading = ref(false);
  const configLoading = ref(false);
  const savingConfig = ref(false);
  const organizing = ref(false);

  const limit = ref(20);
  const offset = ref(0);
  const hasMoreUnorganized = computed(() => unorganizedTasks.value.length < unorganizedTotal.value);

  const organizeProgress = ref<OrganizeProgress | null>(null);
  const error = ref<string | null>(null);

  async function fetchStatus() {
    loading.value = true;
    error.value = null;

    try {
      status.value = await libraryApi.getOrganizeStatus();
    } catch(e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch library status';
    } finally {
      loading.value = false;
    }
  }

  async function fetchConfig() {
    configLoading.value = true;
    error.value = null;

    try {
      config.value = await libraryApi.getOrganizeConfig();
    } catch(e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch library configuration';
    } finally {
      configLoading.value = false;
    }
  }

  async function updateConfig(next: LibraryOrganizeConfig) {
    savingConfig.value = true;
    error.value = null;

    try {
      config.value = await libraryApi.updateOrganizeConfig(next);
      showSuccess('Library configuration saved');
      await fetchStatus();
    } catch(e) {
      const message = e instanceof Error ? e.message : 'Failed to save library configuration';

      error.value = message;
      showError('Failed to save configuration', message);
      throw e;
    } finally {
      savingConfig.value = false;
    }
  }

  async function fetchUnorganizedTasks(append = false) {
    loading.value = true;
    error.value = null;

    try {
      const requestOffset = append ? offset.value : 0;
      const response = await libraryApi.getUnorganizedTasks(limit.value, requestOffset);

      if (append) {
        unorganizedTasks.value = [...unorganizedTasks.value, ...response.items];
      } else {
        unorganizedTasks.value = response.items;
        offset.value = 0;
      }
      unorganizedTotal.value = response.total;
    } catch(e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch unorganized tasks';
    } finally {
      loading.value = false;
    }
  }

  function loadMoreUnorganized() {
    offset.value += limit.value;

    return fetchUnorganizedTasks(true);
  }

  async function triggerOrganize() {
    organizing.value = true;
    error.value = null;

    try {
      const response = await libraryApi.triggerOrganize();

      if (response.success) {
        showSuccess('Library organize started', response.message);
      } else {
        showError('Failed to start library organize', response.message);
      }

      await fetchStatus();
    } catch(e) {
      const message = e instanceof Error ? e.message : 'Failed to start library organize';

      error.value = message;
      showError('Failed to start library organize', message);
      throw e;
    }
  }

  function setOrganizeProgress(progress: OrganizeProgress) {
    organizeProgress.value = progress;
  }

  function clearOrganizeProgress() {
    organizeProgress.value = null;
    organizing.value = false;
  }

  function reset() {
    status.value = null;
    config.value = null;
    unorganizedTasks.value = [];
    unorganizedTotal.value = 0;
    limit.value = 20;
    offset.value = 0;
    loading.value = false;
    configLoading.value = false;
    savingConfig.value = false;
    organizing.value = false;
    organizeProgress.value = null;
    error.value = null;
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
    hasMoreUnorganized,
    organizeProgress,
    error,
    limit,
    offset,

    fetchStatus,
    fetchConfig,
    updateConfig,
    fetchUnorganizedTasks,
    loadMoreUnorganized,
    triggerOrganize,

    setOrganizeProgress,
    clearOrganizeProgress,
    reset,
  };
});

