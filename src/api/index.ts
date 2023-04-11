import request from "./request";
type Pair = Record<string, any>;
const login = (data: Pair) => {
  return request({
    data: data,
    url: "/index/login",
  });
};

const home_info = (data: Pair) => {
  return request({
    data: data,
    url: "/project/get",
    method: "get",
  });
};

const user_info = (data: Pair) => {
  return request({
    data,
    url: "/category/get",
    method: "get",
  });
};

const logOut = (data: Pair) => {
  return request({
    data,
    url: "/index/loginOut",
    method: "get",
  });
};

const second_list = (data: Pair) => {
  return request({
    data,
    url: "/categoryScreenConfig/get",
    method: "get",
  });
};

const daySeven_data = (data: Pair) =>
  request({
    data,
    url: "/monitoringPlantformStatistic/getPageDataByCategoryId",
    method: "get",
  });

const data_show_detail = (data: Pair) =>
  request({
    data,
    url: "/monitoringPlantformStatistic/getByCategoryId",
    method: "get",
  });
const phoneList = (data: Pair) =>
  request({
    data,
    url: "/monitoringPlantformArticle/getByPlantformIdAndKey",
  });
export {
  login,
  home_info,
  user_info,
  logOut,
  second_list,
  daySeven_data,
  data_show_detail,
  phoneList,
};
