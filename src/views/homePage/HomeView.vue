<template>
  <div class="content_home">
    <headInfo :userName="useCounter.userInfo.name" type="changePassword" />
    <div class="open_box">
      <div class="open_title">
        <div class="title_text">{{ useCounter.$state.homeInfo.name }}</div>
        <div class="logout" @click="logout">
          <img class="tc_btn" src="./images/tuichu.png" alt="" />
          <div class="tc_text">退 出</div>
        </div>
      </div>
      <div class="open_btn_box" @click="go()">
        <div class="open_btn_name" v-if="useCounter.userInfo.name">
          {{ useCounter.userInfo.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import headInfo from "@/components/headInfo/headInfo.vue";
import { useCounterStore } from "@/stores/counter";
const router = useRouter();
const useCounter = useCounterStore();
console.log("🚀 ~ file: HomeView.vue:8 ~ router", router, useCounter);
const go = () => {
  router.push({
    name: "second",
    query: { categoryId: useCounter.$state?.userInfo?.id },
  });
};

const logout = () => {
  useCounter.logOut({});
};

onMounted(() => {
  useCounter.queryHomeInfo({});
});
</script>

<style scoped>
.content_home {
  background-image: url("./images/bj.png");
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  padding: 18px 16px 0 16px;
}
.open_box {
  background-image: url("./images/card.png");
  background-size: 100% 392px;
  background-repeat: no-repeat;
  margin-top: 18px;
  padding: 17px 23px 41px 23px;
  box-sizing: border-box;
}
.open_title {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 22px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 30px;
}
.title_text {
  font-size: 22px;
}
.logout {
  display: flex;
  align-items: center;
  margin-left: 19px;
}
.tc_btn {
  width: 18px;
  height: 18px;
  margin-right: 3px;
}
.tc_text {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4bb5f9;
  line-height: 22px;
}
.open_btn_box {
  background-image: url("./images/btn.png");
  background-size: 236px 278px;
  background-repeat: no-repeat;
  width: 236px;
  margin-top: 33px;
  margin-left: 32px;
  padding-top: 150px;
  padding-bottom: 81px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}
.open_btn_name {
  display: inline;
  padding: 9px;
  box-sizing: border-box;
  color: #eafbff;
  font-size: 20px;
  line-height: 28px;
}
</style>
