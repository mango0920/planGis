;
/**
 * 描述：高德地图
 * 作者：houlu
 * 创建时间：2019/5/20
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define([
        "dojo/_base/declare",
        "esri/SpatialReference",
        "./TiledMapLayer",
        "./BasemapType"
    ],
    function(declare,SpatialReference,TiledMapLayer,BasemapType){
        var d=declare("GaodeTiledLayer",TiledMapLayer,{


            /**
             * 构造函数
             * @param layerType  切片图类型
             * @param startLevel  地图起始等级
             * @param endLevel    地图最大等级
             */
            constructor: function ( layerType, startLevel, endLevel) {
                this._mapUrl="http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
                switch(layerType){
                    case BasemapType.GAODE_STREET:
                        this._mapUrl="http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
                        break;
                    case BasemapType.GAODE_IMAGE:
                        this._mapUrl="http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
                        break;
                    case BasemapType.GAODE_LABEL:
                        this._mapUrl="http://webst04.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}";
                        break;
                }
            },

            /**
             * 计算切片图路径
             * @param level  地图等级
             * @param row	  行号
             * @param col     列号
             * @returns {string}  切片图路径
             */
            getTileUrl: function ( level, row, col ) {
                return this.inherited(arguments);
            },
        });

        return d;
    }
);


