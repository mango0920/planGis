/**
 * 描述：底图枚举
 * 作者：houlu
 * 创建时间：2019/5/20
 * 版权：Copyright 2019 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare"
], function (declare) {
    var d = {
        GAODE_STREET:"gaode_street", //高德街道图
        GAODE_IMAGE:"gaode_image",  //高德卫星影像图
        GAODE_LABEL:"gaode_label",  //高德标注图

        GOOGLE_STREET:"google_street", //谷歌街道图
        GOOGLE_IMAGE:"google_image",  //谷歌卫星影像图
        GOOGLE_LABEL:"google_label",  //谷歌标注图

        TDT_STREET_WGS84:"tdt_street_wgs84",
        TDT_STREET_LABEL_WGS84:"tdt_street_label_wgs84",
        TDT_IMAGE_WGS84:"tdt_image_wgs84",
        TDT_IMAGE_LABEL_WGS84:"tdt_image_label_wgs84"
    }
    return d;
})