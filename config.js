pathConfig = new function () {
	this.getApiPath = function () {
		return "http://localhost/arcgis_js_v332_sdk/arcgis_js_api/library/3.32/3.32/"
	};

	//离线地图地址
	this.getOffLineTileMapUrl = function () {
		return "";
	};

};

if (typeof (config) == "undefined" || !config) {
	config = {};
};

config.center = { lon: 120.301682, lat: 31.588459 };//无锡

(function () {
	var index = location.href.lastIndexOf("/", location.href.length - 1);
	var a = location.href.substr(0, index);
	var dojoConfig = window.dojoConfig = {
		async: true,
		packages: [
			{
				name: "howso",
				location: location.href.substr(0, index)
			},
			{
				name: "howsomap",
				location: location.href.substr(0, index) + "/howsomap"
			}
		],
		baseUrl: pathConfig.getApiPath() + "dojo/"

	};
})();

