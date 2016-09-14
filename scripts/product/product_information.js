/**
 * Created by GuoXiang on 2016/8/24.
 */
var vm = new Vue({
    el: '#product-info-container',
    data:{
        productData: fixedProductSessionStorageUtils.getSelectedRegularTarget()
    }
})