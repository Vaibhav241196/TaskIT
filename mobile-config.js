
// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
    id: 'com.siteflu.meteor',
    name: 'TaskIt',
    description: 'Task assignment app',
    author: 'Siteflu',
    email: 'siteflu@gmail.com',
    website: 'http://tasks.siteflu.com'
});
//Set up resources such as icons and launch screens.
App.icons({
    'iphone': 'public/icon.png',
    'iphone_2x': 'public/icon.png',
    'android_mdpi': 'public/icon.png',
    'android_hdpi': 'public/icon.png',
    'android_xhdpi': 'public/icon.png',
    'android_xxhdpi': 'public/icon.png',
    'android_xxxdpi': 'public/icon.png',
});

// App.launchScreens({
//     'iphone': 'splash/Default~iphone.png',
//     'iphone_2x': 'splash/Default@2x~iphone.png',
//     ... more screen sizes and platforms ...
// });
// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');

// Pass preferences for a particular PhoneGap/Cordova plugin
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//     APP_ID: '1234567890',
//     API_KEY: 'supersecretapikey'
// });
// Add custom tags for a particular PhoneGap/Cordova plugin
// to the end of generated config.xml.
// Universal Links is shown as an example here.
App.appendToConfig(`
  <universal-links>
    <host name="tasks.siteflu.com" />
  </universal-links>
`);