<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useCounterStore } from "@/stores/counter";
const useCounter = useCounterStore();
onMounted(() => {
  useCounter.queryHomeInfo({});
});
const includeList: any = ref([]);
const route = useRoute();
// const router = useRouter()
watch(
  () => route,
  (newVal) => {
    if (
      newVal.meta.keepAlive &&
      includeList.value.indexOf(newVal.name) === -1
    ) {
      includeList.value.push(newVal.name);
    }
  },
  { deep: true }
);
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="includeList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped></style>
