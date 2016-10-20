var index_vm = new Vue({
    el : '#rf_index_artical',
    data : {
    	pswDisplay: false,
    	
    	apiUrl : '/api/user-asset-info/',
        value: true,
        tab_showTab1:true,
        totalAmout_pre:0,
        totalAmout_end:'00',
        totalInterset_pre:0,
        totalInterset_end:'00',
        test:1,
        myProducts:[
        	/*{
        		name:"定期123101期",
        		day:18,
        		ifRaise:false,
        		money1:"208,999",
        		money2:"2890",
        		date:"2016-1-21"
        	},
        	{
        		name:"定期123102期",
        		day:19,
        		ifRaise:true,
        		money1:"2,999",
        		money2:"2890",
        		date:"2016-1-21"
        	}*/
        ],
        hisProducts:[
        	/*{
        		name:"定期123199期",
        		day:18,
        		ifJX:false,
        		money1:"208,999",
        		money2:"2890",
        		date:"2016-1-21"
        	}*/
        ],
        currentPage:1
    },
    methods : {
		
        getAjaxData: function (page,isRepay) {
        	if(page == 1){
        		if(isRepay) this.hisProducts = [];
        		else this.myProducts = [];
        	}
            var vm = this;
            var userId = storage.get('userId');
            //userId = '2016090513122648303';
            rest.get({
            	url : vm.apiUrl+userId+'/dquser?page='+page+'&isRepay='+isRepay
            }, function(data){
            	vm.setAmount(data.currentAmount,data.preAmount);
            	var dqUsers = data.dqUsers;
            	for(var i = 0;i < dqUsers.length;i++){
            		var temp = {
            			name:"",//"产品名称",
		        		remainDay:"",//剩余天数,
		        		ifRaise:"",//是否加息,
		        		currentAmount:"",//"持有资产",
		        		respectAmount:"",//"待收本息",
		        		respectIncome:"",//"预期收益",
		        		respectBaseIncome:"",//预期基本收益
		        		respectBDIncome:"",//预期标的收益
		        		respectActIncome:"",//预期活动收益
		        		targetIcon:"",//产品图标
		        		respectInterest:"",//预期利息,
		        		buyDate:"",//"投资日期"
		        		repayDate:"",//"到期日期"
		        		dqUserId:""//产品id
            		}
            		var v = dqUsers[i]; 
            		temp.name = v.targetName;
            		temp.remainDay = vm.handleData('remainDays',v.remainDays);
            		temp.ifRaise = vm.handleData('ifRaise',v);
            		temp.currentAmount = v.currentAmount;
            		temp.respectIncome = vm.handleData('respectIncome',v);
            		temp.respectAmount = vm.handleData('respectAmount',v);
            		temp.respectBaseIncome = v.baseInterestAmount;
            		temp.respectBDIncome = v.bdInterestAmount;
            		temp.respectActIncome = v.kjInterestAmount;
            		temp.targetIcon = v.targetIcon;
            		temp.respectInterest = '9%';//hard code
            		temp.buyDate = vm.handleData('buyDate',v.buyTime);
            		temp.repayDate = vm.handleData('repayDate',v.repayTime);
            		temp.dqUserId = v.dqUserIdStr+'';
            		
            		
            		if(isRepay){
            			vm.hisProducts.push(temp);
            		}
            		else{
            			vm.myProducts.push(temp);
            		}
            		
            	}
            	if(isRepay){
            		vm.$set('myPhisProductsroducts',vm.myProducts);
            	}
            	else{
            		vm.$set('myProducts',vm.myProducts);
            	}
            	 
            	/*vm.$set('dqBalance',NumberFixed(data.dqBalance, 2));
                vm.$set('hqBalance',NumberFixed(data.hqBalance, 2));
                vm.$set('rateBalance',NumberFixed(Math.floor(data.rateBalance*100)/100, 2));
                vm.$set('amount',NumberFixed(data.amount,2));
                vm.$set('rate',NumberFixed(data.rate, 2));
                vm.$set('experienceMoneyAmount',(data.experienceMoneyAmount).toFixed(2));*/
               
               
				//下拉列表初始化               
                 /*setTimeout(function(){
                        scrollInit(function(){
                        	index_vm.getAjaxData(++index_vm.currentPage,!index_vm.tab_showTab1);
                        	//myScroll.refresh();
                        });
                },500)*/
				 
            }, function(data){
            	//alert(data);
            });
        },
        
        changeTab : function () {
        	//this.test++;
            this.tab_showTab1 = !this.tab_showTab1;
            this.currentPage = 1;
            this.getAjaxData(this.currentPage,!this.tab_showTab1);
        },
        showMyProcDetail:function(index){
        	var dqUserId = this.myProducts[index].dqUserId;
        	window.location.href = '/h5/html/myCenter/regular_financial/rf_product.html?type=product&dquserId='+dqUserId;
        },
        showHisProcDetail:function(proc){
        	window.location.href = '/h5/html/myCenter/regular_financial/rf_product.html?type=history&dquserId='+proc.dqUserId;
        },
        handleData:function(type,v){
        	if(type == 'ifRaise'){
        		if(v.kjInterestAmount > 0) return true;
        		else return false;
        	}
        	else if(type == 'respectIncome'){
        		var m = v.baseInterestAmount+v.bdInterestAmount+v.kjInterestAmount;
        		return NumberFixed(m, 2);
        	}
        	else if(type == 'respectAmount'){
        		return v.currentAmount+v.respectIncome;
        	}
        	else if(type == 'buyDate'||type == 'repayDate'){
        		//处理时间
        		date=new Date(parseInt(v));
                var dateformat=date.format('yyyy-MM-dd');
        		return dateformat;
        	}
        	else if(type == 'remainDays'){
        		if(v == 0){
        			return '到期处理中';
        		}
        		else{
        			return '剩余'+v+'天';
        		}
        	}
        },
        setAmount: function (amount,inserest){
        	amount+='';
        	inserest+='';
        	var amounts = amount.split(".");
        	if(amounts.length == 1){
        		this.$set('totalAmout_pre',amount);
        		this.$set('totalAmout_end','00');
        	}
        	else{
        		this.$set('totalAmout_pre',amounts[0]);
        		this.$set('totalAmout_end',amounts[1]);
        	}
        	var inserests = inserest.split(".");
        	if(inserests.length == 1){
        		this.$set('totalInterset_pre',inserest);
        		this.$set('totalInterset_end','00');
        	}
        	else{
        		this.$set('totalInterset_pre',inserests[0]);
        		this.$set('totalInterset_end',inserests[1]);
        	}
        }
    },
    
    ready: function () {
    	var vm = this;
		$(window).scroll(function() {
			var mayLoadContent = $(window).scrollTop() >= $(document).height() - $(window).height();
			var docHeight = $(document).height();
			if(mayLoadContent) {
				//alert("触发滚动");
				
				/*var temp = {
            			name:vm.test,//"产品名称",
		        		remainDay:vm.test,//剩余天数,
		        		ifRaise:vm.test,//是否加息,
		        		currentAmount:vm.test,//"持有资产",
		        		respectAmount:vm.test,//"待收本息",
		        		respectIncome:vm.test,//"预期收益",
		        		respectBaseIncome:vm.test,//预期基本收益
		        		respectBDIncome:vm.test,//预期标的收益
		        		respectActIncome:vm.test,//预期活动收益
		        		targetIcon:vm.test,//产品图标
		        		respectInterest:vm.test,//预期利息,
		        		buyDate:vm.test,//"投资日期"
		        		repayDate:vm.test,//"到期日期"
		        		dqUserId:vm.test//产品id
            		}
				vm.hisProducts.push(temp);
				vm.test++;*/
				vm.getAjaxData(++vm.currentPage,!vm.tab_showTab1);
			}
		});
    	if(userSession.checkId()) {
    		this.getAjaxData(1,!this.tab_showTab1);
    	}
    	//this.getAjaxData(1,!this.tab_showTab1);
    
    }
});

    var myScroll,
    pullUpEl, pullUpOffset,proType,
    page = 2;

    function pullUpAction () {
        setTimeout(function () {    
           /* var el, li;  
            el = document.getElementById('experienceMoney_list');  
            for (i=0; i<10; i++) {  
                li = document.createElement('li');  
                li.innerText = '上拉加载--' + i;  
                document.getElementById('experienceMoney_list').appendChild(li, el.childNodes[0]);  
            }  */
            myScroll.refresh();
            index_vm.getAjaxData(++index_vm.currentPage,!index_vm.tab_showTab1);
            /*$.ajax({
                url:"",
                type:'get',
                data:{"page":page},
                
                success: function (data) {
                    if (data) {
                        info.append(data);
                        page = page + 1;
                        myScroll.refresh();
                    } else{
                        $('#pullUp').hide();
                    };

                }
            });*/
        }, 1000);   
    }