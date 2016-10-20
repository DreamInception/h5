/**
 * Created by GuoXiang on 2016/8/23.
 */
var vm=new Vue({
    el: '#user-login-container',
    data:{
        pswDisplay: false,
    	postData:{
    		userMobile : null,
    		userPwd : null,
    		isBindWechat:true,
			wechatToken:storage.get('wechatToken')
    	},
        apiUrl: '/api/auth',
        type: 'password',
		mobile:null,
		passwd:null,
		phoneFalg:false,
		pswdFlag:false,
    },
    methods:{
        login : function() {
        	var vm = this;
			vm.$set('postData.userMobile', this.mobile);
			vm.$set('postData.userPwd', this.passwd);
			storage.set('mobile', enycryptPhoneNum(this.mobile));
        	rest.post({
        		url: vm.apiUrl,
        		data : vm.postData
        	}, function(data){
        		storage.set('user', data);
        		storage.set('userId', data.userId);
				window.location.href = vm.fromUrl;
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
        bindWechat: function () {
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
    	var vm = this;
		document.getElementById("checkbox-10-1").checked = true;
		var wechat = storage.get('wechatToken');
		if(!wechat){
			$("#checkbox_open").css("display","none");
		}
		else{
			$("#checkbox_open").css("display","block");
		}
    	//var defaultUrl = '/h5/html/myCenter/recharge.html';
		var defaultUrl = '/h5/html/activities/index.html';
    	vm.fromUrl = getFromUrl() || defaultUrl;
    	
    	if(storage.get('user')){
    		window.location = vm.fromUrl;
    	}
    }
});
vm.$watch('mobile', function (val) {
	this.phoneFlag = checkInput.validatePhoneNum(val,'loginBtn');
	checkInput.combinedCheck(this.phoneFlag,this.pswdFlag,true,true,'loginBtn');
});
vm.$watch('passwd', function (val) {
	this.pswdFlag=checkInput.validatePassword(val,'loginBtn');
	checkInput.combinedCheck(this.phoneFlag,this.pswdFlag,true,true,'loginBtn');
});