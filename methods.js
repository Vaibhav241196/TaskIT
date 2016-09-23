import { Meteor } from 'meteor/meteor';

Meteor.methods({

    'assignTask' : function (task){
        
        var members = task.members;
        
        for (i in members) {
            Meteor.users.update({_id: members[i]}, {$push: {tasks: task}});
        }
        
        Meteor.users.update({ _id : task.assignedBy },{$push : { assignedTasks : task }});
    },
    

});