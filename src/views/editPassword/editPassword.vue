<template>
  <div class="content_editPassword">
    <headInfo :userName="'华为nova10'" type="logOut" />
    <div class="form_content">
      <div class="form_title">修改密码</div>
      <div v-for="item in formList" :key="item.key" class="item_">
        <div class="ipunt_box">
          <img :src="item.img" alt="" class="input_icon" />
          <input
            type="password"
            class="input_text"
            v-model="item.value"
            :placeholder="item.placeholder"
          />
        </div>
      </div>
      <div class="confirm_box">
        <van-button
          class="confirm_text"
          color="linear-gradient(180deg, #53A5EB 0%, #296CD2 100%)"
          block
          @click="confirm_fn"
          >修改密码</van-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import headInfo from "@/components/headInfo/headInfo.vue";
import password_img from "./images/denglu-mima.png";
import { showToast } from "vant";
import { useCounterStore } from "@/stores/counter";
import request from "@/api/request";
const useCounter = useCounterStore();
// import id_img from "./images/yonghu-xianxing.png";
const formList: Array<any> = reactive([
  {
    key: "passWord",
    placeholder: "请输入旧密码",
    value: "",
    img: password_img,
  },
  {
    key: "newPassWord",
    placeholder: "请输入新密码",
    value: "",
    img: password_img,
  },
  {
    key: "newPassWordConfirm",
    placeholder: "请确认新密码",
    value: "",
    img: password_img,
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
  request({ data: requestParams, url: "/user/modifyPwd" }).then(
    async ({ code, message }: any) => {
      if (code == 200) {
        showToast({ message: "修改成功", duration: 2000 });
        setTimeout(() => {
          localStorage.clear();
          useCounter.initState();
          location.href = "/login";
        }, 2000);
      }
      if (code == 0) {
        showToast({ message, duration: 2000 });
      }
    }
  );
};
</script>
<style scope>
.content_editPassword {
  background-image: url("./images/bj.png");
  background-size: 100vw 100vh;
  min-height: 100vh;
  background-repeat: no-repeat;
  padding: 36px 16px 0px 16px;
}
.form_content {
  margin-top: 44px;
  width: 100%;
  background-image: url("./images/frombj.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 20px 30px 50px 30px;
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
.form_title {
  font-size: 22px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #ffffff;
  line-height: 30px;
  text-align: center;
}
.confirm_box {
  margin-top: 28px;
}
.confirm_text {
  font-size: 20px !important;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #ffffff !important;
}
</style>
