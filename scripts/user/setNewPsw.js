var index_vm = new Vue({
    el : '#user-setNewpsw-container',
    data : {
		sendSmsUrl : '/api/sms-captcha',
		setPasswordUrl : '/api/password-change',
		smsTicket : null,
		smsText : null,
		mobile : getUrlParam().phone,
    	password : null
    },
    methods : {
		sendSms : function () {
            var vm = this;
			rest.post({
        		url: vm.sendSmsUrl,
        		data : {
            		phone : vm.mobile,
            		type : 'resetLoginPwd'
            	}
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
        }
    },
    ready: function () {
        this.sendSms();
		this.$set('mobile', this.mobile);
    }
	
});
