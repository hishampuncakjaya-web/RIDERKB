/* MYRIDERKU V81 callable bridge. Load after firebase-config.js and Firebase Functions compat SDK. */
(function(g){
  const functions = firebase.app().functions('asia-southeast1');
  const call = name => functions.httpsCallable(name);
  g.MYRIDERKU_V81 = {
    startWhatsAppOtp: phone => call('startWhatsAppOtp')({phone}),
    verifyWhatsAppOtp: (phone, otp) => call('verifyWhatsAppOtp')({phone, otp}),
    getCustomerSession: () => call('getCustomerSession')(),
    saveCustomerProfile: (name, address) => call('saveCustomerProfile')({name, address}),
    adminListCustomers: () => call('adminListCustomers')(),
    adminSetCustomerBlocked: (uid, blocked, reason='') => call('adminSetCustomerBlocked')({uid, blocked, reason}),
    createOrder: payload => call('createCustomerOrder')(payload),
    acceptOrder: orderId => call('acceptOrder')({orderId}),
    listRiderOrders: () => call('listRiderOrders')(),
    riderStatus: (orderId, action, extra={}) => call('riderUpdateOrderStatus')({orderId, action, ...extra}),
    riderArrival: (orderId, kind) => call('riderMarkArrival')({orderId, kind}),
    vendorStatus: (orderId, action, prepMinutes=0, reason='') => call('updateVendorOrderStatus')({orderId, action, prepMinutes, reason}),
    adminWallet: (riderUid, amount, note='') => call('adminAdjustRiderWallet')({riderUid, amount, note}),
    customerReceipt: (orderId, value, message='') => call('customerConfirmReceipt')({orderId, value, message})
  };
})(window);
