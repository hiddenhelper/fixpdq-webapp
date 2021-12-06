export const isPushNotificationSupported = () => {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export const askUserPermission = async () => {
  return await Notification.requestPermission();
}

export const getUserSubscription = () => {
  return navigator.serviceWorker.ready
    .then(function (serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function (pushSubscription) {
      return pushSubscription;
    });
}
