<script setup lang="ts">
  import { useVirtualList } from '@vueuse/core'

  const items = Array.from(Array(99999).keys())
  
  const { list, containerProps, wrapperProps } = useVirtualList(
    // Itens da lista
    items,
    {
      // Defimos a altura de um item para cálculo da altura do container.
      itemHeight: 22,
    },
  )
  </script>
  <template>
    <div v-bind="containerProps" style="height: 300px">
      <div v-bind="wrapperProps">
        <div v-for="item in list" :key="item.index" style="height: 22px">
          Item: {{ item.data }}
        </div>
      </div>
    </div>
  </template>