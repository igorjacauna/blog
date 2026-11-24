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
  <div class="w-full h-full flex flex-col justify-between p-[72px]" style="background-color: #fbfaf5; color: #22211f; background-image: radial-gradient(#d9d5ca 2px, transparent 2px); background-size: 36px 36px;">
    <div class="flex items-center justify-between">
      <div class="text-[52px] font-bold" style="font-family: Caveat; color: #22211f;">
        igor jacaúna
      </div>
      <div class="text-[26px]" style="color: #6e6a61;">
        igorjacauna.com.br
      </div>
    </div>
    <div class="flex flex-col gap-6">
      <div class="text-[84px]" style="font-family: 'Instrument Serif'; line-height: 1.02;">
        {{ title }}
      </div>
      <div v-if="description" class="text-[30px]" style="color: #4f4c45; line-height: 1.4;">
        {{ description }}
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="text-[40px]" style="font-family: Caveat; color: #2442c4;">
        feito à mão em Manaus
      </div>
      <div v-if="date" class="text-[38px]" style="font-family: Caveat; color: #6e6a61;">
        {{ date }}<span v-if="readingTime"> · {{ readingTime }} min</span>
      </div>
    </div>
  </div>
</template>
