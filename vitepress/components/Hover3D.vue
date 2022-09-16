<script lang="ts" setup>
import { useMouseInElement } from '@vueuse/core'
import { computed, ref } from 'vue'
const cardRef = ref(null)

const { elementHeight, elementWidth, elementX, elementY, isOutside } = useMouseInElement(cardRef)

const transformElement = computed(() => {
  const ROTATION = 16
  const rX = (ROTATION / 2 - (elementY.value / elementHeight.value) * ROTATION).toFixed()
  const rY = (ROTATION / 2 - (elementX.value / elementWidth.value) * ROTATION).toFixed()

  if (isOutside.value) return ''

  return `perspective(${elementWidth.value / 2}px) rotateX(${rX}deg) rotateY(${rY}deg)`
})
</script>
<template>
  <div class="card" ref="cardRef">
    <div class="card-title">
      Phil'sosophies
    </div>
    <div class="card-body">
      Dance Until Your Feet Hurt, Sing Until Your Lungs Hurt, Act Until You're William Hurt.
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 12px;
  background-color: var(--vp-c-gray-dark-1);
  max-width: 300px;
  border-radius: 8px;
  transform: v-bind(transformElement);
  transition: transform 0.25s ease-out;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
}

.card-body {
  margin-top: 24px;
}
</style>