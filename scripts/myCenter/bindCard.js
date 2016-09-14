var vm=new Vue({
    el: '#bind-card-container',
    data:{
    	postData:{
    		userId : storage.get('userId'),
    		idHolder : null,
			idCard : null,
    		payCode : null,
    		accNo : null,
			mobile : null
    	},
        apiUrl: '/api/user/' + storage.get('userId') + '/bankcard',
		bankName : '请选择开户行',
		lastUrl: '',
		cardid:null
    },
    methods:{
        bindCard : function() {
        	var vm = this;
            /*vm.$http.put(vm.apiUrl, vm.postData).then(function (response) {
				console.log(response);
            	rest.response(response, function(data) {
            		storage.set('user', data);
            		window.location.href = vm.fromUrl;
            	});
            },function (response) {
            	rest.error(response);
            })*/
			rest.put({
        		url: vm.apiUrl,
        		data : vm.postData
        	}, function(data){
        		storage.set('user', data);
            	window.location.href = vm.fromUrl;
        	});
        },
		choseBank : function () {
			storage.set("beforeData", this.postData);
			window.location.href = "/h5/html/myCenter/choseBank.html";
		}
    },
    ready: function () {
    	if(!userSession.checkId()) {
    		return;
    	}
    	var vm = this;
		var defaultUrl = '/h5/html/activities/index.html';
		var lastPageUrl = getFromUrl();
		if(lastPageUrl!=null){
			storage.set("bindCardLastUrl",lastPageUrl);
		}

    	vm.fromUrl =  storage.get("bindCardLastUrl") || defaultUrl;
		if(lastPageUrl==null){
			vm.lastUrl = "javascript:history.go(-1)";
		}
		else{
			vm.lastUrl = '/h5/html/activities/index.html';  		// 从绑卡页面跳转过�
		}
		
		var chooseBank = storage.get("chooseBank");
		if (chooseBank != null) {
			vm.bankName = chooseBank.bankName;
			vm.postData.payCode = chooseBank.bankCode;
		}
		vm.$set('bankName', vm.bankName);
		
		var beforeData = storage.get("beforeData");
		if (beforeData != null) {
			vm.idHolder = beforeData.idHolder;
			if (vm.idHolder != null && vm.idHolder.length > 0) {
				vm.postData.idHolder = vm.idHolder;
			}
			vm.idCard = beforeData.idCard;
			if (vm.idCard != null && vm.idCard.length > 0) {
				vm.cardid = vm.idCard;
				vm.postData.idCard = vm.idCard;
			}
			vm.accNo = beforeData.accNo;
			if (vm.accNo != null && vm.accNo.length > 0) {
				vm.postData.accNo = vm.accNo;
			}
			vm.mobile = beforeData.mobile;
			if (vm.mobile != null && vm.mobile.length > 0) {
				vm.postData.mobile = vm.mobile;
			}
		}
		checkInput.validateIDNumber(vm.cardid,'bindCard');
    }
});
vm.$watch('cardid', function (val) {
	this.postData.idCard=val;
	checkInput.validateIDNumber(val,'bindCard');
});