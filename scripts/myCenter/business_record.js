/**
 * Created by GuoXiang on 2016/10/12.
 */
var pageNumber = 1, type = 1;
var busRecord_vm = new Vue({
    el: '#business_record_container',
    data: {
        appUrl: '/api/user-asset-info/' + storage.get('userId') + '/tradeHistory',
        listData: [],
        selectGou: false,
        menuOpen: false
    },
    methods: {
        init: function () {
            var height = $(window).height();
            var headHeight = $(".header").height();
            $(".business_record_container").css("height",height);
            $(".record_body").css({
                "height": height - headHeight,
                // "top": headHeight
            });
        },
        switchMenu: function () {
            var vm = this;
            if(!vm.menuOpen){
                vm.menuOpen = true;
                $(".record_body").show();
            }else{
                vm.menuOpen = false;
                $(".record_body").hide();
            }
        },
        openRecord: function(type,title){
            var vm = this;
            vm.menuOpen = false;
            $(".record_body").hide();
            vm.getAjaxData(pageNumber, type);
            $('.record_title').html(title);
        },
        getAjaxData: function(pageNumber, type) {
            var vm = this;
            rest.get({
                url: vm.appUrl,
                params : {
                    pageNumber : pageNumber,
                    type : type
                }
            },function(data) {
                if(data.resultList.length > 0){
                    for(var x=0; x < data.resultList.length; x++){
                        data.resultList[x].amountStr = NumberFixed(new Number(data.resultList[x].amount), 2);
                    } 
                    vm.$set('listData', data.resultList);                   
                }else{
                    vm.$set('listData', []);  
                }
            },function(data) {
                alert(data);
            });
        }
    },
    ready: function () {
        this.init();
        this.getAjaxData(pageNumber, type);
    }
})