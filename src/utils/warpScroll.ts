const autoScroll = ({
  scrollDom,
  fatherDom,
  start = 0,
  speed,
  dataList,
  itemHeight,
  direction = "top",
}: any) => {
  console.log("🚀 ~ file: warpScroll.ts:10 ~ dataList", dataList);
  if (!Array.isArray(dataList)) {
    return;
  }
  if (!(dataList.length * itemHeight > fatherDom.scrollHeight)) {
    return;
  }
  let t: any = null;
  const wrapper = scrollDom;
  (function startAnimate() {
    t = setInterval(function () {
      const end = 0;
      if (Math.abs(start) > dataList.length * itemHeight - 5 * itemHeight) {
        clearInterval(t);

        start = 0;
        console.log("🚀 ~ file: warpScroll.ts:23 ~ start", start);
        start += speed;
        // wrapper.style[direction] = start + "px";
        // wrapper.offsetTop(0, start)
      } else {
        start += speed;
        // wrapper.scrollTop(0, start)
        // end = 0
        // end += speed;
        // wrapper.offsetTop({bottom:start})
        // wrapper.style[direction] = start + "px";
      }
    }, 50);
  })();
  // 鼠标移入时进度条应该显示;
  // wrapper.ontouchstart = function () {
  //   clearInterval(t);
  // };

  //   wrapper.ontouchmove = function (evt: any) {
  //     console.log("🚀 ~ file: warpScroll.ts:36 ~ evn", evt)
  //     var e = evt || event;
  //     var offsetY = e.offsetX;
  //     console.log("🚀 ~ file: warpScroll.ts:39 ~ offsetY", offsetY)
  //     var cl = wrapper.offsetTop;
  //     console.log("🚀 ~ file: warpScroll.ts:41 ~ cl", cl)
  //     document.onmousemove = function(evt){

  //       var e = evt || event;
  //       console.log("🚀 ~ file: warpScroll.ts:49 ~ e.clientY", e.clientY)
  // }

  //   }

  // wrapper.ontouchend = function () {
  //   startAnimate();
  // };
};

export default autoScroll;
