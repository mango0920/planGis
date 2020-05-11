;
/**
 * 描述：蓝色风格的地图
 * 作者：houlu
 * 创建时间：2019/5/20
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define([
        "dojo/_base/declare",
        "dojo/request/script",
        "esri/layers/TiledMapServiceLayer"
    ],
    function(declare,requestScript,TiledMapServiceLayer){
        var d=declare("BlueStyleTiledLayer",TiledMapServiceLayer,{


            /**
             * 构造函数
             * @param layerType  切片图类型
             * @param startLevel  地图起始等级
             * @param endLevel    地图最大等级
             */
            constructor: function ( ) {
                // var url="http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
                var url = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
                requestScript.get(url+"?f=json",{
                    jsonp:"callback"
                }).then(
                    function(result){
                        this._mapUrl=url+"/tile/{z}/{y}/{x}";
                        this.tileInfo=new esri.layers.TileInfo(result.tileInfo);
                        this.spatialReference=new esri.SpatialReference(result.spatialReference);
                       this.fullExtent = new esri.geometry.Extent( result.fullExtent.xmin, result.fullExtent.ymin, result.fullExtent.xmax, result.fullExtent.ymax, this.spatialReference );
                       this.initialExtent=new esri.geometry.Extent( result.initialExtent.xmin, result.initialExtent.ymin, result.initialExtent.xmax, result.initialExtent.ymax, this.spatialReference );
                        this.loaded = true; //必不可少
                        this.onLoad( this );
                        this.opacity=1;
                    }.bind(this),
                    function (err){
                        alert(err)
                    }.bind(this)
                )
            },

            /**
             * 计算切片图路径
             * @param level  地图等级
             * @param row	  行号
             * @param col     列号
             * @returns {string}  切片图路径
             */
            getTileUrl: function ( level, row, col ) {
                var url="";
                if(this._mapUrl){
                    url=this._mapUrl;
                    url = url.replace ( "{x}" , col );
                    url = url.replace ( "{y}" , row );
                    url = url.replace ( "{z}" , level );
                }
                return url;
            },


        });

        return d;
    }
);


