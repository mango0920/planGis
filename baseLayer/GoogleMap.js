;
/**
 * 描述：加载切片图，默认是google地图
 * 作者：houlu
 * 创建时间：2017/9/05
 * 版权：Copyright 2017 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/has",
	"esri/SpatialReference",
	"esri/layers/TiledMapServiceLayer"
],
	function (declare, lang, has, SpatialReference, TiledMapServiceLayer) {
		var d = declare("GoogleMap", TiledMapServiceLayer, {
			/**
* 构造函数
			 * @param layerType  切片图类型，street or image or label,street:街道图，image:影像图,label：标注图
			 * @param startLevel  地图起始等级
			 * @param endLevel    地图最大等级
			 * @param offMapUrl      离线地图地址,如果不填，就是加载在线地图
			 */
			constructor: function (layerType, startLevel, endLevel, offMapUrl) {

				this._layerType = layerType;
				this.spatialReference = new esri.SpatialReference({
					"wkid": 102100
				});
				this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787, this.spatialReference));
				this.tileInfo = new esri.layers.TileInfo({
					"dpi": "96",
					"rows": 256,
					"cols": 256,
					"compressionQuality": 0,
					"origin": {
						"x": -20037508.342787,
						"y": 20037508.342787
					},
					"spatialReference": {
						"wkid": 102100
					},
					"lods": this._getLods(startLevel, endLevel)
				});
				this.loaded = true;
				this.onLoad(this);
				this._offMapUrl = offMapUrl;
				this.opacity = 1;
			},

			/**
* 计算切片图路径
			 * @param level  地图等级
			 * @param row	  行号
			 * @param col     列号
			 * @returns {string}  切片图路径
			 */
			getTileUrl: function (level, row, col) {
				var url = "";
				if (this._offMapUrl && this._offMapUrl != "") {
					url = this._offMapUrl + this._layerType + "/" + level + "/" + col + "/" + row + ".png";
				}
				else {
					var strArray;
					var str2;
					//街道图
					if (this._layerType === "street") {
						url = "http://webrd0{0}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={1}&y={2}&z={3}"; //webrd01
					}
					//标注图
					else if (this._layerType === "label") {
						url = "http://webst0{0}.is.autonavi.com/appmaptile?style=8&x={1}&y={2}&z={3}"; //webrd04
					}
					//影像图
					else if (this._layerType === "image") {
						url = "http://webst0{0}.is.autonavi.com/appmaptile?style=6&x={1}&y={2}&z={3}"; //webrd04
					}

					strArray = ["1", "2", "3", "4"];
					str2 = strArray[((level + col) + row) % strArray.length];
					url = url.replace("{0}", str2);
					url = url.replace("{1}", col);
					url = url.replace("{2}", row);
					url = url.replace("{3}", level);
				}
				return url;

			},

			/**
* 计算地图每个层级下的比例
			 * @param startLevel
			 * @param endLevel
			 * @returns {Array}
			 * @private
			 */
			_getLods: function (startLevel, endLevel) {
				var lods = [];
				var minScale = 591657527.591555;
				var maxResolution = 156543.033928;

				var scale = minScale;
				var resolution = maxResolution;
				for (var i = 0; i <= endLevel; i++) {

					var lod = {
						"level": i,
						"resolution": resolution,
						"scale": scale
					};
					if (i >= startLevel) {
						lods.push(lod);
					}

					scale = scale / 2;
					resolution = resolution / 2;
				}

				return lods;
			}
		});

		return d;
	}
);


