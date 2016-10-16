/**
 * Created by ChangFeng on 2016/10/12.
 */
var page = 1, rows = 10;
var myScroll;

$(function(){
    if ($('.scroller').height() < window.screen.height) {
        $('#pullUp').hide();
    }
    setTimeout(function(){
        scrollInit(pullUpAction);
    },1000)
})

var vm = new Vue({
    el : '#experienceMoney_container',
    data : {
    	userId : storage.get('userId'),
    	listData : [],
        activityAmount : '',
        historyAmount : '',
        interestAmount : ''
    },
    methods : {
		
        getAjaxData: function(page, rows) {
            var vm = this;
            rest.get({
                url: '/api/user-asset-info/' + vm.userId + '/use-tiyan',
                params : {
                    page : page,
                    rows : rows
                }
            },function(data) {
                vm.$set('activityAmount', NumberFixed(new Number(data.activityAmount), 2));
                vm.$set('historyAmount', NumberFixed(new Number(data.historyAmount), 2));
                vm.$set('interestAmount', NumberFixed(new Number(data.interestAmount), 2));
                if(data.resultList.length > 0){
                    for(var x=0; x < data.resultList.length; x++){
                        data.resultList[x].beginDateStr = formatDate(data.resultList[x].beginDate,"yyyy/MM/dd");
                        data.resultList[x].endDateStr = formatDate(data.resultList[x].endDate,"yyyy/MM/dd");
                        data.resultList[x].amountStr = NumberFixed(new Number(data.resultList[x].amount), 2);
                        data.resultList[x].yearRateStr = NumberFixed(new Number(data.resultList[x].yearRate * 100), 2) + '%';
                        data.resultList[x].dayRateStr = data.resultList[x].dayRate * 100 + '%';
                        vm.listData.push(data.resultList[x]);
                    }

                    if (data.resultList.length < rows) {
                        $('#pullUp').hide();
                        $('.noMoreData').show();
                    }

                    setTimeout(function(){
                        myScroll.refresh();
                    },100)
                    
                }else{
                    $('#pullUp').hide();
                    $('.noMoreData').show();
                    myScroll.refresh();
                }
            },function(data) {
                alert(data);
            });
        }
    },
    
    ready: function () {
    	if(userSession.checkId()) {
    		this.getAjaxData(page, rows);
    	}
    }
});

 function pullUpAction() {
    
        page = page + 1;
        setTimeout(function(){
            vm.getAjaxData(page, rows);
        },500)
        
        /*var el, li;  
        el = document.getElementById('experienceMoney_list');  
        for (i=0; i<10; i++) {  
            li = document.createElement('li');  
            li.innerText = '上拉加载--' + i;  
            document.getElementById('experienceMoney_list').appendChild(li, el.childNodes[0]);  
        }*/        
}
