/**
 * Created by GuoXiang on 2016/8/24.
 */
var vm = new Vue({
    el: '#fixed-success-container',
    data:{
        amount : null,
        nextPayInterestDay : null
    },
    methods :{
        toAsset : function () {
            window.location.href = "html/myCenter/asset_index.html";
        },
        toIndexPage : function () {
            window.location.href = "html/activities/index.html";
        }
    },
    ready: function(){
    	// 计息时间
		var now = new Date(); 
		now.setDate(now.getDate() + 1);
		var nextPayInterestDay = now.format('yyyy-MM-dd');
		
		this.nextPayInterestDay = nextPayInterestDay;
		
		// 购买金额
    	this.amount = fixedProductSessionStorageUtils.getBuyAmount();
    	
    	fixedProductSessionStorageUtils.clearAll();
    }
});