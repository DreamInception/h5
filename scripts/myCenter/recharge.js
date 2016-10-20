var recharge_vm=new Vue({
    el: '#recharge-money-container',
    data:{
		bankInfoUrl: '/api/user/' + storage.get('userId') + '/bankcard?userId=' + storage.get('userId'),
		accountBalanceUrl: '/api/user-account/' + storage.get('userId') + '/?userId=' + storage.get('userId'),
		sendSmsUrl: '/api/recharge-order',
		
		userId:storage.get('userId'),
		// money:'',
		incomeId:'0',
		realName:'',
		idCard:'',
		bankName:'',
		accNo:'',
		tip:'',
		accountBalance:'',
		money: Math.ceil(getUrlParam().amount) || null,
		smsCode:'',
		bgStatus: true,
		sendTxt: '发送',
		disableAttr: false,
		maskShow: false,
		sm_winShow: false,
		lm_winShow: false
    },
    methods: {
        getBankInfo: function () {
			var vm = this;
			rest.get({
        		url: vm.bankInfoUrl
        	}, function(data){
        		vm.$set('realName', data.realName);
				vm.$set('idCard', data.idCard);
				vm.$set('bankName', data.bankName);
				vm.$set('accNo', data.accNo);
				vm.$set('tip', data.tip);
        	});
        },
		getAccountBalance : function() {
        	var vm = this;
			rest.get({
        		url: vm.accountBalanceUrl
        	}, function(data){
        		vm.$set('accountBalance', data.acctBalance);
        	});
        },
		sendSms : function() {
        	var vm = this;
			vm.sendTxt = '60s';
			sendMsgTxt.show(function (txt, prop, bgColor) {
				vm.sendTxt = txt;
				vm.disableAttr = prop;
				vm.bgStatus = bgColor;
			});
			rest.post({
        		url: vm.sendSmsUrl,
        		data : {
            		userId : vm.userId,
            		txnAmt : vm.money
            	}
        	}, function(data){
        		vm.incomeId = data.incomeId;
        	});
        },
		recharge : function() {
        	var vm = this;
			/*
            vm.$http.put('/api/recharge-order/' + vm.incomeId + '/confirmation', {
            	userId : vm.userId,
				smsCode : vm.smsCode
            }).then(function (response) {
				console.log(response);
				vm.closeDialog();
				window.location.href = vm.fromUrl;
            },function (response) {
            	rest.error(response);
            })
			 */
			rest.put({
        		url: '/api/recharge-order/' + vm.incomeId + '/confirmation',
        		data : {
            		userId : vm.userId,
					smsCode : vm.smsCode
            	}
        	},function(data){
        		vm.closeDialog();
				// window.location.href = vm.fromUrl;
				window.location.href = "html/myCenter/rechargeSuccess.html?moneyNum="+encodeURIComponent(vm.money)+"&accNo="+encodeURIComponent(vm.accNo)+"&bankName="+encodeURIComponent(vm.bankName)+"&fromUrl="+encodeURIComponent(vm.fromUrl);
        	});

        },
		showDialog : function() {
        	var vm = this;
			alertWin.show(function (maskStatus, winStatus) {
				vm.maskShow = maskStatus;
				vm.sm_winShow = winStatus;

            });
			vm.sendSms();
        },
		closeDialog: function () {
			var vm = this;
			alertWin.close(function (maskStatus, winStatus) {
				vm.maskShow = maskStatus;
				vm.sm_winShow = winStatus;

            });
		}
    },
	ready: function () {
		if(userSession.checkId() && userSession.checkRealName()){
			this.getBankInfo();
			this.getAccountBalance();
		}
    	var defaultUrl = 'html/myCenter/asset_index.html';
    	this.fromUrl = getFromUrl() || defaultUrl;
		// if(this.money!=null && parseInt(this.money)>=100){
		// 	$("#rechargeBtn").removeAttr("disabled");
		// }
		checkInput.validateAmountNum(this.money,'rechargeBtn');
    }
});
recharge_vm.$watch('money', function (val) {
	checkInput.validateAmountNum(val,'rechargeBtn');
});