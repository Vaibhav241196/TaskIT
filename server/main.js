import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

  SMS.twilio = {FROM: '+12563842702' , ACCOUNT_SID: 'AC9af1854c158ec45eee2bac61fc609e96', AUTH_TOKEN: '323b9a50fd5c0ebfaffa57bb52413fa7'};
   	
});


Meteor.methods({
	searchContact : function(mob_no) {
		console.log(mob_no);
		var user = Meteor.users.findOne({ 'phone.number' : mob_no  });
		console.log(user);
		if(user)
			return user._id;
		else
			return undefined;
	},

	insertContact : function(contact){
		
		Meteor.users.update({_id : this.userId 
		},{
			$push : { contacts : contact },
		});
	},

	fetchContacts : function(){

		contacts =  Meteor.users.findOne({_id : this.userId }).contacts;
		console.log(typeof(contacts));
		return contacts;
	}

})