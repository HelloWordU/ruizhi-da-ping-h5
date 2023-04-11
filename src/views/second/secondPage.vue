<template>
  <div class="content_second">
    <headInfo :userName="useCounter.userInfo.name" type="logOut" />
    <div v-for="(item, index) in data_list" :key="item.id" class="item_">
      <div class="item_back">
        <img
          :src="icon_map[item.type]"
          alt=""
          :style="{ width: '100%', height: '100%', position: 'relative' }"
          @click="goDetail(item.type, item.name)"
        />
      </div>
      <div class="item_title">
        <img
          :src="isEdit && edif_index == index ? save_icon : edit_icon"
          alt=""
          class="title_icon"
          @click.stop="editTitle_fn(index)"
        />
        <input
          type="text"
          v-model="item.name"
          v-if="isEdit && edif_index == index"
          class="title_input"
        />
        <div v-else class="title_text">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import headInfo from "@/components/headInfo/headInfo.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCounterStore } from "@/stores/counter";
import icon_1 from "./images/icon_1.png";
import icon_2 from "./images/icon_2.png";
import icon_3 from "./images/icon_3.png";
import icon_4 from "./images/icon_4.png";
import save_icon from "./images/queren.png";
import edit_icon from "./images/edit.png";
import request from "@/api/request";
import { showToast } from "vant";
const router = useRouter();
const route = useRoute();

const icon_map: any = {
  1: icon_1,
  2: icon_2,
  3: icon_3,
  4: icon_4,
};
const useCounter = useCounterStore();
let data_list: any = ref([]);
let init_data_list: any = ref([]);
let edif_index: any = ref(null);
let isEdit = ref(false);
onMounted(() => {
  query_list();
  if (useCounter.$state.homeInfo?.name) {
    document.title = useCounter.$state.homeInfo?.name;
  }
});

const query_list = () => {
  let categoryId = useCounter.$state?.userInfo?.id || route?.query.categoryId;
  useCounter.querySecondList({ categoryId: categoryId });
};

const editTitle_fn = (index: number) => {
  if (!isEdit.value) {
    edif_index.value = index;
    isEdit.value = true;
  } else {
    if (index !== edif_index.value) {
      data_list.value[edif_index.value].name =
        init_data_list.value[edif_index.value]?.name || "";
      edif_index.value = index;
      return;
    }
    if (!data_list.value[edif_index.value]?.name) {
      showToast("名称不能为空");
      return;
    }
    request({
      data: { ...data_list.value[edif_index.value] },
      url: "/categoryScreenConfig/save",
    }).then(({ code }: any) => {
      if (code == 200) {
        query_list();
        isEdit.value = false;
      }
    });
  }
};

const goDetail = (type: number | string, name: string) => {
  const routerName: any = {
    1: "dataShow",
    2: "negativePage",
    3: "remarkPage",
    4: "commentNegative",
  };
  router.push({
    name: routerName[type],
    query: { categoryId: useCounter.$state?.userInfo?.id, name },
  });
};

watch(
  () => useCounter?.$state?.secondList,
  (val) => {
    if (val instanceof Array) {
      init_data_list.value = JSON.parse(JSON.stringify(val));
      data_list.value = [...val];
    }
  }
);
</script>
<style scope>
.content_second {
  background-image: url("./images/bj.png");
  background-size: 100vw;
  min-height: 100vh;
  background-repeat: no-repeat;
  padding: 20px 16px 120px 16px;
}
.item_ {
  margin-top: 18px;
}
.item_back {
  position: relative;
}
.item_title {
  width: 250px;
  height: 42px;
  background-image: url("./images/title_icon.png");
  background-size: 100% 100%;
  position: absolute;
  top: 2px;
  left: 14%;
  padding: 0px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.title_icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}
.title_input {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #499ef3;
  flex: 1;
  z-index: 111;
}
.title_text {
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 25px;
}
</style>
