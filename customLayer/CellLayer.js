define([
    "dojo/_base/declare",
    "howsomap/geometry/Point",
    "howsomap/geometry/Sector",
    "howsomap/layers/canvas/GraphicsLayer",
    "howsomap/symbols/FillSymbol",
    "howsomap/symbols/LineSymbol",
    "howsomap/Graphic",
    "howso/base/coordconvert/CoordConvert"
], function (declare, Point, Sector, GraphicsLayer, FillSymbol, LineSymbol, Graphic) {
    var d = declare("customLayer.CellLayer", GraphicsLayer, {
        constructor: function (options) {
            this._map = options.map;
            this._angle = 30;
            this._r = 100;
            this.coordConvert = new howso.CoordConvert();
        },


        setCells: function (cells) {
            for (var i = 0, length = cells.length; i < length; i++) {
                var cell = cells[i];
                var lineSymbol = new LineSymbol({
                    lineColor: "#ff0000",
                    lineWidth: 2
                });
                var fillSymbol = new FillSymbol({
                    fillColor: "rgba(0,255,0,0.5",
                    outline: lineSymbol
                });
                var coord = this.coordConvert.wgs84_To_gcj02mercator(cell.x, cell.y);
                var geo = new Sector(this._map, coord.x, coord.y, this._r, Number(cell.az), this._angle, 1, 100);
                var graphic = new Graphic(geo, fillSymbol);
                this.addGraphic(graphic);
            }
            this.draw();
        }
    })
    return d;
});