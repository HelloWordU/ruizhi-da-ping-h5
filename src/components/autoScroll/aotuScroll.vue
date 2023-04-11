<template>
  <div ref="wrap">
    <div
      ref="realBox"
      :style="pos"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <div ref="slotList" :style="float">
        <slot></slot>
      </div>
      <slot></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from "vue";

const props: any = defineProps({
  data: {
    type: Array,
  },
  classOption: {
    type: Object,
  },
});
window.requestAnimationFrame(() => {});

const emits = defineEmits(["ScrollEnd"]);
const state: any = reactive({
  xPos: 0,
  yPos: 0,
  delay: 0,
  copyHtml: "",
  height: 0,
  width: 0, // 外容器宽度
  realBoxWidth: 0, // 内容实际宽度
  ease: "",
});

const wrap: any = ref(null);
const slotList: any = ref(null);
const realBox: any = ref(null);
const defaultOption = computed(() => ({
  step: 1, //步长
  limitMoveNum: 5, //启动无缝滚动最小数据数
  hoverStop: true, //是否启用鼠标hover控制
  direction: 1, // 0 往下 1 往上 2向左 3向右
  openTouch: true, //开启移动端touch
  singleHeight: 0, //单条数据高度有值hoverStop关闭
  singleWidth: 0, //单条数据宽度有值hoverStop关闭
  waitTime: 1000, //单步停止等待时间
  switchOffset: 30,
  autoPlay: true,
  navigation: false,
  switchSingleStep: 134,
  switchDelay: 400,
  switchDisabledClass: "disabled",
  isSingleRemUnit: false, // singleWidth/singleHeight 是否开启rem度量
}));
const options = computed(() =>
  Object.assign({}, defaultOption.value, props.classOption)
);
const isHorizontal = computed(() => options.value.direction > 1);
const float: any = computed(() =>
  isHorizontal.value
    ? { float: "left", overflow: "hidden" }
    : { overflow: "hidden" }
);
const pos = computed(() => {
  return {
    transform: `translate(${state.xPos}px,${state.yPos}px)`,
    transition: `all ${state.ease} ${state.delay}ms`,
    overflow: "hidden",
  };
});
const navigation = computed(() => options.value.navigation.value);
const autoPlay = computed(() =>
  navigation.value ? false : options.value.autoPlay
);
const scrollSwitch = computed(
  () => props.data.length >= options.value.limitMoveNum
);
const canTouchScroll = computed(() => options.value.openTouch);
const baseFontSize = computed<number>(() =>
  options.value.isSingleRemUnit
    ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize)
    : 1
);
const realSingleStopWidth = computed(
  () => options.value.singleWidth * baseFontSize.value
);
const realSingleStopHeight = computed(
  () => options.value.singleHeight * baseFontSize.value
);
const step = computed(() => {
  let singleStep;
  let step = options.value.step;
  if (isHorizontal.value) {
    singleStep = realSingleStopWidth.value;
  } else {
    singleStep = realSingleStopHeight.value;
  }
  if (singleStep > 0 && singleStep % step > 0) {
    console.error(
      "如果设置了单步滚动,step需是单步大小的约数,否则无法保证单步滚动结束的位置是否准确。~~~~~"
    );
  }
  return step / 2;
});
const _cancle = () => {
  cancelAnimationFrame(state.reqFrame || "");
};
const _move = () => {
  // 鼠标移入时拦截_move()
  if (state.isHover) return;
  _cancle(); //进入move立即先清除动画 防止频繁touchMove导致多动画同时进行
  state.reqFrame = requestAnimationFrame(
    function () {
      const h = state.realBoxHeight / 2; //实际高度
      const w = state.realBoxWidth / 2; //宽度
      let { direction, waitTime } = options.value;
      if (direction === 1) {
        // 上
        if (Math.abs(state.yPos) >= h) {
          emits("ScrollEnd");
          state.yPos = 0;
        }
        state.yPos -= step.value;
      } else if (direction === 0) {
        // 下
        if (state.yPos >= 0) {
          emits("ScrollEnd");
          state.yPos = h * -1;
        }
        state.yPos += step.value;
      } else if (direction === 2) {
        // 左
        if (Math.abs(state.xPos) >= w) {
          emits("ScrollEnd");
          state.xPos = 0;
        }
        state.xPos -= step.value;
      } else if (direction === 3) {
        // 右
        if (state.xPos >= 0) {
          emits("ScrollEnd");
          state.xPos = w * -1;
        }
        state.xPos += step.value;
      }
      if (state.singleWaitTime) clearTimeout(state.singleWaitTime);
      if (realSingleStopHeight.value) {
        //是否启动了单行暂停配置
        if (Math.abs(state.yPos) % realSingleStopHeight.value < step.value) {
          // 符合条件暂停waitTime
          state.singleWaitTime = setTimeout(() => {
            _move();
          }, waitTime);
        } else {
          _move();
        }
      } else if (realSingleStopWidth.value) {
        if (Math.abs(state.xPos) % realSingleStopWidth.value < step.value) {
          // 符合条件暂停waitTime
          state.singleWaitTime = setTimeout(() => {
            _move();
          }, waitTime);
        } else {
          _move();
        }
      } else {
        _move();
      }
    }.bind(this)
  );
};

const _dataWarm = (data: string | any[]) => {
  if (data.length > 100) {
    console.warn(
      `数据达到了${data.length}条有点多哦~,可能会造成部分老旧浏览器卡顿。`
    );
  }
};

const _stopMove = () => {
  state.isHover = true; //关闭_move
  if (state.singleWaitTime) clearTimeout(state.singleWaitTime);
  _cancle();
};
const _initMove = async () => {
  await nextTick();
  const { switchDelay } = options.value;
  _dataWarm(props.data);
  state.copyHtml = ""; //清空copy
  console.log(isHorizontal.value, scrollSwitch.value);

  if (isHorizontal.value) {
    state.height = wrap.value.offsetHeight;
    state.width = wrap.value.offsetWidth;
    let slotListWidth = slotList.value.offsetWidth;
    // 水平滚动设置warp width
    if (autoPlay.value) {
      // 修正offsetWidth四舍五入
      slotListWidth = slotListWidth * 2 + 1;
    }
    realBox.value.style.width = slotListWidth + "px";
    state.realBoxWidth = slotListWidth;
  }
  console.log(autoPlay);

  if (autoPlay.value) {
    state.ease = "ease-in";
    state.delay = 0;
  } else {
    state.ease = "linear";
    state.delay = switchDelay;
    return;
  }

  // 是否可以滚动判断
  if (scrollSwitch.value) {
    let timer;
    if (timer) clearTimeout(timer);
    state.copyHtml = slotList.value.innerHTML;
    setTimeout(() => {
      state.realBoxHeight = realBox.value.offsetHeight;
      _move();
    }, 0);
  } else {
    _cancle();
    state.yPos = state.xPos = 0;
  }
};
const reset = () => {
  _cancle();
  _initMove();
};

const touchStart = (e: any) => {
  if (!canTouchScroll.value) return;
  let timer;
  const touch = e.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
  const { waitTime, singleHeight, singleWidth } = options.value;
  state.startPos = {
    x: touch.pageX,
    y: touch.pageY,
  }; //取第一个touch的坐标值
  state.startPosY = state.yPos; //记录touchStart时候的posY
  state.startPosX = state.xPos; //记录touchStart时候的posX
  if (!!singleHeight && !!singleWidth) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      _cancle();
    }, waitTime + 20);
  } else {
    _cancle();
  }
};
const touchMove = (e: any) => {
  //当屏幕有多个touch或者页面被缩放过，就不执行move操作
  if (
    !canTouchScroll.value ||
    e.targetTouches.length > 1 ||
    (e.scale && e.scale !== 1)
  )
    return;
  const touch = e.targetTouches[0];
  const { direction } = options.value;
  state.endPos = {
    x: touch.pageX - state.startPos.x,
    y: touch.pageY - state.startPos.y,
  };
  event?.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
  const dir = Math.abs(state.endPos.x) < Math.abs(state.endPos.y) ? 1 : 0; //dir，1表示纵向滑动，0为横向滑动
  if (dir === 1 && direction < 2) {
    // 表示纵向滑动 && 运动方向为上下
    state.yPos = state.startPosY + state.endPos.y;
  } else if (dir === 0 && direction > 1) {
    // 为横向滑动 && 运动方向为左右
    state.xPos = state.startPosX + state.endPos.x;
  }
};
const touchEnd = () => {
  if (!canTouchScroll.value) return;
  let timer;
  const direction = options.value.direction;
  state.delay = 50;
  if (direction === 1) {
    if (state.yPos > 0) state.yPos = 0;
  } else if (direction === 0) {
    let h = (state.realBoxHeight / 2) * -1;
    if (state.yPos < h) state.yPos = h;
  } else if (direction === 2) {
    if (state.xPos > 0) state.xPos = 0;
  } else if (direction === 3) {
    let w = state.realBoxWidth * -1;
    if (state.xPos < w) state.xPos = w;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    state.delay = 0;
    _move();
  }, state.delay);
};

// _initMove();

watch(
  () => props.data,
  (newData, oldData) => {
    _dataWarm(newData);
    //监听data是否有变更
    if (!_.isEqual(newData, oldData)) {
      let time_ = setTimeout(() => {
        reset();
        clearTimeout(time_);
      }, 1300);
      // reset();
    }
  }
);

watch(
  () => autoPlay.value,
  (bol) => {
    if (bol) {
      reset();
    } else {
      _stopMove();
    }
  }
);

onBeforeUnmount(() => {
  _cancle();
  clearTimeout(state.singleWaitTime);
});
</script>
