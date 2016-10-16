var index_vm = new Vue({
    el : '#user-setNewpsw-container',
    data : {
		sendSmsUrl : '/api/sms-captcha',
		setPasswordUrl : '/api/password-change',
		smsTicket : null,
		smsText : null,
		mobile : getUrlParam().phone,
		mobileText : "",
    	password : null,
    	imgKey:"",
    	imgCodeText:"",
		pswDisplay: false,
		type: 'password',
		sendTxt: '发送',
    },
    methods : {
		sendSms : function () {
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
            		phone : vm.mobile,
            		type : 'resetLoginPwd',
            	},
        		params : {
        			imgKey : vm.imgKey,
        			text : vm.imgCodeText
        		},
        	}, function(data){
        		vm.smsTicket = data.ticket;
        	});
        },
		setPassword : function () {
            var vm = this;
			rest.post({
        		url: vm.setPasswordUrl,
        		data : {
            		userMobile : vm.mobile,
                	userPwd : vm.password,
                	ticket : vm.smsTicket,
            		text : vm.smsText
            	}
        	}, function(data){
        		window.location.href = '/h5/html/activities/index.html';
        	});
        },
		switch : function () {
			this.pswDisplay = !this.pswDisplay;
			if(this.type=='text'){
				this.type = 'password';
			}else{
				this.type = 'text';
			}
		},
		
    },
    ready: function () {
    	var parm = getUrlParam();
		this.imgKey = parm.imgKey;
		this.imgCodeText = parm.imgCodeText;
        this.sendSms();
		this.$set('mobile', this.mobile);
		this.mobileText = enycryptPhoneNum(this.mobile);
    }
	
});
