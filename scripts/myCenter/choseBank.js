new Vue({
    el: '#bank-list-container',
    data:{
        apiUrl: '/api/bank',
		listData: []
    },
    methods:{
        getData: function () {
            var vm = this;
            vm.$http.get(vm.apiUrl).then(function (response) {
            	console.log(response);
				rest.response(response, function(data) {
                	vm.$set('listData',response.json().banks);
            	});
            },function (response) {

              })
        },
		chooseBank: function(bankObj) {
			storage.set("chooseBank",bankObj);
			window.location.href = "html/myCenter/bindCard.html";
		}
    },
    ready: function () {
        this.getData();
    }
});