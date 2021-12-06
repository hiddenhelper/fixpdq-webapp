const receiveFixPDQPushNotification = (event) => {
  console.log("[Service Worker] FixPDQ Push Notification Received.");
  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge: "https://www.fixpdq.app/favicon.ico",
    actions: [{ action: "Detail", title: "View", icon: "" }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
}

const openFixPDQPushNotification = (event) => {
  console.log("[Service Worker] FixPDQ Notification Bubble Clicked Received.", event.notification.data);

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receiveFixPDQPushNotification);
self.addEventListener("notificationclick", openFixPDQPushNotification);
