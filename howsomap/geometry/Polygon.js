/**
 * 描述：多边形
 * 作者：houlu
 * 创建时间：2019/5/14
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./Geometry",
    "./GeometryType",
    "esri/geometry/Polygon",
    "esri/geometry/Point"
], function (declare,Geometry,GeometryType,ArcPolygon,ArcPoint) {
    var d = declare("howsomap.geometry.Polygon", Geometry,{
        /**
         * 构造函数
         * @param  map:地图对象
         */
        constructor: function (map,rings) {
            this._map=map;
            this.rings=rings||[];
            this.type=GeometryType.POLYGON;

        },


        /**
         * 坐标转像素
         */
        toPixel:function(){
            let pixelRings=[];
            let pixelScale=this.getPixelScale();
            for(let i=0;i<this.rings.length;i++){
                let ring=this.rings[i];
                let pixelRing=[];
                for(let j=0,length=ring.length;j<length;j++){
                    let pt=ring[j];
                    let pixelPt=this._toScreenPt(pt.x,pt.y,pixelScale);
                    pixelRing.push(pixelPt);
                }
                pixelRings.push(pixelRing);
            }
            return pixelRings;
        },

        /**
         * 判断点是否在多边形内,利用arcgis的API
         * @param pt 平面坐标
         */
        contains:function(mapPoint){
            //构成arcgis的polygon
            if(!this._arcPolygon){
                this._arcPolygon=new ArcPolygon(this._map.spatialReference);
                for(let i=0;i<this.rings.length;i++){
                    let ring=this.rings[i];
                    let arcRing=[];
                    for(let j=0,length=ring.length;j<length;j++){
                        let pt=ring[j];
                        arcRing.push([pt.x,pt.y]);
                    }
                    this._arcPolygon.addRing(arcRing);
                }
            }
            let arcPoint=new ArcPoint(mapPoint.x,mapPoint.y,this._map.spatialReference);
            return this._arcPolygon.contains(arcPoint);
        },


        /**
         * 是否在地图显示范围内
         */
        isInMapExtent:function(){

            return true;
        }



    });
    return d;
})