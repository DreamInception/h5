/**
 * Created by GuoXiang on 2016/10/12.
 */
var myScroll = null;
$(function () {

    setTimeout(function () {
        scrollInit(pullUpAction);
    }, 500);
})

var currentBao_vm = new Vue({
    el: '#currentBao_container',
    data: {
        pageIndex: 1,
        pageNum: 2,
        accountNum: null,
        yestNum: null,
        sumNum: null,
        leftDays: null,
        currentlist: [],
        userId: null,
        returnData: []
    },
    methods: {
        initData: function () {
            var vm = this;
            if (storage.get("userId")) {
                vm.userId = storage.get("userId");
            }
            rest.get({
                url: '/api/user-asset-info/' + vm.userId + '/hquser',
                params: {
                    page: vm.pageIndex,
                    rows: vm.pageNum
                }
            }, function (data) {
                vm.accountNum = NumberFixed(data.current, 2);
                vm.yestNum = NumberFixed(data.yesterdayInterest, 2);
                vm.sumNum = NumberFixed(data.countInterest, 2);
                for (var i = 0, len = data.hqList.length; i < len; i++) {
                    var nextAppendDate = data.hqList[i].nextAppendDate;
                    data.hqList[i].currentAmount = NumberFixed(data.hqList[i].currentAmount, 2);
                    data.hqList[i].yearRate = NumberFixed(data.hqList[i].yearRate * 100, 1);
                    data.hqList[i].appendRate = NumberFixed(data.hqList[i].appendRate * 100, 1);
                    data.hqList[i].leftDays = Math.floor((new Date(nextAppendDate) - new Date()) / (1000 * 86400));
                    if(myScroll){
                        setTimeout(function () {
                            myScroll.refresh();
                        }, 100);

                    }
                };
                for (var i = 0, len = data.hqList.length; i < len; i++) {
                    vm.returnData.push(data.hqList[i]);
                }
                vm.$set('currentlist', vm.returnData);


            }, function (data) {
                $(".pullUpIcon").hide();
                alert(data);
            })
        },
        currentOut: function () {
                if(confirm("转出请下载多肉理财APP")){
                    window.location.href = "http://ad.51doro.com/pf/wxPoster/poster3.html";
                }else{

                }
            }


    },
    ready: function () {
        this.initData();
        var vm = this;


    }
})
function pullUpAction() {
    currentBao_vm.pageIndex++;
    setTimeout(function () {
        currentBao_vm.initData();
    },1000);

}