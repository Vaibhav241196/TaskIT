import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // code to run on server at startup

  // SMS.twilio = {FROM: '+12563842702' , ACCOUNT_SID: 'AC9af1854c158ec45eee2bac61fc609e96', AUTH_TOKEN: '323b9a50fd5c0ebfaffa57bb52413fa7'};
  SMS.send = function(options) {
	  
	 	try {
			 	// result = HTTP.call("get","http://smshorizon.co.in/api/sendsms.php",{ params : { user : "siteflu" , apikey : "g5JtwEaWcghvIseDeLJ3" , 
			 	// 		mobile : options.to , senderid : "MYTEXT" , message : options.body , type : "txt" }});

				console.log(options);

				result = HTTP.call("post","http://139.59.28.252/sms-api/sendsms.php",{ params : { uid : "7020903549" , 
			 			pwd : "Siteflu2016" , phone : options.to.slice(3),msg : options.body }});

				console.log(result);

		 	}

		catch(e){
			console.log(e);
		}
 	}
});


Meteor.publish('users',function () {
    return Meteor.users.find({});
});

Meteor.publish('teams',function () {
	return Teams.find({members : { $elemMatch : {$eq : this.userId } }});
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

});