<script setup lang="ts">
import type { LibraryOrganizeStatus } from '@/types';

import DashboardStatsCard from '@/components/dashboard/DashboardStatsCard.vue';

defineProps<{
  status: LibraryOrganizeStatus | null;
}>();
</script>

<template>
  <div class="library-stats">
    <div class="flex gap-4">
      <DashboardStatsCard
        title="Completed"
        :value="status?.completed ?? 0"
        color="teal"
        icon="pi-check"
      />

      <DashboardStatsCard
        title="Unorganized"
        :value="status?.unorganized ?? 0"
        color="orange"
        icon="pi-inbox"
        :show-pulse="(status?.unorganized ?? 0) > 0"
      />

      <DashboardStatsCard
        title="Organized"
        :value="status?.organized ?? 0"
        color="green"
        icon="pi-folder"
      />
    </div>
  </div>
</template>

<style scoped>
.library-stats {
  margin-bottom: 1.5rem;
}
</style>

