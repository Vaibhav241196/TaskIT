import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './main.css'
import Bootstrap from 'bootstrap';
import './main.html';                                                                                                                                      

Session.setDefault('rerun',true);			// Default value of session variable rerun used to reactively run the homescreen helper

Template.homescreen.onRendered(function fetchContacts(){
	
	this.autorun(function(){ 

		Session.get('rerun');		// to reactively rerun the function
		var contact_accounts = [];

		Meteor.call('fetchContacts', function(err,res) {
			if(!err){
				console.log("Res : " + Array.isArray(res));
				console.log("Res : " + res);
				for (c in res) {
					contact_accounts.push(Meteor.users.findOne({_id : res[c] }));
				}

				Session.set('contacts',contact_accounts);
			}

			else
				console.log("Error");

		});

	});
});

Template.userLayout.helpers({
	user () {
		u = Meteor.users.findOne({_id : Meteor.userId() });
		return u.profile.name;
	} ,
})

Template.homescreen.helpers({

	user () {
		u = Meteor.users.findOne({_id : Meteor.userId() });
		return u.profile.name;
	} ,

	contacts () {

		return Session.get('contacts');
	},
});

Template.homescreen.events({
	'submit form#add_contact' : function(evt) {
		evt.preventDefault();
		var mob_no = $("[name='mobno']").val();
		console.log(mob_no);

		Meteor.call('searchContact',mob_no,function(err,res){
			if(!err){
					if(res) 
						Meteor.call('insertContact',res,function(err,res){
							if(!err){
								Session.set('rerun',!Session.get('rerun'));
								alert("Successfully Added Contact");
							}
							else
								console.log(err)
						});

					else
						alert("No such user found");
				}
			
			else 
				console.log(err);
			
		});
	},

});

Template.verifyphone.events({
	'submit form#verify-phone' : function(evt) {
		evt.preventDefault();

		var user = Meteor.user();
		var code = $("[name='code']").val();
		console.log(code);
		Accounts.verifyPhone(user.phone.number,code,function(err){
			if(!err)
				if(this.next)
					Router.go(this.next);
				else
					Router.go('homescreen');
			else
				console.log(err);
		});
	},

	'click #resend-code' : function(evt) {
		evt.preventDefault();

		var user = Meteor.user();
		Accounts.requestPhoneVerification(user.phone.number);
	}
});


Template.login.events({
	
	'submit form' : function(evt) {
		
		evt.preventDefault();
		var mobno = $("[name = 'mobno']").val();
		var pwd = $("[name = 'password']").val();
		console.log(mobno);
		console.log(this.next);

		var next = this.next;

		Meteor.loginWithPhoneAndPassword({phone : mobno},pwd,function(err){
			if(!err) {
				
				if(next) {
					console.log('Routing to next');
					Router.go(next);
				}

				else {
					console.log("homescreen");
					Router.go('homescreen');
				}
			}

			else
				console.log(err);
		});
	},
});

Template.register.events({

	'submit form' :  function(evt) {
		evt.preventDefault();
		
		var mobno = $("[name = 'mobno']").val();
		var pwd = $("[name = 'password']").val();
		var name = $("[name = 'name']").val();
		var options = {phone : mobno , password : pwd , profile : {

					name : name,
			} 
		};

		Accounts.createUserWithPhone(options);

		Meteor.loginWithPhoneAndPassword({phone : mobno},pwd,function(err){
			if(!err)
				Router.go('homescreen');
			else
				console.log(err);
		});
	},
});






