import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'assignTask' : function (task){
        
        var members = task.members;
        var assigned_representation = {};
        var l;

        for (i in members) {
            l = Meteor.users.findOne({_id : members[i]}).tasks.length;
            assigned_representation = { userId : members[i] , taskId: l };
            
            Meteor.users.update({_id: members[i]}, {$push: {tasks: task}});
            Meteor.users.update({ _id : task.assignedBy },{$push : { assignedTasks : assigned_representation }});
        }
    },
    
    'addTeam' : function (team) {

        var members = team.members;

        var team_id = Teams.insert(team);

        for (i in members) {
            Meteor.users.update({_id: members[i]}, {$push: {teams: team_id}});
        }
        
    },

    'assignTaskTeam' : function (team_id,task){

        var team = Teams.findOne({ _id : team_id });
        var l = team.tasks ? team.tasks.length : 0;
        var assigned_representation = { teamId : team_id , taskId : l };

        Teams.update({_id: team_id }, {$push: {tasks: task}});
        Meteor.users.update({ _id: task.assignedBy },{$push : {assignedTasks : assigned_representation }});
    }
});