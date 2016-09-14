/**
 * Created by GuoXiang on 2016/9/6.
 */
var url = storage.get("bannerUrl");
var index_vm = new Vue({
    el: '#activityArea',
    methods: {
        getAjaxData: function () {
            var vm = this;
            rest.get({
                url:url
            },function(data) {
                $("#contentSec").html();
                $("#contentSec").html(data);
            });
        }
    },
    ready: function() {
        this.getAjaxData();
    }
})