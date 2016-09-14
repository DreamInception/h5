/**
 * Created by GuoXiang on 2016/8/24.
 */
var rechargeSuccess_vm=new Vue({
    el: '#recharge-success-container',
    data:{
        accNo: '',
        bankName: '',
        moneyNum: '',
        fromUrl: null,
        fromUrlExist: true
    },
    ready: function () {
        var vm = this;
        vm.accNo = decodeURIComponent(getUrlParam().accNo);
        vm.moneyNum = decodeURIComponent(getUrlParam().moneyNum);
        vm.bankName = decodeURIComponent(getUrlParam().bankName);
        vm.fromUrl = decodeURIComponent(getUrlParam().fromUrl);
        if(vm.fromUrl=='html/myCenter/asset_index.html'){
            vm.fromUrlExist = false;
        }
        else{
            vm.fromUrlExist = true;
        }
    }
});