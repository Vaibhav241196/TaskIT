/**
 * Created by lite on 24/9/16.
 */

import { Mongo } from 'meteor/mongo';

// Collections
Teams = new Mongo.Collection('teams');


// Push Notifications

Push.allow({
    send: function(userId, notification) {
        // Allow all users to send to everybody - For test only!
        return true;
    }
});
