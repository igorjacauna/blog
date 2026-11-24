<script setup lang="ts">
withDefaults(defineProps<{ type?: 'info' | 'warning' | 'success' | 'danger' }>(), { type: 'info' })

const icons = {
  info: 'i-ph-info',
  warning: 'i-ph-warning',
  success: 'i-ph-check-circle',
  danger: 'i-ph-warning-octagon',
}
</script>

<template>
  <div class="alert not-prose" :class="`alert-${type}`" role="note">
    <span :class="icons[type]" class="alert-icon" aria-hidden="true" />
    <div class="alert-body">
      <slot mdc-unwrap="p" />
    </div>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 0.85rem 1rem;
  border-left: 3px solid var(--alert-color);
  border-radius: 0 0.5rem 0.5rem 0;
  background: color-mix(in srgb, var(--alert-color) 8%, transparent);
  color: var(--fg);
  font-size: 0.95rem;
  line-height: 1.6;
}
.alert-icon {
  flex: none;
  margin-top: 0.2rem;
  color: var(--alert-color);
}
.alert-body :deep(a) {
  text-decoration: underline;
}
.alert-info { --alert-color: #3b82f6; }
.alert-warning { --alert-color: #d97706; }
.alert-success { --alert-color: #16a34a; }
.alert-danger { --alert-color: #dc2626; }
</style>
