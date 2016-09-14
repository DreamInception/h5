var vm = new Vue({
	el: '#add-rate-container',
	data: {
		isSelect: false,
		gouIsShow: false,
		rateCoupons: fixedProductSessionStorageUtils.getAllowRateCoupons(),
		selectId: null,
		selectYearRate: null
	},
	methods: {
        selectCoupon: function (couponId, yearRate) {
            if(couponId==this.selectId){
                this.selectId = null;
                this.selectYearRate = null;
            }else{
                this.selectId = couponId;
                this.selectYearRate = yearRate;
            }
        },
        unSelectCoupon: function () {
        	fixedProductSessionStorageUtils.setSelectedRateCouponId(null);
        	fixedProductSessionStorageUtils.setSelectedRateCouponYearRate(null);
            this.selectId = null;
            this.selectYearRate = null;
        },
		selectedRateCouponOk: function() {
			fixedProductSessionStorageUtils.setSelectedRateCouponId(this.selectId);
			fixedProductSessionStorageUtils.setSelectedRateCouponYearRate(this.selectYearRate);
        	window.location = 'html/product/fixed_product/fixed_invest_money.html';
		},
		setLastSelectedRateCouponId: function(){
			var selectedRateCouponId = fixedProductSessionStorageUtils.getSelectedRateCouponId();
			var selectedRateCouponYearRate = fixedProductSessionStorageUtils.getSelectedRateCouponYearRate();
	    	if(selectedRateCouponId){
	    		this.selectId = selectedRateCouponId;
                this.selectYearRate = selectedRateCouponYearRate;
	    	}
		}
	},
	ready: function() {
		this.setLastSelectedRateCouponId();
	}
});