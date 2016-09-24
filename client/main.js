import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

console.log("Executing main.js");

// Session.setDefault('rerun',true);			// Default value of session variable rerun used to reactively run the homescreen helper

Meteor.subscribe('users');
Meteor.subscribe('teams');

Template.homescreen.onRendered(function fetchContacts(){
//	
// 	this.autorun(function(){ 
//
// 		Session.get('rerun');		// to reactively rerun the function
// 		var contact_accounts = [];
//
// 		Meteor.call('fetchContacts', function(err,res) {
// 			if(!err){
// 				console.log("Res : " + Array.isArray(res));
// 				console.log("Res : " + res);
// 				for (c in res) {
// 					contact_accounts.push(Meteor.users.findOne({_id : res[c] }));
// 				}
//
// 				Session.set('contacts',contact_accounts);
// 			}
//
// 			else
// 				console.log("Error");
//
// 		});
//
// 	});

    console.log(this);
});
//



Template.tabs.helpers({

	// user () {
	// 	// console.log(this.data);
	//    u = Meteor.users.findOne({_id : Meteor.userId() });
	// 	return u.profile.name;
	// },
    //
	// contacts () {
    //
	// 	return Session.get('contacts');
	// },

    tasks () {
        return Meteor.users.findOne({_id : Meteor.userId() }).tasks;
    },
    
    assignedTasks () {
        return Meteor.users.findOne({_id : Meteor.userId() }).assignedTasks;
    },

    getNameById () {
        return Meteor.users.findOne({_id : Meteor.userId() }).profile.name;
    },

    teams () {
        return Teams.find();
    }


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

Template.tabs.events({
   'submit form#assign-task-personal' : function (evt) {
	   evt.preventDefault();

	   var task = {};

       task.name = $(evt.target).find("input[name='task-name']").val();
       task.description = $(evt.target).find("input[name='task-description']").val();
       task.deadline = $(evt.target).find("input[name='task-deadline']").val();
       task.duration = $(evt.target).find("input[name='task-duration']").val();
       task.priority = $(evt.target).find("input[name='task-priority']").val();
       task.members = $(evt.target).find("[name='task-members']").val();
       task.assignedBy = Meteor.userId();
       
       
       Meteor.call('assignTask',task,function (err,res) {
           if(err)
               console.log(err);
           else 
               alert ("Task Assigned succesfully");
       });
       
   },

    'submit form#add-team-form' : function (evt) {
        evt.preventDefault();

        var team = {};

        team.name = $(evt.target).find("input[name='team-name']").val();
        team.description = $(evt.target).find("input[name='team-description']").val();
        team.members = $(evt.target).find("[name='team-members']").val();
        team.admin = Meteor.userId();


        Meteor.call('addTeam',team,function (err,res) {
            if(err)
                console.log(err);
            else
                alert ("Team created successfully");
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






