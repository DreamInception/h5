var vm = new Vue({
    el: '#fixed_productDtls_container',
    data:{
        planRate: new Number(4.80).toFixed(2),
        addRate: new Number(0.50).toFixed(2),
        beginAmt: 100,
        available_amount: new Number(100000).toLocaleString(),
        apiUrl: '/api/regular-target/' + getUrlParam().targetId,
        productData: {},
		barStatus: true,
		targetState:getUrlParam().targetState,
		targetDay: null
    },
    methods:{
        getAjaxData: function () {
            var vm = this;
			rest.get({
					url:vm.apiUrl
				},
				function(data){
					var beginDate = new Date(data.beginDate + 1*24*60*60*1000);
					var now = new Date();
					if(beginDate < now){
						now.setDate(now.getDate() + 1);
						beginDate = now;
					}
					
					data.beginDate = beginDate.format("yyyy-MM-dd");
					
					var endDate = new Date(data.endDate);
					data.endDate = endDate.format("yyyy-MM-dd");
					data.day = (new Date(data.endDate) - new Date(data.beginDate))/((24*60*60*1000)) + 1;
					
					data.yearRateStr = new Number(data.yearRate * 100).toFixed(2) + '%';
					data.dayRateStr = data.dayRate * 100 + '%';
					
					data.targetId = getUrlParam().targetId;
					
					if(data.regularTargetAppendRate){
						data.regularTargetAppendRate.appendYearRate = data.regularTargetAppendRate.appendYearRate * 100 + '%';
						
					}
					vm.targetDay = data.day;
					vm.setProgressBar(data);
					fixedProductSessionStorageUtils.setAllowMoneyCoupons(null);
					fixedProductSessionStorageUtils.setAllowRateCoupons(null);
					fixedProductSessionStorageUtils.setBuyAmount(null);
					fixedProductSessionStorageUtils.setSelectedMoneyCouponId(null);
					fixedProductSessionStorageUtils.setSelectedMoneyCouponValue(null);
					fixedProductSessionStorageUtils.setSelectedRateCouponId(null);
					fixedProductSessionStorageUtils.setSelectedRateCouponYearRate(null);

					fixedProductSessionStorageUtils.setSelectedRegularTarget(data);
					
					console.log(fixedProductSessionStorageUtils.getSelectedRegularTarget().targetId);
					
                	vm.$set('productData',data);
				},
				
				function(data){
					alert(data);
				}

			);
        },
		setProgressBar: function (data) {
			data.availableAmount = data.buyAmount;
			var per = 100 * (data.availableAmount / data.targetAmount);
			if(per<80 &&　vm.targetState==400 ){
				vm.barStatus = false;
			}else if(vm.targetState==300){
				vm.barStatus = false;
			}else if(vm.targetState!=400 && vm.targetState!=300){
				vm.barStatus = true;
				per = 100;
			}else{
				vm.barStatus = true;
			}
			$(".progressBar p").css("width",per+'%');
		}
    },
    ready: function () {
        this.getAjaxData();
    }
})