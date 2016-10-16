var totalAsset_vm = new Vue({
    el: '#setup_index_container',
    data: {
        accNo: null,
        mobile: null,
        realName: null,
        idCard: null,
        bankName: null,
        isBind : false,
        bindUrl: null
    },
    methods: {
        ajaxData: function () {
            var userId = storage.get('userId');
           // var userId = '2016090513122648203';
            var vm = this;
            rest.get({
                url: '/api/user/' + userId + '/bankcard'
            }, function (data) {
                vm.isBind = true;
                vm.accNo = data.accNo;
                vm.mobile = data.mobile;
                vm.realName = data.realName;
                vm.idCard = data.idCard;
                vm.bankName = data.bankName;
                vm.changeUrl();
            }, function (data) {
                if(data.error.code=='没有绑卡'){
                    vm.isBind = false
                }
                if(storage.get("mobile")!=null){
                    vm.mobile = storage.get("mobile");
                }
                vm.changeUrl();
            });
         
        },
        logout: function () {
            sessionStorage.clear();
            window.location.href = "/h5/html/activities/index.html";
        },
        changeUrl: function () {
            var vm = this;
            if(!vm.isBind){
                vm.bindUrl = "/h5/html/myCenter/bindCard.html?from="+encodeURIComponent('/h5/html/myCenter/setup_center.html');
            }else{
                vm.bindUrl = "javascript:;";
            }
        }
        
    },
    ready: function () {
        this.ajaxData();

    }
})