;
/**
 * 描述：切片图
 * 作者：houlu
 * 创建时间：2019/5/20
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define([
        "dojo/_base/declare",
        "esri/SpatialReference",
        "esri/layers/TiledMapServiceLayer"
    ],
    function(declare,SpatialReference,TiledMapServiceLayer){
        var d=declare("TiledMapLayer",TiledMapServiceLayer,{

            /**
             * 构造函数
             * @param layerType  切片图类型
             * @param startLevel  地图起始等级
             * @param endLevel    地图最大等级
             */
            constructor: function ( layerType, startLevel, endLevel) {
                this.spatialReference = new esri.SpatialReference( {
                    "wkid": 102100
                } );
                this.initialExtent = ( this.fullExtent = new esri.geometry.Extent( -20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787, this.spatialReference ) );
                this.tileInfo = new esri.layers.TileInfo( {
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
                    "lods": this._getLods( startLevel, endLevel )
                } );
                this.loaded = true; //必不可少
                this.onLoad( this );
                this.opacity=1;
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

            /**
             * 计算地图每个层级下的比例
             * @param startLevel
             * @param endLevel
             * @returns {Array}
             * @private
             */
            _getLods: function ( startLevel, endLevel ) {
                var lods = [];
                var minScale = 591657527.591555;
                var maxResolution = 156543.033928;

                var scale = minScale;
                var resolution = maxResolution;
                for ( var i = 0; i <= endLevel; i++ ) {

                    var lod = {
                        "level": i,
                        "resolution": resolution,
                        "scale": scale
                    };
                    if ( i >= startLevel ) {
                        lods.push( lod );
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


