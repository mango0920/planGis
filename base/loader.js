(function(){
	/**
	 * opts:{
	 * 	el:'${path}'
	 *  path:'http://192.168.10.171/roadtest/gisapi'
	 * }
	 * */
	function syncLoadScript(obj){
		const tags = document.getElementsByTagName('script');
		const tagArr = [].slice.apply(tags,[0]);
		for(let i=0;i<tagArr.length;i++){
			let src = tagArr[i].getAttribute('data-src');
			if(src){
				let newSrc = format(src,obj);
				document.write('<script src="'+newSrc+'" type="text/javascript"></script>');
			}
		}
	}
	function syncLoadCss(obj){
		const tags = document.getElementsByTagName('link');
		const tagArr = [].slice.apply(tags,[0]);

		for(let i=0;i<tagArr.length;i++){
			let src = tagArr[i].getAttribute('data-href');
			if(src){
				let newSrc = format(src,obj);
				document.write('<link type="text/css" rel="stylesheet" href="'+newSrc+'"></link>');
			}
		}
	}
	function format(tmpl,obj){
		var reg = null;
		for(var i in obj){
			reg = new RegExp("\{\{"+i+"\}\}");
			tmpl = tmpl.replace(reg,obj[i]);
		}
		return tmpl;
	}
	syncLoadScript({
		path:pathConfig.getApiPath()
	});
	syncLoadCss({
		path:pathConfig.getApiPath()
	});
}());
