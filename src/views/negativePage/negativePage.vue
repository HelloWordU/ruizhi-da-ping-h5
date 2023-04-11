<template>
  <div class="content_negative">
    <div class="negative_card1">
      <div class="nega_tip_box">
        <div class="nage_tip_item" v-for="item in lightTipList" :key="item.key">
          <div class="nage_tip_item_content">
            <img class="nage_tip_item_icon" :src="lightMap[item.light]" alt="" />
            <div class="nage_tip_item_text">{{ item.label }}</div>
          </div>
        </div>
      </div>
      <div class="light_box_nega">
        <div v-for="item in surveyList" :key="item.keys" class="nega_light_box">
          <div>
            <img :src="lightMap[item.value]" alt="" class="three_light_icon" />
          </div>
          <div class="three_light_text">{{ item.key }}</div>
        </div>
      </div>
    </div>
    <div class="negative_card2">
      <div class="nega_tip_box">
        <div class="nage_tip_item" v-for="item in lightTipList" :key="item.key">
          <div class="nage_tip_item_content">
            <img class="nage_tip_item_icon" :src="lightMap[item.light]" alt="" />
            <div class="nage_tip_item_text">{{ item.label }}</div>
          </div>
        </div>
      </div>
      <div class="light_box_nega">
        <div v-for="item in headlineList" :key="item.keys" class="nega_light_box">
          <div>
            <img :src="lightMap[item.value]" alt="" class="three_light_icon" />
          </div>
          <div class="three_light_text">{{ item.key }}</div>
        </div>
      </div>
    </div>
    <div class="negative_card3">
      <div class="line_class_box1">
        <div v-for="item in line_class" :key="item.key" class="line_class_item">
          <div
            class="line_class_icon"
            v-if="!item.type"
            :style="{ border: item.color }"
          ></div>
          <div class="line_class_text">
            <span v-if="item.type" :style="{ color: item.color }">--</span>
            {{ item.label }}
          </div>
        </div>
      </div>
      <div id="negatLine"></div>
    </div>
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <van-button block class="goHome" @click="router.go(-1)">返回上一页</van-button>
      <van-button block class="goHome" @click="go_home">返回首页</van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import request from "@/api/request";
import { onMounted, ref, onDeactivated } from "vue";
import { useRoute, useRouter } from "vue-router";
import { nanoid } from "nanoid";
import { useCounterStore } from "@/stores/counter";
import green from "./images/green.png";
import red from "./images/red.png";
import yellow from "./images/yellow.png";
import green_ from "./images/green_.png";
import red_ from "./images/red_.png";
import yellow_ from "./images/yellow_.png";
import { Chart } from "@antv/g2";
const useCounter = useCounterStore();
const route = useRoute();
const router = useRouter();
let chartCanvas: any = ref(null);
let t: any = ref(null);
let categoryId = useCounter.$state?.userInfo?.id || route?.query.categoryId;

const lightMap: any = {
  green,
  red,
  yellow,
  1: green_,
  "-1": red_,
  0: yellow_,
};
const lightTipList: any = [
  { label: "负面达标率(优)", light: "green", key: nanoid() },
  { label: "负面达标率(中)", light: "yellow", key: nanoid() },
  { label: "负面率超标", light: "red", key: nanoid() },
];
const line_class: any = [
  { color: "1px solid #EB5D02", label: "网易", key: nanoid() },
  { color: "1px solid #EB9A02", label: "头条", key: nanoid() },
  { color: "1px solid #BE55E1", label: "腾讯", key: nanoid() },
  { color: "1px solid #4BB5F9", label: "新浪", key: nanoid() },
  { color: "1px solid #E9DA41", label: "凤凰网", key: nanoid() },
  { color: "1px solid #54C790", label: "搜狐", key: nanoid() },
  { color: "#F83A3A", label: "警戒线", key: nanoid(), type: "line" },
];
let surveyList: any = ref([]);
let headlineList: any = ref([]);

const querySurveyList = () => {
  request({
    data: { categoryId },
    url: "/negativeRate/getAll",
    method: "get",
  }).then(({ code, data }: any) => {
    if (code == 200) {
      surveyList.value = data?.map((item: any) => {
        item.keys = nanoid();
        return item;
      });
    }
  });
  request({
    data: { categoryId },
    url: "/negativeRate/getGateWay",
    method: "get",
  }).then(({ code, data }: any) => {
    if (code == 200) {
      headlineList.value = data?.map((item: any) => {
        item.keys = nanoid();
        return item;
      });
    }
  });
};

const queryLineData = () => {
  request({
    url: "/negativeRate/getGateWayRate",
    data: { categoryId },
    method: "get",
  }).then(({ code, data }: any) => {
    if (code == 200) {
      init_line_fn(data);
    }
  });
};
const queryInitData = () => {
  if (t.value) {
    clearTimeout(t.value);
  }
  querySurveyList();
  queryLineData();
  t.value = setTimeout(() => {
    queryInitData();
  }, 1000 * 60 * 10);
};
const init_line_fn = (val: Record<string, any>) => {
  if (val?.timeData instanceof Array) {
    let list: any = [];
    val?.timeData.map((item: any, index: number) => {
      let wyItem = {
        x: item,
        y: val?.wyData?.[index],
        警戒线: 10,
        jjx_: "警戒线",
        // y: index * 1,
        color: "#EB5D02",
        label: "网易",
      };
      let ttItem = {
        x: item,
        y: val?.ttData?.[index],
        警戒线: 10,
        jjx_: "警戒线",
        color: "#EB9A02",
        label: "头条",
      };
      let txItem = {
        x: item,
        y: val?.txData?.[index],
        警戒线: 10,
        jjx_: "警戒线",
        color: "#BE55E1",
        label: "腾讯",
      };
      let xlItem = {
        x: item,
        y: val?.xlData?.[index],
        警戒线: 10,
        jjx_: "警戒线",
        color: "#4BB5F9",
        label: "新浪",
      };
      let fhwItem = {
        x: item,
        y: val?.fhwData?.[index],
        警戒线: 10,
        jjx_: "警戒线",
        color: "#E9DA41",
        label: "凤凰网",
      };
      let shItem = {
        x: item,
        y: val?.shData?.[index],
        警戒线: 10,
        jjx_: "警戒线",
        color: "#54C790",
        label: "搜狐",
      };
      list.push(wyItem);
      list.push(ttItem);
      list.push(txItem);
      list.push(xlItem);
      list.push(fhwItem);
      list.push(shItem);
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
    网易: "#EB5D02",
    头条: "#EB9A02",
    腾讯: "#BE55E1",
    新浪: "#4BB5F9",
    凤凰网: "#E9DA41",
    搜狐: "#54C790",
    警戒线: "#F83A3A",
  };
  chartCanvas.value = new Chart({
    container: "negatLine",
    autoFit: true,
    height: 260,
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
  chart.scale("警戒线", {
    min: 0,
    max: 10,
    minLimit: 0,
    maxLimit: 10,
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
      return value;
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
      "g2-tooltip-list-item": {
        height: "3px",
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
  chart.axis("警戒线", {
    line: {
      style: {
        stroke: "#F83A3A",
      },
    },
    grid: null,
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
  // chart.axis("警戒线", false);
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
  chart.line().position("x*警戒线").color("#F83A3A").shape("dash");
  chart.point().size(1).color("#FFD7D7").position("x*警戒线");
  chart.render();
};
const go_home = () => {
  window.location.replace("/");
};
onMounted(() => {
  if (route?.query?.name) {
    let name: any = route?.query?.name;
    document.title = name;
  }
  queryInitData();
});
onDeactivated(() => {
  if (t.value) {
    clearTimeout(t.value);
  }
});
</script>
<style scope>
.content_negative {
  background: linear-gradient(180deg, #0f1e58 0%, #030519 100%);
  width: 100vw;
  padding: 13px 16px 20px 16px;
  font-size: 14px;
  min-height: 100vh;
}
.negative_card1 {
  height: 240px;
  width: 100%;
  padding: 58px 6px 36px 10px;
  background-image: url("./images/card1.png");
  background-repeat: no-repeat;
  background-size: 100% 240px;
}

.negative_card2 {
  margin-top: 16px;
  height: 240px;
  width: 100%;
  padding: 58px 6px 36px 10px;
  background-image: url("./images/card2.png");
  background-repeat: no-repeat;
  background-size: 100% 240px;
}

.negative_card3 {
  margin-top: 16px;
  height: 390px;
  width: 100%;
  padding: 65px 10px 14px 10px;
  background-image: url("./images/card3.png");
  background-repeat: no-repeat;
  background-size: 100% 390px;
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
.nega_tip_box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-right: 10px;
}
.nage_tip_item_content {
  display: flex;
  align-items: center;
}
.nage_tip_item_icon {
  width: 13px;
  height: 13px;
  margin-right: 4px;
}
.nage_tip_item_text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
}
.light_box_nega {
  display: flex;
  overflow-x: auto;
  align-items: center;
  margin-top: 26px;
}
.nega_light_box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.three_light_icon {
  width: 51px;
  height: 82px;
}
.three_light_text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9ac5da;
  line-height: 18px;
}
.line_class_box1 {
  display: flex;
  flex-wrap: wrap;
}
.line_class_item {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
}
.line_class_icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}
.line_class_text {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
}
#negatLine {
  margin-top: 14px;
  width: 100%;
  height: 260px;
}
</style>
