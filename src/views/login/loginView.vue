<template>
  <div class="content">
    <div class="login_box">
      <img src="./images/logo.png" alt="" class="login_icon" />
    </div>
    <div class="form_content">
      <div v-for="item in formList" :key="item.key" class="item_">
        <div
          :class="
            item.key === 'checkCode'
              ? 'ipunt_box verifiCode_ipunt_box'
              : 'ipunt_box'
          "
        >
          <img :src="item.img" alt="" class="input_icon" />
          <input
            :type="item.key === 'password' ? 'password' : 'text'"
            class="input_text"
            v-model="item.value"
            :placeholder="item.placeholder"
          />
        </div>
        <div v-if="item.key === 'checkCode'" class="verifiCode_">
          <img :src="checkCode" alt="" class="verifiCode_icon" />
        </div>
      </div>

      <van-button
        class="confirm"
        color="linear-gradient(180deg, #53A5EB 0%, #296CD2 100%)"
        block
        @click="confirm_fn"
        >登录</van-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, onMounted, ref } from "vue";
import password_img from "./images/denglu-mima.png";
import id_img from "./images/yonghu-xianxing.png";
import verifiCode_img from "./images/yanzhengma.png";
import request from "@/api/request";
import { showToast } from "vant";
import { useCounterStore } from "@/stores/counter";
const useCounter = useCounterStore();
const checkCode = ref("");
const formList: Array<any> = reactive([
  {
    key: "userName",
    placeholder: "请输入登录ID",
    value: "",
    img: id_img,
  },
  {
    key: "password",
    placeholder: "请输入密码",
    value: "",
    img: password_img,
  },
  {
    key: "checkCode",
    placeholder: "请输验证码",
    value: "",
    img: verifiCode_img,
  },
]);
const confirm_fn = () => {
  let requestParams: Record<string, string> = {};
  for (let i = 0; i < formList.length; i++) {
    let item = formList[i];
    if (!item?.value) {
      showToast(item?.placeholder);
      return;
    }
    requestParams[item?.key] = item.value;
  }
  useCounter.login({
    ...requestParams,
    captchaToken: localStorage.getItem("captchaAccessToken"),
  });
};

const queryCode = () => {
  let today = new Date();
  request({
    url: "/index/captcha",
    method: "get",
    data: { date: today.getTime() },
  }).then((res: any) => {
    console.log("🚀 ~ file: loginView.vue:86 ~ queryCode ~ res", res);
    if (res.code == 200) {
      checkCode.value = res?.data?.captchaData;
      localStorage.setItem("captchaAccessToken", res?.data.captchaAccessToken);
    }
  });
};
onMounted(() => {
  queryCode();
});
</script>
<style scoped>
.content {
  width: 100vw;
  background-image: url("./images/loginBj.png");
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  background-color: #080e32;
  padding: 40px 25px 0 25px;
  min-height: 100vh;
}
.login_box {
  margin: 0px 24px;
}
.login_icon {
  width: 100%;
}
.form_content {
  margin-top: 48px;
  width: 100%;
  background-image: url("./images/loginBjFrom1.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 54px 30px 60px 30px;
}
.item_ {
  width: 100%;
  display: flex;
  margin-top: 23px;
  justify-content: space-between;
}
.ipunt_box {
  width: 100%;
  padding: 8px 12px;
  background: rgba(41, 108, 210, 0.4);
  border-radius: 2px;
  border: 1px solid rgba(60, 130, 201, 0.4);
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.verifiCode_ipunt_box {
  width: 63%;
}
.input_icon {
  width: 24px;
  height: 23px;
  margin-right: 16px;
}
.input_text {
  height: 25px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #499ef3;
  width: 100%;
}
.input_text::-webkit-input-placeholder {
  color: #499ef3;
}
.verifiCode_ {
  width: 33%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #eee;
  box-sizing: border-box;
}
.confirm {
  margin-top: 28px;
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #ffffff;
}
.verifiCode_icon {
  width: 100%;
  height: 100%;
}
</style>
