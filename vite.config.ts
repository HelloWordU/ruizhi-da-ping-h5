import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import postcsspxtoviewport from "postcss-px-to-viewport";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: "px", // 要转化的单位
          viewportWidth: 375, // UI设计稿的宽度
          viewportHeight: 667, //视口的高度，对应的是设计稿的高度（也可以不配置）
          unitPrecision: 2, // 转换后的精度，即小数点位数
          propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          // fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: [".ignore", ".hairlines", "plyr"], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: false, //启动项目后打开浏览器
    proxy: {
      "/api": {
        target: "http://182.61.26.201:9101/", //API服务地址
        // pathRewrite: { "^/api": "" }, //路径改写
        changeOrigin: true, //开启跨域
      },
    },
  },
});
