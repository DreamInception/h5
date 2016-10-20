var vm = new Vue({
    el: '#try-cash-container',
    data: {
        selectId: null,
        selectValue: null,
        moneyCouponList: fixedProductSessionStorageUtils.getAllowMoneyCoupons()
    },
    methods: {
        selectCoupon: function (couponId, value) {
            if(couponId==this.selectId){
                this.selectId = null;
                this.selectValue = null;
            }else{
                this.selectId = couponId;
                this.selectValue = value;
                $("input[type='checkbox']").removeAttr("checked");
            }
        },
        
        unSelectCoupon: function () {
        	fixedProductSessionStorageUtils.setSelectedMoneyCouponId(null);
        	fixedProductSessionStorageUtils.setSelectedMoneyCouponValue(null);
            this.selectId = null;
        },
        selectedMoneyCouponOk : function(){
        	fixedProductSessionStorageUtils.setSelectedMoneyCouponId(this.selectId);
        	fixedProductSessionStorageUtils.setSelectedMoneyCouponValue(this.selectValue);
        	window.location = 'html/product/fixed_product/fixed_invest_money.html';
        },
		setLastSelectedMoneyCouponId: function(){
			var selectedMoneyCouponId = fixedProductSessionStorageUtils.getSelectedMoneyCouponId();
			var selectedMoneyCouponValue = fixedProductSessionStorageUtils.getSelectedMoneyCouponValue();
	    	if(selectedMoneyCouponId && selectedMoneyCouponValue){
	    		this.selectId = selectedMoneyCouponId;
	    		this.selectValue = selectedMoneyCouponValue;
	    	}
		}
        
    },
    ready: function(){
    	this.setLastSelectedMoneyCouponId();
    	console.log(this.moneyCouponList.length);
    }
});