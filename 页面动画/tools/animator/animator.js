(function(g){
	/**
	 * 动画对象
	 * @param {Number} duration 动画时长
	 * @param {Function} progress 动画进展
	 * @param {Function} easing   缓动函数
	 */
	function Animator(duration, progress, easing){
		this.duration = duration;
		this.progress = progress;
		this.easing = easing || function(p){return p;};
	}
	/**
	 * 动画开始事件
	 * @param  {String|Function} finished 动画完成标志
	 */
	Animator.prototype.start = function(finished){
		var startTime = Date.now(); //动画开始时间，用于计算动画进程度
		var duration = this.duration;
		var _this = this;

		var _step = function(){
			var p = (Date.now() - startTime)/duration; //动画完成度，p取值0~1，为1时本次动画执行完毕
			var next = true;//是否继续下个动画帧
			if(p < 1.0){
				_this.progress(_this.easing(p), p);
			}else{
				if(typeof finished === 'function'){
					next = (finished() === false);
				}else{
					next = (finished === false);
				}
				if(next){
					startTime += duration; //开始下个动画帧，修改startTime为上个动画帧执行结束时间
					p -= 1.0; //开始下个动画帧，重置p

					_this.progress(_this.easing(p), p);
				}else{
					_this.progress(_this.easing(1.0), 1.0);
				}
			}


			if(next){
				requestAnimationFrame(_step);
			};
		};

		requestAnimationFrame(_step);
	};

	g.Animator = Animator;
})(window)