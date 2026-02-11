import type { WishlistFilters, UpdateWishlistRequest, ImportItem, ExportFormat } from '@/types';

import { computed } from 'vue';

import { useWishlistStore } from '@/stores/wishlist';

export function useWishlist() {
  const store = useWishlistStore();

  const items = computed(() => store.items);
  const total = computed(() => store.total);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);
  const filters = computed(() => store.filters);
  const selectedIds = computed(() => store.selectedIds);

  const hasMore = computed(() => store.hasMore);
  const selectedCount = computed(() => store.selectedCount);
  const allSelected = computed(() => store.allSelected);
  const someSelected = computed(() => store.someSelected);

  async function fetchWishlist(append = false) {
    return store.fetchWishlist(append);
  }

  async function updateItem(id: string, data: UpdateWishlistRequest) {
    return store.updateItem(id, data);
  }

  async function deleteItem(id: string) {
    return store.deleteItem(id);
  }

  async function bulkDelete(ids?: string[]) {
    return store.bulkDelete(ids);
  }

  async function bulkRequeue(ids?: string[]) {
    return store.bulkRequeue(ids);
  }

  async function exportItems(format: ExportFormat, ids?: string[]) {
    return store.exportItems(format, ids);
  }

  async function importItems(importedItems: ImportItem[]) {
    return store.importItems(importedItems);
  }

  function isSelected(id: string) {
    return store.isSelected(id);
  }

  function toggleSelection(id: string) {
    store.toggleSelection(id);
  }

  function selectAll() {
    store.selectAll();
  }

  function clearSelection() {
    store.clearSelection();
  }

  function toggleSelectAll() {
    store.toggleSelectAll();
  }

  function isProcessing(id: string) {
    return store.isProcessing(id);
  }

  function updateFilters(newFilters: Partial<WishlistFilters>) {
    store.setFilters(newFilters);
  }

  function loadMore() {
    return store.loadMore();
  }

  function reset() {
    store.reset();
  }

  return {
    items,
    total,
    loading,
    error,
    filters,
    selectedIds,
    hasMore,
    selectedCount,
    allSelected,
    someSelected,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    toggleSelectAll,
    isProcessing,
    fetchWishlist,
    updateItem,
    deleteItem,
    bulkDelete,
    bulkRequeue,
    exportItems,
    importItems,
    updateFilters,
    loadMore,
    reset,
  };
}
