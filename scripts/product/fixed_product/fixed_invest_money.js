var vm = new Vue({
	el: '#buy-fixedPro-container',
	data: {
		userAccount: {},
		allMoneyCoupons : [],
    	allRateCoupons : [],
		moneyCoupons: [],
		rateCoupons: [],
		
		selectRateCouponId:null,
		selectRateCouponYearRate : fixedProductSessionStorageUtils.getSelectedRateCouponYearRate(),
		rateCouponStr:null,
		
		selectMoneyCouponId:fixedProductSessionStorageUtils.getSelectedMoneyCouponId(),
		selectMoneyCouponValue : fixedProductSessionStorageUtils.getSelectedMoneyCouponValue(),
		moneyCouponStr:null,

		day: fixedProductSessionStorageUtils.getSelectedRegularTarget().day,
		targetId: fixedProductSessionStorageUtils.getSelectedRegularTarget().targetId,
		targetState: fixedProductSessionStorageUtils.getSelectedRegularTarget().targetState,
		minAmount: fixedProductSessionStorageUtils.getSelectedRegularTarget().minAmount,
		unitAmount: fixedProductSessionStorageUtils.getSelectedRegularTarget().unitAmount,
		dayRate: fixedProductSessionStorageUtils.getSelectedRegularTarget().dayRate,
		day: fixedProductSessionStorageUtils.getSelectedRegularTarget().day,
		availableAmount: fixedProductSessionStorageUtils.getSelectedRegularTarget().targetAmount - fixedProductSessionStorageUtils.getSelectedRegularTarget().availableAmount,
		day_earning:0+'元',
		btnDisplay:true,
		isAgree:true,
		money_num: null,
		rechargeNum:0,
		tyjUrl: '',
		rateUrl: '',
		returnUrl: null
	},
	methods: {
		buyForward: function() {
			if(!vm.isAgree){
				alert("请先阅读并同意产品合同");
				return;
			}
			
			var amount = fixedProductSessionStorageUtils.getBuyAmount();
			if(!amount || amount < vm.minAmount){
				alert("产品的购买金额小于最小购买金额");
				return;
			}
			
			
			var buyRegularOrderUrl = '/api/regular-order';
			var param = {
				userId : storage.get('userId'),
				targetId : fixedProductSessionStorageUtils.getSelectedRegularTarget().targetId,
				moneyCouponId: fixedProductSessionStorageUtils.getSelectedMoneyCouponId(),
				rateCouponId: fixedProductSessionStorageUtils.getSelectedRateCouponId(),
				amount: fixedProductSessionStorageUtils.getBuyAmount()
			}
			
			rest.post({
					url:buyRegularOrderUrl,
					data:param
				}, function(data){
					var buyRegularTargetResult = data.buyRegularTargetResult;
					if(buyRegularTargetResult === true){
						window.location.href = "html/product/fixed_product/fixed_invest_success.html?amount=" + vm.amount;
					}
				},function(data){
					alert(data);
				}
			);
		},
		rechargeForward : function () {
            window.location.href = "html/myCenter/recharge.html?amount=" + this.rechargeNum+"&from="+ encodeURIComponent(window.location.pathname+window.location.search);
        },
		agreeOrNot:function(){
			vm.isAgree = $("#checkbox-1-1").is(':checked');
		},
		getUserAccount: function() {
			var userAccountUrl = '/api/user-account/' + storage.get('userId');
			var vm = this;
			rest.get({
				url:userAccountUrl
			},function(data) {
				
				var userAccount = data;
				userAccount.acctBalance = NumberFixed(new Number(userAccount.acctBalance), 2);
				vm.$set('userAccount', data);
				
				var buyAmount = fixedProductSessionStorageUtils.getBuyAmount();
				if(buyAmount > data.acctBalance){
			    	vm.rechargeNum = buyAmount - vm.userAccount.acctBalance;
			    	vm.btnDisplay = false;
			    }

			},function(data) {
				alert(data);
			});
		},
		getMoneyCoupon: function() {
			var vm = this;
			$.ajax({
				type :'get',
				url : '/api/money-coupon?userId=' + storage.get('userId'),
				dataType : 'json',
				contentType:'application/json',
				async:false,
				success:function(successRtnData){
					console.log(successRtnData.moneyCoupons);
					var allowMoneyCoupons = daysFilter(successRtnData.moneyCoupons);
						
					for(var i=0;i<allowMoneyCoupons.length;i++){
						allowMoneyCoupons[i].closingDateStr = new Date(allowMoneyCoupons[i].closingDate).format('yyyy-MM-dd');
						allowMoneyCoupons[i].yearRateStr = NumberFixed(allowMoneyCoupons[i].yearRate * 100, 2);
					}
					
					vm.$set('allMoneyCoupons', allowMoneyCoupons);

					var buyAmount = fixedProductSessionStorageUtils.getBuyAmount();
					if(buyAmount==null){
						var moneyCoupons = amountFilter(0, allowMoneyCoupons);
					}else{
						var moneyCoupons = amountFilter(buyAmount, allowMoneyCoupons);
					}

					fixedProductSessionStorageUtils.setAllowMoneyCoupons(moneyCoupons);

					vm.$set('moneyCoupons', moneyCoupons);
					
					if(!vm.selectMoneyCouponValue){
						vm.moneyCouponStr = moneyCoupons.length + " 张可用";
						//TODO
						if(moneyCoupons.length==0){
							this.tyjUrl = 'javascript:;';
						}else{
							this.tyjUrl = "html/product/fixed_product/fixed_tyj_ticket.html";
						}
					}else{
						vm.moneyCouponStr = vm.selectMoneyCouponValue + "元";
					}
					
					
					
					
				},
				error:function(errorRtnData){
					alert(errorRtnData);
				}
			})
		},
		getRateCoupon: function() {
			var vm = this;
			$.ajax({
				type :'get',
				url : '/api/rate-coupon?userId=' + storage.get('userId'),
				dataType : 'json',
				contentType:'application/json',
				async:false,
				success:function(successRtnData){
					var allowRateCoupons = daysFilter(successRtnData.rateCoupons);
					
					for(var i=0;i<allowRateCoupons.length;i++){
						allowRateCoupons[i].closingDateStr = new Date(allowRateCoupons[i].closingDate).format('yyyy-MM-dd');
						allowRateCoupons[i].yearRateStr = (allowRateCoupons[i].yearRate * 100).toFixed(2);
					}
					
					
					vm.$set('allRateCoupons', allowRateCoupons);
					var buyAmount = fixedProductSessionStorageUtils.getBuyAmount();
					if(buyAmount==null){
						var rateCoupons = amountFilter(0, allowRateCoupons);
					}else{
						var rateCoupons = amountFilter(buyAmount, allowRateCoupons);
					}
					fixedProductSessionStorageUtils.setAllowRateCoupons(rateCoupons);

					vm.$set('rateCoupons', rateCoupons);
					
					if(!vm.selectRateCouponYearRate){
						vm.rateCouponStr = rateCoupons.length + " 张可用";
						//TODO
						if(rateCoupons.length==0){
							this.rateUrl = 'javascript:;';
						}else{
							this.rateUrl = "html/product/fixed_product/fixed_rate_coupon.html";
						}
					}else{
						vm.rateCouponStr = vm.selectRateCouponYearRate + "%";
					}
					
					

				},
				error:function(errorRtnData){
					alert(errorRtnData);
				}
			})
		},
		setBuyAmount: function(){
			var vm = this;
			var buyAmount = fixedProductSessionStorageUtils.getBuyAmount();
			if(buyAmount){
				vm.$set('money_num', buyAmount);
				vm.day_earning = NumberFixed(buyAmount * vm.dayRate * vm.day, 4);

				vm.rateCoupons = amountFilter(buyAmount, vm.allRateCoupons);
				vm.rateCouponStr = vm.rateCoupons.length + " 张可用";	
				
				vm.moneyCoupons = amountFilter(buyAmount, vm.allMoneyCoupons);
				vm.moneyCouponStr = vm.moneyCoupons.length + " 张可用";	

				if(vm.selectRateCouponYearRate) {
					this.rateCouponStr = '+ ' + vm.selectRateCouponYearRate + ' %';
				}
				
				if(vm.selectMoneyCouponValue){
					this.moneyCouponStr = '+ ' + vm.selectMoneyCouponValue + ' 元';	
				}
			}else{
				vm.$set('money_num', null);
			}

			//Todo
			if(vm.moneyCoupons.length==0){
				this.tyjUrl = 'javascript:;';
			}else{
				this.tyjUrl = "html/product/fixed_product/fixed_tyj_ticket.html";
			}

			if(vm.rateCoupons.length==0){
				this.rateUrl = 'javascript:;';
			}else{
				this.rateUrl = "html/product/fixed_product/fixed_rate_coupon.html";
			}

		},
		amountCheck: function (val) {
			var vm = this;
			var b = (!(parseInt(val) % 100 == 0))|| !(/(^[1-9]\d*$)/.test(val));
			if (b) {
				if(val==null){
					$("#purchaseBtn1").hide();
					$("#purchaseBtn2").hide();
					$("#purchaseBtn4").hide();
					this.btnDisplay = true;
					$("#purchaseBtn").css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
					return;
				}
				$("#purchaseBtn1").hide();
				$("#purchaseBtn2").hide();
				$("#purchaseBtn4").show();
				this.btnDisplay = true;
				$("#purchaseBtn").css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
			} else {
				if (parseInt(val) > parseInt(vm.availableAmount)) {
					$("#purchaseBtn2").hide();
					$("#purchaseBtn4").hide();
					$("#purchaseBtn1").show();
					this.btnDisplay = true;
					$("#purchaseBtn").css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
				} else {
					if( parseInt(val) > parseInt(this.userAccount.acctBalance)){
						this.btnDisplay = false;
						$("#purchaseBtn1").hide();
						$("#purchaseBtn4").hide();
						vm.rechargeNum = NumberFixed(val - this.userAccount.acctBalance, 2);
						$("#purchaseBtn2").show();
					}else{
						$("#purchaseBtn2").hide();
						$("#purchaseBtn4").hide();
						$("#purchaseBtn1").hide();
						this.btnDisplay = true;
						$("#purchaseBtn").css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
					}
				}
			}
		},
	},
	ready: function() {
		if(!userSession.checkId() || !userSession.checkRealName()){
    		return;
    	}
		var amount = fixedProductSessionStorageUtils.getBuyAmount() || this.money_num;
		this.amountCheck(amount);
		this.getUserAccount();
		this.getMoneyCoupon();
		this.getRateCoupon();
		this.setBuyAmount();
		
		this.returnUrl = "html/product/fixed_product/fixed_product_details.html?targetId="+this.targetId+"&targetState="+storage.get("targetState");
	}
});


function daysFilter(coupons) {
	var allowCoupons = [];	
	
	if(!coupons || coupons.length == 0){
		return allowCoupons;
	}
	
	var now = new Date();
	
	for(var couponsIndex = 0; couponsIndex < coupons.length; couponsIndex ++){
		var coupon = coupons[couponsIndex];
		if((new Date(coupon.closingDate) - now) > 0){
	    	allowCoupons.push(coupon);
	    }	
	}
	
	return allowCoupons;
}

function amountFilter(amountValue, coupons) {
	var allowCoupons = [];	
	
	if(!coupons || coupons.length == 0){
		return allowCoupons;
	}
	for(var couponsIndex = 0; couponsIndex < coupons.length; couponsIndex ++){
		var coupon = coupons[couponsIndex];
		if(amountValue >= coupon.minAmount){
	    	allowCoupons.push(coupon);
	    }	
	}
	return allowCoupons;
	
}


vm.$watch('money_num',function (val) {
	val = new Number(val);
    fixedProductSessionStorageUtils.setBuyAmount(val);
    this.amount = val;
    this.day_earning = NumberFixed(val * vm.dayRate * vm.day, 4) + '元';
    
    if(val > this.userAccount.acctBalance){
    	vm.rechargeNum = val - this.userAccount.acctBalance;
    	vm.btnDisplay = false;
    }else{
    	vm.btnDisplay = true;
    }
    
	this.amountCheck(val);
    
    var moneyCoupons = amountFilter(val, this.allMoneyCoupons);
    var rateCoupons = amountFilter(val,this.allRateCoupons);
    
    this.rateCouponStr = rateCoupons.length + " 张可用";
	//	todo
	if(rateCoupons.length==0){
		this.rateUrl = 'javascript:;';
	}else{
		this.rateUrl = "html/product/fixed_product/fixed_rate_coupon.html";
	}
    if(this.selectRateCouponYearRate){
    	this.selectRateCouponYearRate = null;
    	fixedProductSessionStorageUtils.setSelectedRateCouponId(null);
    	fixedProductSessionStorageUtils.setSelectedRateCouponYearRate(null);
    }
    
    
    this.moneyCouponStr = moneyCoupons.length + " 张可用";
	//todo
	if(moneyCoupons.length==0){
		this.tyjUrl = 'javascript:;';
	}else{
		this.tyjUrl = "html/product/fixed_product/fixed_tyj_ticket.html";
	}
    if(this.selectMoneyCouponValue){
    	this.selectMoneyCouponValue = null;
    	fixedProductSessionStorageUtils.setSelectedMoneyCouponId(null);
    	fixedProductSessionStorageUtils.setSelectedMoneyCouponValue(null);
    }
    
    console.log(moneyCoupons.length);
    
	fixedProductSessionStorageUtils.setAllowMoneyCoupons(moneyCoupons);
	fixedProductSessionStorageUtils.setAllowRateCoupons(rateCoupons);
	
	this.moneyCoupons = moneyCoupons;
	this.rateCoupons = rateCoupons;
    
});