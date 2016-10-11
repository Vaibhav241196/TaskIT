import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


// Meteor.subscribe('users');
// Meteor.subscribe('teams');

/* Global Helper Functions */

function compareDate(d1,d2) {

    if( (d1.getDate() < d2.getDate()) && (d1.getMonth() <= d2.getMonth()) && (d1.getFullYear() <= d2.getFullYear()) )
        return -1;

    else if ( (d1.getDate() > d2.getDate()) && (d1.getMonth() >= d2.getMonth()) && (d1.getFullYear() >= d2.getFullYear()) )
        return 1;

    else
        return 0;
}

/* ====================================== Global Template Helpers ===================================== */

Template.registerHelper('notEqual',function (a,b) {
    return a != b ;
});

Template.registerHelper('isEqual',function (a,b) {
    return a == b ;
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

        console.log("In my tasks");
        var task_list =  [] ;
        var teams = Meteor.users.findOne({ _id : Meteor.userId() }).teams;
        var team;
        var team_tasks;

        function searchFunction(task,index){
            var return_value = ( task.members.indexOf(Meteor.userId()) >= 0 );

            console.log("In filter function");

            if(return_value) {
                task.team = { id : this._id , index : index };
            }
            return return_value;
        }

        if(teams) {
            for (i in teams) {

                team_tasks = [];
                team = Teams.findOne({_id: teams[i]});

                if(team) {
                    if (team.tasks) {
                        team_tasks = team.tasks.filter(searchFunction, team);
                    }
                }

                if(team_tasks) {
                    task_list = task_list.concat(team_tasks);
                }
            }
        }

        if(task_list)
            task_list.sort(function(a,b){ return a.deadline - b.deadline });

        console.log("My tasks : " );
        console.log(task_list);
        return task_list;

    },

    teamTasks () {

        for (t in this.tasks) {
            this.tasks[t].team = { id : this._id , index : t };
        }

        console.log("Team Tasks : " );
        console.log(this.tasks);
        return this.tasks;
    },

    contacts () {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    },
    
    assignedTasks () {

        var teams = Meteor.users.findOne({ _id : Meteor.userId() }).teams;
        var team;
        var team_tasks = [];
        var assigned_tasks_list = [];

        function searchFunction(task,index){

            var return_value = ( task.assignedBy == Meteor.userId() );

            if(return_value) {
                task.team = { id : this._id , index : index };
            }
            return return_value;
        }

        if(teams) {
            for (i in teams) {

                team_tasks = [];
                team = Teams.findOne({_id: teams[i]});

                if(team) {
                    if(team.tasks)
                        team_tasks = team.tasks.filter(searchFunction,team);
                }

                if(team_tasks)
                    assigned_tasks_list = assigned_tasks_list.concat(team_tasks);
            }
        }

        return assigned_tasks_list;
    },

    teams () {
        return Teams.find({name : { $exists : true }});
    }

});

Template.tasklist.helpers({

    getTeam () {

        var team_name = Teams.findOne({_id : this.team.id }).name;

        if(team_name) {
            return team_name;
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
        var month_arr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return date_arr[date.getDay()] + " " + date.getDate() + " " + month_arr[date.getMonth()]  + " " + date.getFullYear();
    },

    notLastOfArray(){
        // console.log(this);
    },

    getChecked(status) {
        if(this.status == status) {
            return "checked";
        }
        else
            return "";
    },

    getActive(status){
        if(this.status == status) {
            return "active";
        }
        else
            return "";
    },

    groupByDate(tasks) {
        var groups = [{groupName : 'Today' , records : [] , count : 0 },{groupName : 'Tommorow' , records : [] , count : 0 },{groupName : 'Later' , records : [] , count : 0 }];

        var today = new Date();
        
        var tommorow = new Date();
        tommorow.setDate(tommorow.getDate() + 1);


        console.log("All Tasks ");
        console.log(tasks);
        
        for (t in tasks) {
            if (!compareDate(tasks[t].deadline,today)){
                groups[0].records.push(tasks[t]);
                groups[0].count++;
            }

            else if (!compareDate(tasks[t].deadline,tommorow)){
                groups[1].records.push(tasks[t]);
                groups[1].count++;
            }
            
            else {
                groups[2].records.push(tasks[t]);
                groups[2].count++;
            }
        }

        console.log("Groups : ");
        console.log(groups);

        return groups;
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
       var today = new Date();

       task.name = $(evt.target).find("input[name='task-name']").val();
       task.description = $(evt.target).find("input[name='task-description']").val();

       task.deadline = $(evt.target).find("input[name='task-deadline']").val();
       task.deadline = new Date(task.deadline);

       task.duration = $(evt.target).find("input[name='task-duration']").val();
       task.priority = $(evt.target).find("[name='task-priority']").val();
       task.members = $(evt.target).find("[name='task-members']").val();
       task.assignedBy = Meteor.userId();


       if(compareDate(task.deadline,today) < 0)
           alert("Please Enter a realistic deadline. Your team mates can not go back in time and complete tasks");

       else {
           Meteor.call('assignTask', task, function (err, res) {

               if (err)
                   console.log(err);
               else
                   alert("Task Assigned succesfully");
           });
       }
       
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

        var today = new Date();
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

        if(compareDate(task.deadline,today) < 0)
            alert("Please Enter a realistic deadline. Your team mates can not go back in time and complete tasks");

        else {
            Meteor.call('assignTaskTeam', team_id, task, function (err, res) {
                if (err)
                    console.log(err);
                else
                    alert("Task Assigned succesfully");
            });
        }

    }
});

Template.tasklist.events({
   'change [name="status"]' : function (evt){
       evt.preventDefault();
       
       var team_id = this.team.id;
       var task_id = Number(this.team.index);

       var status = $(evt.target).val();

       Meteor.call('updateStatus',team_id,task_id,status);
   }
});


Template.verifyphone.events({
	'submit form#verify-phone' : function(evt) {
		evt.preventDefault();

		var user = Meteor.user();
		var code = $("[name='code']").val();
		Accounts.verifyPhone(user.phone.number,code,function(err){
			if(!err)
				if(this.next)
					Router.go(this.next);
				else
					Router.go('homescreen');
			else {
                console.log(err);
                alert(err.message);
            }
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
                alert(err.message);
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

        if(pwd !== conf_pwd) {
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
                    alert(err.message);
            });
        }
	},
});






