;
/**
 * 描述：天地图
 * 作者：houlu
 * 创建时间：2019/5/23
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define([
        "dojo/_base/declare",
        "esri/SpatialReference",
        "./BasemapType",
        "esri/layers/TiledMapServiceLayer"
    ],
    function(declare,SpatialReference,BasemapType,TiledMapServiceLayer){
        var d=declare("TiledMapLayer",TiledMapServiceLayer,{

            /**
             * 构造函数
             * @param layerType  切片图类型
             * @param startLevel  地图起始等级
             * @param endLevel    地图最大等级
             */
            constructor: function ( layerType, startLevel, endLevel) {
                this.spatialReference = new esri.SpatialReference( {
                    "wkid": 4326
                } );
                this.initialExtent = ( this.fullExtent = new esri.geometry.Extent( -180, -90, 180, 90, this.spatialReference ) );
                this.tileInfo = new esri.layers.TileInfo( {
                    "dpi": "96",
                    "rows": 256,
                    "cols": 256,
                    "compressionQuality": 0,
                    "origin": {
                        "x": -180,
                        "y": 90
                    },
                    "spatialReference": {
                        "wkid": 4326
                    },
                    "lods": this._getLods( startLevel, endLevel )
                } );
                this._mapUrl="";
                switch(layerType){
                    case BasemapType.TDT_STREET_WGS84:
                        this._mapUrl="http://t{col%8}.tianditu.com/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles";
                        break;
                    case BasemapType.TDT_STREET_LABEL_WGS84:
                        this._mapUrl="http://t{row%8}.tianditu.com/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles";
                        break;
                    case BasemapType.TDT_IMAGE_WGS84:
                        this._mapUrl="http://t0.tianditu.com/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" ;
                        break;
                    case BasemapType.TDT_IMAGE_LABEL_WGS84:
                        this._mapUrl="http://t0.tianditu.com/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles";
                        break;
                }
                this._mapUrl+="&tk=d939b92b33c174d9bca699888292a568";
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
                    url = url.replace ( "{col%8}" , col%8 );
                    url = url.replace ( "{row%8}" , row%8 );
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
                var minScale = 147748796.52937502*2*2;
                var maxResolution = 0.3515625*2*2;

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


