var index_vm = new Vue({
    el : '#user-fPsw-container',
    data : {
        imgApiUrl : '/api/captcha',
		checkImgCodeUrl : '/api/captcha',
		imgData : null,
		imgKey : null,
		imgCodeText : null,
		mobile : null
    },
    methods : {
        getImgCode : function () {
            var vm = this;
			rest.post({
        		url: vm.imgApiUrl
        	}, function(data){
        		vm.$set('imgData','data:image/png;base64,' + data.image);
				vm.imgKey = data.imgKey;
        	});
        },
		checkImgCode : function () {
            var vm = this;
			rest.get({
        		url: vm.checkImgCodeUrl + '?imgKey=' + this.imgKey + '&text=' + this.imgCodeText
        	}, function(data){
        		window.location.href = '/h5/html/user/setNewPsw.html?phone=' + vm.mobile;
        	});
        }
    },
    ready: function () {
        this.getImgCode();
    }
	
});
