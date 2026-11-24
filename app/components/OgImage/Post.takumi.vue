<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  date?: string
  readingTime?: number
}>(), {
  title: 'Igor Jacaúna',
})
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between p-[72px]" style="background-color: #0c0f0f; color: #f4f4f5;">
    <div class="flex items-center gap-5">
      <div class="flex items-center justify-center w-[64px] h-[64px] rounded-[16px] text-[32px] font-bold" style="background-color: #0d9488; color: #ffffff;">
        ij
      </div>
      <div class="text-[30px] font-semibold" style="color: #a1a1aa;">
        igorjacauna.com.br
      </div>
    </div>
    <div class="flex flex-col gap-6">
      <div class="text-[68px] font-bold" style="line-height: 1.1; letter-spacing: -0.02em;">
        {{ title }}
      </div>
      <div v-if="description" class="text-[30px]" style="color: #a1a1aa; line-height: 1.4;">
        {{ description }}
      </div>
    </div>
    <div class="flex items-center justify-between text-[26px]" style="color: #71717a;">
      <div>Igor Jacaúna</div>
      <div v-if="date">
        {{ date }}<span v-if="readingTime"> · {{ readingTime }} min de leitura</span>
      </div>
    </div>
  </div>
</template>
