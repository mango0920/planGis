/**
 * 描述：线样式
 * 作者：houlu
 * 创建时间：2018/10/10
 * 版权：Copyright 2018 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */

define(["dojo/_base/declare",
    "./SymbolType"
], function (declare,SymbolType) {
    var d = declare("howsomap.symbols.LineSymbol",null, {
        /**
         * 构造函数
         * @param dash:[实心距离，空心距离]
         */
        constructor: function (options) {
            this.lineColor=options.lineColor||"#0";
            this.lineWidth=options.lineWidth||0;
            this.lineDash=options.lineDash;
            this.type=SymbolType.LINESYMBOL;
            this.shadowBlur=options.shadowBlur;

        },

    });
    return d;
})