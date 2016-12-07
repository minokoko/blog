/**
	前端路由器：
		功能：页面跳转、记录页面状态、资源加载、参数传递
		解决方案：hash+hashChange / hTML5 history API
  */
(function(w){
	function YsRouters(){
		this.routers = {}; //页面路径存储{key[path]:value[object]}
	}
	// Router 对象初始化 url change 监听
	YsRouters.prototype.init = function(){
		window.addEventListener('hashChange',function(){},false);
		window.addEventListener('load',function(){},false);
	};
	// Router 注册path
	YsRouters.prototype.map = function(path,callback){
		var that = this,
			path = path.replace(/\s*/g,'');
		that.routers[path] = {
			fn: null
		};
		if(Object.prototype.toString.call(callback) === '[object Function]'){
			that.routers[path].callback = callback;
		}

	};
	//path 改变触发回调方法
	YsRouters.prototype.urlChange = function(){

	};
	//资源加载方法
	YsRouters.prototype.loadAsset = function(){

	};
})(window)