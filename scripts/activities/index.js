var myScroll = null;
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
		currentPage: 1
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
						data.regularTargets[x].yearRateStr = NumberFixed(new Number(data.regularTargets[x].yearRate * 100), 2) + '%';
						if(data.regularTargets[x].regularTargetAppendRate){
							data.regularTargets[x].addRateStr = NumberFixed(new Number(data.regularTargets[x].regularTargetAppendRate.appendYearRate * 100), 2) + '%';
						}
						data.regularTargets[x].dayRateStr = data.regularTargets[x].dayRate * 100 + '%';
					}
					vm.$set('listData', data.regularTargets);
					vm.displayFixedPro = [];
					vm.bindRealData(data);
					
						if(data.regularTargets[0].regularTargetAppendRate){
							$("#list .list_day").html( NumberFixed(new Number(data.regularTargets[0].regularTargetAppendRate.appendYearRate * 100), 2) + '%');
						}
						$("#list .plan-rate-num").html (NumberFixed(new Number(data.regularTargets[0].yearRate * 100), 2));

						$("#list .list_amount").html(data.regularTargets[0].unitAmount);

					if(data.regularTargets[1].regularTargetAppendRate){
						$("#list2 .list_day").html( NumberFixed(new Number(data.regularTargets[1].regularTargetAppendRate.appendYearRate * 100), 2) + '%');
					}
					$("#list2 .plan-rate-num").html (NumberFixed(new Number(data.regularTargets[1].yearRate * 100), 2));

					$("#list2 .list_amount").html(data.regularTargets[0].unitAmount);
					if(myScroll){
						setTimeout(function () {
							myScroll.refresh();
						}, 100);

					}

				}
			},function(data) {
				$(".pullUpIcon").hide();
				alert(data);
			});
		},
		closeLayer: function() {
			var vm = this;
			vm.downloadDisplay = false;
		},
		bindRealData: function (data) {
			var vm = this;
			$("#circleProduct1").attr('data-title','活期宝');
			$("#circleProduct2 .day").html('期限'+data.regularTargets[0].day + '天');
			$("#circleProduct2 .plan-rate-num").html(NumberFixed(new Number(data.regularTargets[0].yearRate * 100), 2) + '%');
			if(data.regularTargets[0].regularTargetAppendRate){
				$("#circleProduct2 .plan-rate-num").append("<span class='addRate'>+"+data.regularTargets[0].regularTargetAppendRate.addRateStr+"</span>");
			}
			$("#circleProduct2 .unit-amount").html(data.regularTargets[0].unitAmount + '元起购');
			$("#circleProduct2").attr('data-title',data.regularTargets[0].targetName);
			$("#circleProduct2").attr('href',"html/product/fixed_product/fixed_product_details.html?targetId="+data.regularTargets[0].targetId+"&targetState="+data.regularTargets[0].targetState);
			$("#circleProduct3 .day").html('期限'+data.regularTargets[1].day + '天');
			$("#circleProduct3 .plan-rate-num").html(NumberFixed(new Number(data.regularTargets[1].yearRate * 100), 2) + '%');
			if(data.regularTargets[1].regularTargetAppendRate){
				$("#circleProduct2 .plan-rate-num").append("<span class='addRate'>+"+data.regularTargets[1].regularTargetAppendRate.addRateStr+"</span>");
			}
			$("#circleProduct3 .unit-amount").html(data.regularTargets[1].unitAmount + '元起购');
			$("#circleProduct3").attr('data-title',data.regularTargets[1].targetName);
			$("#circleProduct3").attr('href',"html/product/fixed_product/fixed_product_details.html?targetId="+data.regularTargets[1].targetId+"&targetState="+data.regularTargets[1].targetState);
		},
		bindMockData: function () {
			var vm = this;
			$("#circleProduct1").attr('data-title','活期宝');
			$("#circleProduct2 .day").html('期限'+vm.mockList[0].day + '天');
			$("#circleProduct2 .plan-rate-num").html(vm.mockList[0].yRate + '%');
			if(vm.mockList[0].regularTargetAppendRate){
				$("#circleProduct2 .plan-rate-num").append("<span class='addRate'>+"+vm.mockList[0].regularTargetAppendRate.addRateStr+"</span>");
			}
			$("#circleProduct2 .unit-amount").html(vm.mockList[0].unitAmount + '元起购');
			$("#circleProduct2").attr('data-title',vm.mockList[0].targetName);
			$("#circleProduct2").attr('href',"html/product/fixed_product/fixed_product_details.html?targetId="+vm.mockList[0].targetId+"&targetState="+vm.mockList[0].targetState);
			$("#circleProduct3 .day").html('期限'+vm.mockList[1].day + '天');
			$("#circleProduct3 .plan-rate-num").html(vm.mockList[1].yRate + '%');
			if(vm.mockList[1].regularTargetAppendRate){
				$("#circleProduct2 .plan-rate-num").append("<span class='addRate'>+"+vm.mockList[1].regularTargetAppendRate.addRateStr+"</span>");
			}
			$("#circleProduct3 .unit-amount").html(vm.mockList[1].unitAmount + '元起购');
			$("#circleProduct3").attr('data-title',vm.mockList[1].targetName);
			$("#circleProduct3").attr('href',"html/product/fixed_product/fixed_product_details.html?targetId="+vm.mockList[1].targetId+"&targetState="+vm.mockList[1].targetState);
		}

	},
	ready: function() {
		var vm = this;
		//vm.getAjaxData();
		vm.bindMockData();
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