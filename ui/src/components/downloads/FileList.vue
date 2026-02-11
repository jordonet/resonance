<script setup lang="ts">
import type { SlskdFile, DirectoryGroup } from '@/types';

import { computed } from 'vue';
import { formatBytes } from '@/utils/formatters';

interface Props {
  directories: DirectoryGroup[];
}

const props = defineProps<Props>();

const totalFiles = computed(() => props.directories.reduce((sum, dir) => sum + dir.files.length, 0));

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  return ext.toUpperCase();
}

function getFileName(file: SlskdFile): string {
  const parts = file.filename.replace(/\\/g, '/').split('/');

  return parts[parts.length - 1] || file.filename;
}

function formatDuration(seconds?: number): string {
  if (!seconds) {
    return '-';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${ mins }:${ secs.toString().padStart(2, '0') }`;
}
</script>

<template>
  <div class="file-list">
    <div v-for="dir in directories" :key="dir.path" class="file-list__directory">
      <div v-if="directories.length > 1" class="file-list__dir-header">
        <i class="pi pi-folder text-surface-400" />
        <span class="file-list__dir-path">{{ dir.path.split('/').pop() }}</span>
        <span class="file-list__dir-count">({{ dir.files.length }} files)</span>
      </div>

      <div class="file-list__files">
        <div v-for="file in dir.files" :key="file.filename" class="file-list__file">
          <div class="file-list__file-name">
            <span class="file-list__ext">{{ getFileExtension(file.filename) }}</span>
            <span class="file-list__name">{{ getFileName(file) }}</span>
          </div>
          <div class="file-list__file-meta">
            <span v-if="file.bitRate" class="file-list__bitrate">{{ file.bitRate }}kbps</span>
            <span v-if="file.length" class="file-list__duration">{{ formatDuration(file.length) }}</span>
            <span class="file-list__size">{{ formatBytes(file.size || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="file-list__summary">
      {{ totalFiles }} file(s) total
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-list {
  font-size: 0.875rem;

  &__directory {
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__dir-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--surface-700);
    margin-bottom: 0.5rem;
  }

  &__dir-path {
    font-weight: 500;
    color: var(--surface-200);
  }

  &__dir-count {
    color: var(--surface-400);
    font-size: 0.75rem;
  }

  &__files {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem 0.5rem;
    background: var(--surface-800);
    border-radius: 4px;
  }

  &__file-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
  }

  &__ext {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    background: var(--surface-700);
    border-radius: 3px;
    color: var(--surface-300);
    flex-shrink: 0;
  }

  &__name {
    color: var(--surface-200);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__file-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--surface-400);
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  &__summary {
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--surface-700);
    color: var(--surface-400);
    font-size: 0.75rem;
    text-align: right;
  }
}
</style>
