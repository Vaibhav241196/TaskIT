import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'assignTask' : function (task){
        
        var members = task.members;
        var assigned_representation = {};

        var participant_arr = members;
        participant_arr.push(task.assignedBy);

        var team = Teams.findOne({ members : { $size : participant_arr.length , $all : participant_arr } , name : {$exists : false }});
        
        if(!team) {
            team_id = Teams.insert({members: participant_arr, tasks: [task]});

            for (i in members) {
                Meteor.users.update({_id: members[i]}, {$push: { teams: team_id }});
            }
        }

        else {
            team_id = team._id;
            Teams.update({_id: team_id}, {$push: {tasks: task}});
        }

        
    },
    
    'addTeam' : function (team) {

        var members = team.members;
        var team_id = Teams.insert(team);

        for (i in members) {
            Meteor.users.update({_id: members[i]}, {$push: {teams: team_id }});
        }
        
    },

    'assignTaskTeam' : function (team_id,task){

        var team = Teams.findOne({ _id : team_id });
        var l = team.tasks ? team.tasks.length : 0;
        var assigned_representation = { teamId : team_id , taskId : l };

        Teams.update({_id: team_id }, {$push: {tasks: task}});
        Meteor.users.update({ _id: task.assignedBy },{$push : {assignedTasks : assigned_representation }});
    },

    'updateStatus' : function (team_id,task_id,status) {

        var team = Teams.findOne({ _id : team_id });
        var tasks = team.tasks;


        console.log(tasks);
        console.log(task_id);
        console.log(tasks[task_id].status);

        tasks[task_id].status = Number(status);

        Teams.update({ _id : team_id }, {$set : { tasks : tasks } });
    }
});