/**
 * Created by GuoXiang on 2016/8/24.
 */
var vm=new Vue({
    el:"#invest-record-container",
    data:{
        ApiUrl:'',
        regularOrders:[]
    },
    methods:{
        getAjaxData: function () {
        	console.log(fixedProductSessionStorageUtils.getSelectedRegularTarget());
            var vm = this;
            rest.get({
                url : '/api/regular-target/' + fixedProductSessionStorageUtils.getSelectedRegularTarget().targetId + '/order'
            },function (data) {
                vm.$set('regularOrders',data.regularOrders);
                vm.hideMobile();
                vm.dateFormat();
            });
        },
        hideMobile:function() {
            var vm = this;
            for(var i=0;i<vm.regularOrders.length;i++){
                head = vm.regularOrders[i].mobile.substring(0, 3);
                tail = vm.regularOrders[i].mobile.substring(7, 11);
                vm.regularOrders[i].mobile = head + '****' + tail;
            }
        },
        dateFormat:function() {
            var vm = this;
            for(var i=0;i<vm.regularOrders.length;i++){
                var date=new Date(parseInt(vm.regularOrders[i].buyTime));
                var year=date.getYear()+1900;
                var month=date.getMonth()+1;
                var day=date.getDate();
                var hour=date.getHours();
                var minute=date.getMinutes();
                var second=date.getSeconds();
                vm.regularOrders[i].buyTime = year+"-"+month+"-"+day+"   "+hour+":"+minute+":"+second;
            }
        }
    },
    ready: function () {
        this.getAjaxData();
    }
})