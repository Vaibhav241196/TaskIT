import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

Meteor.startup(() => {
  // code to run on server at startup

  // SMS.twilio = {FROM: '+12563842702' , ACCOUNT_SID: 'AC9af1854c158ec45eee2bac61fc609e96', AUTH_TOKEN: '323b9a50fd5c0ebfaffa57bb52413fa7'};
  SMS.send = function(options) {
 	// console.log(options);

 	// var msg_str = "http://smshorizon.co.in/api/sendsms.php&user=siteflu&apikey=g5JtwEaWcghvIseDeLJ3&mobile="+options.to+"&senderid=MYTEXT&message="+options.body+"type=txt";

 	// var req = new XMLHttpRequest();
 	// req.open("GET",msg_str,true);
 	// req.send();


	 	try {
			 	result = HTTP.call("get","http://smshorizon.co.in/api/sendsms.php",{ params : { user : "siteflu" , apikey : "g5JtwEaWcghvIseDeLJ3" , 
			 			mobile : options.to , senderid : "MYTEXT" , message : options.body , type : "txt" } },function(result){
			 				console.log("HTTP call result : " + result.content);
			 			});	 		
		 	}

		catch(e){
			console.log(e);
		}	


 	}  	
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