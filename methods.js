import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'assignTask' : function (task){
        
        var members = task.members;
        
        for (i in members) {
            Meteor.users.update({_id: members[i]}, {$push: {tasks: task}});
        }
        
        Meteor.users.update({ _id : task.assignedBy },{$push : { assignedTasks : task }});
    },
    
    'addTeam' : function (team) {

        var members = team.members;

        var team_id = Teams.insert(team);

        for (i in members) {
            Meteor.users.update({_id: members[i]}, {$push: {teams: team_id}});
        }
        
    },

    'assignTaskTeam' : function (team,task){

        var members = task.members;

        for (i in members) {
            Teams.update({_id: team }, {$push: {tasks: task}});
        }

        Meteor.users.update({ _id : task.assignedBy },{$push : { assignedTasks : task }});
    }
});