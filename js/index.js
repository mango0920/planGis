var gisObj;


function iframeLoaded() {
  gis.window.initMap({
    onLoad: mapLoaded
  });
}

function mapLoaded(obj) {
  gisObj = obj;
}
