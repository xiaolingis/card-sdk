/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-15 14:49:52
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-10-19 10:20:49
 */
import * as Cesium from "cesium";
import { Util } from "../core/index";

export function style2Entity(style, entityAttr) {
  style = style || {};
  if (entityAttr == null) {
    // 默认值
    entityAttr = {
      fill: true,
    };
  }

  // 贴地时，剔除高度相关属性
  if (style.clampToGround) {
    if (style.hasOwnProperty("height")) delete style.height;
    if (style.hasOwnProperty("extrudeHeight")) delete style.extrudeHeight;
  }

  // style 赋值给entity
  for (var key in style) {
    var value = style[key];
    switch (key) {
      default:
        // 直接赋值
        entityAttr[key] = value;
        break;
      case "opacity": // 跳过扩展其他属性的参数
      case "outlineOpacity":
        break;
      case "outlineColor":
        // 边框颜色
        entityAttr.outlineColor = new Cesium.Color.fromCssColorString(
          value || "#FFFF00"
        ).withAlpha(style.outlineOpacity || style.opacity || 1.0);
        break;
      case "height":
        entityAttr.height = Number(value);
        if (style.extrudeHeight)
          entityAttr.extrudeHeight =
            Number(style.extrudeHeight) + Number(value);
        break;
      case "color":
        // 填充颜色
        entityAttr.material = new Cesium.Color.fromCssColorString(
          value || "#FFFF00"
        ).alpha.withAlpha(Number(style.opacity || 1.0));
        break;
      case "image":
        // 填充图片
        entityAttr.material = new Cesium.ImageMaterialProperty({
          image: style.image,
          color: new Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(
            Number(style.opacity || 1.0)
          ),
        });
        break;
      case "rotation":
        // 旋转角度
        entityAttr.rotation = Cesium.Math.toRadians(value);
        if (!style.stRotation)
          entityAttr.stRotation = Cesium.Math.toRadians(value);
        break;
      case "stRotation":
        entityAttr.stRotation = Cesium.Math.toRadians(value);
        break;
    }
  }

  // 如果未设置任何material,设置默认颜色
  if (entityAttr.material == null) {
    entityAttr.material = Cesium.Color.fromRandom({
      minimumGreen: 0.75,
      maximumBlue: 0.75,
      alpha: Number(style.opacity || 1.0),
    });
  }

  return entityAttr;
}

//获取entity的坐标
export function getPositions(entity) {
  if (entity._positions_draw && entity._positions_draw.length > 0)
    return entity._positions_draw;

  var re = entity.rectangle.coordinates.getValue(); // Rectangle
  var height = entity.rectangle.height ? entity.rectangle.height.getValue() : 0;

  var pt1 = Cesium.Cartesian3.fromRadians(re.west, re.south, height);
  var pt2 = Cesium.Cartesian3.fromRadians(re.east, re.north, height);
  return [pt1, pt2];
}

// 获得外边界坐标
export function getOutlinePositions(entity) {
  var positions = getPositions(entity);
  return [
    {
      x: positions[0].x,
      y: positions[0].y,
      z: positions[0].z,
    },
    {
      x: positions[1].x,
      y: positions[0].y,
      z: positions[0].z,
    },
    {
      x: positions[1].x,
      y: positions[1].y,
      z: positions[1].z,
    },
    {
      x: positions[0].x,
      y: positions[1].y,
      z: positions[1].z,
    },
  ];
}

// 获取entity的坐标（geojson规范的格式）
export function getCoordinates(entity) {
  var positions = this.getPositions(entity);
  var coordinates = Util.cartesians2lonlats(positions);
  return coordinates;
}

export function toGeoJson(entity) {
  var coordinates = this.getCoordinates(entity);
  return {
    type: "Feature",
    properties: entity.attribute || {},
    geometry: {
      type: "MultiPoint",
      coordinates: coordinates,
    },
  };
}
