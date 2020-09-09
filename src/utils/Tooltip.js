/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 08:32:36
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-08 13:53:23
 */

import $ from "jquery";

// 样式文件在map.css
export var message = {
  draw: {
    point: {
      start: "单击 完成绘制",
    },
    polyline: {
      // 线面
      start: "单击 开始绘制",
      cont: "单击增加点， 右击删除点",
      end: "单击增加点，右击删除点</br>双击完成绘制",
      end2: "单击完成绘制",
    },
  },
  edit: {
    start: "单击后 完成编辑",
    end: "释放后 完成修改",
  },
  dragger: {
    def: "拖动 修改位置", // 默认
    addMidPoint: "拖动 增加点",
    moveHeight: "拖动 修改高度",
    editRadius: "拖动 修改半径",
    editHeading: "拖动 修改方向",
    editScale: "拖动 修改缩放比例",
  },
  del: {
    def: "<br/>右击 删除该点",
    min: "无法删除，点数量不能少于",
  },
};

export function Tooltip(frameDiv) {
  var div = document.createElement("DIV");
  div.className = "div-tooltip right";
  var arrow = document.createElement("DIV");
  arrow.className = "draw-tooltip-arrow";
  div.appendChild(arrow);
  var title = document.createElement("DIV");
  title.className = "draw-tooltip-inner";
  div.appendChild(title);

  this._div = div;
  this._title = title;
  // add to frame div and display coordinates
  frameDiv.appendChild(div);

  // 鼠标的移入
  $(".draw-tooltip").mouseover(() => {
    $(this).hide();
  });
}

Tooltip.prototype.setVisible = function (visible) {
  this._div.style.display = visible ? "block" : "none";
};

Tooltip.prototype.showAt = function (position, message) {
  if (position && message) {
    this.setVisible(true);
    this._title.innerHTML = message;
    this._div.style.top = position.y - this._div.clientHeight / 2 + "px";
    //left css时
    //this._div.style.left = (position.x - this._div.clientWidth - 30) + "px";

    //right css时
    this._div.style.left = position.x + 30 + "px";
  } else {
    this.setVisible(false);
  }
};
