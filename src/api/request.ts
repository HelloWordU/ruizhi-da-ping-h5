import axios from "axios";
import { showToast, showLoadingToast, closeToast } from "vant";
import Cookies from "js-cookie";
interface RequestData {
  url: string;
  data: Record<string, any>;
  method?: string;
  headers?: Record<string, any>;
  options?: Record<string, any>;
}
// 对外扩展配置
const defaults = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    accessToken: localStorage.getItem("accessToken"),
  },
  successResponseHandler: (data: any, cfg: any) => {
    console.log("data>>>", data);
    console.log("cfg>>>", cfg);
  },
  errorResponseHandler: (data: any, cfg: any) => {
    console.log("data>>>", data);
    console.log("cfg>>>", cfg);
  },
};
const request = ({
  url = "",
  data = {},
  method = "post",
  headers = {},
  options = {},
}: RequestData) => {
  const cfg = {
    headers,
    data: {},
    method,
    params: {},
    url: `http://182.61.26.201:9101${url}`,
    baseURL: "",
  };
  if (method.toLocaleLowerCase() === "get") {
    cfg.params = Object.assign({}, data);
  } else {
    cfg.data = Object.assign({}, data);
  }
  cfg.headers = Object.assign({}, defaults.headers, cfg.headers || {});
  return new Promise((resolve) => {
    showLoadingToast({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });
    axios
      .request(cfg)
      .then(({ data, headers, config, request }) => {
        if (request.status === 200) {
          resolve(data);
        }
        const { autoHandleSuccess = true, autoHandleError = true } =
          options || {};
        if (
          (data.status && data.status.code === 10000) ||
          Object.prototype.toString.call(data) === "[object Blob]"
        ) {
          autoHandleSuccess && defaults.successResponseHandler(data, cfg);
        } else {
          autoHandleError && defaults.errorResponseHandler(data, cfg);
        }
      })
      .catch((e) => {
        console.log(e);
        if (!axios.isCancel(e)) {
          defaults.errorResponseHandler(e, cfg);
        }
      });
  });
};

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (response?.data?.code == -1) {
      showToast(response?.data?.message);
    } else {
      closeToast();
    }
    return response;
  },
  function (error) {
    const { response } = error || {};

    switch (response.status) {
      case 401:
        window.location.replace("/login");
        break;

      default:
        if (response.statusText || response.message) {
          showToast(response.statusText || response.message);
        } else {
          closeToast();
        }
        break;
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // return Promise.reject(error);
  }
);
export default request;
