/* Routes */

// =============================== Routes Start ===================================


// ============================================== Root route =========================================
Router.route('/' , function(){

	this.layout('userLayout', { data : function () {
        return {
            	user: Meteor.users.findOne({_id: Meteor.userId()})
        	};
    	}
    });

	if(this.ready()) {
        this.render('homescreen', {
            data: function () {

                return {
                    user: Meteor.users.findOne({_id: Meteor.userId()})
                };
            }

        });
    }
}, 
{ 
	name : 'homescreen',
});
// ============================================= Root route ends ====================================

// ============================================= Login route ========================================
Router.route('/login',function() {
		
		this.render('login', { data : function(){
			return { next : this.params.query.next } ; 
		},
	});
},
{ 
	name : 'login',
});
// ============================================= Login route ends ===================================

// ============================================= Phone Verification route ===========================
Router.route('/verifyphone',function() {
		this.render('verifyphone' , {data : function() {
			return { next : this.params.query.next } ;
		},
	});
},
{
	name : 'verifyphone',
});
// ============================================= Phone verification route ends =======================

// ============================================= Registration route ==================================
Router.route('/register',function() {
	this.render('register');
}, 	
{ 
	name : 'register' ,
});
// ============================================= Registration route ends =============================

// ============================================= Logout route ========================================
Router.route('/logout',function(){
	var that = this;
	
	Meteor.logout(function(err){
		if(!err) {
			that.redirect('login');
		}

		else {
			console.log("Error logout");
			alert("Error");
		}
	});
},
{
	name: 'logout',
});
// ============================================= Logout route ends =============================

// ============================================= Test route ====================================
Router.route('/user/:_id',function(){
	this.layout('userLayout');
	this.render('userPage');

});
// ============================================= Test route ends ===============================



// ============================================= Route authentication function ==================
/*  Function executed before running any of the route functions
    except for Login and Registration routes
	
	1. Redirects unauthenticated user to login page
	2. Redirects logged in user to phone verification page if not verified.
	3. Redirects to appropriate route if logged in and verified.

*/

Router.onBeforeAction(function(){

	var path = this.route._path;

	if(Meteor.user() !== undefined)
	{
		if(Meteor.user())
		{
			if(Meteor.user().phone !== undefined)
			{
				if(!Accounts.isPhoneVerified() && path.indexOf('/verifyphone') !== 0 ) {
					this.redirect('verifyphone' ,{} , { query : 'next='+path ,} );
					alert('Please verify phone number');
				}
				
				else {
					this.next();
				}
			}
		}

		else { 

			if(path != '/')
				alert('Please Login');
			this.redirect('login',{} , {query : 'next='+path ,});
		}
	}

}, {
		except : ['register','login','logout'],
});

// ============================================= Logout route validation function ==================
/*  Function executed before the logout route function
    Executed only first time logout is called and does not reactively reruns like onBeforeAction
	
	1. Redirects non logged in user to login page if tries to logout
*/

Router.onRun(function(){

	if(Meteor.user != undefined) {

		if(Meteor.user()) 
			this.next();
		else
			this.redirect('login');
	}

}, {
	only : ['logout'],
});