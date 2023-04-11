<template>
  <div class="content_datashow">
    <div class="card1">
      <div class="card1_top">
        <div v-for="item in peopleCount" :key="item.key" class="card1_top_item">
          <div class="people_num">{{ item.value }}</div>
          <div v-html="item.label" class="people_text" />
        </div>
      </div>
      <div class="line_class_box">
        <div v-for="item in line_class" :key="item.key" class="line_class_item">
          <div class="line_class_icon" :style="{ border: item.color }"></div>
          <div class="line_class_text">{{ item.label }}</div>
        </div>
      </div>
      <div id="showData_line"></div>
    </div>

    <div class="card2">
      <div class="swiper detail_">
        <aotuScroll :data="detail_list" :class-option="{ step: 0.6 }">
          <div v-for="(item, index) in detail_list" :key="item.keys">
            <div
              :class="`detail_item ${
                plantformId === item.plantformId ? 'active_detail_item' : ''
              }`"
            >
              <div class="oneself">
                {{ item.oneself }}
              </div>
              <div class="reach">{{ item.reach }}</div>
              <div @click="queryPhoneList(item, index)" class="detail_title">
                {{ item.title }}
              </div>
            </div>
            <div class="line" v-if="index != detail_list.length - 1"></div>
          </div>
        </aotuScroll>
      </div>
    </div>
    <div class="card3">
      <div class="card3_title">
        <div>
          <img class="card3_title_icon" src="./images/left.png" alt="" />
        </div>
        <div class="card3_title_title">{{ plantformName }}</div>
        <div>
          <img class="card3_title_icon" src="./images/right.png" alt="" />
        </div>
      </div>
      <div class="card_input_">
        <input type="text" class="card_input" v-model="keyword" disabled />
        <img src="./images/sousuo.png" alt="" class="card3_input_icon" />
      </div>
      <div class="swiper phone_list">
        <aotuScroll
          :data="useCounter.phoneList"
          v-if="initEle"
          :class-option="{ step: 0.6 }"
        >
          <div>
            <div
              v-for="(item, index) in useCounter.phoneList"
              :key="index"
              class="phone_list_item"
              @click="goUrlPage(item.url)"
            >
              <div class="phone_item_title" v-html="item.title"></div>
              <div class="phone_item_url">{{ item.url }}</div>
              <div
                v-if="index != useCounter.$state.phoneList.length - 1"
                class="line"
              ></div>
            </div>
          </div>
        </aotuScroll>
      </div>
    </div>
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <van-button block class="goHome" @click="goback">返回上一页</van-button>
      <van-button block class="goHome" @click="go_home">返回首页</van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, onDeactivated } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Chart } from "@antv/g2";
import { nanoid } from "nanoid";
import aotuScroll from "@/components/autoScroll/aotuScroll.vue";
import { useCounterStore } from "@/stores/counter";
const useCounter = useCounterStore();
const route = useRoute();
const router = useRouter();
let categoryId = useCounter.$state?.userInfo?.id || route?.query.categoryId;
let plantformId = ref("");
let detail_list: any = ref([]);
let keyword = ref("");
let plantformName = ref("");
let plantformIdIndex: any = ref(0);
let initEle = ref(true);
let t: any = ref(null);
let tmin10: any = ref(null);
let chartCanvas: any = ref(null);
let peopleCount = ref([
  { label: "达标", key: "reachNum", value: "" },
  { label: "不达标", key: "noReachNum", value: "" },
  { label: `总核心<br />人口数`, key: "totalNum", value: "" },
]);
const line_class = [
  { color: "1px solid #EB5D02", label: "自身", key: nanoid() },
  { color: "1px solid #EB9A02", label: "竟品", key: nanoid() },
  { color: "1px solid #BE55E1", label: "行业", key: nanoid() },
  { color: "1px solid #4BB5F9", label: "自身竟品对比", key: nanoid() },
];
const queryLineData = () => {
  if (tmin10.value) {
    clearTimeout(tmin10.value);
  }
  useCounter.querySevenDataLine({ categoryId });
  useCounter.queryDataShowDetail({ categoryId });
  tmin10.value = setTimeout(() => {
    queryLineData();
  }, 1000 * 60 * 10);
};
const goback = () => {
  router.back();
};
const queryPhoneList = (item?: any, index?: number) => {
  plantformIdIndex.value = index;
  plantformId.value = item.plantformId;
  plantformName.value = item.plantformName;
  initEle.value = false;
  useCounter
    .queryPhoneList({
      optionValue: item.plantformId,
      keyWord: keyword.value,
    })
    .then(() => {
      t.value = setTimeout(() => {
        autoQueryPhoneList();
      }, 1000 * 30);
      initEle.value = true;
    });
};

const autoQueryPhoneList = () => {
  if (plantformIdIndex.value == detail_list.value.length - 1) {
    queryPhoneList(detail_list.value[0], 0);
    return;
  }
  queryPhoneList(
    detail_list.value[plantformIdIndex.value + 1],
    plantformIdIndex.value + 1
  );
};

onDeactivated(() => {
  if (t.value) {
    clearTimeout(t.value);
  }
  if (tmin10.value) {
    clearTimeout(tmin10.value);
  }
});

onMounted(() => {
  if (route?.query?.name) {
    let name: any = route?.query?.name;
    document.title = name;
  }
  queryLineData();
});
const go_home = () => {
  window.location.replace("/");
};
const init_line_fn = (val: Record<string, any>) => {
  keyword.value = val?.categoryName;
  peopleCount.value = peopleCount.value.map((item) => {
    item.value = val[item.key];
    return item;
  });
  if (val?.timeData instanceof Array) {
    let list: any = [];
    val?.timeData.map((item: any, index: number) => {
      let zsItem = {
        x: item,
        y: val?.zsData?.[index],
        // y: index * 1,
        color: "#EB5D02",
        label: "自身",
      };

      let dbItem = {
        x: item,
        y: val?.dbData?.[index],
        jp: index * 3,
        color: "#EB9A02",
        label: "竟品",
      };
      let hyItem = {
        x: item,
        y: val?.hyData?.[index],
        hy: index * 2,
        color: "#BE55E1",
        label: "行业",
      };
      let jpItem = {
        x: item,
        y: val?.jpData?.[index],
        db: index * 4,
        color: "#4BB5F9",
        label: "自身竟品对比",
      };
      list.push(zsItem);
      list.push(dbItem);
      list.push(hyItem);
      list.push(jpItem);
    });
    chart_List_anction(list);
  }
};

const chart_List_anction = (data: any) => {
  if (chartCanvas.value) {
    chartCanvas.value.data(data); // 更新数据源
    // do something
    chartCanvas.value.render(); // 更新图表
    return;
  }
  const colorMap: any = {
    自身竟品对比: "#4BB5F9",
    自身: "#EB5D02",
    行业: "#BE55E1",
    竟品: "#EB9A02",
  };
  chartCanvas.value = new Chart({
    container: "showData_line",
    autoFit: true,
    height: 240,
  });
  let chart = chartCanvas.value;
  chart.data(data);
  chart.animate(true);

  chart.scale("y", {
    min: 0,
    minLimit: 0,
    nice: true,
    tickCount: 6,
    formatter: function (value: any) {
      return parseInt(value);
    },
  });
  chart.scale("x", {
    sync: true,
    tickCount: 7,
    formatter: function (value: any) {
      return value.replace("月", ".").replace("日", "");
    },
  });
  chart.tooltip({
    domStyles: {
      "g2-tooltip": {
        background: "#333",
        width: "65%",
      },
      "g2-tooltip-name": {
        color: "#fff",
      },
      "g2-tooltip-title": {
        color: "#fff",
      },
      "g2-tooltip-marker": {
        color: "#fff",
      },
      "g2-tooltip-value": {
        color: "#fff",
      },
    },
    showCrosshairs: true,
    shared: true,
  });
  chart.axis("x", {
    line: {
      style: {
        stroke: "#1F4A93",
      },
    },
    label: {
      style: {
        fill: "#9AC5DA", //文字颜色
        fontFamily: "ingFangSC-Regular, PingFang SC", //文字字体
        fontWeight: 400, //文字粗细
        fontSize: 12, //文字大小
      },
      formatter: function formatter(val: any) {
        return val;
      },
    },
  });
  chart.axis("y", {
    line: {
      style: {
        stroke: "#1F4A93",
      },
    },
    grid: {
      line: {
        style: {
          stroke: "#1F4A93",
        },
      },
    },
    label: {
      style: {
        fill: "#FFFFFF", //文字颜色
        fontFamily: "ingFangSC-Regular, PingFang SC", //文字字体
        fontWeight: 400, //文字粗细
        fontSize: 12, //文字大小
      },
      formatter: function formatter(val: any) {
        return val;
      },
    },
  });
  chart
    .line()
    .position("x*y")
    .color("label", (val: any) => {
      return colorMap[val];
    })
    .style({
      fields: ["x", "y", "color"], // 数据字段
      callback: (x: any, y: any, color: any) => {
        const style = { lineWidth: 1, stroke: color, fill: color };
        return style;
      },
    });
  chart.render();
};

const init_detail_list = (val: any) => {
  detail_list.value = val.map((item: any) => {
    item.title = `(${item?.categoryName})${item?.plantformName}(${item?.categoryName})`;
    item.reach = item?.isReachingStandard ? "达标" : "不达标";
    item.oneself = "自身";
    item.keys = nanoid();
    return item;
  });
  plantformId.value = val?.[0]?.plantformId;

  queryPhoneList(val?.[0], 0);
};

const goUrlPage = (url: any) => {
  if (url) location.href = url;
};

watch(
  () => [useCounter.$state.sevenLine],
  ([val]) => {
    init_line_fn(val);
  }
);
watch(
  () => [useCounter.$state.dataShowDetail],
  ([val]) => {
    console.log("🚀 ~ file: dataShow.vue:218 ~ val", val);
    if (val instanceof Array) init_detail_list(val);
  }
);
</script>
<style scope>
.content_datashow {
  background: linear-gradient(180deg, #0f1e58 0%, #030519 100%);
  min-height: 100vh;
  padding: 14px 16px;
}
.card1 {
  background-image: url("./images/card1.png");
  background-size: 100% 464px;
  width: 100%;
  padding: 62px 10px 26px 10px;
  background-repeat: no-repeat;
}
.card1_top {
  display: flex;
  justify-content: space-between;
}
.card1_top_item {
  background-image: url("./images/pane.png");
  width: 94px;
  height: 84px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 8px;
  padding-top: 3px;
  /* justify-content: center; */
}
.people_num {
  font-size: 26px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #4bb5f9;
  line-height: 37px;
}
.people_text {
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  flex: 1;
  display: flex;
  align-items: center;
}
.line_class_box {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}
.line_class_item {
  display: flex;
  align-items: center;
  margin-left: 6px;
}
.line_class_icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 3px;
}
.line_class_text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
}
#showData_line {
  height: 240px;
  width: 100%;
  margin-top: 13px;
  /* background-color: #030519; */
}
.card2 {
  background-image: url("./images/card2.png");
  background-size: 100% 338px;
  width: 100%;
  padding: 42px 10px 26px 10px;
  background-repeat: no-repeat;
  margin-top: 14px;
  height: 338px;
}
.detail_ {
  height: 290px;
  width: 100%;
  overflow-y: hidden;
  /* position: relative; */
}
.detail_1 {
  height: 290px;
  width: 100%;
  overflow: auto;
}
.detail_item {
  padding: 16px 10px;
  height: 56px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
}
.active_detail_item {
  background: rgba(19, 63, 139, 0.58);
}
div::-webkit-scrollbar {
  width: 0;
}
.oneself {
  height: 24px;
  background: rgba(211, 60, 60, 0.5);
  border-radius: 2px;
  border: 1px solid #d33c3c;
  padding: 2px 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  box-sizing: border-box;
  margin-right: 4px;
}
.reach {
  border-radius: 2px;
  border: 1px solid #ffffff;
  box-sizing: border-box;
  padding: 2px 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  margin-right: 4px;
}
.detail_title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
}
.pop_div {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  line-height: 18px;
}
.line {
  opacity: 0.5;
  border-bottom: 1px solid #1f4a93;
}
.card3 {
  background-image: url("./images/card3.png");
  height: 570px;
  width: 100%;
  background-size: 100% 570px;
  background-repeat: no-repeat;
  padding: 0px 18px 20px 18px;
  margin-top: 14px;
}
.card_input_ {
  margin-top: 12px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #4bb5f9;
  display: flex;
  align-items: center;
  padding: 0px 10px;
}
.card_input {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  padding: 0px 6px;
  flex: 1;
  color: #ffffff;
  font-size: 16px;
}
.card3_input_icon {
  width: 20px;
  height: 20px;
}
.phone_list {
  margin-top: 10px;
  height: 425px;
  width: 100%;
  overflow-y: hidden;
  /* background-color: #030519; */
}
.phone_list_item {
  padding: 10px 0;
}
.phone_item_title {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 24px;
}
.phone_item_url {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #b8e6ff;
  line-height: 24px;
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
.card3_title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}
.card3_title_icon {
  width: 19px;
  height: 11px;
}
.card3_title_title {
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 25px;
  margin: 0 9px;
}
/* .warp {
  position: absolute;
  top: 0;
} */
</style>
