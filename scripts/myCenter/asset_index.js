/**
 * Created by GuoXiang on 2016/8/24.
 */
var index_vm = new Vue({
    el: '#asset_index_container',
    data: {
        pswDisplay: false,

        apiUrl: '/api/user-assert/',

        dqBalance: null,
        hqBalance: null,
        rateBalance: null,
        amount: null,
        rate: null,
        bnBalance: 0,
        experienceMoneyAmount: null,
        value: true,
        baina: null
    },
    methods: {

        getAjaxData: function () {
            var vm = this;
            rest.get({
                url: vm.apiUrl + storage.get('userId')
            }, function (data) {
                vm.$set('dqBalance', NumberFixed(data.dqBalance, 2));
                vm.$set('hqBalance', NumberFixed(data.hqBalance, 2));
                vm.$set('rateBalance', NumberFixed(Math.floor(data.rateBalance * 100) / 100, 2));
                vm.$set('amount', NumberFixed(data.amount, 2));
                vm.$set('rate', NumberFixed(data.rate, 2));
               vm.$set('baina', NumberFixed(data.bnBalance, 2));
                vm.$set('experienceMoneyAmount', NumberFixed(data.experienceMoneyAmount,2));
            }, function (data) {
                alert(data);
            });
        },

        switch: function (e) {
            e.cancelBubble || e.stopPropagation();
            this.pswDisplay = !this.pswDisplay;
            this.value = !this.value;
        },

        jumpAsset: function () {
            window.location.href = "html/myCenter/total_asset.html";
        },
        retrive: function () {
            if(confirm("取现请下载多肉理财APP")){
                window.location.href = "http://ad.51doro.com/pf/wxPoster/poster3.html";
            }else{

            }
        },
        jumpBn: function () {
            if(confirm("查看请下载多肉理财APP")){
                window.location.href = "http://ad.51doro.com/pf/wxPoster/poster3.html";
            }else{

            }
        }
    },

    ready: function () {
        if (userSession.checkId()) {
            this.getAjaxData();
        }
    }
});
