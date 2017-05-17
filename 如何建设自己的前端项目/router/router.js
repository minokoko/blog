/**
	前端路由器：
		功能：页面跳转、记录页面状态、资源加载、参数传递
		解决方案：hash+hashChange / hTML5 history API
  */
(function(w){
	var _isFun = function(fun){
		return (Object.prototype.toString.call(fun) === '[object Function]');
	};
	var _getPathQuery = function(){
		var pathDetail = window.location.hash.replace(/.*#/,'').split('?'),
			path = pathDetail[0]?pathDetail[0]:'/',
			params = pathDetail[1]?pathDetail[1].split('&'):[],
			query = {};
		for(var i=0;i<params.length;i++){
			var item = params[i].split('=');
				query[item[0]] = item[1];
		}
		return {
			path: path,
			query: [query]
		};
	};

	function YsRouters(){
		this.routers = {}; //页面路径存储{key[path]:value[object]}
		this.defaultAction = null;

		this.init();
	}
	// Router 对象初始化 url change 监听
	YsRouters.prototype.init = function(){
		var that = this;
		window.addEventListener('hashchange',function(){
			that.urlChange();
		},false);

		window.addEventListener('load',function(){
			that.urlChange();
		},false);
	};
	// Router 注册path
	// 参数传递形式：[:name]/path/[value]
	YsRouters.prototype.map = function(map){
		var that = this,
			defaultAction = map['/'];
		if(defaultAction){
			that.defaultAction = defaultAction;
		}
		this.routers = map;
	};
	YsRouters.prototype.when = function(path,opt){
		var that = this,
			path = path?path:'/';

		if(!that.routers.hasOwnProperty(path)){
			that.routers[path] = {
				action: opt.action,
				regPath
				query:_getQuery(path)
			}
		}

		return this;
	};
	//path 改变触发回调方法
	YsRouters.prototype.urlChange = function(){
		var currentUrl = _getPathQuery();
		if(this.routers[currentUrl.path]){
			var routeItem = this.routers[currentUrl.path];
			if(_isFun(routeItem.action)){
				routeItem.action && routeItem.action.call(null,currentUrl);
			}
		}else{
			this.defaultAction();
		}
	};
	//资源加载方法
	YsRouters.prototype.loadAsset = function(file,urlParam){
		var that = this,
			router = that.routers[urlParam.path],
			query = urlParam.query;

		if(router.fn){

		}else{
			var scriptEle = document.createElement('script');
				scriptEle.type = 'text/javascript';
				scriptEle.src = file;
				scriptEle.onload = function(){
					console.log('下载'+file+'完成');
					router.fn = true;
				};
			document.getElementsByTagName('body')[0].appendChild(scriptEle);
		}
	};

	window.ysRouters = new YsRouters();
})(window)