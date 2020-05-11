/**
 * 描述：填充样式
 * 作者：houlu
 * 创建时间：2018/10/10
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./SymbolType"
], function (declare,SymbolType) {
    var d = declare("howsomap.symbols.FillSymbol",null, {
        /**
         * 构造函数
         * @param
         */
        constructor: function (options) {
            this.color=options.fillColor;
            this.outline=options.outline;
            this.type=SymbolType.FILLSYMBOL;
        },


    });
    return d;
})