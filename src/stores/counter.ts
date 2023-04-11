import { defineStore } from "pinia";
import {
  login,
  home_info,
  user_info,
  logOut,
  second_list,
  daySeven_data,
  data_show_detail,
  phoneList,
} from "@/api/index";

type Pair = Record<string, any>;

const initState: any = () => {
  return {
    homeInfo: {},
    userInfo: {},
    secondList: [],
    sevenLine: {},
    dataShowDetail: [],
    phoneList: [],
  };
};

export const useCounterStore = defineStore("counter", {
  state: () => initState(),
  getters: {},
  actions: {
    async logOut(payload: any) {
      logOut(payload).then(({ code }: any) => {
        if (code == 200) {
          localStorage.clear();
          this.$state = initState();
          window.location.replace("/login");
        }
      });
    },
    async login(payload: Pair) {
      login(payload).then((res: any) => {
        if (res?.code == 200) {
          localStorage.setItem("accessToken", res.data);
          window.location.replace("/");
        }
        return res;
      });
    },
    async queryHomeInfo(payload: Pair) {
      home_info(payload).then((res: any) => {
        const { code, data } = res || {};
        if (code == 200) {
          if (data) {
            this.homeInfo = data || {};
            document.title = data?.name;
            this.queryUserinfo({ projectId: data?.id });
          }
        }
      });
    },
    async queryUserinfo(payload: Pair) {
      user_info(payload).then(({ code, data }: any) => {
        if (code == 200) {
          if (data && data?.length) {
            /**
             * 需求简化  默认取第一个
             */
            this.userInfo = data[0];
          }
        }
      });
    },
    async querySecondList(payload: Pair) {
      second_list(payload).then(({ code, data }: any) => {
        if (code == 200) {
          if (data && data.length) {
            this.secondList = data;
          } else {
            this.secondList = [
              { categoryId: payload.categoryId, name: "核心入口屏", type: 1 },
              { categoryId: payload.categoryId, name: "全网舆情屏", type: 2 },
              { categoryId: payload.categoryId, name: "整合分发屏", type: 3 },
              {
                categoryId: payload.categoryId,
                name: "评论区维护红绿灯预警",
                type: 4,
              },
            ];
          }
        }
      });
    },
    async querySevenDataLine(payload: Pair) {
      daySeven_data(payload).then(({ code, data }: any) => {
        if (code == 200) {
          this.sevenLine = data;
        }
      });
    },
    async queryDataShowDetail(payload: Pair) {
      data_show_detail(payload).then(({ code, data }: any) => {
        if (code == 200) {
          this.dataShowDetail = data;
        }
      });
    },
    async queryPhoneList(payload: Pair) {
      phoneList(payload).then(({ code, data }: any) => {
        if (code == 200) {
          this.phoneList = data;
        }
      });
    },
    async initState() {
      this.$state = initState();
    },
  },
});
