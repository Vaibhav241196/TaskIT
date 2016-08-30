/* Routes */

Router.route('/' , function(){
	this.render('homescreen');
}, 
{ 
	name : 'homescreen',
});

Router.route('/login',function() {
		
		this.render('login', { data : function(){
			return { next : this.params.query.next } ; 
		},
	});
},
{ 
	name : 'login',
});

Router.route('/verifyphone',function() {
		// console.log(this.params.next);
		this.render('verifyphone' , {data : function() {
			return { next : this.params.next } ;
		},
	});
},
{
	name : 'verifyphone',
});

Router.route('/register',function() {
	this.render('register');
}, 	
{ 
	name : 'register' ,
});

Router.route('/logout',function(){
	Meteor.logout();
	this.render('login');
},
{
	name: 'logout',
})

Router.route('/test',function(){
	console.log('Hello');
})


Router.onBeforeAction(function(){
	
	console.log("Before route");
	var path = this.route._path;
	console.log(path);
	// console.log(this);

	if(Meteor.user() !== undefined)
	{
		if(Meteor.user())
		{
			if(Meteor.user().phone !== undefined)
			{
				console.log(Meteor.user());
				console.log(Accounts.isPhoneVerified());
				if(!Accounts.isPhoneVerified() && path.indexOf('/verifyphone') !== 0 ) {
					console.log("In if");
					this.redirect('verifyphone' ,{} , { query : 'next='+path ,} );
				}
				
				else {
					console.log("In else");
					this.next();
				}
			}
		}

		else 
			this.redirect('login',{} , {query : 'next='+path ,});
	}

}, {
		except : ['register','login','logout'],
});