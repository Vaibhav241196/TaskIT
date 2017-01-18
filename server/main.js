import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // code to run on server at startup
  // SMS.twilio = {FROM: '+12563842702' , ACCOUNT_SID: 'AC9af1854c158ec45eee2bac61fc609e96', AUTH_TOKEN: '323b9a50fd5c0ebfaffa57bb52413fa7'};
  
  /* ============================== Function for sending  sms ======================================== */
	SMS.send = function(options) {
	  
	 	try {
			 	// result = HTTP.call("get","http://smshorizon.co.in/api/sendsms.php",{ params : { user : "siteflu" , apikey : "g5JtwEaWcghvIseDeLJ3" , 
			 	// 		mobile : options.to , senderid : "MYTEXT" , message : options.body , type : "txt" }});

				console.log(options);

				HTTP.call("post","http://139.59.28.252/sms-api/sendsms.php",{ params : { uid : "7020903549" , 
			 			pwd : "Siteflu2016" , phone : options.to.slice(3),msg : options.body }},function(res,err){
			 					console.log(res);
			 					console.log(err);
			 			});

		 	}

		catch(e){
			console.log(e);
		}
 	}

 	/* =============================== Data publishing to clients ============================= */
	Meteor.publish('users',function () {
	    return Meteor.users.find({},{ fields: { services: 0 }});
	});

	Meteor.publish('teams',function () {
		return Teams.find({members : { $elemMatch : {$eq : this.userId } }});
	});
	/* =============================== Data publishing to clients end ============================= */

});


/* =============================== Server side methods ============================= */
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
	},

	'sendMessage' : function (options) {

		try {
		    // result = HTTP.call("get","http://smshorizon.co.in/api/sendsms.php",{ params : { user : "siteflu" , apikey : "g5JtwEaWcghvIseDeLJ3" ,
		    // 		mobile : options.to , senderid : "MYTEXT" , message : options.body , type : "txt" }});

		    console.log(options);
			result = HTTP.call("post","http://139.59.28.252/sms-api/sendsms.php",{ params : { uid : "7020903549" ,
		    	pwd : "Siteflu2016" , phone : options.phone,msg : options.msg }});

			console.log("Response");
			console.log(result);
		}

	    catch(e){
	        console.log("In catch block");
			console.log(e);
	    }
	},

});
/* =============================== Server side methods end ============================= */