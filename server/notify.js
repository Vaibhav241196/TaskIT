/**
 * Created by lite on 3/11/16.
 */

Push.Configure({
    // apn: {
    //     certData: Assets.getText('apnDevCert.pem'),
    //     keyData: Assets.getText('apnDevKey.pem'),
    //     passphrase: 'xxxxxxxxx',
    //     production: true,
    //     //gateway: 'gateway.push.apple.com',
    // },

    gcm: {
        apiKey: 'AIzaSyDrD4kuQcovkV5DnpLh-AMMYFtRn05_rt4',
        projectNumber: 284029652921,
    },

    // production: true,
    sound: true,
    badge: true,
    alert: true,
    vibrate: true,
    // 'sendInterval': 15000, Configurable interval between sending
    // 'sendBatchSize': 1, Configurable number of notifications to send per batch
    // 'keepNotifications': false,
//
});