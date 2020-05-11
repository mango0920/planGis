/**
 * 描述：线
 * 作者：houlu
 * 创建时间：2018/10/9
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./Geometry",
    "./GeometryType",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/geometry/geometryEngine"
], function (declare,Geometry,GeometryType,ArcPolyline,ArcPoint,ArcGeometryEngine) {
    var d = declare("howsomap.geometry.Polyline", Geometry,{
        /**
         * 构造函数
         * @param  map:地图对象
         */
        constructor: function (map,paths) {
            this._map=map;
            this.paths=paths||[];
            this.type=GeometryType.POLYLINE;
        },

        /**
         * 转像素坐标
         */
        toPixel:function(){
            let pixePaths=[];
            let path;
            let pixelPath;
            let pt;
            //遍历路径
            for(let i=0;i<this.paths.length;i++){
                path=this.paths[i];
                pixelPath=[];
                //遍历点数据
                for(let j=0,length=path.length;j<length;j++){
                    pt=path[j];
                    pixelPath.push(this._toScreenPt(pt.x,pt.y));
                }
                pixePaths.push(pixelPath);

            }
            return pixePaths;
        },

        /**
         * 是否包含点坐标
         * @param pt 平面坐标
         */
        contains:function(pt,symbol){
            return false;
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