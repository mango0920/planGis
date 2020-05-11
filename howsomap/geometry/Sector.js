/**
 * 描述：扇形
 * 作者：houlu
 * 创建时间：2018/10/9
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./Geometry",
    "./GeometryType"
], function (declare,Geometry,GeometryType) {
    var d = declare("howsomap.geometry.Sector", Geometry,{
        /**
         * 构造函数
         * @param  map:地图对象
         */
        constructor: function (map,x,y,r,azimuth,angle,minPixelR,maxPixelR) {
            this._map=map;
            this.x=x||0;
            this.y=y||0;
            this.r=r||0;
            this.azi=azimuth;
            this.angle=angle;
            this.minPixelR=minPixelR;
            this.maxPixelR=maxPixelR;
            this.type=GeometryType.SECTOR;

            //计算像素坐标系的起始终点角度
            let pixelAz = this.azi - 90;
            if (pixelAz < 0) {
                pixelAz += 360;
            }
            this.beginAzi = pixelAz - this.angle / 2;
            this.endAzi = pixelAz + this.angle / 2;

        },

        /**
         * 转像素坐标
         */
        toPixel:function(){
            let pixelScale=this.getPixelScale();
            let pt=this._toScreenPt(this.x,this.y,pixelScale);
            let r=this._calculPixelRadius(this.r,pixelScale);
            // this.pixelx=pt.x;
            // this.pixely=pt.y;
            // this.pixelr=r;
            return {x:pt.x,y:pt.y,r:r,begin:this.beginAzi/180*Math.PI,end:this.endAzi/180*Math.PI,angle:this.angle};
        },

        /**
         * 是否包含点坐标
         * @param pt 平面坐标
         */
        contains:function(pt,symbol){

            var sector=this.toPixel();
            var point=this._toScreenPt(pt.x,pt.y);
            //判断距离
            if(Math.pow(point.x-sector.x,2)+Math.pow(point.y-sector.y,2)>Math.pow(sector.r,2)){
                return false;
            }
            //再判断角度
            var azimuth = Math.atan2(point.x - sector.x,sector.y- point.y) * 180 / Math.PI;
            if (azimuth < 0) {
                azimuth += 360;
            }
            if (this.azi == 0) {
                this.azi = 360;
            }
            if((Math.abs(azimuth - this.azi) <= this.angle / 2 || 360 - Math.abs(azimuth - this.azi) <= this.angle / 2)){
                return true;
            }
            return false;
        },


        /**
         * 计算像素半径
         * @param r
         * @private
         */
        _calculPixelRadius:function(r,pixelScale){
            var pixelR=r/pixelScale.x;
            //半径在最大最小半径之间
            if(this.minPixelR && pixelR<this.minPixelR){
                pixelR=this.minPixelR;
            }
            if(this.maxPixelR && pixelR>this.maxPixelR){
                pixelR=this.maxPixelR;
            }
            return pixelR;
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