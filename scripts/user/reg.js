var index_vm = new Vue({
    el : '#user-register-container',
    data : {
		imgApiUrl : '/api/captcha',
		sendSmsUrl : '/api/sms-captcha',
		checkImgCodeUrl : '/api/captcha',
		checkSmsUrl : '/api/sms-captcha',
		regApiUrl : '/api/user',
		
		imgData : null,
		imgKey : null,
		imgCodeText : null,
		smsTicket : null,
		smsText : null,
		mobile : null,
    	password : null,
    	recomment : '',
		sendTxt: '发送',
		disableAttr: false,
		type: 'password',
		bgStatus: true,
		pswDisplay: false,
		maskShow: false,
		ar_winShow: false,
		isBindWechat:true,
		phoneFalg:false,
		pswdFlag:false,
		imgFlag:false,
		msgFlag:false,
    },
    methods : {
		switch : function () {
			this.pswDisplay = !this.pswDisplay;
			if(this.type=='text'){
				this.type = 'password';
			}else{
				this.type = 'text';
			}
		},
        getImgCode : function () {
            var vm = this;
			rest.post({
        		url: vm.imgApiUrl
        	}, function(data){
        		vm.$set('imgData','data:image/png;base64,' + data.image);
				vm.imgKey = data.imgKey;
        	});
        },
		sendSms : function () {
            var vm = this;
			vm.sendTxt = '60s';
			sendMsgTxt.show(function(txt,prop,bgColor){
				vm.sendTxt =txt;
				vm.disableAttr = prop;
				vm.bgStatus = bgColor;
			});
			
			rest.post({
        		url: vm.sendSmsUrl,
        		params : {
        			imgKey : vm.imgKey,
        			text : vm.imgCodeText
        		},
        		data : {
            		phone : vm.mobile,
            		type : 'register'
            	}
        	}, function(data){
        		vm.smsTicket = data.ticket;
        	}, function(){
        		vm.getImgCode();
        	});
        },
		reg : function(){
        	var vm = this;
        	
			rest.post({
        		url: vm.regApiUrl,
        		params : {
        			ticket : vm.smsTicket,
        			text : vm.smsText
        		},
        		data : {
            		userMobile : vm.mobile,
                	userPwd : vm.password,
                	recomment : vm.recomment,
    				fromChannel : storage.get('channel') || 'H5',
    				wechatToken: storage.get('wechatToken')
            	}
        	}, function(data){
        		storage.set('userId', data.userId);
        		storage.set('user', data);
        		window.location.href = '/h5/html/myCenter/bindCard.html?from='+encodeURIComponent('/h5/html/activities/index.html');
        	});
        },
		bindWechat:function(){
			if(document.getElementById("checkbox-10-1").checked){
        		this.isBindWechat = true;
        		return true;
            }else{
            	this.isBindWechat = false;
            	return false;

            }
		}
    },
    ready: function () {
        this.getImgCode();
		document.getElementById("checkbox-10-1").checked = true;
    }
});
index_vm.$watch('mobile', function (val) {
	this.phoneFlag = checkInput.validatePhoneNum(val,'sendBtn');
	checkInput.combinedCheck(this.phoneFlag,this.imgFlag,true,true,'sendBtn');
	checkInput.combinedCheck(this.pswdFlag,this.msgFlag ,this.phoneFlag,this.imgFlag,'regBtn');
});
index_vm.$watch('password', function (val) {
	this.pswdFlag = checkInput.validatePassword(val,'regBtn');
	checkInput.combinedCheck(this.pswdFlag,this.msgFlag ,this.phoneFlag,this.imgFlag,'regBtn');
});
index_vm.$watch('imgCodeText', function (val) {
	if(val==null||val==''||val.length!=4){
		this.imgFlag=false;
	}else{
		this.imgFlag=true;
	}
	checkInput.combinedCheck(this.phoneFlag,this.imgFlag,true,true,'sendBtn');
	checkInput.combinedCheck(this.pswdFlag,this.msgFlag ,this.phoneFlag,this.imgFlag,'regBtn');
});
index_vm.$watch('smsText', function (val) {
	if(val==null||val==''||val.length!=6){
		this.msgFlag=false;
	}else{
		this.msgFlag=true;
	}
	checkInput.combinedCheck(this.pswdFlag,this.msgFlag ,this.phoneFlag,this.imgFlag,'regBtn');
});