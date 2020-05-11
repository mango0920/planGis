;
/**
 * 描述：谷歌地图
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
        var d=declare("GoogleTiledLayer",TiledMapLayer,{


            /**
             * 构造函数
             * @param layerType  切片图类型
             * @param startLevel  地图起始等级
             * @param endLevel    地图最大等级
             */
            constructor: function ( layerType, startLevel, endLevel) {
                this._mapUrl="http://mt0.google.cn/vt/lyrs=m@273000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={4}";
                switch(layerType){
                    case BasemapType.GOOGLE_STREET:
                        this._mapUrl="http://mt0.google.cn/vt/lyrs=m@273000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={4}";
                        break;
                    case BasemapType.GOOGLE_IMAGE:
                        this._mapUrl="http://mt0.google.cn/vt/lyrs=s@175&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={4}";
                        break;
                    case BasemapType.GOOGLE_LABEL:
                        this._mapUrl="http://mt0.google.cn/vt/imgtp=png32&lyrs=h@273000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={4}";
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
                var url=this._mapUrl;
                var strGalileoArray = ["", "G", "Ga", "Gal", "Gali", "Galil", "Galile", "Galileo"];
                var strGalileo = strGalileoArray[((level + col + 1) + row) % strGalileoArray.length];
                url = url.replace ( "{z}" , level );
                url = url.replace ( "{x}" , col );
                url = url.replace ( "{y}" , row );
                url = url.replace ( "{4}" , strGalileo );
                return url;
            },
        });

        return d;
    }
);


