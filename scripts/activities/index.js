window.onload = function () {
	var mySwiper = new Swiper('.swiper-container', {
		// Optional parameters
		loop: true,
		pagination: '.swiper-pagination',
		paginationClickable: true,
		// autoHeight: true,
		// autoplay: true,
		slidesPerSlide: 1,
		speed: 1000
	});
	// var resize = function(e) {
	// 	var query = $('.swiper-container');
	// 	var clientW = query[0].clientWidth;
	// 	query.css('height', clientW*286/650+'px');
	// }
	// $(window).bind('resize', resize);
	// resize();
	setInterval(function(){
		mySwiper.slideNext();
	}, 4000);
}



var index_vm = new Vue({
	el: '#index-main-container',
	data: {
		planrate_start: 4.8,
		planrate_end: 8.8,
		listData: [],
		cur_productId: 160505,
		downloadDisplay: true,
		isLogin: false
	},
	methods: {
		getAjaxData: function() {
			var vm = this;
			rest.get({
				url:'/api/regular-target'
			},function(data) {
				if(data.regularTargets){
					for(var x=0; x < data.regularTargets.length; x++){
						
						var beginDate = new Date(data.regularTargets[x].beginDate);
						var endDate = new Date(data.regularTargets[x].endDate);
						var now = new Date();
						if(beginDate < now){
							now.setDate(now.getDate() + 1);
							beginDate = now;
							beginDate.setHours(0);
							beginDate.setMinutes(0);
							beginDate.setSeconds(0);
							beginDate.setMilliseconds(0);
						}
						
						data.regularTargets[x].onsaleTime = new Date(data.regularTargets[x].onsaleTime).format("hh:mm");
						data.regularTargets[x].days = (new Date(endDate) - new Date(beginDate))/((24*60*60*1000)) + 1;
						data.regularTargets[x].yearRateStr = NumberFixed(new Number(data.regularTargets[x].yearRate * 100), 2) + '%';
						data.regularTargets[x].dayRateStr = data.regularTargets[x].dayRate * 100 + '%';
					}
					vm.$set('listData', data.regularTargets);
				}
			},function(data) {
				alert(data);
			});
		},
		closeLayer: function() {
			var vm = this;
			vm.downloadDisplay = false;
		}

	},
	ready: function() {
		var vm = this;
		this.getAjaxData();
		if(storage.get("userId")){
			vm.isLogin = true;
		}else{
			vm.isLogin = false;
		}

	}
});

function wechatLoginCallback(){
	if(storage.get("userId")){
		index_vm.isLogin = true;
	}else{
		index_vm.isLogin = false;
	}
}
