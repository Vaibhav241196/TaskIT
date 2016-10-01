import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


// Meteor.subscribe('users');
// Meteor.subscribe('teams');

/* ====================================== Global Template Helpers ===================================== */

Template.registerHelper('notEqual',function (a,b) {
    return a != b ;
});

Template.registerHelper('contacts',function () {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}});
});

Template.registerHelper('getNameById',function (id) {
        return Meteor.users.findOne({_id : id }).profile.name;
});


/* ====================================  Tabs template Helpers ========================================= */
Template.tabs.helpers({

    myTasks () {

        var user = Meteor.users.findOne({ _id : Meteor.userId() });
        var task_list = user.tasks ? user.tasks : [] ;
        var teams = user.teams;
        var team;
        var team_tasks;

        function searchFunction(task){
            return task.members.indexOf(Meteor.userId()) >= 0;
        }

        if(user.teams) {
            for (i in teams) {
                team = Teams.findOne({_id: teams[i]});

                if(team) {
                    if(team.tasks)
                        team_tasks = team.tasks.filter(searchFunction);
                }

                if(team_tasks)
                    task_list = task_list.concat(team_tasks);


            }
        }

        if(task_list)
            task_list.sort(function(a,b){ return a.deadline - b.deadline });

        return task_list;

        // return Meteor.users.findOne({_id : Meteor.userId() }).tasks;
    },

    contacts () {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    },
    
    assignedTasks () {

        var assignedTasks  = Meteor.users.findOne({_id : Meteor.userId() }).assignedTasks;

        var assigned_tasks_list = [];

        for (a in assignedTasks) {
            if( assignedTasks[a].userId )
                assigned_tasks_list.push(Meteor.users.findOne({ _id: assignedTasks[a].userId }).tasks[assignedTasks[a].taskId]);

            else if(assignedTasks[a].teamId) {
                assigned_tasks_list.push(Teams.findOne({ _id: assignedTasks[a].teamId }).tasks[assignedTasks[a].taskId]);
            }

            return assigned_tasks_list;
        }
    },

    teams () {
        return Teams.find();
    }

});

Template.tasklist.helpers({
    getTeam () {
        if(this.team) {
            return Teams.findOne({_id : this.team }).name;
        }

        else
            return "Personal";
    },

    getColorByPriority(priority) {
        if(priority == 'low')
            return "alert-success";
        else if(priority == 'medium')
            return "alert-warning";
        else if(priority == 'high')
            return "alert-danger";
    },

    getDateString(date) {
        var date_arr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        return date_arr[date.getDay()] + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    },

    notLastOfArray(){
        console.log(this);
    },

});

// Template.homescreen.events({
// 	'submit form#add_contact' : function(evt) {
// 		evt.preventDefault();
// 		var mob_no = $("[name='mobno']").val();
// 		console.log(mob_no);
//
// 		Meteor.call('searchContact',mob_no,function(err,res){
// 			if(!err){
// 					if(res)
// 						Meteor.call('insertContact',res,function(err,res){
// 							if(!err){
// 								Session.set('rerun',!Session.get('rerun'));
// 								alert("Successfully Added Contact");
// 							}
// 							else
// 								console.log(err)
// 						});
//
// 					else
// 						alert("No such user found");
// 				}
//
// 			else
// 				console.log(err);
//
// 		});
// 	},
// });

Template.tabs.events({
   'submit form#assign-task-personal' : function(evt) {
	   evt.preventDefault();

	   var task = {};

       task.name = $(evt.target).find("input[name='task-name']").val();
       task.description = $(evt.target).find("input[name='task-description']").val();

       task.deadline = $(evt.target).find("input[name='task-deadline']").val();
       task.deadline = new Date(task.deadline);

       task.duration = $(evt.target).find("input[name='task-duration']").val();
       task.priority = $(evt.target).find("[name='task-priority']").val();
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

        team.members.push(team.admin);


        Meteor.call('addTeam',team,function (err,res) {
            if(err)
                console.log(err);
            else
                alert ("Team created successfully");
        });

    },

    'submit form#assign-task-team' : function (evt) {
        evt.preventDefault();

        var task = {};
        var team_id = this._id;

        console.log(this);

        task.name = $(evt.target).find("input[name='task-name']").val();
        task.description = $(evt.target).find("input[name='task-description']").val();

        task.deadline = $(evt.target).find("input[name='task-deadline']").val();
        task.deadline = new Date(task.deadline);

        task.duration = $(evt.target).find("input[name='task-duration']").val();
        task.priority = $(evt.target).find("[name='task-priority']").val();
        task.members = $(evt.target).find("[name='task-members']").val();
        task.assignedBy = Meteor.userId();
        task.team = team_id;


        Meteor.call('assignTaskTeam',team_id,task,function (err,res) {
            if(err)
                console.log(err);
            else
                alert ("Task Assigned succesfully");
        });

    }
});

Template.tasklist.events({
   'change [name="status"]' : function (evt){
       evt.preventDefault();
       console.log(this._id);
       console.log("In event");
   }
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
        var country_code = $("[name='country-code']").val();
		var mobno = $("[name = 'mobno']").val();
		var pwd = $("[name = 'password']").val();

        mobno = country_code + mobno;

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
		
		var country_code = $("[name = 'county-code']").val()
        var mobno = $("[name = 'mobno']").val();
		var pwd = $("[name = 'password']").val();
		var conf_pwd = $("[name = 'conf-password']").val();
		var name = $("[name = 'name']").val();

        mobno = country_code + mobno  ;

        if(pwd === conf_pwd) {
            alert("Passwords don't match");
        }

        else {
            
            var options = {
                phone: mobno, password: pwd, profile: {

                    name: name,
                }
            };

            Accounts.createUserWithPhone(options);

            Meteor.loginWithPhoneAndPassword({phone: mobno}, pwd, function (err) {
                if (!err)
                    Router.go('homescreen');
                else
                    console.log(err);
            });
        }
	},
});






