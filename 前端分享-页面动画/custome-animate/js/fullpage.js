define(function(require,exports,module){
	require('../../components/jquery/dist/jquery.min.js');
	require('../fullpageslide/ys-slide.js');

	$(function(){
		var page_run={
			ysContDom : $('#ys-cont'),
			tabListDom : $('.tab-list'),
			get_init_data:function(){

			},
			init_page:function(){
				var that = this;
				$('.panel').css('height', jQuery(window).height());

				that.ysContDom.ysSlide({
					sectionPanel:'.panel',
					anchorName:'anchor-name',
					nav:true,
					scrollbar:false,
					keyAble:true,
					navTip:['1','2','3','4','5','6'],
					endInit:function(index,panel){
						var color = '#9cc';
						if(index%2 == 0){
							color = '#6C9';
						}
						$(panel).addClass('done').css({
							backgroundColor:color
						}).find('.panel-content').addClass('done');
					},
					beforeScroll:function(lastIndex,lastPanel,index,panel){
						$(lastPanel).removeClass('done').find('.panel-content').removeClass('done');;
						var color = '#9CC';
						if(index%2 == 0){
							color = '#6C9';
						}
						$(panel).addClass('done').css({
							backgroundColor:color
						});
					},
					afterScroll:function(index,panel){
						$(panel).find('.panel-content').addClass('done');
					}
				});
			},
			bind_event:function(){
				var that = this;
				that.tabListDom.on('click',function(e){
					var $that = $(this),
						index = $(e.target).index(),
						tabContentDom = $that.parent('div').find('~ .tab-content');
					if(!tabContentDom[0])return;
					var tabContList = tabContentDom.find('.item-cont');
					$.each(tabContList,function(i,ele){
						if(i != index && $(ele).hasClass('active')){
							$(ele).removeClass('active');
						}
						if(i == index && !($(ele).hasClass('active'))){
							$(ele).addClass('active');
						}	
					});
				});
			},
			init_run:function(){
				this.init_page();
				this.bind_event();
			}
		};
		page_run.init_run();
	});

});