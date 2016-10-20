var index_vm = new Vue({
    el : '#rf_product_artical',
    data : {
    	pswDisplay: false,
    	apiUrl : '/api/user-asset-info/',
        value: true,
        ifMyPro:true,
        dquserId:"",
        targetName:"",//产品名称
        respectIncome:"",//预期收益
        currentAmount:"",//持有资产
        respectAmount:"",//代收本息
        repayDate:"",//到期日期
        remainDay:"",//剩余天数
        buyDate:"",//投资时间
        respectInterest:"",//预期年化收益
        respectBaseIncome:"",//预期基本收益
		respectBDIncome:"",//预期标的收益
		respectActIncome:"",//预期活动收益
        targetIcon:"",//图标   		
		targetId:""
    },
    methods : {
		
        getAjaxData: function () {
            var vm = this;
            var userId = storage.get('userId');
            //userId = '2016090513122648303';
            rest.get({
            	url : vm.apiUrl+userId+'/'+vm.dquserId+'/invest-detail'
            }, function(data){
            		vm.targetName = data.targetName;
            		vm.respectBaseIncome = vm.setAmount(data.baseInterestAmount);
            		vm.respectBDIncome = vm.setAmount(data.bdInterestAmount);
            		vm.respectActIncome = vm.setAmount(data.kjInterestAmount);
            		vm.respectIncome = NumberFixed((vm.respectBaseIncome-0)+(vm.respectBDIncome-0)+(vm.respectActIncome-0), 2);
            		vm.currentAmount = vm.setAmount(data.currentAmount);
            		vm.respectAmount =  NumberFixed((vm.currentAmount-0)+(vm.respectIncome-0),2);
            		vm.repayDate = data.repayDate;
            		vm.remainDay = data.remainDays;
            		vm.buyDate = vm.handleData('buyDate',data.buyTime);
            		vm.respectInterest = vm.setRate(data.yearRate);
            		
            		vm.targetIcon = data.targetIcon;
            		vm.targetId = data.targetId;
            		
            		
				 
            }, function(data){
            	//alert(data);
            });
        },
        showDetailbenifit:function(type){
        	if(type==1){
        		$("#ts_alt").css("display","none");
        		$("#ts_zichan_border").css("display","block");
        		$("#ts_span").css("display","block");
        	}
        	else if(type==2){
        		$("#ts_alt").css("display","block");
        		$("#ts_zichan_border").css("display","none");
        		$("#ts_span").css("display","none");
        	}
        },
        pageToContact:function(){
        	window.location.href = '/h5/html/contract/pdt_contract_dq.html';
        },
        pageToProduct:function(){
        	var obj = {
        		targetName:"",
        		targetAmount:"",
        		day:"",
        		minAmount:"",
        		yearRateStr:"",
        		beginDate:"",
        		endDate:"",
        	}
        	fixedProductSessionStorageUtils.setSelectedRegularTarget(obj);
        	window.location.href = '/h5/html/product/fixed_product/fixed_product_details.html?targetId='+(this.targetId+'');
        },
        handleData:function(type,v){
        	if(type == 'respectAmount'){
        		return this.setAmount(v.currentAmount+v.preAmount);
        	}
        	else if(type == 'buyDate'||type == 'repayDate'){
        		//处理时间
        		date=new Date(parseInt(v)+86400000);
                var dateformat=date.format('yyyy-MM-dd');
        		return dateformat;
        	}
        },
        setAmount: function(amount){
        	 var result = [];
        	amount+='';
        	var amounts = amount.split(".");
        	if(amounts.length == 1){
        		result[0] = amount;
        		result[1] = '00';
        	}
        	else{
        		result[0] = amounts[0];
        		if(amounts[1].length == 1){
        			result[1] = amounts[1]+'0';
        		}
        		else if(amounts[1].length == 2){
        			result[1] = amounts[1];
        		}
        		else if(amounts[1].length > 2){
        			result[1] = amounts[1].substring(0,2);
        		}
        		
        	}
        	return result[0]+'.'+result[1];
        	//return amount.toFixed(2);
        },
        setRate: function(amount){
		    return  (amount*100).toFixed(2)+'%';
        }
        
    },
    
    ready: function () {
    	if(userSession.checkId()) {
    		var parm = getUrlParam();
			//var proId = parm.product;
			var type = parm.type;
			this.dquserId = parm.dquserId;
			if(type == "product"){
				this.ifMyPro = true;
			}
			else if(type == "history"){
				this.ifMyPro = false;
			}
	    		this.getAjaxData();
	    }
    }
});
