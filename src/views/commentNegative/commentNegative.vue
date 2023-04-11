<template>
  <div class="content_commen">
    <div class="commen_card">
      <div class="tip_text">
        <div v-for="item in totalTitleList" :key="item.key" class="tip_item">
          <img class="tip_light_icon" :src="lightMap[item.light]" alt="" />
          <div class="tip_light_text">
            {{ item.label }}({{ item.value || 0 }})
          </div>
        </div>
      </div>

      <div class="light_box">
        <div v-for="item in listData" :key="item.showDate">
          <div :class="`light_time`">
            <div>{{ item.title }}</div>
            <div>{{ item.showDate }}</div>
          </div>
          <div class="light_icon_box">
            <div v-for="ite in item.list" :key="ite.key">
              <img class="light_icon_" :src="lightMap[ite.light]" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <van-button block class="goHome" @click="router.go(-1)"
        >返回上一页</van-button
      >
      <van-button block class="goHome" @click="go_home">返回首页</van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import request from "@/api/request";
import { onDeactivated, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { nanoid } from "nanoid";
import moment from "moment";
import { useCounterStore } from "@/stores/counter";
import green from "./images/green.png";
import red from "./images/red.png";
import yellow from "./images/yellow.png";
const useCounter = useCounterStore();
const route = useRoute();
const router = useRouter();
let t: any = ref(null);
let categoryId = useCounter.$state?.userInfo?.id || route?.query.categoryId;

const lightMap: any = {
  green,
  red,
  yellow,
};

const totalTitleList: any = ref([
  { key: "normalCount", value: "", label: "正常链接", light: "green" },
  { key: "negetiveCount", value: "", label: "有负面评论的链接", light: "red" },
  { key: "noCommentCount", value: "", label: "评论为0的链接", light: "yellow" },
]);
const listData: any = ref([
  {
    title: "最近2小时",
    space: 2,
    showDate: "",

    list: [],
  },
  {
    title: "最近5小时",
    space: 5,
    showDate: "",
    list: [],
  },
  {
    title: "最近12小时",
    space: 12,
    showDate: "",
    list: [],
  },
  {
    title: "最近24小时",
    space: 24,
    showDate: "",
    list: [],
  },
]);

const shuffle = (array: Array<any>) => {
  var copy = [],
    n = array.length,
    i;
  // 如果还剩有元素。。
  while (n) {
    // 随机选取一个元素
    i = Math.floor(Math.random() * n--);
    let splice_ = array.splice(i, 1);
    // 移动到新数组中
    copy.push(splice_[0]);
  }
  return copy;
};

const querylist = () => {
  if (t.value) {
    clearTimeout(t.value);
  }
  request({
    data: { categoryId },
    url: "/commentNegativeConfig/get",
    method: "get",
  }).then(({ code, data }: any) => {
    console.log("🚀 ~ file: commentNegative.vue:34 ~ querylist ~ data", data);
    if (code == 200) {
      totalTitleList.value = totalTitleList.value.map((item: any) => {
        item.value = data[item.key];
        return item;
      });
      const tadayTime = moment();
      const timeFormat = moment(tadayTime).format("HH:mm:ss");
      listData.value = listData.value.map((item: any) => {
        item.showDate = `${moment(tadayTime)
          .subtract(item.space, "hours")
          .format("HH:mm:ss")}-${timeFormat}`;
        item.list = data[`last${item.space}HourData`].map((ite: any) => {
          if (ite.isNormal) {
            return { light: "green", key: nanoid() };
          }
          if (ite.isNoComment) {
            return { light: "yellow", key: nanoid() };
          }
          if (ite.isNegetive) {
            return { light: "red", key: nanoid() };
          }
        });
        // let normalCountArr: Array<any> = new Array(
        //   data[`last${item.space}HourNormalCount`]
        // ).fill({ light: "green", key: nanoid() });
        // let noCommentCountArr = new Array(
        //   data[`last${item.space}HourNoCommentCount`]
        // ).fill({ light: "yellow", key: nanoid() });
        // let negetiveCountArr = new Array(
        //   data[`last${item.space}HourNegetiveCount`]
        // ).fill({ light: "red", key: nanoid() });
        // item.list = shuffle([
        //   ...normalCountArr,
        //   ...noCommentCountArr,
        //   ...negetiveCountArr,
        // ]);
        return item;
      });
    }
    t.value = setTimeout(() => {
      querylist();
    }, 1000 * 60 * 10);
  });
};
const go_home = () => {
  window.location.replace("/");
};

onDeactivated(() => {
  if (t.value) {
    clearTimeout(t.value);
  }
});

onMounted(() => {
  if (route?.query?.name) {
    let name: any = route?.query?.name;
    document.title = name;
  }
  querylist();
});
</script>
<style scope>
.content_commen {
  background: linear-gradient(180deg, #0f1e58 0%, #030519 100%);
  width: 100vw;
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
}
.commen_card {
  background-image: url("./images/card.png");
  background-repeat: no-repeat;
  background-size: 100% 528px;
  height: 528px;
  width: 100%;
  box-sizing: border-box;
  padding-top: 20px;
}
.tip_text {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 17px;
}
.tip_item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.tip_light_icon {
  width: 13px;
  height: 13px;
  margin-right: 4px;
}
.tip_light_text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
}
.light_box {
  margin-top: 12px;
  height: 450px;
  width: 100%;
  overflow-y: auto;
}

.light_time {
  background-image: url("./images/pane.png");
  height: 26px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 26px;
  padding: 0 14px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 17px;
  align-items: center;
}
.light_icon_box {
  padding: 6px 17px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
}
.light_icon_ {
  width: 22px;
  height: 22px;
  margin-right: 6px;
}
.goHome {
  background-color: transparent !important;
  border-radius: 4px !important;
  border: 1px solid #4bb5f9 !important;
  margin-top: 20px;
  font-weight: 600;
  color: #4bb5f9;
  line-height: 25px;
  font-size: 18px;
  width: 48%;
}
div::-webkit-scrollbar {
  width: 0;
}
</style>
