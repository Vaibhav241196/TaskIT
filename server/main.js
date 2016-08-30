import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

  SMS.twilio = {FROM: '+12563842702' , ACCOUNT_SID: 'AC9af1854c158ec45eee2bac61fc609e96', AUTH_TOKEN: '323b9a50fd5c0ebfaffa57bb52413fa7'};
   	
});
