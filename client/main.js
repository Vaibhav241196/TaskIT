import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../node_modules/bootstrap/dist/css/bootstrap.css'

import './main.css'

import Bootstrap from 'bootstrap';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });


Template.homescreen.helpers({

	user () {
		u = Meteor.users.findOne({_id : Meteor.userId() });
		console.log(Meteor);
		return u.profile.name;
	} ,

	users () {
		u = Meteor.users.find();
		return u;
	},
});

Template.verifyphone.events({
	'submit form#verify-phone' : function(evt) {
		evt.preventDefault();

		var user = Meteor.user();
		console.log(user);
		var code = $("[name='code']").val();
		// Meteor.logout();
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

		console.log(this.next);
		var mobno = $("[name = 'mobno']").val();
		var pwd = $("[name = 'password']").val();
		console.log(mobno);

		Meteor.loginWithPhoneAndPassword({phone : mobno},pwd,function(err){
		if(!err)
			if(this.next)
				Router.go(this.next);
			else
				Router.go('homescreen');
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
		
		console.log(mobno);
		console.log(pwd);
		console.log(name);
		console.log(Meteor);


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






