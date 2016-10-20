var myScroll = null;
window.onload = function () {

	// var resize = function(e) {
	// 	var query = $('.swiper-container');
	// 	var clientW = query[0].clientWidth;
	// 	query.css('height', clientW*286/650+'px');
	// }
	// $(window).bind('resize', resize);
	// resize();

	$(".posterList").mobileRotate({
		containerWidth: $(this).width()*0.8,
		containerHeight: $(this).width()*0.5,
		posterWidth: $(this).width()*0.5,
		posterHeight: $(this).width()*0.5,
		scale: 0.7,
		delay: 500,
		speed: 500,
		autoplay: false
	});

	setTimeout(function () {
		scrollInit(pullUpAction);
	}, 500);
}



var index_vm = new Vue({
	el: '#index-main-container',
	data: {
		planrate_start: 4.8,
		planrate_end: 8.8,
		listData: [],
		cur_productId: 160505,
		downloadDisplay: true,
		isLogin: false,
		fixedList: {},
		mockList: [{'yRate':0.00,'day':0,'unitAmount':100,'targetName':'doro第一期','targetState':400,'targetId': 'doro01','regularTargetAppendRate':{'addRateStr':'0.2'}},{'yRate':1.00,'day':10,'unitAmount':100,'targetName':'doro第二期','targetState':400,'targetId': 'doro01'}],
		currentPage: 1,
		returnData: [],
		version: 2,
		bannerList: []
	},
	methods: {
		getAjaxData: function() {
			var vm = this;
			rest.get({
				url:'/api/regular-target',
				params: {
					currentPage: vm.currentPage
				}
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
						//data.regularTargets[x].days = (new Date(endDate) - new Date(beginDate))/((24*60*60*1000)) + 1;
						data.regularTargets[x].yearRateStr = NumberFixed(new Number(data.regularTargets[x].yearRate * 100), 2);
						if(data.regularTargets[x].regularTargetAppendRate){
							data.regularTargets[x].addRateStr = NumberFixed(new Number(data.regularTargets[x].regularTargetAppendRate.appendYearRate * 100), 2) + '%';
						}
						data.regularTargets[x].dayRateStr = data.regularTargets[x].dayRate * 100 + '%';
					}

					for (var i = 0, len = data.regularTargets.length; i < len; i++) {
						vm.returnData.push(data.regularTargets[i]);
					}
					vm.$set('listData', vm.returnData);

					// vm.$set('listData', data.regularTargets);
					vm.displayFixedPro = [];
					if(vm.currentPage && vm.currentPage==1){
						vm.bindRealData(data);
					}
					if(myScroll){
						setTimeout(function () {
							myScroll.refresh();
						}, 100);
                    
					}

				}
			},function(data) {
				$(".pullUpIcon").hide();
			//	alert(data);
			});
		},
		bindRealData: function (data) {
			var vm = this;
			$("#circleProduct1").attr('data-title','活期宝');
			$("#circleProduct2 .day").html('期限'+data.regularTargets[0].day + '天');
			$("#circleProduct2 .plan-rate-num").html(NumberFixed(new Number(data.regularTargets[0].yearRate * 100), 2) + '%');
			if(data.regularTargets[0].regularTargetAppendRate!=null){
				$("#circleProduct2 .plan-rate-num").append("<span class='addRate'>+"+NumberFixed(new Number(data.regularTargets[0].regularTargetAppendRate.appendYearRate * 100), 2) + "%</span>");
			}
			$("#circleProduct2 .unit-amount").html(data.regularTargets[0].unitAmount + '元起购');
			$("#circleProduct2").attr('data-title',data.regularTargets[0].targetName);
			$("#circleProduct2").attr('href',"html/product/fixed_product/fixed_product_details.html?targetId="+data.regularTargets[0].targetId+"&targetState="+data.regularTargets[0].targetState);
			$("#circleProduct3 .day").html('期限'+data.regularTargets[1].day + '天');
			$("#circleProduct3 .plan-rate-num").html(NumberFixed(new Number(data.regularTargets[1].yearRate * 100), 2) + '%');
			if(data.regularTargets[1].regularTargetAppendRate!=null){
				$("#circleProduct3 .plan-rate-num").append("<span class='addRate'>+"+NumberFixed(new Number(data.regularTargets[1].regularTargetAppendRate.appendYearRate * 100), 2) + "%</span>");
			}
			$("#circleProduct3 .unit-amount").html(data.regularTargets[1].unitAmount + '元起购');
			$("#circleProduct3").attr('data-title',data.regularTargets[1].targetName);
			$("#circleProduct3").attr('href',"html/product/fixed_product/fixed_product_details.html?targetId="+data.regularTargets[1].targetId+"&targetState="+data.regularTargets[1].targetState);
		},
		closeLayer: function () {
			var vm = this;
			vm.downloadDisplay = false;
		},
		getBannerImg: function () {
			var vm = this;
			rest.get({
				url: '/api/activity-banner/getBannerByVersion/'+vm.version,
			},function (data) {
				$(".swiper-wrapper").html();
				for(var i=0;i<data.banners.length;i++){

                	if(data.banners[i].h5Url=="" || data.banners[i].h5Url==null){
						data.banners[i].h5Url = 'javascript:;';
					}

					var eachSwiper = "<div class='swiper-slide'>"+
						"<a href=\""+data.banners[i].h5Url+"\">"+
						"<img src=\""+data.banners[i].picSrc+"\" alt='' width='100%' height='100%'>"+
						"</a></div>"
                
					$(".swiper-wrapper").append(eachSwiper);
                
				}
				// vm.$set("bannerList",data.banners);
				var mySwiper = new Swiper('.swiper-container', {
					// Optional parameters
					loop: true,
					pagination: '.swiper-pagination',
					paginationClickable: true,
					// autoHeight: true,
					// autoplay: true,
					slidesPerSlide: 1,
					speed: 1000,
					// preventClicks: false,
					// preventClicksPropagation: false
				});
				setInterval(function(){
					mySwiper.slideNext();
				}, 4000);


			},function (data) {
				alert(data);
			})
		}

	},
	ready: function() {
		var vm = this;
		vm.getBannerImg();
		vm.getAjaxData();
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

function pullUpAction() {
	index_vm.currentPage++;
	setTimeout(function () {
		index_vm.getAjaxData();
	}, 1000);
}
function forwardUrl(url) {
	window.location.href = url;
}
