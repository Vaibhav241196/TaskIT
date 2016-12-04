import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


// Meteor.subscribe('users');
// Meteor.subscribe('teams');

/* Global Helper Functions */

function compareDate(d1,d2) {

    d1.setHours(0);
    d1.setMinutes(0);
    d1.setSeconds(0);
    d1.setMilliseconds(0);

    d2.setHours(0);
    d2.setMinutes(0);
    d2.setSeconds(0);
    d2.setMilliseconds(0);

    if( d1 < d2)
        return -1;

    else if ( d1 > d2)
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

Template.registerHelper('parseObject',function(str){
    return JSON.parse(str);
});

Template.registerHelper('stringifyObject',function(obj){
    return JSON.stringify(obj);
});

Template.registerHelper('runHelper',function(template,helper){
    helper = " " + helper;
    console.log(this);
    return Template[template].__helpers[helper].call(this);
});

Template.registerHelper('notContains',function(string,substring){
    
    if(string.indexOf(substring) == -1)
        return true;
    else
        return false;
});


/* ====================================  Tabs template Helpers ========================================= */
Template.tabs.helpers({

    contacts () {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    },
    
    displayTeams () {

        var teams = Teams.find({name : { $exists : true }}).fetch();
        
        for( t in teams) {
            teams[t].helper = "teamTasks";
            teams[t].selector = "team-"+t;
        }
        
        teams.push({name: 'New Team', selector: 'new' , target: 'add-new-team' });
        
        console.log(teams);
        return teams;
    }

});
/* ====================================  Tabs template Helpers end ========================================= */

/* ====================================  Generic tab content template Helpers ========================================= */
Template.tabcontentLayout.helpers({

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

        var team = Teams.findOne({ _id : this._id });

        if (team.tasks) {
            for (t in team.tasks) {
                team.tasks[t].team = { id : this._id , index : t };
            }
        }

        console.log("Team Tasks : " );
        return team.tasks;
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

});
/* ====================================  Generic tab content template Helpers end ========================================= */


/* ====================================  Generic task listing template Helpers ========================================= */
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
        var groups = [{groupName : 'DeadlineExtended' , records : [] , count : 0 },{groupName : 'Today' , records : [] , count : 0 },{groupName : 'Tommorow' , records : [] , count : 0 },{groupName : 'Later' , records : [] , count : 0 }];

        var today = new Date();
        var tommorow = new Date();

        tommorow.setDate(tommorow.getDate() + 1);


        console.log("All Tasks ");
        console.log(tasks);
        
        for (t in tasks) {

            if(compareDate(tasks[t].deadline,today) == -1){
                groups[0].records.push(tasks[t]);
                groups[0].count++;
            }
            
            else if (compareDate(tasks[t].deadline,today) == 0){
                groups[1].records.push(tasks[t]);
                groups[1].count++;
            }

            else if (compareDate(tasks[t].deadline,tommorow) == 0){
                groups[2].records.push(tasks[t]);
                groups[2].count++;
            }
            
            else {
                groups[3].records.push(tasks[t]);
                groups[3].count++;
            }
        }

        console.log("Groups : ");
        console.log(groups);

        return groups;
    },

});
/* ====================================  Generic task listing template Helpers end ========================================= */

/* ====================================  Tabs template events ========================================= */
Template.tabs.events({
    'submit form#assign-task-personal' : function(evt) {
        evt.preventDefault();

        var task = {};
        
        var today = new Date();
        var members_numbers = [];
        var ownerName;

        task.name = $(evt.target).find("input[name='task-name']").val();
        task.description = $(evt.target).find("input[name='task-description']").val();

        task.deadline = $(evt.target).find("input[name='task-deadline']").val();
        task.deadline = new Date(task.deadline);

        task.duration = $(evt.target).find("input[name='task-duration']").val();
        task.priority = $(evt.target).find("[name='task-priority']").val();
        task.members = $(evt.target).find("[name='task-members']").val();
        task.assignedBy = Meteor.userId();
        
        task.status = 0;

        ownerName = Meteor.users.findOne({ _id : task.assignedBy }).profile.name;

        console.log(compareDate(task.deadline,today));

        if(compareDate(task.deadline,today) < 0)
            alert("Please Enter a realistic deadline. Your team mates can not go back in time and complete tasks");

        else {
            Meteor.call('assignTask', task, function (err, res) {

                if (err)
                    console.log(err);
                else {
                    alert("Task Assigned succesfully");

                    for (i in task.members)
                        members_numbers[i] = Meteor.users.findOne({ _id : task.members[i] }).phone.number.slice(3);

                    Meteor.call('sendMessage', { phone: members_numbers.toString(),
                        msg: "Hey, You have been assigned a task \nTask Name - " + task.name +
                        "\nBy - " + ownerName + "\nCheck out at tasks.siteflu.com",
                    }, function(err,res){
                        if(err)
                            console.log(err);
                        else
                            console.log(res);
                    });

                    Meteor.call('sendNotification', task.members, 'New Task' , "You have been assigned a task \nTask Name - " + task.name +
                        "\nBy - " + ownerName + "\nCheck out at tasks.siteflu.com",function (err,res) {
                        if(err)
                            console.log(err);
                        else
                            console.log(res);
                    });
                }
            });
        }

        $(".add-task-personal").modal('hide');
    },

    'submit form#add-team-form' : function (evt) {
        evt.preventDefault();

        var team = {};
        var adminName;
        var member_numbers = [];

        team.name = $(evt.target).find("input[name='team-name']").val();
        team.description = $(evt.target).find("input[name='team-description']").val();
        team.members = $(evt.target).find("[name='team-members']").val();
        team.admin = Meteor.userId();

        team.members.push(team.admin);

        adminName = Meteor.users.findOne({_id : team.admin });

        Meteor.call('addTeam',team,function (err,res) {
            if(err)
                console.log(err);
            else {
                alert("Team created successfully");

                for (i in team.members)
                    member_numbers[i] = Meteor.users.findOne({ _id : team.members[i] }).phone.number.slice(3);
                
                Meteor.call('sendMessage', { phone: members_numbers.toString(),
                                             msg: "Hey, You have been added in team" + team.name + 
                                             "\nBy - " + adminName + "\nCheck out at tasks.siteflu.com",
                },function(err,res){
                    if(err)
                        console.log(err);
                    else
                        console.log(res);
                });

                Meteor.call('sendNotification', team.members, 'New Team' , "You have been added in team" + team.name +
                    "\nBy - " + adminName + "\nCheck out at tasks.siteflu.com", function(err,res){

                    if(err)
                        console.log(err);
                    else
                        console.log(res);
                });
            }
        });

        $(".add-new-team").modal('hide');
    },
});
/* ====================================  Tabs template events end ========================================= */

/* ====================================  Generic tab content template events ========================================= */
Template.tabcontentLayout.events({
    'submit form#assign-task-team' : function (evt) {
        evt.preventDefault();

        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        
        var task = {};
        var team_id = this._id;
        var team_name = Teams.findOne({ _id : team_id}).name;
        var member_numbers = [];

        var ownerName;

        console.log(this);

        task.name = $(evt.target).find("input[name='task-name']").val();
        task.description = $(evt.target).find("input[name='task-description']").val();

        task.deadline = $(evt.target).find("input[name='task-deadline']").val();
        task.deadline = new Date(task.deadline);

        task.duration = $(evt.target).find("input[name='task-duration']").val();
        task.priority = $(evt.target).find("[name='task-priority']").val();
        task.members = $(evt.target).find("[name='task-members']").val();
        task.assignedBy = Meteor.userId();
        
        task.status = 0;

        ownerName = Meteor.users.findOne({ _id : task.assignedBy }).profile.name;

        if(compareDate(task.deadline,today) < 0)
            alert("Please Enter a realistic deadline. Your team mates can not go back in time and complete tasks");

        else {
            Meteor.call('assignTaskTeam', team_id, task, function (err, res) {
                if (err)
                    console.log(err);
                else {
                    alert("Task Assigned succesfully");

                    for (i in task.members)
                        member_numbers[i] = Meteor.users.findOne({ _id : task.members[i] }).phone.number.slice(3);
                    
                    Meteor.call('sendMessage', { phone: member_numbers.toString(),
                                 msg: "Hey, You have been assigned a task in team " + team_name +  "\nTask Name - " + task.name +
                                 "\nBy - " + ownerName + "\nCheck out at tasks.siteflu.com",
                    }, function(err,res){
                        if(err)
                            console.log(err);
                        else
                            console.log(res);
                    });

                    Meteor.call('sendNotification', task.members, 'New Task' , "You have been assigned a task in team " + team_name +  "\nTask Name - " + task.name +
                        "\nBy - " + ownerName + "\nCheck out at tasks.siteflu.com",function(err,res){
                        if(err)
                            console.log(err);
                        else
                            console.log(res);
                    });

                    $(".add-task-team").modal('hide');
                }
            });
        }
    },
});
/* ====================================  Generic tab content template events end ========================================= */


/* ====================================  Generic task listing template events ========================================= */
Template.tasklist.events({
   'change [name="status"]' : function (evt){
       evt.preventDefault();
       
       var team_id = this.team.id;
       var task_id = Number(this.team.index);
       
       var task = Teams.findOne({ _id: team_id }).tasks[task_id];
       var task_name = task.name;
       var task_owner = Meteor.users.findOne({ _id : task.assignedBy }).phone.number.slice(3);
       var status = $(evt.target).val();
       var changing_member = Meteor.users.findOne({ _id: Meteor.userId() }).name;

       Meteor.call('updateStatus',team_id,task_id,status,function (err,res) {
           if(err)
               console.log(err);
           else {
               Meteor.call('sendMessage', { phone: task_owner,
                            msg: "Hey, Status of your assigned task " + task_name +
                            "has been changed to " + status + "\nBy - " + changing_member + "\nCheck out at tasks.siteflu.com",
               });
           }
       });
   }
});
/* ====================================  Generic task listing template events end ========================================= */


/* ====================================  verify phone template events  ========================================= */
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
/* ====================================  Verify phone template events end ========================================= */


/* ====================================  Login template events ========================================= */
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
/* ====================================  Login template events end ========================================= */

/* ====================================  Register template events ======================================== */
Template.register.events({

	'submit form' :  function(evt) {
		evt.preventDefault();
		
		var country_code = $("[name = 'country-code']").val()
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
/* ====================================  Register template events end ======================================== */





