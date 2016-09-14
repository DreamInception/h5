/**
 * Created by GuoXiang on 2016/8/24.
 */
var index_vm = new Vue({
    el : '#asset_index_container',
    data : {
    	pswDisplay: false,
    	
    	apiUrl : '/api/user-assert/',
    	
		dqBalance : null,
		hqBalance : null,
		rateBalance : null,
		amount : null,
		rate : null,
		experienceMoneyAmount : null,
        value: true
    },
    methods : {
		
        getAjaxData: function () {
            var vm = this;
            rest.get({
            	url : vm.apiUrl+ storage.get('userId')
            }, function(data){
            	vm.$set('dqBalance',NumberFixed(data.dqBalance, 2));
                vm.$set('hqBalance',NumberFixed(data.hqBalance, 2));
                vm.$set('rateBalance',NumberFixed(Math.floor(data.rateBalance*100)/100, 2));
                vm.$set('amount',NumberFixed(data.amount,2));
                vm.$set('rate',NumberFixed(data.rate, 2));
                vm.$set('experienceMoneyAmount',(data.experienceMoneyAmount).toFixed(2));
            }, function(data){
            	alert(data);
            });
        },
        
        switch : function () {
            this.pswDisplay = !this.pswDisplay;
            this.value = !this.value;
        }
    },
    
    ready: function () {
    	if(userSession.checkId()) {
    		this.getAjaxData();
    	}
    }
});
