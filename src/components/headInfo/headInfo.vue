<template>
  <div class="headInfo">
    <div class="flex">
      <div><img src="./images/head_.png" alt="" class="head_icon" /></div>
      <div class="userName">{{ userName }}</div>
    </div>
    <div class="btn_box" @click="onPress(type)">{{ typeMap[type] }}</div>
  </div>
</template>
<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";
import { useRouter } from "vue-router";
const router = useRouter();
const useCounter = useCounterStore();
defineProps<{
  onPress?: () => void;
  userName?: string;
  type: "logOut" | "changePassword";
}>();
const typeMap = {
  logOut: "退  出",
  changePassword: "修改密码",
};
const onPress = (type: string) => {
  if (type === "logOut") {
    useCounter.logOut();
  } else {
    router.push({ name: "editPassword" });
  }
};
</script>
<style scoped>
.headInfo {
  background-image: url("./images/info_.png");
  background-size: 100%;
  background-repeat: no-repeat;
  padding: 26px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex {
  display: flex;
  align-items: center;
}
.head_icon {
  display: block;
  height: 50px;
  width: 50px;
  margin-right: 10px;
}
.userName {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4bb5f9;
  line-height: 28px;
}
.btn_box {
  padding: 6px 13px;
  border-radius: 4px;
  border: 1px solid #4bb5f9;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4bb5f9;
  line-height: 22px;
}
</style>
