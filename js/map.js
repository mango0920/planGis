var map;

// 初始化地图
function initMap(options) {
  _options = options;
  require([
    "esri/map",
    "esri/SpatialReference",
    "esri/layers/GraphicsLayer",
    "baseLayer/GoogleMap.js",
    "base/coordconvert/CoordConvert.js",
  ], function (Map, SpatialReference, GraphicsLayer, GoogleMap, CoordConvert) {
    map = new Map("map", {
      center: [118.80858, 32.04763],
      zoom: 12,
      maxZoom: 17,
      minZoom: 2,
      logo: false,
      force3DTransforms: true,
      wrapAround180: false
    });

    // 设置地图坐标系
    var spatialReference = new SpatialReference(102100);
    map.spatialReference = spatialReference;

    // 加载街道切片图层 1-20 级
    var streetLayer = new GoogleMap("street", 1, 20);

    map.on("load", function () {
      options.onLoad({

      });
    })

    map.addLayer(streetLayer);

  });
}







