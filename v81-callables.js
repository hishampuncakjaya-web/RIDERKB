/* MYRIDERKU V87 callable bridge (tahan ralat). Selamat dimuat dua kali. */
(function(g){
  if (g.MYRIDERKU_V81 && g.MYRIDERKU_V81.__v87) return;
  var names={
    startWhatsAppOtp:['startWhatsAppOtp',function(phone){return {phone:phone}}],
    verifyWhatsAppOtp:['verifyWhatsAppOtp',function(phone,otp){return {phone:phone,otp:otp}}],
    getCustomerSession:['getCustomerSession',function(){return undefined}],
    saveCustomerProfile:['saveCustomerProfile',function(name,address){return {name:name,address:address}}],
    adminListCustomers:['adminListCustomers',function(){return undefined}],
    adminSetCustomerBlocked:['adminSetCustomerBlocked',function(uid,blocked,reason){return {uid:uid,blocked:blocked,reason:reason||''}}],
    createOrder:['createCustomerOrder',function(p){return p}],
    acceptOrder:['acceptOrder',function(orderId){return {orderId:orderId}}],
    listRiderOrders:['listRiderOrders',function(){return undefined}],
    riderStatus:['riderUpdateOrderStatus',function(orderId,action,extra){return Object.assign({orderId:orderId,action:action},extra||{})}],
    riderArrival:['riderMarkArrival',function(orderId,kind){return {orderId:orderId,kind:kind}}],
    vendorStatus:['updateVendorOrderStatus',function(orderId,action,prep,reason){return {orderId:orderId,action:action,prepMinutes:prep||0,reason:reason||''}}],
    adminWallet:['adminAdjustRiderWallet',function(riderUid,amount,note){return {riderUid:riderUid,amount:amount,note:note||''}}],
    customerReceipt:['customerConfirmReceipt',function(orderId,value,message){return {orderId:orderId,value:value,message:message||''}}]
  };
  var fns=null;
  function getFns(){
    if(fns) return fns;
    if(!g.firebase||!g.firebase.functions) throw new Error('Perkhidmatan Firebase Functions belum dimuat. Muat semula halaman.');
    var m=/\/(admin|rider|vendor)(\.html)?\/?$/.exec(location.pathname), role=m?m[1]:null, app;
    try{ app=role?g.firebase.app(role):g.firebase.app(); }catch(e){ app=g.firebase.app(); }
    fns=app.functions('asia-southeast1'); return fns;
  }
  var api={__v87:true};
  Object.keys(names).forEach(function(k){
    api[k]=function(){
      var a=arguments, spec=names[k];
      try{
        var c=getFns().httpsCallable(spec[0]), d=spec[1].apply(null,a);
        return d===undefined?c():c(d);
      }catch(e){ return Promise.reject(e); }
    };
  });
  g.MYRIDERKU_V81=api;
})(window);
