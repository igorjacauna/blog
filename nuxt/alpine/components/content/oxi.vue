<script setup lang="ts">
type AlertProps = {
  type: string
}
defineProps<AlertProps>();
</script>
<template>
  <div class="alert" :class="type">
    <ContentSlot :use="$slots.default" unwrap="p" />
  </div>
</template>
<style>
:root {
  --info-bg: $dt('color.blue.300');
  --info-color: $dt('color.blue.700');
  --info-border: $dt('color.blue.500');

  --warning-bg: $dt('color.yellow.300');
  --warning-color: $dt('color.yellow.700');
  --warning-border: $dt('color.yellow.500');

  --danger-bg: $dt('color.red.300');
  --danger-color: $dt('color.red.700');
  --danger-border: $dt('color.red.500');
}

.dark {
  --info-bg: $dt('color.blue.700');
  --info-color: $dt('color.blue.300');
  --info-border: $dt('color.blue.500');

  --warning-bg: $dt('color.yellow.700');
  --warning-color: $dt('color.yellow.300');
  --warning-border: $dt('color.yellow.500');

  --danger-bg: $dt('color.red.700');
  --danger-color: $dt('color.red.300');
  --danger-border: $dt('color.red.500');
}
</style>
<style scoped lang="postcss">
.alert {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 16px 16px 8px;
  line-height: 24px;
  font-size: 14px;
  margin: 24px 0;

  &.info {
    border-color: var(--info-border);
    color: var(--info-color);
    background-color: var(--info-bg);
  }

  &.warning {
    border-color: var(--warning-border);
    color: var(--warning-color);
    background-color: var(--warning-bg);
  }

  &.danger {
    border-color: var(--danger-border);
    color: var(--danger-color);
    background-color: var(--danger-bg);
  }
}
</style>
<style>
.alert-title {
  font-weight: 700;
}

.alert p + p {
  margin: 8px 0;
}

.alert.details summary {
  margin: 0 0 8px;
  font-weight: 700;
}

.alert.details summary + p {
  margin: 8px 0;
}

.alert a {
  color: inherit;
  font-weight: 600;
  text-decoration: underline;
  transition: opacity 0.25s;
}

.alert a:hover {
  opacity: 0.6;
}
</style>