var trip2 = {
		// Place application variables here
		appLayout: '',
		appName: 'Trip2.0',
		appDir: 'trip2',
		suspendDateID: 0,

	runApp: function(parent, acl, sections, userInfo,sectionList){
		// Application code here
		var base = parent;
		var sec = sectionList;
		var user = userInfo;

		console.log(acl);

		switch(acl){
			// Read-only
			case 1:
				break;

			// Write
			case 2:
				break;

			// Full
			case 3:

			// Admin
			case 4:
				this.loadScript("/_apps/trip2/js/trip2ADMIN_class.js?v="+Math.random(), function(parent, userInfo){
					if(sections != 0){
						var trip2App = new trip2ADMIN(base, user, sec);
					}else{
						var trip2App = new trip2ADMIN(base, user, sec);
					}
					trip2App.create();
				}, function(ex){
					console.log("ERROR: "+ex);
				});
				break;

			default:
				break;
		}
	},
// End runApp function
	loadScript: function(url, callback){
		try{
			var js;
			if(!this.isLoaded(url)){
				js = document.createElement("script");
				js.type = "text/javascript";
				if(js.readystate){
					js.onreadystatechange = function(){
						if(js.readystate === "loaded" || js.readystate === "complete"){
							js.onreadystatechange = null;
							console.log("Script: "+url+" is now loaded");
							callback();
						}
					};
				}else{
					js.onload = function(){
						console.log("Script: "+url+" is now loaded");
						callback();
					};
				}
				js.src = url;
				document.getElementsByTagName("head")[0].appendChild(js);
			}
			callback();
		}catch(err){
			console.log(err.message);
		}
		
	},

	loadVaultCSS: function(){
    var link  = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', '/dhtmlx/codebase/dhtmlxvault.css');
		document.getElementsByTagName('head')[0].appendChild(link);
	},

	isLoaded: function(src){
		var scripts = document.getElementsByTagName("script");
		for(var i = 0; i <scripts.length; i++){
			if(scripts[i].getAttribute('src') == src){
				return true;
			}
		}
		return false;
	}
};
