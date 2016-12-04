/**
 * Created by lite on 3/11/16.
 */

/* =============================== For notifications on android devices ============================= */
Push.Configure({
    android: {
        senderID: 284029652921,
        alert: true,
        badge: true,
        sound: true,
        vibrate: true,
        clearNotifications: true
        // icon: '',
        // iconColor: ''
    },
    // ios: {
    //     alert: true,
    //     badge: true,
    //     sound: true
    // }
});