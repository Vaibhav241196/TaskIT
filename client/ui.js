/**
 * Created by lite on 21/9/16.
 */

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

Template.tabs.onRendered(function() {

    'use strict';
    // $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
    //
    // 	var $target = $(e.target);
    // 	var $tabs = $target.closest('.nav-tabs-responsive');
    // 	var $current = $target.closest('li');
    // 	var $parent = $current.closest('li.dropdown');
    // 	$current = $parent.length > 0 ? $parent : $current;
    // 	var $next = $current.next();
    // 	var $prev = $current.prev();
    // 	var updateDropdownMenu = function($el, position){
    // 		$el
    // 			.find('.dropdown-menu')
    // 			.removeClass('pull-xs-left pull-xs-center pull-xs-right')
    // 			.addClass( 'pull-xs-' + position );
    // 	};
    //
    // 	$tabs.find('>li').removeClass('next prev');
    // 	$prev.addClass('prev');
    // 	$next.addClass('next');
    //
    // 	updateDropdownMenu( $prev, 'left' );
    // 	updateDropdownMenu( $current, 'center' );
    // 	updateDropdownMenu( $next, 'right' );
    // });

    // $('.selectpicker').selectpicker();
});

Template.calender.onCreated(
    function () {
        $.getScript('http://arshaw.com/js/fullcalendar-1.6.4/fullcalendar/fullcalendar.min.js',function(){

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: true,
                events: [
                    {
                        title: 'All Day Event',
                        start: new Date(y, m, 1)
                    },
                    {
                        title: 'Long Event',
                        start: new Date(y, m, d-5),
                        end: new Date(y, m, d-2)
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: new Date(y, m, d-3, 16, 0),
                        allDay: false
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        start: new Date(y, m, d+4, 16, 0),
                        allDay: false
                    },
                    {
                        title: 'Meeting',
                        start: new Date(y, m, d, 10, 30),
                        allDay: false
                    },
                    {
                        title: 'Lunch',
                        start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 14, 0),
                        allDay: false
                    },
                    {
                        title: 'Birthday Party',
                        start: new Date(y, m, d+1, 19, 0),
                        end: new Date(y, m, d+1, 22, 30),
                        allDay: false
                    },
                    {
                        title: 'Click for Google',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        url: 'http://google.com/'
                    }
                ]
            });
        })

    }
)
