<template>
  <div class="remark_content">
    <div class="re_card1">
      <div class="re_card1_" v-for="item in isSueList" :key="item.key">
        <div v-for="ite in item.list" :key="ite.key" class="re_card1_item">
          <div class="re_card1_item_val">{{ ite.value }}</div>
          <div class="re_card1_item_label">{{ ite.label }}</div>
        </div>
        <div class="s_line"></div>
      </div>
    </div>
    <div class="re_card2">
      <div class="re_card2_">
        <div v-for="(item, index) in hotList" :key="item.keys">
          <div class="re_card2_item">
            <img
              :src="iconMap[index + 1]"
              alt=""
              v-if="index >= 0 && index < 3"
              class="re_card2_item_icon"
            />
            <div v-if="index > 2" class="re_card2_item_icon1">
              {{ index + 1 }}
            </div>
            <div class="re_card2_item_text">{{ item.title }}</div>
          </div>
          <div class="line" v-if="index != hotList.length - 1"></div>
        </div>
      </div>
    </div>
    <div class="re_card3">
      <div class="re_card3_">
        <div v-for="(item, index) in hotCList" :key="item.keys">
          <div class="re_card2_item">
            <img
              :src="iconMap[index + 1]"
              alt=""
              v-if="index >= 0 && index < 3"
              class="re_card2_item_icon"
            />
            <div v-if="index > 2" class="re_card2_item_icon1">
              {{ index + 1 }}
            </div>
            <div class="re_card2_item_text">{{ item.title }}</div>
          </div>
          <div class="line" v-if="index != hotList.length - 1"></div>
        </div>
      </div>
    </div>
    <div class="re_card4">
      <div class="re_card4_">
        <aotuScroll
          :data="brightSpotList"
          :class-option="{ step: 0.7, limitMoveNum: 6 }"
        >
          <div
            v-for="(item, index) in brightSpotList"
            :key="item.keys"
            class="re_card4_item"
            @click="goUrlPage(item.url)"
          >
            <div class="re_card4_item_top">
              <img
                class="card4_item_top_icon"
                src="./images/icon_star.png"
                alt=""
              />
              <div class="card4_item_top_text">{{ item.title }}</div>
            </div>
            <div class="re_card4_item_middle">
              <div class="re_card4_item_middle_text">
                <span :style="{ color: '#B8E6FF' }">来源：</span
                >{{ item.source }}
              </div>
              <div class="re_card4_item_middle_text">
                <span :style="{ color: '#B8E6FF' }">作者：</span
                >{{ item.author }}
              </div>
              <div class="card4_sLine"></div>
            </div>
            <div class="re_card4_item_bottom">
              <div class="re_card4_item_middle_text">
                <span :style="{ color: '#B8E6FF' }">阅读量：</span
                >{{ item.readNum }}
              </div>
              <div class="re_card4_item_middle_text">
                <span :style="{ color: '#B8E6FF' }">互动量：</span
                >{{ item.interactionNum }}
              </div>
              <div class="card4_sLine"></div>
            </div>
            <div
              class="line line1"
              v-if="index != brightSpotList.length - 1"
            ></div>
          </div>
        </aotuScroll>
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
import { onMounted, ref, onDeactivated } from "vue";
import { useRoute, useRouter } from "vue-router";
import aotuScroll from "../../components/autoScroll/aotuScroll.vue";
import { nanoid } from "nanoid";
import { useCounterStore } from "@/stores/counter";
import icon_one from "./images/one.png";
import icon_two from "./images/two.png";
import icon_three from "./images/three.png";

const iconMap: any = {
  1: icon_one,
  2: icon_two,
  3: icon_three,
};

const useCounter = useCounterStore();
const route = useRoute();
const router = useRouter();

const hotList: any = ref([]);
const hotCList: any = ref([]);
const isSueList: any = ref([]);
const brightSpotList: any = ref([]);
let t: any = ref(null);
let categoryId = useCounter.$state?.userInfo?.id || route?.query.categoryId;
const queryHotList = () => {
  request({
    data: { categoryId },
    url: "/categoryHotWord/get",
    method: "GET",
  }).then((res: any) => {
    const { code, data } = res || {};
    if (code == 200) {
      hotList.value = data?.map((item: any) => {
        item.keys = nanoid();
        return item;
      });
    }
  });
};

const queryHwIssue = () => {
  request({
    url: "/categoryMaintenance/get",
    data: { categoryId },
    method: "Get",
  }).then((res: any) => {
    const { code, data } = res || {};
    if (code == 200) {
      let obj1 = {
        key: nanoid(),
        list: [
          { label: "撰写目标", value: data["write"], key: nanoid() },
          { label: "已撰写", value: data["haveRrite"], key: nanoid() },
        ],
      };
      let obj2 = {
        key: nanoid(),
        list: [
          { label: "发布目标", value: data["publish"], key: nanoid() },
          { label: "已发布", value: data["havepublish"], key: nanoid() },
        ],
      };
      let obj3 = {
        key: nanoid(),
        list: [
          { label: "阅读量目标", value: data["read"], key: nanoid() },
          { label: "已完成", value: data["haveRead"], key: nanoid() },
        ],
      };
      isSueList.value = [obj1, obj2, obj3];
    }
  });
};

const queryHotC = () => {
  request({
    data: { categoryId },
    url: "/categoryIndustryHotWord/get",
    method: "GET",
  }).then((res: any) => {
    const { code, data } = res || {};
    if (code == 200) {
      hotCList.value = data?.map((item: any) => {
        item.keys = nanoid();
        return item;
      });
    }
  });
};

const queryBrightSpot = () => {
  request({
    data: { categoryId },
    url: "/categoryArticle/get",
    method: "GET",
  }).then((res: any) => {
    const { code, data } = res || {};
    if (code == 200) {
      brightSpotList.value = data?.map((item: any) => {
        item.keys = nanoid();
        return item;
      });
    }
  });
};
const go_home = () => {
  window.location.replace("/");
};
const goUrlPage = (url: string) => {
  if (url) location.href = url;
};

const initQueryData = () => {
  if (t.value) {
    clearTimeout(t.value);
  }
  queryHotList();
  queryHwIssue();
  queryHotC();
  queryBrightSpot();
  t.value = setTimeout(() => {
    initQueryData();
  }, 1000 * 60 * 10);
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
  initQueryData();
});
</script>
<style scope>
.remark_content {
  background: linear-gradient(180deg, #0f1e58 0%, #030519 100%);
  width: 100vw;
  padding: 13px 16px;
  font-size: 14px;
}
.re_card1 {
  width: 100%;
  height: 375px;
  background-image: url("./images/r_card_1.png");
  background-repeat: no-repeat;
  background-size: 100% 375px;
  padding: 44px 16px 29px 16px;
}
.re_card2 {
  margin-top: 14px;
  width: 100%;
  height: 328px;
  background-image: url("./images/r_card_2.png");
  background-repeat: no-repeat;
  background-size: 100% 328px;
  padding: 42px 16px 5px 16px;
}
.re_card3 {
  margin-top: 14px;
  width: 100%;
  height: 340px;
  background-image: url("./images/r_card_3.png");
  background-repeat: no-repeat;
  background-size: 100% 340px;
  padding: 42px 16px 5px 16px;
}
.re_card4 {
  margin-top: 14px;
  width: 100%;
  height: 650px;
  background-image: url("./images/r_card_4.png");
  background-repeat: no-repeat;
  background-size: 100% 650px;
  padding: 52px 16px 18px 16px;
}
.re_card1_ {
  margin-top: 13px;
  height: 84px;
  background-image: url("./images/rectangle.png");
  background-repeat: no-repeat;
  background-size: 100% 84px;
  padding: 11px;
  display: flex;
  position: relative;
}
.re_card1_item {
  width: 49%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.s_line {
  width: 1px;
  height: 44px;
  background-color: #4ab4f9;
  display: inline;
  position: absolute;
  left: 50%;
  top: 18px;
}
.re_card1_item_label {
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  margin-top: 7px;
}
.re_card1_item_val {
  font-size: 26px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #4bb5f9;
  line-height: 26px;
}
.re_card2_ {
  height: 255px;
  overflow: auto;
  width: 100%;
}
.re_card3_ {
  height: 285px;
  overflow: auto;
  width: 100%;
}
.re_card2_item {
  display: flex;
  padding: 15px 14px;
  align-items: center;
}
.re_card2_item_icon {
  width: 20px;
  height: 29px;
  margin-right: 14px;
}
.re_card2_item_icon1 {
  width: 22px;
  height: 22px;
  border: 1px solid #4bb5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
}
.re_card2_item_text {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
}
.line {
  border-bottom: 1px solid #1f4a93;
  width: 100%;
  opacity: 0.5;
}
.line1 {
  margin-top: 14px;
}
.re_card4_ {
  height: 570px;
  overflow-y: auto;
}
.re_card4_item {
  padding: 10px 14px 0 14px;
}
.re_card4_item_top {
  display: flex;
  align-items: center;
}
.card4_item_top_icon {
  width: 31px;
  height: 26px;
  margin-right: 9px;
}
.card4_item_top_text {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 24px;
}
.re_card4_item_middle {
  margin-top: 5px;
  display: flex;
  position: relative;
}
.re_card4_item_bottom {
  display: flex;
  position: relative;
}
.re_card4_item_middle_text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fff;
  line-height: 14px;
  width: 48%;
}
.card4_sLine {
  position: absolute;
  left: 35%;
  top: 25%;
  width: 1px;
  height: 10px;
  background: rgba(19, 43, 96, 1);
}
.goHome {
  background-color: transparent !important;
  border-radius: 4px !important;
  border: 1px solid #4bb5f9 !important;
  margin-top: 14px;
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
