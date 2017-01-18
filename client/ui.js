/**
 * Created by lite on 21/9/16.
 */
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

//========================================== css imports ====================================================
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/selectize/dist/css/selectize.bootstrap3.css';
import '../node_modules/magicsuggest/magicsuggest-min.css';
import './main.css'


//========================================== javascript files import ========================================
import Bootstrap from 'bootstrap';
import Selectize from 'selectize';
import MagicSuggest from 'magicsuggest';

//========================================= html templates import ============================================
import './main.html';

console.log("Executing Ui js");

/* ======================================= Global variables for magic suggest handles ====================== */

magicsuggest_personal_task = {};
magicsuggest_new_team = {};


/* ======================================= Side nav animation in mobile ================================ */
Template.homescreen.onRendered(function(){
    
    var side_nav_open = false;
    
    $(".navbar-toggle").click(function (evt) {
        evt.preventDefault();
        
        if(!side_nav_open) {
            open_side_bar();
        }
        else {
            close_side_bar();
        }
    });

    $("body").click(function(evt) {
        if(side_nav_open && $($(".navbar-toggle")[0]).find(evt.target).length == 0 &&  evt.target != $(".navbar-toggle")[0]) {
            console.log("If body");
            close_side_bar();
        }
    });

    function open_side_bar() {
        var side_nav = $(".side-nav");

        side_nav.css("display", "block");
        side_nav.animate({left: "46%"}, 100);
        side_nav_open = true;
    }

    function close_side_bar() {
        var side_nav = $(".side-nav");

        side_nav.animate({left: "106%"},{

            duration: 100,

            done: function() {
                    $(this).css("display", "none");
            },

        });

        side_nav_open = false;
    }
    
});


/* ======================================= Generic event listerner function =========================== */
function assignEvent(element,event,handler,useCapture){
    if(element.addEventListener)
        element.addEventListener(event,handler,useCapture);
    else if(element.attachEvent)
        element.attachEvent("on"+event,handler,useCapture);
}


// (function($) {
//
// 	'use strict';
//
// 	$(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
// 		var $target = $(e.target);
// 		var $tabs = $target.closest('.nav-tabs-responsive');
// 		var $current = $target.closest('li');
// 		var $parent = $current.closest('li.dropdown');
// 		$current = $parent.length > 0 ? $parent : $current;
// 		var $next = $current.next();
// 		var $prev = $current.prev();
// 		var updateDropdownMenu = function($el, position){
// 			$el
// 				.find('.dropdown-menu')
// 				.removeClass('pull-xs-left pull-xs-center pull-xs-right')
// 				.addClass( 'pull-xs-' + position );
// 		};
//
// 		$tabs.find('>li').removeClass('next prev');
// 		$prev.addClass('prev');
// 		$next.addClass('next');
//
// 		updateDropdownMenu( $prev, 'left' );
// 		updateDropdownMenu( $current, 'center' );
// 		updateDropdownMenu( $next, 'right' );
// 	});
// })(jQuery);

// Template.tabs.onRendered(function() {
//
//     'use strict';
//
//
//     Meteor.defer(function(){
//
//         console.log("Rendering tabs");
//         $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
//
//         	var $target = $(e.target);
//         	var $tabs = $target.closest('.nav-tabs-responsive');
//         	var $current = $target.closest('li');
//         	var $parent = $current.closest('li.dropdown');
//         	$current = $parent.length > 0 ? $parent : $current;
//         	var $next = $current.next();
//         	var $prev = $current.prev();
//         	var updateDropdownMenu = function($el, position){
//         		$el
//         			.find('.dropdown-menu')
//         			.removeClass('pull-xs-left pull-xs-center pull-xs-right')
//         			.addClass( 'pull-xs-' + position );
//         	};
//
//         	$tabs.find('>li').removeClass('next prev');
//         	$prev.addClass('prev');
//         	$next.addClass('next');
//
//         	updateDropdownMenu( $prev, 'left' );
//         	updateDropdownMenu( $current, 'center' );
//         	updateDropdownMenu( $next, 'right' );
//         })
//
//
//     });
//
// });


/* =================================== For selectize plugin on select buttons ======================== */
for (t in Template) {
    if(Blaze.isTemplate(Template[t])) {
        Template[t].onRendered(function(){
            $('select').selectize({
                plugins: ['remove_button','restore_on_backspace'],
                render: {

                    item: function (data,escape) {
                        return '<div>' + ( data.label ? escape(data.label) : escape(data.text) ) + '</div>';
                    },

                    option: function (data,escape) {
                        return '<div>' + escape(data.text) + '</div>';
                    }
                }
            });

            
        });
    }
}

// Template.tabcontentLayout.onRendered(function(){

//     magicsuggest_personal_task = $("#magicsuggest-personal-task").magicSuggest({

//         data: function(q){
//             var users = Meteor.users.find().fetch();
//             var name = "";
//             var matched_users = [];
//             var search_string;

//             for(i in users){
//                 name = users[i].profile.name;
//                 search_string = new RegExp(name,"i");
//                 if( name.search(search_string) != -1 )
//                     matched_users.push({ id: users[i]._id, name: users[i].profile.name });
                
//             }

//             return matched_users;
//         },

//         required: true,
//         name: 'task-members',
//         valueField: 'id',
//     });

//     magicsuggest_new_team = $("#magicsuggest-new-team").magicSuggest({

//         data: function(q){
//             var users = Meteor.users.find().fetch();
//             var name = "";
//             var matched_users = [];
//             var search_string;

//             for(i in users){
//                 name = users[i].profile.name;
//                 search_string = new RegExp(name,"i");
//                 if( name.search(search_string) != -1 )
//                     matched_users.push({ id: users[i]._id, name: users[i].profile.name });
                
//             }

//             return matched_users;
//         },

//         required: true,
//         name: 'task-members',
//         valueField: 'id',
//     });

// });

// console.log(magicsuggest_personal_task);

// Template.calender.onCreated(function () {
//         $.getScript('http://arshaw.com/js/fullcalendar-1.6.4/fullcalendar/fullcalendar.min.js',function(){
//
//             var date = new Date();
//             var d = date.getDate();
//             var m = date.getMonth();
//             var y = date.getFullYear();
//
//             $('#calendar').fullCalendar({
//                 header: {
//                     left: 'prev,next today',
//                     center: 'title',
//                     right: 'month,agendaWeek,agendaDay'
//                 },
//                 editable: true,
//                 events: [
//                     {
//                         title: 'All Day Event',
//                         start: new Date(y, m, 1)
//                     },
//                     {
//                         title: 'Long Event',
//                         start: new Date(y, m, d-5),
//                         end: new Date(y, m, d-2)
//                     },
//                     {
//                         id: 999,
//                         title: 'Repeating Event',
//                         start: new Date(y, m, d-3, 16, 0),
//                         allDay: false
//                     },
//                     {
//                         id: 999,
//                         title: 'Repeating Event',
//                         start: new Date(y, m, d+4, 16, 0),
//                         allDay: false
//                     },
//                     {
//                         title: 'Meeting',
//                         start: new Date(y, m, d, 10, 30),
//                         allDay: false
//                     },
//                     {
//                         title: 'Lunch',
//                         start: new Date(y, m, d, 12, 0),
//                         end: new Date(y, m, d, 14, 0),
//                         allDay: false
//                     },
//                     {
//                         title: 'Birthday Party',
//                         start: new Date(y, m, d+1, 19, 0),
//                         end: new Date(y, m, d+1, 22, 30),
//                         allDay: false
//                     },
//                     {
//                         title: 'Click for Google',
//                         start: new Date(y, m, 28),
//                         end: new Date(y, m, 29),
//                         url: 'http://google.com/'
//                     }
//                 ]
//             });
//         })
//
//     });