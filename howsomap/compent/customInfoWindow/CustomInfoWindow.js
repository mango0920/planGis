;
/**
 * 描述：带指向的信息框
 * 作者：houlu
 * 创建时间：2018/10/06
 * 版权：Copyright 2017 Howso Tech. Co. Ltd. All Rights Reserved.
 * Company:南京华苏科技有限公司
 */
define(["dojo/_base/declare",
], function (declare) {
    var d = declare("howsomap.compent.customInfoWindow.CustomInfoWindow", null, {
        constructor: function (options) {
            this._map = options.map;
            this._closedCallBack = options.closedCallBack;
            this._container = options.container;

            this._minWidth = options.minWidth;
            this._minHeight = options.minHeight;
            this._maxWidth = options.maxWidth;
            this._maxHeight = options.maxHeight;
            this._map.on("pan", this._mapPanned.bind(this));
            this._map.on("extent-change", this._mapExtentChanged.bind(this));
        },

        /**
         * 显示内容
         * @param parameters：{
         *      title:标题
         *      infoArr:需要显示的信息
         *      x:地理坐标,
         *      y:地理坐标,
         *      offsetX:横向偏移，像素坐标
         *      offsetY:坐标偏移，像素坐标
         * {
         */
        showContent: function (parameters) {
            this._index = 0;
            this._infoArr = parameters.infoArr;
            this._x = parameters.x;
            this._y = parameters.y;
            this._title = parameters.title;
            this._offsetX = parameters.offsetX;
            this._offsetY = parameters.offsetY;

            //信息框
            if (!this._infoWindowContainer) {
                this._infoWindowContainer = document.createElement("div");
                this._infoWindowContainer.className = "customPopup";
            }
            this._infoWindowContainer.innerHTML = "";
            this._container.appendChild(this._infoWindowContainer);

            //创建title
            var titleContainerDiv = document.createElement("div");
            titleContainerDiv.className = "titlePane";
            this._infoWindowContainer.appendChild(titleContainerDiv);
            this._titleDiv = document.createElement("div");
            this._titleDiv.className = "title";
            titleContainerDiv.appendChild(this._titleDiv);
            //创建删除按钮
            var closeDiv = document.createElement("div");
            closeDiv.className = "titleButton close";
            closeDiv.onclick = this._closeInfoWindow.bind(this);
            titleContainerDiv.appendChild(closeDiv);
            //创建“上一个”按钮
            this._preDiv = document.createElement("div");
            this._preDiv.id = "preDiv";
            this._preDiv.className = "titleButton prev";
            this._preDiv.onclick = this._showPre.bind(this);
            titleContainerDiv.appendChild(this._preDiv);
            //创建“下一个”按钮
            this._nextDiv = document.createElement("div");
            this._nextDiv.id = "nextDiv";
            this._nextDiv.className = "titleButton next";
            this._nextDiv.onclick = this._showNext.bind(this);
            titleContainerDiv.appendChild(this._nextDiv);

            //创建内容总容器
            var contentTotalDiv = document.createElement("div");
            contentTotalDiv.className = "contentTotalPane";
            this._infoWindowContainer.appendChild(contentTotalDiv);
            //内容容器
            var contentDiv = document.createElement("div");
            contentDiv.className = "contentPane";
            contentTotalDiv.appendChild(contentDiv);
            //table
            var table = document.createElement("table");
            table.id = "attrTable";
            table.className = "attrTable";
            contentDiv.appendChild(table);

            //创建指示三角形
            var pointerDiv = document.createElement("div");
            this._infoWindowContainer.appendChild(pointerDiv);
            pointerDiv.id = "pointerDiv";

            //设置最大高度
            if (this._maxHeight) {
                var elements = document.getElementsByClassName("contentPane");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.maxHeight = this._maxHeight + "px";
                }
            }

            //显示内容
            this._showContent(this._infoArr[0]);
            //控制翻页按钮
            this._controlNextAndPreButton();
            //计算箭头样式
            this._calculatePointer(this._x, this._y);
        },

        /**
         * 显示内容
         * @param data
         * @private
         */
        _showContent: function (data) {
            var table = document.getElementById("attrTable");
            var tableLength = table.rows.length;
            for (var i = tableLength - 1; i >= 0; i--) {
                table.deleteRow(i);
            }

            var font = "";
            var maxLabelWidth = 0;
            var maxValueWidth = 0;
            for (var label in data) {
                var row = table.insertRow();
                var labelTd = row.insertCell();
                var valueTd = row.insertCell();
                labelTd.className = "attrName";
                valueTd.className = "attrValue";
                labelTd.innerHTML = label + "：";
                valueTd.innerHTML = data[label];
                //let elements=document.getElementsByName("attrName");
                //获取字体
                if (font == "") {
                    font = document.getElementsByClassName("attrName")[0].style.font;
                }
                //找出label与value各自最大的长度
                maxLabelWidth = Math.max(this._computeLabelSize(labelTd.innerHTML).width, maxLabelWidth);
                maxValueWidth = Math.max(this._computeLabelSize(valueTd.innerHTML).width, maxValueWidth);
            }
            //设置最小宽度
            if (this._minWidth) {
                this._setWindowWidth(this._minWidth);
            }
            var width = maxLabelWidth + maxValueWidth + 40;
            //如果设置了最大宽度，那么得计算里面的内容是否超标
            if (this._maxWidth) {
                //如果连最小宽度都没达到，就不需要考虑最大宽度
                if (width < this._minWidth) {
                    return;
                }
                if (width < this._maxWidth) {
                    this._setWindowWidth(width);
                }
                else {
                    this._setWindowWidth(this._maxWidth);
                    var elements = document.getElementsByClassName("attrName");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.whiteSpace = "nowrap";
                    }
                }

            }
        },

        /**
         * 计算箭头的需要用哪种样式
         * @param x 像素坐标
         * @param y
         * @private
         */
        _calculatePointer: function (x, y) {
            var map = this._map;
            var pixelScale_x = map.extent.getWidth() / map.width;
            x = ( x - map.extent.xmin ) / pixelScale_x | 0 + this._offsetX;
            y = map.height - ( y - map.extent.ymin ) / pixelScale_x | 0 + this._offsetY;
            var className = "";
            var pointerDiv = document.getElementById("pointerDiv");
            if (pointerDiv === null) {
                return;
            }
            //箭头在左边
            if (this._container.clientWidth > x + this._infoWindowContainer.clientWidth) {
                //判断箭头在上、中、下
                //上
                if (y < this._infoWindowContainer.clientHeight / 2) {
                    className = "pointer topleft";
                    x = x - 7 - 16 / 2;
                    y = y + 16 * Math.sin(Math.PI / 4);

                }
                //下
                else if (this._container.clientHeight - y < this._infoWindowContainer.clientHeight / 2) {
                    className = "pointer bottomleft";
                    x = x - 7 - 16 / 2;
                    y = y - 16 * Math.sin(Math.PI / 4) - this._infoWindowContainer.clientHeight;
                }
                //中
                else {
                    className = "pointer left";
                    x = x + 16 * ( Math.sin(Math.PI / 4) );
                    y = y - this._infoWindowContainer.clientHeight / 2 - 16 / 2;
                }
            }
            //箭头在右边
            else {
                //上
                if (y < this._infoWindowContainer.clientHeight / 2) {
                    className = "pointer topright";
                    y = y + 16 * Math.sin(Math.PI / 4);
                    x = x + 7 + 16 / 2 - this._infoWindowContainer.clientWidth;
                }
                //下
                else if (this._container.clientHeight - y < this._infoWindowContainer.clientHeight / 2) {
                    className = "pointer bottomright";
                    x = x + 7 + 16 / 2 - this._infoWindowContainer.clientWidth;
                    y = y - 16 * Math.sin(Math.PI / 4) - this._infoWindowContainer.clientHeight;
                }
                //中
                else {
                    className = "pointer right";
                    x = x - 16 * ( Math.sin(Math.PI / 4) ) - this._infoWindowContainer.clientWidth;
                    y = y - this._infoWindowContainer.clientHeight / 2 - 16 / 2;
                }
            }
            pointerDiv.className = className;
            this._infoWindowContainer.style.left = x + "px";
            this._infoWindowContainer.style.top = y + "px";
            this._mapPanned({delta: {x: 0, y: 0}});
        },

        /**
         * @private 控制翻页按钮
         */
        _controlNextAndPreButton: function () {
            this._preDiv.className = "titleButton pre hidden";
            this._nextDiv.className = "titleButton next hidden";
            if (this._index > 0) {
                this._preDiv.className = "titleButton pre";
            }
            if (this._index < this._infoArr.length - 1) {
                this._nextDiv.className = "titleButton next"
            }
            this._titleDiv.innerHTML = this._title;
            if (this._infoArr.length > 1) {
                this._titleDiv.innerHTML += " (" + ( this._index + 1 ) + "/" + this._infoArr.length + ")";
            }
        },


        /**
         * 显示上一个
         * @private
         */
        _showPre: function () {
            this._index--;
            this._showContent(this._infoArr[this._index]);
            this._calculatePointer(this._x, this._y);
            this._controlNextAndPreButton();
        },

        /**
         * 显示下一个
         * @private
         */
        _showNext: function () {
            this._index++;
            this._showContent(this._infoArr[this._index]);
            this._calculatePointer(this._x, this._y);
            this._controlNextAndPreButton();
        },

        /**
         * 关闭
         * @private
         */
        _closeInfoWindow: function () {
            this._container.removeChild(this._infoWindowContainer);
            this._closedCallBack();
        },

        /**
         * 地图拖动的事件响应
         * @private
         */
        _mapPanned: function (event) {
            if (this._infoWindowContainer) {
                var translate = "translate(" + event.delta.x + "px," + event.delta.y + "px)";
                this._infoWindowContainer.style.transform = translate;
                this._infoWindowContainer.style.WebkitTransform = translate;
                this._infoWindowContainer.style.MozTransform = translate;
                this._infoWindowContainer.style.OTransform = translate;
                this._infoWindowContainer.style.msTransform = translate;
            }
        },

        /**
         * 地图范围改变的事件响应
         * @private
         */
        _mapExtentChanged: function (event) {
            if (this._infoWindowContainer) {
                this._calculatePointer(this._x, this._y);
            }

        },

        //计算字符串长宽
        _computeLabelSize: function (label, font) {
            if (!this._divCompute) {
                this._divCompute = document.createElement("div");
                //this._divCompute.cssText="position:absolute;visibility:hidden";
                // this._divCompute.style.fontSize=fontsize;
                this._divCompute.style.position = "absolute";
                this._divCompute.style.visibility = "hidden";
                this._divCompute.style.font = font;
                document.getElementById("container").appendChild(this._divCompute);
            }
            this._divCompute.innerHTML = label;
            var width = this._divCompute.offsetWidth;
            var height = this._divCompute.offsetHeight;
            return {width: width, height: height};
        },

        //设置弹窗大小
        _setWindowWidth: function (width) {
            var elements = document.getElementsByClassName("customPopup");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.width = width + "px";
            }
            elements = document.getElementsByClassName("contentTotalPane");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.width = width + "px";
            }
        }

    });
    return d;
});














