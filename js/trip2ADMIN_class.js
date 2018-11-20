function trip2ADMIN(parent, userData, section){
  this.appLayout = "";
  this.parent = parent;
  this.userData = userData;
  this.section = section;
  this.appName = 'Trip2.0';
  this.appDirectory = 'trip2';
};

trip2ADMIN.prototype = {
/**
 * APPLICATION CODE STARTS HERE
 */
 create: function(){

 	console.log(this.section);

// Extending Date object for suspend dates
	Date.prototype.addDays = function(days) {
	    var dat = new Date(this.valueOf())
	    dat.setDate(dat.getDate() + days);
	    return dat;
	}

    // switch(this.section){

    //   case 'All':
    //     this.loadSectionALL();
    //     break;

    //   default:
    //     break;
    // }
    // 
 /* DHX Window object */
    var appWindow = new dhtmlXWindows();
    var parentLayout = new dhtmlXLayoutObject({
		parent:	this.parent,
		pattern: "2U",
		cells: [
			{id: 'a', text: '', header: false},
			{id: 'b', text: 'Documentation', collapse: true}
		]
	});

 /* App Layout */
this.appLayout = new dhtmlXLayoutObject({
      parent: parentLayout.cells('a'),
      pattern: "1C"
    });

 /* Tabbar */
    // MAIN TABBAR TO LAYOUT ------------------------------------------------------------------------------------------------------------------

	var myTabbar = this.appLayout.cells('a').attachTabbar({
		align: "left",
		mode: "top",
		tabs: [
	        {id: "home", text: "Home", active: true},
	        {id: "Review", text: "Review"},
	        {id: "archived", text: "Archived"},
	        {id:"BlacklistWhitelist", text: "Blacklist | Whitelist"},
	        {id:"DNC", text: "Do Not Contact"},
	        {id:"BrochureR", text: "Brochure Records"},
		    {id: "reports", text: "Reports"},
		    {id: "pl", text: "Process Log"},
	    ]

});

// HIDE DNC FOR NOW ....................................................................................................................... 		

myTabbar.tabs("DNC").hide();

this.loadSections(this.section, myTabbar, this.appDirectory, appWindow, this.userData, parentLayout);

  },

loadSections: function(sectionList, tabbar, refApp, appWindow, userData, pLayout){
    console.log(sectionList);
    for(var i = 0; i < sectionList.length; i++){
    	console.log("load"+sectionList[i][0]);
      window["trip2ADMIN"]["prototype"]["load"+sectionList[i][0]](tabbar, sectionList[i][1], refApp, appWindow, userData, pLayout.cells('a'));
    }
    
    if(this.userData["godModeIDs"] != null){
      window.dhx4.ajax.get("/_apps/commonCore/ext/isGod.php?godModeIDs="+this.userData['godModeIDs'], function(r){
        if(r.xmlDoc.responseText == 'true'){
          window["trip2ADMIN"]["prototype"]["loadDashboard"](tabbar, sectionList, refApp, appWindow);
        }
      });
    }

    tabbar.tabs(tabbar.getAllTabs()[0]).setActive();
  },






loadDateSuspension: function(myTabbar, acl, refApp, appWindow, userData){
	myTabbar.addTab("dateSus","Date Suspension");

	var dateSusLayout = myTabbar.tabs("dateSus").attachLayout({

		pattern: "1C",

		cells: [
		 {id: "a", text: "Suspend Date's Scheduler"},

		]

	});

scheduler.config.xml_date = "%Y-%m-%d %H:%i";
scheduler.locale.labels.section_checkme = "Does repeat";
			
scheduler.config.lightbox.sections=[	
	{ name:"description", height:50, map_to:"text", type:"textarea", focus:true },
	{ name:"checkme", height:55, map_to:"single_checkbox", type:"checkbox", checked_value:"1", unchecked_value:"0" },
	{ name:"time", height:72, type:"time", map_to:"auto"}	
];

	var suspendDate = dateSusLayout.cells("a").attachScheduler(new Date(), "month");

	window.dhx4.ajax.get("/_apps/trip2/ext/getSuspendDates.php", function(r){
		var dates = JSON.parse(r.xmlDoc.responseText);
		console.log(dates);
		suspendDate.parse(dates, "json");
		console.log(suspendDate.getEvents());

	});

var cMenu = new dhtmlXMenuObject();
	cMenu.renderAsContextMenu();
	cMenu.addNewChild(cMenu.topId, 0, "remove", "Remove Suspension", false, "/dhtmlx/codebase/imgs/close.gif");


suspendDate.attachEvent("onContextMenu", function(event_id, native_event_object){
	window.trip2.suspendDateID = event_id;
  	if (event_id) {
		var posx = 0;
		var posy = 0;
		if (native_event_object.pageX || native_event_object.pageY) {
			posx = native_event_object.pageX;
			posy = native_event_object.pageY;
		} else if (native_event_object.clientX || native_event_object.clientY) {
			posx = native_event_object.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = native_event_object.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		cMenu.showContextMenu(posx, posy);
		return false; // prevent default action and propagation
	}
	return true;
});


   	this.suspendDate_onEventAdded(suspendDate);
   	this.suspendDate_onEventChanged(suspendDate);
   	this.cMenu_onClick(suspendDate, cMenu);

  }, // END OF LOAD DATE SUSPENSION



loadAll: function(myTabbar, acl, refApp, appWindow, userData, cell){

	
// PROCESS LOG .....................................................................................................................
var pLogLayout = myTabbar.tabs("pl").attachLayout({

		pattern: "1C",

		cells: [

		 {id: "a", text: "Process Log Information"},

		]

	});

// PROCESS LOG GRID .......................................................................................................................
var gridCellPL = pLogLayout.cells("a");

var plGrid = gridCellPL.attachGrid(); 																		 // ATTACHING THE GRID
	plGrid.setImagePath("/dhtmlx/codebase/imgs/");
	plGrid.setHeader('Process, Start Time, File Name, Valid Records, Error Records, Processed');
	plGrid.attachHeader('#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter');
	plGrid.setColTypes('ro,ro,ro,ro,ro,ro');                     			 								// SETTING COL TYPES TO READ ONLY OR EDIT
	plGrid.setInitWidths("200,200,300,200,200,200");                               						   // INIT WIDTH 
	plGrid.setColSorting("str,date,str,str,str,str");  													  // COL SORTING TO STRINGS, INT, DATE, ETC..D
	plGrid.enableResizing("true,true,true,true,true,true");
	plGrid.enableColumnMove(true);
 	plGrid.enableEditEvents(true,false,true); 
 	plGrid.init();
 	//plGrid.load('/_apps/trip2/connectors/pLogTest_connector.php');
    plGrid.setColumnsVisibility("false,false,false,false,false,false");

// PROCESS LOG TOOLBAR ..................................................................................................................................
var pLogToolbar = gridCellPL.attachToolbar();

	pLogToolbar.addText("text_from",  null, "From:");
	pLogToolbar.addInput("dateFromPL", null, "", 75);
	pLogToolbar.addText("text_to", null, "To:");
	pLogToolbar.addInput("dateToPL", null, "", 75);
    pLogToolbar.addButton(4,null,'Search','/dhtmlx/codebase/imgs/view.gif',null);
	pLogToolbar.addSeparator(5,5);
	pLogToolbar.addButton(6,null,'All Records','/dhtmlx/codebase/imgs/selectAllScroll.png',null);

// CALANDER FOR ARCHIVE TO/FROM INPUT ---------------------------------------------------------------------------------------------------------------

var plInputFrom,
	plInputTo,
	PLCalendar;

	plInputFrom = pLogToolbar.getInput("dateFromPL");
	plInputFrom.setAttribute("readOnly", "true");
	plInputFrom.onclick = function(){ setSens(inputTill,"max"); }
	
	plInputTill = pLogToolbar.getInput("dateToPL");
	plInputTill.setAttribute("readOnly", "true");
	plInputTill.onclick = function(){ setSens(arcInputFrom,"min"); }
	
//INIT CALENDAR FOR TOOLBAR SELECT....................................................................................................

var PLCalendar = new dhtmlXCalendarObject([plInputFrom,plInputTill]);
	PLCalendar.setDateFormat("%Y-%m-%d");
	PLCalendar.setWeekStartDay(7);

	function setSens(inp, x) {
			if (x == "min") {
				PLCalendar.setSensitiveRange(inp.value, null);
			} else {
				PLCalendar.setSensitiveRange(null, inp.value);
			}
}


// 'ADD NEW PERMISSION' (ADMIN ONLY)
var appToolbar = cell.attachToolbar();
    	appToolbar.addButton(2,2,'<span style="font-style:italic;">Add new permission&nbsp;</span>','/dhtmlx/codebase/imgs/add-user.png',null);
    	//appToolbar.addButton(3,3,'<span style="font-style:italic;">Settings&nbsp;</span>','/dhtmlx/codebase/imgs/columnSettings.png',null);

// CREATE DHXWINDOWS OBJECT ----------------------------------------------------------------------------------------------------------------------

var appWindow = new dhtmlXWindows();



// HIDE REPORTS FOR NOW .................................................................................................... 		

myTabbar.tabs("reports").hide();


// HOME TAB LAYOUT (F0RM) -----------------------------------------------------------------------------------------------------

var homeLayout = myTabbar.tabs("home").attachLayout({

		pattern: "1C",

		cells: [
		 {id: "a", text: "Form"},
		 //{id: "b", text: "Suspend Date's Scheduler"},

		]

	});

// BEGIN FORM DESIGN FOR HOME PAGE .............................................................................................

var formCell = homeLayout.cells("a");

var homeForm, homeFormData;
	 homeFormData = [


{type: "block", name: "blockHeader", style:" margin-bottom:10px; background-color:#DFDCE3; border-bottom:solid; width:100%;", blockOffset: 0, list:[

//LITERATURE REQUEST SHEET

{type: "label", name: "headerTitle",  label: "<h1><b>Literature Request Sheet</b></h1>"}

]},

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, style:"margin-left:10px;", list:[

//Date
		// {type: "calendar", name: "date", style:"width:70px;", position:"label-left", label: "<b>Date:</b>",
		// required:true},

		//{type: "newcolumn"},
//Fname
		{type: "input", name: "Fname", position:"label-left", label: "<b>First Name:</b>", required:true },

		{type: "newcolumn"},
//Lname
		{type: "input", name: "Lname", style:"width:180px;", position:"label-left", label: "<b>Last Name:</b>", required:true},
]},

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, style:"margin-left:10px;", list:[

//Address 1 & 2
		{type: "input", name: "address", style:"width:550px;", position:"label-left", label: "<b>Address:</b>",
			required:true},

		{type: "input", style:"margin-left:65px; width:550px;", name: "address2"},
]},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, style:"margin-left:10px;", list:[

//City
		{type: "input", name: "city", position:"label-left", label: "<b>City:</b>", required:true},

		{type: "newcolumn"},
//State
		{type: "combo", name: "state", style:"width:230px;",  position:"label-left", label: "<b>State:</b>", required:true},

		{type: "newcolumn"},
//Zip
		{type: "input", name: "zip", style:"width:110px;", position:"label-left", label: "<b>Zip:</b>", required:true},

]},

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, style:"margin-left:10px;", list:[

//Phone Number
		{type: "input", name: "phoneNumber", position:"label-left", label: "<b>Phone Number:</b>"},

		{type: "newcolumn"},
//Email
		{type: "input", name: "email", style:"width:310px;", position:"label-left", label: "<b>Email:</b>",
		 validate:"ValidEmail" },
]},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, style:"margin-left:10px;", list:[

//Notes
		{type: "input", name: "notes", label: "<b>Notes:</b>", rows:5, style:"width:565px;"},

]},

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", style:"background-color:#DFDCE3; width:100%; margin-top:10px; border-bottom:solid; ", blockOffset: 0, list:[

//Sheet Grand Totals
		{type: "label", name: "headerTitle",  label: "<h1><b>Sheet Grand Totals</b></h1>"}

]},

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, list:[

//Vacation Kits
{type: "checkbox", position:"label-right", label: "<b>Vacation Kits:</b>", value:"vk", checked: true, name:"packages" },

      	{type: "newcolumn"},
//Map
{type: "checkbox", position:"label-right", label: "<b>MG</b>", value:"mg",  checked: false, name:"packages"},

        {type: "newcolumn"},
//COE
{type: "checkbox", position:"label-right", label: "<b>RR</b>", value:"rr", checked: false, name:"packages"},

		{type: "newcolumn"},
//SP
{type: "checkbox", position:"label-right", label: "<b>WW</b>", value:"fg",  checked: false, name:"packages"}, // PKG CHANGE

		{type: "newcolumn"},
//TG
{type: "checkbox", position:"label-right", label: "<b>MB</b>", value:"mb", checked: false, name:"packages"},

		{type: "newcolumn"},
//ADV
{type: "checkbox", position:"label-right", label: "<b>RC</b>", value:"cg", checked: false, name:"packages"}, // PKG CHANGE

		{type: "newcolumn"},
//ARV
{type: "checkbox", position:"label-right", label: "<b>DW</b>", value:"wg", checked: false, name:"packages"} // PKG CHANGE

// 		{type: "newcolumn"},
// //AS
// {type: "checkbox", position:"label-right", label: "<b>AS</b>", value:"as", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //ASW
// {type: "checkbox", position:"label-right", label: "<b>ASW</b>", value:"asw", checked: false, name:"packages"},

]},

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// {type: "block", blockOffset: 0, list:[

// //DB
// {type: "checkbox", position:"label-right", label: "<b>DB</b>", value:"db", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //HS
// {type: "checkbox", position:"label-right", label: "<b>DL/HS</b>", value:"dlhs", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //GF/LRR
// {type: "checkbox", position:"label-right", label: "<b>GF/LRR</b>", value:"gflrr", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //HOA/LR
// {type: "checkbox", position:"label-right", label: "<b>HOA/LR</b>", value:"hoalr", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //LOL
// {type: "checkbox", position:"label-right", label: "<b>LOL</b>", value:"lol", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //NWA
// {type: "checkbox", position:"label-right", label: "<b>NWA</b>", value:"nwa", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //OG
// {type: "checkbox", position:"label-right", label: "<b>OG</b>", value:"og", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //OMR
// {type: "checkbox", position:"label-right", label: "<b>OMR</b>", value:"omr", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //WAMF
// {type: "checkbox", position:"label-right", label: "<b>WAMF</b>", value:"wamf", checked: false, name:"packages"},

// ]},

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// {type: "block", blockOffset: 0, list:[

// //RR
// {type: "checkbox", position:"label-right", label: "<b>RR</b>", value:"rr", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //WW
// {type: "checkbox", position:"label-right", label: "<b>WW</b>", value:"ww", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //GOLF
// {type: "checkbox", position:"label-right", label: "<b>GOLF</b>", value:"golf", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //LETS RIDE
// {type: "checkbox", position:"label-right", label: "<b>Let's Ride</b>", value:"letsRide", checked: false,name:"packages" },

// 	{type: "newcolumn"},
// //LETS RIDE CW
// {type: "checkbox", position:"label-right", label: "<b>Let's Ride Civil War</b>", value:"letsRideCW", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //MG
// {type: "checkbox", position:"label-right", label: "<b>MG</b>", value:"mg", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //BIKE
// {type: "checkbox", position:"label-right", label: "<b>BIKE</b>", value:"bike", checked: false,name:"packages" },

// 	{type: "newcolumn"},
// //MB
// {type: "checkbox", position:"label-right", label: "<b>MB</b>", value:"mb", checked: false, name:"packages"},

// ]},

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// {type: "block", blockOffset: 0, list:[

// //RC
// {type: "checkbox", position:"label-right", label: "<b>RC</b>", value:"rc", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //DW
// {type: "checkbox", position:"label-right", label: "<b>DW</b>", value:"dw", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //HT
// {type: "checkbox", position:"label-right", label: "<b>HT</b>", value:"ht", checked: false, name:"packages"},

// 	{type: "newcolumn"},
// //NA
// {type: "checkbox", position:"label-right", label: "<b>NA</b>", value:"na", checked: false,name:"packages"},

// 	{type: "newcolumn"},
// //MISC
// {type: "checkbox", position:"label-right", label: "<b>Misc</b>", value:"misc", checked: false, name:"packages"},

// ]},

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{type: "block", blockOffset: 0, list:[

// SUBMIT BTN

{type:"button", name:"submitBtn",value:"Submit"}

]}

	];


var attachHomeFormData = formCell.attachForm(homeFormData);

// SUSPEND DATE SCHEDULER DESIGN -------------------------------------------------------------------------------------
// scheduler.config.xml_date = "%Y-%m-%d %H:%i";
// scheduler.locale.labels.section_checkme = "Does repeat";
			
// scheduler.config.lightbox.sections=[	
// 	{ name:"description", height:50, map_to:"text", type:"textarea", focus:true },
// 	{ name:"checkme", height:55, map_to:"single_checkbox", type:"checkbox", checked_value:"1", unchecked_value:"0" },
// 	{ name:"time", height:72, type:"time", map_to:"auto"}	
// ];

// var suspendDate = homeLayout.cells("b").attachScheduler(new Date(), "month");

// 	window.dhx4.ajax.get("/_apps/trip2/ext/getSuspendDates.php", function(r){
// 		var dates = JSON.parse(r.xmlDoc.responseText);
// 		console.log(dates);
// 		suspendDate.parse(dates, "json");
// 		console.log(suspendDate.getEvents());
// 		// var today = new Date();
// 		// suspendDate.getEvents().forEach(function(i, ind){
// 		// 	console.log(i);
// 		// 	i.start_date.setFullYear(today.getFullYear());
// 		// 	i.end_date.setFullYear(today.getFullYear());
// 		// });
// 		// console.log(suspendDate.getEvents());
// 		// suspendDate.setCurrentView();
// 	});

// var cMenu = new dhtmlXMenuObject();
// 	cMenu.renderAsContextMenu();
// 	cMenu.addNewChild(cMenu.topId, 0, "remove", "Remove Suspension", false, "/dhtmlx/codebase/imgs/close.gif");


// suspendDate.attachEvent("onContextMenu", function(event_id, native_event_object){
// 	window.trip2.suspendDateID = event_id;
//   	if (event_id) {
// 		var posx = 0;
// 		var posy = 0;
// 		if (native_event_object.pageX || native_event_object.pageY) {
// 			posx = native_event_object.pageX;
// 			posy = native_event_object.pageY;
// 		} else if (native_event_object.clientX || native_event_object.clientY) {
// 			posx = native_event_object.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
// 			posy = native_event_object.clientY + document.body.scrollTop + document.documentElement.scrollTop;
// 		}
// 		cMenu.showContextMenu(posx, posy);
// 		return false; // prevent default action and propagation
// 	}
// 	return true;
// });

// REVIEW TAB LAYOUT BEGIN -------------------------------------------------------------------------------------------------------------------------

var reviewLayout = myTabbar.tabs("Review").attachLayout({

		pattern: "1C",

		cells: [

	 {id: "a", text: "Grid", header: false},

		]
});

// VAR FOR GRID FOR REVIEW TABLE .................................................................................................................

var gridCell = reviewLayout.cells("a");

// CREATE REVIEW TOOLBAR -------------------------------------------------------------------------------------------------------------------------

var reviewToolbar = gridCell.attachToolbar();
	reviewToolbar.addButton(1,1,'Re-Run&nbsp;','/dhtmlx/codebase/imgs/fast-forward.png',null); 	  		// RE-RUN BUTTON
	reviewToolbar.addButton(3,3,'Blacklist&nbsp;','/dhtmlx/codebase/imgs/blacklist.png',null);  	   // BLACKLIST BUTTON
    reviewToolbar.addButton(4,4,'Whitelist&nbsp;','/dhtmlx/codebase/imgs/whiteList.png',null);  	  // WHITE LIST BUTTON
    reviewToolbar.addButton(5,5,'Settings&nbsp;','/dhtmlx/codebase/imgs/columnSettings.png',null); 	 // DUP DATE CHECK
    reviewToolbar.disableItem(1); 	
    reviewToolbar.disableItem(3); 
    reviewToolbar.disableItem(4); 														   			// DISABLE RE-RUN BUTTON

// SETTINGS TOOL BAR POP --------------------------------------------------------------------------------------------------------------------------

var settingsToolbarPop = new dhtmlXPopup({
		toolbar: reviewToolbar,
		id: ["5"]
});

// BLACKLIST TOOLBAR POP OUT --------------------------------------------------------------------------------------------------------

var blacklistToolbarPop = new dhtmlXPopup({
		toolbar: reviewToolbar,
		id: ["3"]
});

// WHITELIST TOOLBAR POP OUT ----------------------------------------------------------------------------------------------

var whitelistToolbarPop = new dhtmlXPopup({
		toolbar: reviewToolbar,
		id: ["4"]
});

// BLACKLIST FORM DESIGN.............................................................................................

var blacklistFormData = [

{type: "fieldset",  name: "mydata", label: "Blacklist Type", width:210, list:[
{type:"block", blockOffset:0, list:[
{type: "checkbox", label: "Name: ", name:"nameCheck"},
	{type: "newcolumn"},
	{type: "checkbox", label: "Address: ", name:"addressCheck"}
]},
	
{type: "checkbox", label: "Always Mark for Delete? ", name:"actionCheck"}
]},


{type: "input", rows:"3", width:210, label:"Notes", position:"label-top", name:"blacklistNoteField", hidden:true},
{type:"block", name:"nameDetail", blockOffset:0, hidden:true, list:[
{type: "checkbox", label: "First Name: ", name:"fNameCheck"},
	{type: "newcolumn"},
	{type: "checkbox", label: "Last Name: ", name:"lNameCheck"}
]},
{type: "button", name:"submitButton", value:"Submit"}
];

var blacklistForm = blacklistToolbarPop.attachForm(blacklistFormData);

 // WHITELIST POP FORM DESIGN..................................................................................
 
var whitelistFormData = [

{type: "fieldset",  name: "mydata", label: "Whitelist Type", width:210, list:[

{type:"block", name:"nameDetail", blockOffset:0, list:[

{type: "checkbox", label: "First Name: ", name:"fNameWLCheck"},
{type: "newcolumn"},
{type: "checkbox", label: "Last Name: ", name:"lNameWLCheck"}

]},
	]},

{type: "button", name:"submitButton", value:"Submit"}

];

var whitelistForm = whitelistToolbarPop.attachForm(whitelistFormData);

// SETTINGS TOOLBAR POP FORM DESIGN ...............................................................................

var settingsFormData = [

{type:"block", blockOffset:0, name:"dupeDaysDetail", blockOffset:0, list:[

{type: "label", label:"Duplicate Days:"},
{type: "input", name:"dupeDays"},
{type: "button", name:"submitButton", value:"Submit"}

]},

];

var settingsForm = settingsToolbarPop.attachForm(settingsFormData);

// Fill out settings form from current values in DB
window.dhx4.ajax.get("/_apps/trip2/ext/getSettings.php", function(r){
	var vConfigs = JSON.parse(r.xmlDoc.responseText);
	settingsForm.setItemValue("dupeDays", vConfigs[0][1]);
});

//window settingsForm.setItemValue();
 
// CREATE REVIEW GRID --------------------------------------------------------------------------------------------------------------------------

// CREATE BLACKLIST CONTEXT MENU 
// var blackListMenu;
// blackListMenu = new dhtmlXMenuObject();
// blackListMenu.setIconsPath("/dhtmlx/codebase/imgs/"); // BLACKLIST ICON IMG
// blackListMenu.renderAsContextMenu();
// blackListMenu.loadStruct("/_apps/trip2/data/context.xml");

var reviewGrid = gridCell.attachGrid('a'); // ATTACHING THE GRID
	reviewGrid.setImagePath("/dhtmlx/codebase/imgs/");
	reviewGrid.setHeader('&nbsp;,ID, Status, Date, First Name, Last Name, Address, Address 2, City, State, Zip, Zone, Country, Phone, Email, Media Sources, Brochures, Review');
	reviewGrid.setColTypes('sub_row_grid,ro,ro,ro,ro,ro,ed,ed,ed,ro,ed,ed,ed,ro,ro,ro,ro,ro');                      // SETTING COL TYPES TO READ ONLY OR EDIT
	reviewGrid.setInitWidths("50,50,50,150,200,150,200,200,100,70,100,100,100,150,200,100,200,100");                                // INIT WIDTH 
	reviewGrid.setColSorting("na,str,str,date,str,str,str,str,str,str,str,str,str,str,str,str,str,str");  // COL SORTING TO STRINGS, INT, DATE, ETC..D
	reviewGrid.enableResizing("true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true");
	reviewGrid.enableColumnMove(true);
 	reviewGrid.enableEditEvents(true,false,true); 



// ASK FOR DATA FROM SQL SERVER ----------------------------------------------------------------------------------------------------------------

reviewGrid.load("/_apps/trip2/connectors/reviewGrid_connector.php", function(){

reviewGrid.forEachRow(function(id){

		if(reviewGrid.getRowAttribute(id, "megan") != undefined){

		reviewGrid.cells(id, 0).setBgColor("orange");

		reviewGrid.cells(id, 2).setBgColor("orange");

}
				
var reviewItems= reviewGrid.cells(id,17).getValue(); // here
				 reviewGrid.setCellExcellType(id,2,'coro'); // COMBO - READ ONLY
				
// STATUS COMBO BOX..................................................................................................

var statusSelect = reviewGrid.getCombo(2);
		
	statusSelect.put("D","Delete");     	// DELETE 
    statusSelect.put("S","Process");	   // PROCESS

  	reviewGrid.cells(id, 2).setValue("Review");

// STATE COMBO BOX ...................................................................................................      	
// var stateSelect = reviewGrid.cells(id,16).getValue(); // here
// console.log(stateSelect);
				  reviewGrid.setCellExcellType(id,9,'co');
var stateCombo = reviewGrid.getCombo(9);
					

window.dhx4.ajax.get("/_apps/trip2/connectors/statecombo_connector.php?isGridCombo=true", function(r){

var states = JSON.parse(r.xmlDoc.responseText);
       console.log(states[0]);  
    for(var i = 0; i < states.length; i++) {
          	stateCombo.put(states[i][0],states[i][0]);
          	}
});
        
var reviewArray = reviewItems.split(",");
				for(var i = 0; i < reviewArray.length; i++){
				
					if (reviewArray[i] != ''){
						var index = parseInt(reviewArray[i]);
						index = index + 3;
						//console.log("Original: "+reviewArray[i]+" -- Formatted: "+index);
						reviewGrid.cells(id, index).setBgColor('#ff6666');
					}
					
					/*var value= reviewGrid.cells(id,reviewArray[i]).getValue();
					reviewGrid.cells(id,reviewArray[i]).setValue('<b>'+value+'</b>');*/
				}		
		});
});

		reviewGrid.init();
		reviewGrid.setColumnsVisibility("false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true");

		// reviewGrid.attachEvent("onSubGridCreated", function(grid){
		//   grid.setNoHeader(true);
		//   grid.init();
		// });

		var reviewDP = new dataProcessor("/_apps/trip2/ext/updateReview.php");
			reviewDP.init(reviewGrid);
			reviewDP.setTransactionMode("POST", false);
			reviewDP.setUpdateMode("off");
			reviewDP.attachEvent("onBeforeUpdate", function(id, state, data){
				console.log(data);
				dhtmlx.message({id: "loadingBox", expire:35000, text: "Sending data. Please wait..."});
				return true;
			});
			reviewDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}
			});

reviewGrid.attachEvent("onRowSelect", function(id,ind){
reviewToolbar.enableItem(3);
reviewToolbar.enableItem(4);
});		

// BROCHURE RECORDS LAYOUT ----------------------------------------------------------------------------------

var brochureRLayout = myTabbar.tabs('BrochureR').attachLayout({
			pattern: "1C",
			cells: [
				{id: "a", text: "Brochure Records Grid", header: true},
				
			]
		}); 

var brochureRToolbar = brochureRLayout.cells('a').attachToolbar();
		 brochureRToolbar.addButton(1,1,'New','/dhtmlx/codebase/imgs/add.gif','/dhtmlx/codebase/imgs/add_dis.gif');
			brochureRToolbar.addButton(2,2,'Remove','/dhtmlx/codebase/imgs/close.gif','/dhtmlx/codebase/imgs/close_dis.gif');
			brochureRToolbar.addSeparator('sep',3);
			brochureRToolbar.addButton(3,4,'Save','/dhtmlx/codebase/imgs/save.gif','/dhtmlx/codebase/imgs/save_dis.gif');
			brochureRToolbar.addButton(4,5,'Reload','/dhtmlx/codebase/imgs/refresh-green001.gif',null);

var brochureRGrid = brochureRLayout.cells('a').attachGrid();
		
			brochureRGrid.setHeader("IDPOS, KIT, ABBR, NAME, ACTIVE");
			brochureRGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter");
			brochureRGrid.setColTypes("co,ed,ed,ed,ch");
			brochureRGrid.setColSorting("int,str,str,str,int");
			brochureRGrid.setInitWidths("100,100,100,*,*");
			brochureRGrid.enableResizing("true,true,true,true,true");
			brochureRGrid.setColumnsVisibility("false,false,false,false,false");
			brochureRGrid.load('/_apps/trip2/connectors/brochuresGrid_connector.php', function(){
// START HERE
// 
console.log(brochureRGrid.getCombo(0));
				var myArray = [];
				brochureRGrid.forEachRow(function(id){
					myArray.push(brochureRGrid.cells(id,0).getValue());
				});
				var selectBox = brochureRGrid.getCombo(0);
				//selectBox.clear();
					for(var i=0;i<=26;i++){
						if(myArray.indexOf(i)==-1){
							selectBox.put(i,i);
						}
					}
					//selectBox.remove(myArray[4]);
					// 2nd for loop over myArray: 
					for(var j = 0; j < myArray.length; j++){
							selectBox.remove(myArray[j]);
					}

});

			brochureRGrid.init();

var brochureRDP = new dataProcessor("/_apps/trip2/ext/updateBrochureRecordsGrid.php");
			brochureRDP.init(brochureRGrid);
			brochureRDP.setTransactionMode("POST", false);
			brochureRDP.setUpdateMode("off");
			brochureRDP.attachEvent("onBeforeUpdate", function(id, state, data){
				console.log(data);
				dhtmlx.message({id: "loadingBox", text: "<div class='dhtmlx-loadingMessage'></div>"});
				return true;
			});

			brochureRDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				console.log(response);
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}

				brochureRGrid.clearAndLoad('/_apps/trip2/connectors/brochuresGrid_connector.php');
			});

// DNC LAYOUT -------------------------------------------------------------------------------------------------

var DNCLayout = myTabbar.tabs('DNC').attachLayout({
			pattern: "1C",
			cells: [
				{id: "a", text: "Do Not Contact Grid", header: true},
				
			]
		}); 


var DNCToolbar = DNCLayout.cells('a').attachToolbar();
			DNCToolbar.addButton(1,1,'New','/dhtmlx/codebase/imgs/add.gif','/dhtmlx/codebase/imgs/add_dis.gif');
			DNCToolbar.addButton(2,2,'Remove','/dhtmlx/codebase/imgs/close.gif','/dhtmlx/codebase/imgs/close_dis.gif');
			DNCToolbar.addSeparator('sep',3);
			DNCToolbar.addButton(3,4,'Save','/dhtmlx/codebase/imgs/save.gif','/dhtmlx/codebase/imgs/save_dis.gif');
			DNCToolbar.addButton(4,5,'Reload','/dhtmlx/codebase/imgs/refresh-green001.gif',null);

var dncGrid = DNCLayout.cells('a').attachGrid();
		
			dncGrid.setHeader("FULLNAME,ADDRESS,ADDRESS2,CITY,STATE,ZIPCODE,PLUS4,NOTES,CHECK - TO BE REVIEWED");
			dncGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
			dncGrid.setColTypes("ed,ed,ed,ed,ed,ed,ed,ed,ch");
			dncGrid.setColSorting("str,str,str,str,str,int,int,str,int");
			dncGrid.setInitWidths("400,*,*,*,*,*,*,*,*");
			dncGrid.enableResizing("true,true,true,true,true,true,true,true,true");
			dncGrid.setColumnsVisibility("false,false,false,false,false,false,false,false,false");
			dncGrid.load('/_apps/trip2/connectors/dnc_connector.php');
			dncGrid.init();

var dncDP = new dataProcessor("/_apps/trip2/ext/updateDNCGrid.php");
			dncDP.init(dncGrid);
			dncDP.setTransactionMode("POST", false);
			dncDP.setUpdateMode("off");
			dncDP.attachEvent("onBeforeUpdate", function(id, state, data){
				console.log(data);
				dhtmlx.message({id: "loadingBox", text: "<div class='dhtmlx-loadingMessage'></div>"});
				return true;
			});

			dncDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				console.log(response);
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}

				dncGrid.clearAndLoad('/_apps/trip2/connectors/dnc_connector.php');
			});

// BLACKLIST | WHITELIST LAYOUT -----------------------------------------------------------------------------
	
var bwListLayout = myTabbar.tabs('BlacklistWhitelist').attachLayout({
			pattern: "3U",
			cells: [
				{id: "a", text: "Blacklist Names", header: true},
				{id: "b", text: "Whitelist Names", collapse: false},
				{id: "c", text: "Blacklist Addresses", collapse: false}
			]
		});  

// BLACKLIST NAMES + ADDRESSES AND WHITELIST TOOLBARS.......................................................................

var bListNameToolbar = bwListLayout.cells('a').attachToolbar();
			bListNameToolbar.addButton(1,1,'New','/dhtmlx/codebase/imgs/add.gif','/dhtmlx/codebase/imgs/add_dis.gif');
			bListNameToolbar.addButton(2,2,'Remove','/dhtmlx/codebase/imgs/close.gif','/dhtmlx/codebase/imgs/close_dis.gif');
			bListNameToolbar.addSeparator('sep',3);
			bListNameToolbar.addButton(3,4,'Save','/dhtmlx/codebase/imgs/save.gif','/dhtmlx/codebase/imgs/save_dis.gif');
			bListNameToolbar.addButton(4,5,'Reload','/dhtmlx/codebase/imgs/refresh-green001.gif',null);

var wListNameToolbar = bwListLayout.cells('b').attachToolbar();
			wListNameToolbar.addButton(1,1,'New','/dhtmlx/codebase/imgs/add.gif','/dhtmlx/codebase/imgs/add_dis.gif');
			wListNameToolbar.addButton(2,2,'Remove','/dhtmlx/codebase/imgs/close.gif','/dhtmlx/codebase/imgs/close_dis.gif');
			wListNameToolbar.addSeparator('sep',3);
			wListNameToolbar.addButton(3,4,'Save','/dhtmlx/codebase/imgs/save.gif','/dhtmlx/codebase/imgs/save_dis.gif');
			wListNameToolbar.addButton(4,5,'Reload','/dhtmlx/codebase/imgs/refresh-green001.gif',null);

var bListAddressToolbar = bwListLayout.cells('c').attachToolbar();
			bListAddressToolbar.addButton(1,1,'New','/dhtmlx/codebase/imgs/add.gif','/dhtmlx/codebase/imgs/add_dis.gif');
			bListAddressToolbar.addButton(2,2,'Remove','/dhtmlx/codebase/imgs/close.gif','/dhtmlx/codebase/imgs/close_dis.gif');
			bListAddressToolbar.addSeparator('sep',3);
			bListAddressToolbar.addButton(3,4,'Save','/dhtmlx/codebase/imgs/save.gif','/dhtmlx/codebase/imgs/save_dis.gif');
			bListAddressToolbar.addButton(4,5,'Reload','/dhtmlx/codebase/imgs/refresh-green001.gif',null);

// BLACKLIST NAMES + ADDRESSES AND WHITELIST GRIDS................................................................................

var bListNameGrid = bwListLayout.cells('a').attachGrid();
		
			bListNameGrid.setHeader("NAME,CHECK - TO BE REVIEWED");
			bListNameGrid.attachHeader("#text_filter");
			bListNameGrid.setColTypes("ed,ch");
			bListNameGrid.setColSorting("str,int");
			bListNameGrid.setInitWidths("400,*");
			bListNameGrid.enableResizing("true,true");
			bListNameGrid.setColumnsVisibility("false,false");
			bListNameGrid.setStyle(
    "color:black; font-weight:bold;", "","color:red;", ""
);
			bListNameGrid.load('/_apps/trip2/connectors/bListGrid_connector.php');
			bListNameGrid.init();

var wListNameGrid = bwListLayout.cells('b').attachGrid();
			wListNameGrid.setHeader("NAME,CHECK - TO BE REVIEWED");
			wListNameGrid.attachHeader("#text_filter");
			wListNameGrid.setColTypes("ed,ch");
			wListNameGrid.setColSorting("str,int");
			wListNameGrid.setInitWidths("400,*");
			wListNameGrid.enableResizing("true,true");
			wListNameGrid.setColumnsVisibility("false,false");
			wListNameGrid.setStyle(
    "color:black; font-weight:bold;", "","color:green;", ""
);
			wListNameGrid.load('/_apps/trip2/connectors/wListGrid_connector.php');
			wListNameGrid.init();

var bListAddressGrid = bwListLayout.cells('c').attachGrid();
			bListAddressGrid.setHeader("ADDRESS,ADDRESS2,CITY,STATE,ZIPCODE,PLUS4,NOTES,CHECK - TO BE REVIEWED");
			bListAddressGrid.attachHeader("#text_filter,#text_filter,#select_filter,#text_filter,#text_filter,#text_filter,#text_filter");
			bListAddressGrid.setColTypes("ed,ed,ed,ed,ed,ed,ed,ch");
			bListAddressGrid.setColSorting("str,str,str,str,int,int,str,int");
			bListAddressGrid.setInitWidths("400,*,*,*,*,*,*,*");
			bListAddressGrid.enableResizing("true,true,true,true,true,true,true,true");
			bListAddressGrid.setColumnsVisibility("false,false,false,false,false,false,false,false");
			bListAddressGrid.setStyle(
    "color:black; font-weight:bold;", "","color:red;", ""
);
			bListAddressGrid.load('/_apps/trip2/connectors/bListAddressGrid_connector.php');
			bListAddressGrid.init();


var blistDP = new dataProcessor("/_apps/trip2/ext/updateBlistNamesGrid.php");
			blistDP.init(bListNameGrid);
			blistDP.setTransactionMode("POST", false);
			blistDP.setUpdateMode("off");
			blistDP.attachEvent("onBeforeUpdate", function(id, state, data){
				console.log(data);
				dhtmlx.message({id: "loadingBox", text: "<div class='dhtmlx-loadingMessage'></div>"});
				return true;
			});

			blistDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				console.log(response);
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}

				bListNameGrid.clearAndLoad('/_apps/trip2/connectors/bListGrid_connector.php');
			});

var wlistDP = new dataProcessor("/_apps/trip2/ext/updateWlistNamesGrid.php");
			wlistDP.init(wListNameGrid);
			wlistDP.setTransactionMode("POST", false);
			wlistDP.setUpdateMode("off");
			wlistDP.attachEvent("onBeforeUpdate", function(id, state, data){
				dhtmlx.message({id: "loadingBox", text: "<div class='dhtmlx-loadingMessage'></div>"});
				return true;
			});

			wlistDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}
				wListNameGrid.clearAndLoad('/_apps/trip2/connectors/wListGrid_connector.php');
			});

var bAddresslistDP = new dataProcessor("/_apps/trip2/ext/updateBlistAddressGrid.php");
			bAddresslistDP.init(bListAddressGrid);
			bAddresslistDP.setTransactionMode("POST", false);
			bAddresslistDP.setUpdateMode("off");
			bAddresslistDP.attachEvent("onBeforeUpdate", function(id, state, data){
				console.log(data);
				dhtmlx.message({id: "loadingBox", text: "<div class='dhtmlx-loadingMessage'></div>"});
				return true;
			});

			bAddresslistDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}
				bListAddressGrid.clearAndLoad('/_apps/trip2/connectors/bListAddressGrid_connector.php');
			});

// ARCHIVED LAYOUT ------------------------------------------------------------------------------------------------------------------------
		
var archivedLayout = myTabbar.tabs("archived").attachLayout({

		pattern: "1C",

		cells: [

	 {id: "a", text: "Grid", header: false},

		]

});

var archivedGridCell = archivedLayout.cells("a");

// CREATE ARCHIVED TOOLBAR -------------------------------------------------------------------------------------------------------------------------

var archivedToolbar = archivedGridCell.attachToolbar();

	archivedToolbar.addText("text_from",  null, "From:");
	archivedToolbar.addInput("dateFrom", null, "", 75);
	archivedToolbar.addText("text_to", null, "To:");
	archivedToolbar.addInput("dateTo", null, "", 75);
    archivedToolbar.addButton(4,null,'Search','/dhtmlx/codebase/imgs/view.gif',null);
	archivedToolbar.addSeparator(5,5);
	archivedToolbar.addButton(6,null,'All Records','/dhtmlx/codebase/imgs/selectAllScroll.png',null);
	archivedToolbar.addSeparator(7,7);
	archivedToolbar.addButton(8,8,'Export to Excel','/dhtmlx/codebase/imgs/cut.gif',null);
	archivedToolbar.addSeparator(9,9);
	archivedToolbar.addButton(10,10,'Save Changes','/dhtmlx/codebase/imgs/save.gif',null);

	archivedToolbar.disableItem(8);
	
// CREATE ARCHIVED GRID -------------------------------------------------------------------------------------------------------------------------

var archivedGrid =  archivedGridCell.attachGrid();
	archivedGrid.setHeader('ID, Date, First Name, Last Name, Address, Address 2, City, State, Zip, Country, Phone, Email, Brochures, Review');
	archivedGrid.attachHeader('#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#select_filter,#text_filter,#select_filter,#text_filter,#text_filter');
	archivedGrid.setColTypes('ro,ro,ro,ro,ed,ed,ed,ed,ed,ed,ro,ro,ro,ro');
	archivedGrid.setInitWidths("0,100,200,200,150,200,200,100,70,100,100,150,200,100");
	archivedGrid.setColSorting("int,date,str,str,str,str,str,str,str,str,str,str,str,str");
	archivedGrid.enableResizing("true,true,true,true,true,true,true,true,true,true,true,true,true,true"); // RESIZE THE CELLS IN GRID
	archivedGrid.enableColumnMove(true);
	archivedGrid.enableSmartRendering(true, 20);
	archivedGrid.init();
	archivedGrid.setColumnsVisibility("true,false,false,false,false,false,false,false,false,false,false,false,false,true");

// CALANDER FOR ARCHIVE TO/FROM INPUT ---------------------------------------------------------------------------------------------------------------

var arcInputFrom,
	arcInputTo,
	archivedCalendar;

	arcInputFrom = archivedToolbar.getInput("dateFrom");
	arcInputFrom.setAttribute("readOnly", "true");
	arcInputFrom.onclick = function(){ setSens(inputTill,"max"); }
	
	arcInputTill = archivedToolbar.getInput("dateTo");
	arcInputTill.setAttribute("readOnly", "true");
	arcInputTill.onclick = function(){ setSens(arcInputFrom,"min"); }
	
// INIT CALENDAR FOR TOOLBAR SELECT....................................................................................................

var archivedCalendar = new dhtmlXCalendarObject([arcInputFrom,arcInputTill]);
	archivedCalendar.setDateFormat("%Y-%m-%d");
	archivedCalendar.setWeekStartDay(7);

	function setSens(inp, x) {
			if (x == "min") {
				archivedCalendar.setSensitiveRange(inp.value, null);
			} else {
				archivedCalendar.setSensitiveRange(null, inp.value);
			}
}

// ARCHIVED DP -------------------------------------------------------------------------------------------------------------------------------

var arcDP = new dataProcessor("/_apps/trip2/ext/updateArchiveGrid.php");
			arcDP.init(archivedGrid);
			arcDP.setTransactionMode("POST", false);
			arcDP.setUpdateMode("off");
			arcDP.attachEvent("onBeforeUpdate", function(id, state, data){
				console.log(data);
				dhtmlx.message({id: "loadingBox", text: "<div class='dhtmlx-loadingMessage'></div>"});
				return true;
			});

			arcDP.attachEvent("onAfterUpdate", function(id, action, tid, response){
				console.log(response);
				if(action != 'error'){
					dhtmlx.message({id: "loadingBox", text: "Data saved!"});
				}else{
					dhtmlx.message({id: "loadingBox", text: "An error occured! Please try again."});
				}


			});

// STATE COMBO BOX -------------------------------------------------------------------------------------------------------------------------------

var myCombo = attachHomeFormData.getCombo('state');
	myCombo.load("/_apps/trip2/connectors/statecombo_connector.php");
	myCombo.allowFreeText(false);
	myCombo.enableAutocomplete();

// REPORTS TAB ----------------------------------------------------------------------------------------------------------------------------------

var reportsTabbar = myTabbar.tabs("reports").attachTabbar({
		mode: "top",
		align: "left",
		tabs: [
	 		{id: "overview", text: "Overview", active: true},
	 		{id: "custom", text: "Custom"}
		]

});

var overviewLayout = reportsTabbar.tabs("overview").attachLayout({
		pattern: "3U",
		cells: [
	 		{id: "a", text: "Entries per Media Categories"},
	 		{id: "b", text: "Entries per Media Sources"},
	 		{id: "c", text: "Top 10 States"}
		]

});

// DONUT CHART OBJECT -------------------------------------------------------------------------------------------------------------------------

var topCategoriesDonut = overviewLayout.cells('a').attachChart({
	view: "donut",
	value: "#Items#",
	color: "#color#",
	legend:{
			width: 300,
			align:"right",
			valign:"middle",
					template: function(obj){
						var sum = topCategoriesDonut.sum("#Items#");
						var label = obj.label;
						var text = label+" - "+Math.round(parseFloat(obj.Items)/sum*100)+"%";
						return "<div class='label' style='border:1px solid "+obj.color+"'>"+text+"</div>";
				}
		}
});

// LOADING THE DONUT CHART OBJECT -------------------------------------------------------------------------------------------------------------

window.dhx4.ajax.get("/_apps/trip2/ext/getMediaCategories.php", function(r){
		var data = JSON.parse(r.xmlDoc.responseText);
			topCategoriesDonut.parse(data, "json");		
});

var topSourcesDonut = overviewLayout.cells('b').attachChart({
	view: "donut",
	value: "#Items#",
	color: "#color#",
				//label: "<b>#label#</b>",
				// label: function(obj){
				// 	var sum = topCategoriesDonut.sum("#Items#");
				// 	var text = Math.round(parseFloat(obj.Items)/sum*100)+"%";
				// 	return "<div class='label' style='border:1px solid "+obj.color+"'>"+text+"</div>";
				// },
				//pieInnerText: "<b class='label'>#Items#</b>",
				legend:{
					width: 300,
					align:"right",
					valign:"middle",
					template:function(obj){
						var sum = topCategoriesDonut.sum("#Items#");
						var label = obj.label;
						var text = label+" - "+Math.round(parseFloat(obj.Items)/sum*100)+"%";
						return "<div class='label' style='border:1px solid "+obj.color+"'>"+text+"</div>";
					}
				}
			});

window.dhx4.ajax.get("/_apps/trip2/ext/getMediaSources.php", function(r){
				var data = JSON.parse(r.xmlDoc.responseText);
				topSourcesDonut.parse(data, "json");		
			});

var topStatesBar =overviewLayout.cells('c').attachChart({
			view: "bar",
			value: "#states1#",
			label: function(obj){
				var sum = topStatesBar.sum("#states1#");
				var text = Math.round(parseFloat(obj.states1)/sum*100)+"%";
				return "<div class='bar-graph-label' style='border:1px solid "+obj.color+"'>"+text+"</div>";
			},
			color: "#color#",
			xAxis: {
				title: "Top 10 States",
				template:"#states2#"
			}
		});

window.dhx4.ajax.get("/_apps/trip2/ext/getTopStates.php", function(r){
				var data = JSON.parse(r.xmlDoc.responseText);
				topStatesBar.parse(data, "json");		
});

// CUSTOM TOOLBAR LAYOUT --------------------------------------------------------------------------------------------------------------------
	
var customLayout = reportsTabbar.tabs("custom").attachLayout({
		pattern: "1C",
		cells: [
	 		{id: "a", text: "", header: false}
		]
});	

var customToolbar = customLayout.cells('a').attachToolbar();
		customToolbar.addButton(1,1,'Commission Report','/dhtmlx/codebase/imgs/reports.gif','/dhtmlx/codebase/imgs/reports_dis.gif'); // COMMISION REOPORT BTN
		customToolbar.addSeparator(2,2); 																							 // DIVIDER 
		customToolbar.addText("text_from", null, "From:");																			// "FROM" LABEL 
		customToolbar.addInput("dateFrom", null, "", 75);																		   // "FROM"
		customToolbar.addText("text_to", null, "To:");
		customToolbar.addInput("dateTo", null, "", 75);
		customToolbar.addButton(3,null,'Conversion Report','/dhtmlx/codebase/imgs/monthly_report.gif',null);

// CUSTOM TABBAR CALENDAR ------------------------------------------------------------------------------------------------------------------

var inputFrom,
	inputTo,
	myCalendar;

// GET INPUTS......................................................................................................
	inputFrom = customToolbar.getInput("dateFrom");
	inputFrom.setAttribute("readOnly", "true");
	inputFrom.onclick = function(){ setSens(inputTill,"max"); }
	
	inputTill = customToolbar.getInput("dateTo");
	inputTill.setAttribute("readOnly", "true");
	inputTill.onclick = function(){ setSens(inputFrom,"min"); }
	
// INIT CALENDAR....................................................................................................
var myCalendar = new dhtmlXCalendarObject([inputFrom,inputTill]);
	myCalendar.setDateFormat("%Y-%m-%d");

	function setSens(inp, k) {
			if (k == "min") {
				myCalendar.setSensitiveRange(inp.value, null);
			} else {
				myCalendar.setSensitiveRange(null, inp.value);
			}
}

// EVENT CALLS --------------------------------------------------------------------------------------------------------------------

	this.toolbar_onClick(appToolbar, appWindow, this.appDirectory);
	this.form_onButtonClick(attachHomeFormData);
	this.reviewToolbar_onClick(reviewToolbar, reviewGrid, reviewDP);
	this.reviewGrid_onCellChanged(reviewGrid,reviewToolbar);
	this.customToolbar_onClick(customToolbar, customLayout);
	this.archivedToolbar_onClick(archivedToolbar, archivedGrid, arcDP);
	this.pLogToolbar_onClick(pLogToolbar, plGrid);
	this.blacklistForm_onChange(blacklistForm);
	this.blackListForm_onButtonClick(reviewGrid, blacklistForm); // BLACKLIST EVENT 
	this.whitelistForm_onButtonClick(reviewGrid, whitelistForm);
	//this.reviewGrid_onClick(reviewGrid);
	this.blacklistNamesToolbar_onClick(bListNameToolbar, bListNameGrid , blistDP);
	this.whitelistNamesToolbar_onClick(wListNameToolbar, wListNameGrid , wlistDP);
    this.blacklistAddressesToolbar_onClick(bListAddressToolbar, bListAddressGrid , bAddresslistDP);
    this.doNotConToolbar_onClick(DNCToolbar, dncGrid, dncDP);
    this.brochureRecordToolbar_onClick(brochureRToolbar, brochureRGrid, brochureRDP);
   	this.settingsForm_onButtonClick(reviewGrid, settingsForm);
   	// this.suspendDate_onEventAdded(suspendDate);
   	// this.suspendDate_onEventChanged(suspendDate);
   	// this.cMenu_onClick(suspendDate, cMenu);
},

 /*************
 * EVENTS
 ************/


// BROCHURE RECORD TOOLBAR ON CLICK ............................................................................

brochureRecordToolbar_onClick: function(toolbar, grid, dp){
 		toolbar.attachEvent("onClick", function(id){
 			switch(id){
 				case '1':
 					var newID = new Date().valueOf();
 					grid.addRow(newID, "");
 					grid.moveRowTo(newID, grid.getRowId(0));
 					grid.moveRowUp(newID);
 					grid.selectRowById(newID);
 					break;

 				case '2':
 					grid.deleteSelectedItem();
 					break;

 				case '4':
 					grid.clearAndLoad('/_apps/trip2/connectors/brochuresGrid_connector.php');
 					break;

 				default:
 					//grid.forEachRow();
 					dp.sendData();

 					break;
 			}
 		});
 	},



// DO NOT CONTACT TOOLBAR ONCLICK ..............................................................................

doNotConToolbar_onClick: function(toolbar, grid, dp){
 		toolbar.attachEvent("onClick", function(id){
 			switch(id){
 				case '1':
 					var newID = new Date().valueOf();
 					grid.addRow(newID, "");
 					grid.moveRowTo(newID, grid.getRowId(0));
 					grid.moveRowUp(newID);
 					grid.selectRowById(newID);
 					break;

 				case '2':
 					grid.deleteSelectedItem();
 					break;

 				case '4':
 					grid.clearAndLoad('/_apps/trip2/connectors/dnc_connector.php');
 					break;

 				default:
 					dp.sendData();
 					break;
 			}
 		});
 	},



//BLACKLIST NAMES TOOLBAR ONCLIcK.............................................................................
blacklistNamesToolbar_onClick: function(toolbar, grid, dp){
 		toolbar.attachEvent("onClick", function(id){
 			switch(id){
 				case '1':
 					var newID = new Date().valueOf();
 					grid.addRow(newID, "");
 					grid.moveRowTo(newID, grid.getRowId(0));
 					grid.moveRowUp(newID);
 					grid.selectRowById(newID);
 					break;

 				case '2':
 					grid.deleteSelectedItem();
 					break;

 				case '4':
 					grid.clearAndLoad('/_apps/trip2/connectors/bListGrid_connector.php');
 					break;

 				default:
 					dp.sendData();
 					break;
 			}
 		});
 	},

//WHITELIST NAMES TOOLBAR ONCLICK........................................................................

whitelistNamesToolbar_onClick: function(toolbar, grid, dp){
 		toolbar.attachEvent("onClick", function(id){
 			switch(id){
 				case '1':
 					var newID = new Date().valueOf();
 					grid.addRow(newID, "");
 					grid.moveRowTo(newID, grid.getRowId(0));
 					grid.moveRowUp(newID);
 					grid.selectRowById(newID);
 					break;

 				case '2':
 					grid.deleteSelectedItem();
 					break;

				case '4':
 					grid.clearAndLoad('/_apps/trip2/connectors/wListGrid_connector.php');
 					break;

 				default:
 					dp.sendData();
 					break;
 			}
 		});
 	},

//BLACKLIST ADDRESS TOOLBAR ONCLICK.......................................................................

 blacklistAddressesToolbar_onClick: function(toolbar, grid, dp){
 		toolbar.attachEvent("onClick", function(id){
 			switch(id){
 				case '1':
 					var newID = new Date().valueOf();
 					grid.addRow(newID, "");
 					grid.moveRowTo(newID, grid.getRowId(0));
 					grid.moveRowUp(newID);
 					grid.selectRowById(newID);
 					break;

 				case '2':
 					grid.deleteSelectedItem();
 					break;

 				case '4':
 					grid.clearAndLoad('/_apps/trip2/connectors/blistAddressGrid_connector.php');
 					break;

 				default:
 					dp.sendData();
 					break;
 			}
 		});
 	},
 	



// TOOLBAR ON CLICK FUNCTION ---------------------------------------------------------------------------------------
 
 /**
 * toolbar -- onClick function
 * @param  {[toolbar]} 				tBar [toolbar with 'Add new permission' (ADMIN)]
 * @param  {[dhxWindows]} 			win  [dhxwindow object]
 * @param  {[app directory name]} 	appD [string name of app directory]
 * @return {[EVENT]}      				 [onClick]
 */

 toolbar_onClick: function(tBar, win, appD){
	    var appName = this.appName;
	    var appSection = this.section;
	    tBar.attachEvent('onClick', function(id){

	      if (win.window('uma') == null) {
	        // window was not created earlier
	        // create a new one
	        win.createWindow('uma', 100, 20, screen.width-300, screen.height-400);
	        win.window('uma').setText(appName+' - User Manager');
	        // init app
	        //initApp('uma', win.window('uma'), appD, appName, 4);
// ONLY FOR BETA
	        var appLayout = new dhtmlXLayoutObject({
				parent: win.window('uma'),
				pattern: "3E",
				cells: [
					{
						id: "a",
						text: "Tools",
						collapse: true,
						height: 60
					},
					{
						id: "b",
						text: "Application Name",
						collapse: false
					},
					{
						id: "c",
						text: "Application Documentation",
						collapse: true
					}
				]
			});
	        //window['uma'].runApp(appLayout, appD, appName, 4, false, "");
	        var appComboConn = '/_apps/uma/connectors/ldapCombo_connector.php';
		    var appGridConn = '/_apps/uma/connectors/ldapGrid_connector.php';
		    var permissionsGridConn = '/_apps/uma/connectors/PermissionsGrid_connector.php';
		    var grantPermissionsConn = '/_apps/uma/connectors/GrantPermissions_connector.php';
		    var bpath = ',OU=ADPT,dc=adpt,dc=arkgov,dc=net';

	        var umaLayout = new dhtmlXLayoutObject({
		      parent: appLayout.cells('b'),
		      pattern: '2U',
		      cells: [
		        {
		          id: 'a',
		          header: false,
		          text: appName,
		          width: 300
		        },
		        {
		          id: 'b',
		          header: false
		        }
		      ]
		    });

		    // Attach a status bar in reference to the grid
		    umaLayout.cells('b').attachStatusBar({
		      height: 30,
		      text: "<div id='pagingArea'></div>"
		    });

		    // Create the form for the left-side of UMA
		    var formData = [
		      {type: "button", name: "home", value: "Current users", width: 100},
		      {type: "fieldset", name: "searchFor", label: "Search for user", list: [
		        {type: "settings", inputWidth: 200},
		        {type: "input", name: "cpu_tag", hidden: true, disabled: true, note:{text:"&nbsp;Enter CPU Service Tag above."}},
		        {type: "input", name: "first_name", note:{text:"&nbsp;Enter users first name above."}},
		        {type: "input", name: "last_name", note:{text:"&nbsp;Enter users last name above."}}
		      ]},
		      {type: "label", label: "-OR-"},
		      {type: "fieldset", name: "byLocation", label: "Search by location", list: [
		        {type: "settings", position: "label-right", inputWidth: 200},
		        {type: "combo", name: "selOU1"},
		        {type: "combo", name: "selOU2"},
		        {type: "combo", name: "selOU3"}
		      ]},
		      {type: "label", name: "addSelLabel", label: "Add Selected User(s) to:", hidden: true},
		      {type: "label", name: "appName", label: "{application name}", offsetLeft: 30, hidden: true},
		      {type: "block", name: "addBlock", blockOffset: 30, hidden: true, list: [
		        {type: "button", name: "add", value: "Add"},
		        {type: "newcolumn"},
		        {type: "button", name: "cancel", value: "Cancel"}
		      ]},
		      {type: "button", name: "submit", value: "Submit", width: 100}
		    ];

		    // Initate grid in application layout
		    var appGrid = umaLayout.cells('b').attachGrid();
		      appGrid.setImagePath("/dhtmlx/codebase/imgs/");
		      appGrid.setHeader("<div style='width:100%;padding-left:7px;text-align:left;'>&#x2713;</div>,ACL,Section,Employee Name,Employee Title,Department,Telephone Number,GUID,Username",null,["text-align:center;","text-align:center;","","","","","",""]);
		      appGrid.attachHeader("#master_checkbox,<div id='acl' style='width:100%;text-align:center;'></div>,<div id='sec' style='width:100%;text-align:center;'></div>,#text_filter,#text_filter,#select_filter,&nbsp;,&nbsp;,&nbsp;");
		      appGrid.setInitWidths("45,150,*,*,*,*,*,*,*");
		      appGrid.setColAlign("center,,,,,,,,");
		      appGrid.setColTypes("ch,coro,coro,ro,ro,ro,ro,ro,ro");
		      appGrid.setColSorting("na,str,str,str,na,na,na,na,na");
		    var aclSel = appGrid.getCombo(1);
		      aclSel.put(0," No Access");
		      aclSel.put(3," Full");
		      aclSel.put(4," Admin");
		      // Only retrieve sections in relation to the app
		      var secSel = appGrid.getCombo(2);

		      if(appSection == 'All'){
		      	window.dhx4.ajax.get("/_apps/uma/connectors/GetSections.php?refApp="+appD, function(r){
			        console.log(r.xmlDoc.responseText);
			        var appSections = r.xmlDoc.responseText.split(',');
			        console.log(appSections);
			        
			          for(var i = 0; i < appSections.length; i++){
			            secSel.put(i, appSections[i]);
			          }
			      });
		      		appGrid.load("/_apps/uma/connectors/GetCurrentUsers.php?refApp="+appD);
		      }else{
				secSel.put(0, appSection);
				appGrid.load("/_apps/uma/connectors/GetCurrentUsers.php?refApp="+appD+"&refSection="+appSection);
		      }

		    appGrid.setColumnsVisibility("false,false,false,false,false,false,false,true,true");

		    appGrid.enableEditEvents(true,false,true);
		    appGrid.enableColumnAutoSize(true);
		    appGrid.enablePaging(true, 20, 3, "pagingArea");
		    appGrid.setPagingSkin("toolbar");
		    appGrid.enableMultiselect(true);
		    appGrid.init();

		    // Instatiate Date Processor
		    var appDp = new dataProcessor("/_apps/uma/connectors/uma_connector.php");
		    appDp.setUpdateMode("off",false);
		    appDp.init(appGrid);

		    // Initiate form in application layout
		    var appForm = umaLayout.cells('a').attachForm(formData);
		      appForm.disableItem("search_type", "computer");
		      appForm.hideItem("selOU2");
		      appForm.hideItem("selOU3");

		      //Combos
		      var selOU1 = appForm.getCombo("selOU1");selOU1.enableFilteringMode(true);selOU1.setComboText("Location");selOU1.load(appComboConn+"?optxt=Init&opval=");
		      var selOU2 = appForm.getCombo("selOU2");selOU2.enableFilteringMode(true);selOU2.setComboText("");selOU2.disable();
		      var selOU3 = appForm.getCombo("selOU3");selOU3.enableFilteringMode(true);selOU3.setComboText("");selOU3.disable();

		      /*
			  Custom function:
			  Note:
			    DHTMLX does not have an event function that listens for events from
			    custom HTML embedded into the dhtmlxGrid header
			 */
			//BEGIN

			      // Selecing a value from the Master ACL

			      var refApp = appD;
			      // Embed an HTML Select semantic into the appGrid header -- 'aclSelect'
			      document.getElementById('acl').innerHTML="<select id='aclSelect'><option value=0>No Access</option><option value=1>Read Only</option><option value=2>Write</option><option value=3>Full</option><option value=4>Admin</option><option value=5>Reports</option></selection>";

			      // 'aclSelect' onChange function
			      document.getElementById('acl').onchange = function(){
			        // Grab the ACL value from the 'aclSelect' tag
			        var masterACL = document.getElementById('aclSelect');
			        var masterACLValue = masterACL[masterACL.selectedIndex].value;
			        // Array variable that will store grid row IDs
			        var arrayIDs;
			        // We only care if the user has checked MORE than 1 row
			        if(appGrid.getCheckedRows(0).indexOf(',') > -1){
			          // Convert a comma-delimited rowID list into an array and store it in 'arrayIDs'
			          arrayIDs = appGrid.getCheckedRows(0).split(",");
			          // Declare variables to send to 'GrandPermissions_connector.php'
			          var employee;
			          var employeeName;
			          var employeeUserName;
			          var acl = masterACLValue;
			          // Loop through 'arrayIDs' to:
			          //  (1) - Set the rowIDs ACL value to the 'masterACLValue'
			          //  (2) - Send each selected row (one-at-a-time) to 'GrandPermissions_connector.php'
			          for(var i = 0; i < arrayIDs.length; i++){
			            // Set acl value
			            appGrid.cells(arrayIDs[i],1).setValue(masterACLValue);
			            // Set variables respectively: Guid, FullName, Username
			            employee = appGrid.cells(arrayIDs[i],7).getValue();
			            employeeName = appGrid.cells(arrayIDs[i],3).getValue();
			            employeeUserName = appGrid.cells(arrayIDs[i],8).getValue();
			          }
			        }
			      };
			// END custom function
			
/* EVENTS */			
// FORM ONBUTTONCLICK
			appForm.attachEvent("onButtonClick", function(name){
		      if(name == 'submit'){
		        if(appGrid.getChangedRows() == ""){
		          // No changes made
		        }else{
		          // Convert changed row list to array
		          var rowArray = appGrid.getChangedRows().split(",");
		          // Grab the values from the row respectively: Guid, FullName, Username, ACL, Section
		          var employee;
		          var employeeName;
		          var employeeUserName;
		          var acl;
		          var section;
		          for(var i = 0; i < rowArray.length; i++){
		            // Grab the values from the row respectively: Guid, FullName, Username
		            employee = appGrid.cells(rowArray[i],7).getValue();
		            employeeName = appGrid.cells(rowArray[i],3).getValue();
		            employeeUserName = appGrid.cells(rowArray[i],8).getValue();
		            acl = appGrid.cells(rowArray[i],1).getValue();
		            section = appGrid.cells(rowArray[i],2).getTitle();
		            console.log("Employee: "+employeeName+" with username: "+employeeUserName+" and with guid: "+employee+" now have ACl of: "+acl+" and Section: "+section);
		            window.dhx4.ajax.get("/_apps/uma/connectors/GrantPermissions_connector.php?employee="+employee+"&name="+employeeName+"&userName="+employeeUserName+"&acl="+acl+"&section="+section+"&refApp="+refApp, function(r){
		              console.log(r.xmlDoc.responseText);
		              if(appSection == 'All'){
		              	appGrid.clearAndLoad("/_apps/uma/connectors/GetCurrentUsers.php?refApp="+refApp);
		              }else{
		              	appGrid.clearAndLoad("/_apps/uma/connectors/GetCurrentUsers.php?refApp="+refApp+"&refSection="+appSection);
		              }
		            });
		          }
		          dhtmlx.alert({
		            type: "alert",
		            text: "User(s) will now need to refresh their web page",
		            title: "Success!",
		            ok: "Ok"
		          });
		          var selOU1 = appForm.getCombo("selOU1");
		          selOU1.setComboText("Location");
		          // selOU1.load("/_apps/uma/connectors/ldapCombo_connector.php?optxt=Init&opval=");
		          //
		          // var selOU2 = form.getCombo("selOU2");
		          // selOU2.enableFilteringMode(true);
		          // selOU2.setComboText("");
		          // selOU2.disable();
		          //
		          // var selOU3 = form.getCombo("selOU3");
		          // selOU3.enableFilteringMode(true);
		          // selOU3.setComboText("");
		          // selOU3.disable();
		        }
		      }else if(name == 'home'){
		      	console.log(appSection);
		      	if(appSection != 'All'){
		      		appGrid.clearAndLoad("/_apps/uma/connectors/GetCurrentUsers.php?refApp="+refApp+"&refSection="+appSection);
		      	}else{
		      		appGrid.clearAndLoad("/_apps/uma/connectors/GetCurrentUsers.php?refApp="+refApp);
		      	}
		      }
		    });

// FORM ONCHANGE
		    appForm.attachEvent("onChange", function(id, value){
		      // Get the search type value and then clear the grid
		      // This sections loads data from LDAP and the userData table in SQL Srv
		      SItem = appForm.getItemValue("search_type");
		      appGrid.clearAll();
		      // CPU Service Tag search
		      if(id == "cpu_tag"){
		        appGrid.clearAndLoad(appGridConn+"?qryitm="+value+"&opitm="+SItem+"&opid="+id+"&refApp="+refApp);
		      }
		      // User name search
		      if((id == "first_name")||(id == "last_name")){
		        var fname = appForm.getItemValue("first_name");
		        var lname = appForm.getItemValue("last_name");

		        appGrid.clearAndLoad(appGridConn+"?qryfnm="+fname+"&qrylnm="+lname+"&opitm="+SItem+"&opid="+id+"&refApp="+refApp);
		      }

		      if(id == "search_type"){
		        switch(value){
		          case "user":
		            appForm.setItemLabel("searchFor", "Search for user");
		            appForm.disableItem("cpu_tag");
		            appForm.hideItem("cpu_tag");
		            appForm.enableItem("first_name");
		            appForm.showItem("first_name");
		            appForm.enableItem("last_name");
		            appForm.showItem("last_name");
		            if(userAdmin == 1){
		              appGrid.setColumnLabel(0, "&#x2713;");
		              appGrid.setColumnLabel(1, "Employee Name");
		              appGrid.setColumnLabel(2, "Employee Title");
		              appGrid.setColumnLabel(3, "Department");
		              appGrid.setColumnLabel(4, "Telephone Number");
		              appGrid.setColumnLabel(5, "GUID");
		              appGrid.setColumnLabel(6, "Username");
		            }else{
		              appGrid.setColumnLabel(0, "&#x2713;");
		              appGrid.setColumnLabel(1, "Employee Name");
		              appGrid.setColumnLabel(2, "Employee Title");
		              appGrid.setColumnLabel(3, "Department");
		              appGrid.setColumnLabel(4, "Telephone Number");
		              appGrid.setColumnLabel(5, "GUID");
		              appGrid.setColumnLabel(6, "Username");
		            }
		            break;
		          case "computer":
		            appForm.setItemLabel("searchFor", "Search for computer");
		            appForm.enableItem("cpu_tag");
		            appForm.showItem("cpu_tag");
		            appForm.disableItem("first_name");
		            appForm.hideItem("first_name");
		            appForm.disableItem("last_name");
		            appForm.hideItem("last_name");
		            if(userAdmin == 1){
		              appGrid.setColumnLabel(0, "&#x2713;");
		              appGrid.setColumnLabel(1, "Computer Service Tag");
		              appGrid.setColumnLabel(2, "Computer Location");
		              appGrid.setColumnLabel(3, "Operating System");
		              appGrid.setColumnLabel(4, "Service Pack");
		              appGrid.setColumnLabel(5, "");
		              appGrid.setColumnLabel(6, "");
		            }else{
		              appGrid.setColumnLabel(0, "&#x2713;");
		              appGrid.setColumnLabel(1, "Computer Service Tag");
		              appGrid.setColumnLabel(2, "Computer Location");
		              appGrid.setColumnLabel(3, "Operating System");
		              appGrid.setColumnLabel(4, "Service Pack");
		              appGrid.setColumnLabel(5, "");
		              appGrid.setColumnLabel(6, "");
		            }
		            break;
		        }
		      }
		    });

// GRID ONXLE
		    appGrid.attachEvent("onXLE", function(){
		      // Get count of current number of rows
		      var count = appGrid.getRowsNum();
		      var appGridToolbar;

		      // Select first row by default
		      appGrid.selectRow(0);

		      // Set count of current number of rows
		      if(first_loaded==true){
		        appGridToolbar=appGrid.aToolBar;
		        appGridToolbar.addText("rows_num",7,"&nbsp;Record Count: "+count);
		        first_loaded=false
		      }

		      // If a record has an acl of 'No Access',
		      // then disable the acl cell
		      appGrid.forEachRow(function(rowID){
		        if(appGrid.cells(rowID,1).getValue() == 0){
		          appGrid.cells(rowID,1).setDisabled(true);
		          appGrid.cells(rowID,1).setTextColor('#AAA');
		        }
		      });
		    });
		    first_loaded=true;

// GRID ONEDITCELL
		    appGrid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
		      switch(cInd){
		        case 0:
		          // Check or uncheck the row
		          if(appGrid.cells(rId,0).getValue() == 1){
		            // If the checked row has ACl of 'No Access'
		            // then enable the ACL row
		            if(appGrid.cells(rId,1).getValue() == 0){
		              appGrid.cells(rId,1).setDisabled(false);
		              appGrid.cells(rId,1).setTextColor('#ff9900');
		            }
		          }else{
		            // If the unchecked row has ACl of 'No Access'
		            // then disable the ACL row
		            if(appGrid.cells(rId,1).getValue() == 0){
		              appGrid.cells(rId,1).setDisabled(true);
		              appGrid.cells(rId,1).setTextColor('#AAA');
		            }
		          }
		          return true;
		          break;

		        case 1:
		          console.log("Change ACL");
		          var employee = appGrid.cells(appGrid.getSelectedId(),7).getValue();
		          var employeeName = appGrid.cells(appGrid.getSelectedId(),3).getValue();
		          var employeeUserName = appGrid.cells(appGrid.getSelectedId(),8).getValue();
		          if(stage == 2 && nValue != oValue){
		            return true;
		          }
		          break;

		        case 2:
		          if(appGrid.cells(appGrid.getSelectedId(),1).getValue() != 0){
		            return true;
		          }else{
		            return false;
		          }
		          break;

		        default:
		          break;
		      }
		    });

// COMBO_1 ONCHANGE
		    selOU1.attachEvent("onChange", function(value, text){
		      // If user is searching Exhibit Shop or Warehouse in Central Office
		      if((value == "OU=Exhibit Shop,OU=Central Office"+bpath)||(value == "OU=Warehouse,OU=Central Office"+bpath)){
		        // Then hide the other combos and clear/load the grid
		        (appForm.isItemHidden("selOU2") == false) ? appForm.hideItem("selOU2") : '';
		        (appForm.isItemHidden("selOU3") == false) ? appForm.hideItem("selOU3") : '';
		          appGrid.clearAndLoad(appGridConn+"?opval="+value+"&opitm="+SItem+"&refApp="+refApp);
		      // Otherwise, show the other combos and load them from LDAP
		      }else{
		        appForm.showItem("selOU2");
		        selOU2.enable();
		        selOU2.clearAll();
		        selOU2.load(appComboConn+"?optxt="+text+"&opval="+value);

		        // If Central Office, load S2 with departments
		        if(value == "OU=Central Office"+bpath){
		          selOU2.setComboText("Department");
		        // If Parks, load S2 with regions
		        }else if(value == "OU=Parks,OU=Remote Locations"+bpath){
		          selOU2.setComboText("Region");
		        // If anything else, do the following
		        }else{
		          switch(value){
		            case "OU=History Commission Regional Archives,OU=Remote Locations"+bpath:
		              selOU2.setComboText("Regional Archive");
		              break;
		            case "OU=Regional Offices,OU=Remote Locations"+bpath:
		              selOU2.setComboText("Office");
		              break;
		            case "OU=Welcome Centers,OU=Remote Locations"+bpath:
		              selOU2.setComboText("Center");
		              break;
		            default:
		              appForm.hideItem("selOU2");
		              selOU2.disable();
		          }
		        }
		      }
		    });

// COMBO_2 ONCHANGE
		    selOU2.attachEvent("onChange", function(value, text){
		      // More conditionals on values in LDAP
		      switch (value) {
		        case "OU=Accounting,OU=Central Office"+bpath:
		        case "OU=Parks,OU=Central Office"+bpath:
		        case "OU=Tourism,OU=Central Office"+bpath:
		        case "Region 1":
		        case "Region 2":
		        case "Region 3":
		        case "Region 4":
		        case "Region 5":
		          appForm.showItem("selOU3");
		          selOU3.enable();
		          selOU3.clearAll();

		          switch (value) {
		            case "OU=Accounting,OU=Central Office"+bpath:
		            case "OU=Parks,OU=Central Office"+bpath:
		            case "OU=Tourism,OU=Central Office"+bpath:
		              selOU3.setComboText("Section");
		              selOU3.load(appComboConn+"?optxt="+text+"&opval="+value);
		              break;
		            case "Region 1":
		            case "Region 2":
		            case "Region 3":
		            case "Region 4":
		            case "Region 5":
		              selOU3.setComboText("Park");
		              selOU3.load(appComboConn+"?optxt="+text+"&opval="+value);
		              break;
		            default:
		              s3.setComboText("ERROR");
		            break;
		          }

		          break;
		        default:
		        appForm.hideItem("selOU3");
		        appGrid.clearAndLoad(appGridConn+"?opval="+value+"&opitm="+SItem+"&refApp="+refApp);
		      }
		    });

// COMBO_3 ONCHANGE
		    selOU3.attachEvent("onChange", function(value){
		      if(value !== null){
		        appGrid.clearAndLoad(appGridConn+"?opval="+value+"&opitm="+SItem+"&refApp="+refApp);
		      }
		    });
	      }else{
	        // window already created (app probably attached),
	        // you just need to change focus
	        win.window('uma').bringToTop();
	      }
	    });
	},



// BLACK LIST FORM ONCHANGE FUNCTION -------------------------------------------------------------------------------------

blacklistForm_onChange: function(form){
form.attachEvent("onChange", function (name, value, state){
     if(form.isItemChecked('addressCheck')){
form.showItem('blacklistNoteField');
     }else{
form.hideItem('blacklistNoteField');
     }

     if(form.isItemChecked('nameCheck')){
form.showItem('nameDetail');
     }else{
form.hideItem('nameDetail');
     }
});

},	

// BLACKLIST BUTTON ON CLICK FUNCTION -------------------------------------------------------------------------------------------------------------

blackListForm_onButtonClick: function(grid, form){

form.attachEvent("onButtonClick", function(name){
		
var isNameChecked = form.isItemChecked('nameCheck'); 							// IS NAME CHECKED T-F
var isAddressChecked = form.isItemChecked('addressCheck');   				   // IS ADDRESS CHECKED T-F 
var isActionChecked = (form.isItemChecked('actionCheck') == true ? 1 : 0); 	  // IF TRUE, THEN "1", IF NOT "0". DHX IF/ELSE STATEMENT 
var gridID = grid.cells(grid.getSelectedRowId(),1).getValue();				 // 1.) GET GRID ID : var gridID = grid.cells(..).getValue();
																			// 2.) PASS "gridID" in ajax function (go to PHP page to finish steps)

// IF "NAME" CHECKBOX IS CHECKED...................................................................................		

if(isNameChecked){
	var fName = grid.cells(grid.getSelectedRowId(),4).getValue(); 	 // PULL THE FIRST NAME 
	var lName = grid.cells(grid.getSelectedRowId(),5).getValue();  	// PULL THE LAST NAME 

// CALL WITH AJAX TO SEND TO DB...................................................................................

window.dhx4.ajax.get("/_apps/trip2/ext/addToBlacklist.php?isNames=true"+"&fName="+fName+"&lName="+lName+"&action="+isActionChecked+"&gridID="+gridID, function(r){
console.log(r.xmlDoc.response);

	});
}

// IF "ADDRESS" CHECKBOX IS CHECKED....................................................................................

if(isAddressChecked){
	var address = grid.cells(grid.getSelectedRowId(),6).getValue();   	 // ADDRESS
	var address2 = grid.cells(grid.getSelectedRowId(),7).getValue();	// ADDRESS 2
	var city = grid.cells(grid.getSelectedRowId(),8).getValue();	   // CITY
	var state = grid.cells(grid.getSelectedRowId(),9).getValue();	  // STATE
	var zipcode = grid.cells(grid.getSelectedRowId(),10).getValue();  // ZIP CODE
	var blacklistNotes = form.getItemValue('blacklistNoteField');	// BLACKLIST NOTES

window.dhx4.ajax.get("/_apps/trip2/ext/addToBlacklist.php?isAddresses=true"+"&address="+address+"&address2="+address2+"&city="+city+"&state="+state+"&zipcode="+zipcode+"&blacklistNotes="+blacklistNotes+"&action="+isActionChecked+"&gridID="+gridID, function(r){
console.log(r.xmlDoc.response);
	});

} 

if(isNameChecked == false && isAddressChecked == false){	dhtmlx.alert({
			                type: "alert-error",
			                text: "Please select a checkbox of what you would like to Blacklist, before submission.",
			                title: "Error!",
			                ok: "Ok"
			            });
}else{
	dhtmlx.message({
    title: "Success",
    type: "alert",
    text: "Blacklist Items Created!",
  
});
	//grid.deleteRow(grid.getSelectedRowId());
}
	

		});


},

// WHITELIST BUTTON ON CLICK FUNCTION -------------------------------------------------------------------------------------------------------------

whitelistForm_onButtonClick: function(grid, form){

form.attachEvent("onButtonClick", function(name){

var isFNameWLChecked = form.isItemChecked('fNameWLCheck'); 	
var isLNameWLChecked = form.isItemChecked('lNameWLCheck');	
var gridID = grid.cells(grid.getSelectedRowId(),1).getValue();				 // 1.) GET GRID ID : var gridID = grid.cells(..).getValue();
																			// 2.) PASS "gridID" in ajax function (go to PHP page to finish steps)

// IF "NAME" CHECKBOX IS CHECKED...................................................................................		
if(isFNameWLChecked){
	var fName = grid.cells(grid.getSelectedRowId(),4).getValue(); 	 // PULL THE FIRST NAME 
	//var lName = grid.cells(grid.getSelectedRowId(),5).getValue();  	// PULL THE LAST NAME 

// CALL WITH AJAX TO SEND TO DB...................................................................................

 window.dhx4.ajax.get("/_apps/trip2/ext/addToWhitelist.php?fName="+fName, function(r){
 console.log(r.xmlDoc.response);

 });

 dhtmlx.message({
    title: "Success",
    type: "alert",
    text: "New Whitelist First Name Created!",
});
 }

if(isLNameWLChecked){
	//var lName = grid.cells(grid.getSelectedRowId(),4).getValue(); 	 // PULL THE FIRST NAME 
	var lName = grid.cells(grid.getSelectedRowId(),5).getValue();  	// PULL THE LAST NAME 

// CALL WITH AJAX TO SEND TO DB...................................................................................

 window.dhx4.ajax.get("/_apps/trip2/ext/addToWhitelist.php?lName="+lName, function(r){
 console.log(r.xmlDoc.response);

 });

 dhtmlx.message({
    title: "Success",
    type: "alert",
    text: "New Whitelist Last Name Created!",
});
 }

 if(isFNameWLChecked == false && isLNameWLChecked == false){	dhtmlx.alert({
			                type: "alert-error",
			                text: "Please select a checkbox of what you would like to Blacklist, before submitting.",
			                title: "Error!",
			                ok: "Ok"
			            });
 }

 // if(isFNameWLChecked == true && isLNameWLChecked == true){	dhtmlx.alert({
	// 		                type: "alert",
	// 		                text: "WOW",
	// 		                title: "Success",
	// 		                ok: "Ok"
	// 		            });
 // }

// }else{
// 	dhtmlx.message({
//     title: "Success",
//     type: "alert",
//     // text: "New Whitelist Name Created!",
  
// });
	//grid.deleteRow(grid.getSelectedRowId());
//}

		});


},

// SETTINGS FORM ONCLICK ------------------------------------------------------------------------------------------------------------------

settingsForm_onButtonClick: function(grid, form){

form.attachEvent("onButtonClick", function(name){

form.send("/_apps/trip2/ext/updateSettings.php", "POST", function(r){
	
console.log(r.xmlDoc.response);
	
	});
 dhtmlx.message({
    title: "Update!",
    type: "alert",
    text: "Duplicate Days Is Now Updated.",
});
});

},


// FORM BUTTON ON CLICK FUNCTION ----------------------------------------------------------------------------------------------------------

// /**
 // * form -- onButtonClick function
 // * @param  {[form]} 				form [submission of Trip form]
 // * @return {[EVENT]}      				 [onButtonClick]
 // */
 
 
form_onButtonClick: function(form){

		form.attachEvent("onButtonClick", function(name){
			// var packagesList = document.getElementsByName('packages[]');
			// var packages = [];
			// for(var i = 0; i < packagesList.length; i++){
			// 	packages.push(packagesList[i].value);
			// }
			// console.log(packages.toString());
			//var packages = form.getCheckedValue('packages[]');
			//console.log(packages);
			var p = [];
			form.forEachItem(function(id){
				if(form.getItemType(id)=='checkbox'){
					if(form.isItemChecked(id)){
						if(p.indexOf(form.getItemValue(id))){
							p.push(form.getItemValue(id));
						}
					}
				}
			});
			 console.log("/_apps/trip2/ext/submitForm.php?packageList="+p);
			form.send("/_apps/trip2/ext/submitForm.php?packageList="+p, "get", function(r){

// ALERT USER ON FORM SUBMISSION 
				console.log(r.xmlDoc.response);
				if(r.xmlDoc.response == 'success'){
					dhtmlx.alert({
					    title:"Success!",
					    type:"alert",
					    text:"Successfully submitted"
					});
					form.clear();
					form.setItemValue("packages", "vk");
					form.setItemValue("states", "");
				}else{
					dhtmlx.alert({
					    title:"Error!",
					    type:"alert-error",
					    text:"Something went wrong, please try again"
					});
				}

			});

		});
	},

// REVIEW TOOLBAR RE-RUN FUNCTION -----------------------------------------------------------------------------------	
 
reviewToolbar_onClick: function(toolbar,grid,dp){
		var processArray = [];
		toolbar.attachEvent("onClick", function(id){
			switch(id){
				case '1':
				dp.sendData();
              		
           		 grid.clearAndLoad("/_apps/trip2/connectors/reviewGrid_connector.php", function(){
            	 	grid.forEachRow(function(id){
              		
						var reviewItems= grid.cells(id,17).getValue();
										 grid.setCellExcellType(id,1,'coro');

						var statusSelect = grid.getCombo(2);

							statusSelect.put("D","Delete");     // DELETE 
						    statusSelect.put("S","Process");   // PROCESS
						    statusSelect.put("R","Review");   // REVIEW

						var stateSelect = grid.cells(id,15).getValue();
										  grid.setCellExcellType(id,9,'co');

						var stateCombo = grid.getCombo(9);
													
						
						window.dhx4.ajax.get("/_apps/trip2/connectors/statecombo_connector.php?isGridCombo=true", function(r){
					         
							var states = JSON.parse(r.xmlDoc.responseText);
							// console.log(states);

				          for(var i = 0; i < states.length; i++) {
				          	stateCombo.put(states[i][0],states[i][0]);
				          	}
						});

													
						var reviewArray = reviewItems.split(",");

						for(var i = 0; i < reviewArray.length; i++){
						
							if (reviewArray[i] != ''){
								var index = parseInt(reviewArray[i]);
								index = index + 2;
								grid.cells(id, index).setBgColor('#ff6666');
							}

						}		
						});
              		});
				break;
				
			default:
						
				break;
				
			}
			
		});
		
		
},
	
// REVIEW GRID ON CELL CHANGED ----------------------------------------------------------------------------------
	
/**
 * reviewGrid -- onCellChanged function
 * @param  {[grid]} 				dhx grid [grid obj]
 * @return {[EVENT]}      				 	 [onCellChanged]
 */

reviewGrid_onCellChanged: function(grid,toolbar){
		grid.attachEvent("onCellChanged", function(rId,cInd,nValue){
			


	if(cInd == 2){
// create var isAll 
	var isAll = []; 
// go thru each row 
		grid.forEachRow(function(id){
// if the status is not r then set isAll to true. continue.. 

	if(grid.cells(id,2).getValue()!='R' && grid.cells(id,2).getValue()!='Review'){
// push true into isAll 
			isAll.push('true');
}
// otherwise isAll set back to false and exit out of the forEachRow. 
		else{
		// push false into isAll
			isAll.push('false');
	
		} 

});


// Google: javascript if array contains (Aaron thinks it might be indexOf().... he's not sure.... he's not very reliable)
if(isAll.indexOf('false') != -1){
					 toolbar.disableItem(1);
				}else{
					toolbar.enableItem(1);
				}	
	
		
	}	
		});
},

// CUSTOM TOOLBAR ON CLICK -----------------------------------------------------------------------------------------

/**
 * customToolbar -- onClick
 * @param  {DHX Toolbar} toolbar -customToolbar object with buttons to generate reports
 * @param  {DHX Layout} layout    -customLayout that will contain the report
 * @return {EVENT}         onClick
 */

customToolbar_onClick: function(toolbar, layout){

		toolbar.attachEvent("onClick", function(id){

		switch(id){

// Commission report
		case '1':

// Create layout................................................................................................
var commissionLayout = layout.cells('a').attachLayout({
						pattern: "3T",
						cells: [
					 	{id: "a", text: "Top 10 States -- arkansas.com"},
					 	//{id: "b", text: "States Percentage -- arkansas.com"},
					 	{id: "b", text: "Inquiries by Media"},
					 	{id: "c", text: "Percentage Inquiries by Media"}
						]

});	

// TOP 10 STATES VIA ARKANSAS.COM...............................................................................
var topStatesBar = commissionLayout.cells('a').attachChart({
					view: "bar",
					value: "#states1#",
					label: function(obj){
							var sum = topStatesBar.sum("#states1#");
							var text = parseFloat(obj.states1)/sum*100+"%";
							return "<div class='bar-graph-label' style='border:1px solid "+obj.color+"'>"+text+"</div>";
},
					color: "#color#",
					xAxis: {
							title: "Top 10 States on arkansas.com",
							template:"#states2#"
						}
});
					window.dhx4.ajax.get("/_apps/trip2/ext/getCommissionReport.php?id="+1, function(r){
							var data = JSON.parse(r.xmlDoc.responseText);
							topStatesBar.parse(data, "json");		
						});

					// var statesGrid = commissionLayout.cells('b').attachGrid();
					// 	statesGrid.setHeader("State,%");
					// 	statesGrid.setColTypes("ro,ro");
					// 	statesGrid.setColSorting("str,int");
					// 	statesGrid.setInitWidths("200,*");
					// 	statesGrid.enableResizing("true,true");
					// 	statesGrid.load('/_apps/trip2/connectors/statesGrid_connector.php', function(){
					// 		var total = 0;
					// 		statesGrid.forEachRow(function(id){
					// 			total = total + parseInt(statesGrid.cells(id, 1).getValue());
					// 		});
					// 		statesGrid.forEachRow(function(id){
					// 			statesGrid.cells(id, 1).setValue((parseInt(statesGrid.cells(id, 1).getValue())/total)*100);
					// 		});
					// 		console.log(total);
					// 	});
					// 	statesGrid.init();

						var currentYear = new Date().getFullYear();
						var previousYear = currentYear - 1;
						var mediaGrid = commissionLayout.cells('b').attachGrid();
							mediaGrid.setHeader("&nbsp;,Media");
							mediaGrid.setColTypes("sub_row,ro");
							mediaGrid.setImagePath("/dhtmlx/codebase/imgs/");
							mediaGrid.setInitWidths("30,*");
							mediaGrid.init();
							mediaGrid.enableAutoHeight(true);
							mediaGrid.load("/_apps/trip2/data/mediaGrid.xml", function(){
								mediaGrid.cells("1",0).open();
								mediaGrid.cells("2", 0).open();
								mediaGrid.cells("3", 0).open();
							});

						var mediaYTDGrid = commissionLayout.cells('c').attachGrid();
							mediaYTDGrid.setHeader("&nbsp;,Media");
							mediaYTDGrid.setColTypes("sub_row,ro");
							mediaYTDGrid.setImagePath("/dhtmlx/codebase/imgs/");
							mediaYTDGrid.setInitWidths("30,*");
							mediaYTDGrid.init();
							mediaYTDGrid.enableAutoHeight(true);
							mediaYTDGrid.load("/_apps/trip2/data/monthToDateMediaGrid.xml", function(){
								mediaYTDGrid.cells("1",0).open();
								mediaYTDGrid.cells("2", 0).open();
								console.log(mediaYTDGrid.serialize());
							});
					break;

				case '3':
					if(toolbar.getInput('dateFrom').value != ""){
						var from = toolbar.getInput('dateFrom').value;
						var to = toolbar.getInput('dateTo').value;

						var conversionLayout = layout.cells('a').attachLayout({
							pattern: "1C",
							cells: [
						 		{id: "a", text: "Conversion Report"}
							]
						});	

// INIT MEDIA CONVERSION REPORT LAYOUT ------------------------------------------------------------------------------------------------------

var mediaConversionGrid = conversionLayout.cells('a').attachGrid();
	mediaConversionGrid.setHeader("&nbsp;,Media");
	mediaConversionGrid.setColTypes("sub_row,ro");
	mediaConversionGrid.setImagePath("/dhtmlx/codebase/imgs/");
	mediaConversionGrid.setInitWidths("30,*");
	mediaConversionGrid.init();
	mediaConversionGrid.enableAutoHeight(true);
	mediaConversionGrid.load("/_apps/trip2/ext/getTimeSpanMediaTotals.php?from="+from+"&to="+to, function(){
	mediaConversionGrid.cells("1",0).open();
	mediaConversionGrid.cells("2", 0).open();

	console.log(mediaConversionGrid.serialize());
});						
	}else{
						dhtmlx.alert({
			                type: "alert-error",
			                text: "You must select a date in the From field",
			                title: "Error!",
			                ok: "Ok"
			            });
					}
					break;

				default:
					layout.detachObject();
					break;
			}
		});
	},

pLogToolbar_onClick: function(toolbar, grid){
	
	toolbar.attachEvent("onClick", function(id){

		switch(id){

      	case '6': // Getting ALL the Records

			grid.clearAndLoad("/_apps/trip2/ext/getProcessLogRecords.php?all=true");
			
            break;

        default: // Search

          if(toolbar.getInput('dateFromPL').value != ""){ // CHECK TO SEE IF THE DATE FROM IS FILLED (IT MUST HAVE A VALUE IN ORDER TO GET RECORDS) 
				
				var from = toolbar.getInput('dateFromPL').value;
            	var to = toolbar.getInput('dateToPL').value;
            
            
            grid.clearAndLoad("/_apps/trip2/ext/getProcessLogRecords.php?from="+from+"&to="+to);

   
          }else{ // OTHERWISE, THE USER DIDN'T ENTER ANYTHING INTO THE 'FROM' FIELD, THEREFORE, ALERT AN ERROR MESSAGE     
            dhtmlx.alert({
                      type: "alert-error",
                      text: "You must select a date in the From field",
                      title: "Error!",
                      ok: "Ok"
                  });
          }
          break;
      }

	});

},

// ARCHIVED TOOL BAR ON CLICK FUNCTION -----------------------------------------------------------------------------
archivedToolbar_onClick: function(toolbar, grid, dp){
    toolbar.attachEvent("onClick", function(id){

////////////////////////////////////////////////////////////////////////////////////////////////////
// SWITCH ON ID OF TOOLBAR
// 		i.e.
// 			Did the user supply a date range and hit 'Search'? (default)
// 			OR, did the user hit 'All Records'? (case 6)
// 	////////////////////////////////////////////////////////////////////////////////////////////////		
      
      switch(id){

      	case '8': // Exporting Grid to Excel
      	 	grid.toExcel("http://dhtmlxgrid.appspot.com/export/excel");
      		break;

      	case '6': // Getting ALL the Records
			grid.clearAndLoad("/_apps/trip2/ext/getArchivedRecords.php?all=true", function(){

            grid.forEachRow(function(id){

            grid.cells(id, 4).setValue((grid.cells(id, 4).getValue() == 1 ? 'New' : 'Used'));
              		
              });
            });
			toolbar.disableItem(8); // Disable Export to Excel ( We dont want them to export ALL records )
            break;

        case '10': // Save
        	
        	dp.sendData();

        	break;

        default: // Search

          if(toolbar.getInput('dateFrom').value != ""){ // CHECK TO SEE IF THE DATE FROM IS FILLED (IT MUST HAVE A VALUE IN ORDER TO GET RECORDS) 
				var from = toolbar.getInput('dateFrom').value;
            	var to = toolbar.getInput('dateTo').value;
            	toolbar.enableItem(8);
            
            grid.clearAndLoad("/_apps/trip2/ext/getArchivedRecords.php?from="+from+"&to="+to, function(){ // THEN, DO AJAX CALL TO GET RECORDS FROM THE ARCHIVE TABLE

  			grid.forEachRow(function(id){

                grid.cells(id, 4).setValue((grid.cells(id, 4).getValue() == 1 ? 'New' : 'Used'));

              });
            }); 

   
          }else{ // OTHERWISE, THE USER DIDN'T ENTER ANYTHING INTO THE 'FROM' FIELD, THEREFORE, ALERT AN ERROR MESSAGE     
            dhtmlx.alert({
                      type: "alert-error",
                      text: "You must select a date in the From field",
                      title: "Error!",
                      ok: "Ok"
                  });
          }
          break;
      }
    });
  },

suspendDate_onEventAdded: function(cal){
  	cal.attachEvent("onEventAdded", function(id, ev){
  		var events = cal.getEvents(cal.getEvent(id).start_date, cal.getEvent(id).end_date);
// Check if a suspension already exists on that day	
  		if(events.length > 1){
  			dhtmlx.alert({
			    title:"Date Suspension Error",
			    type:"alert-error",
			    text:"A suspension is already scheduled on that day"
			});
  			cal.deleteEvent(id);
  		}else{
// Get dates
	  		var dateArray = [];
	  		var currentDate = ev.start_date;
	  		var dateObj;
	  		while(currentDate <= ev.end_date){
	  			dateObj = new Date(currentDate)
	  			dateArray.push([dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]);
	  			currentDate = currentDate.addDays(1);
	  		}

// Get checkbox value (is repeat)
			var isRepeat = ev.single_checkbox;

	  		window.dhx4.ajax.post("/_apps/trip2/ext/suspendDates.php", "dates="+JSON.stringify(dateArray)+"&isRepeat="+isRepeat, function(r){
				console.log(r.xmlDoc.responseText);		
			});
  		}
  	});
  },

  suspendDate_onEventChanged: function(cal){
  	cal.attachEvent("onDblClick", function(id, e){
  		// Change event (Won't be supported yet. Must wait until table is reconstructed)
  		// Just disable editing
  		return false;
  	});
  },

  cMenu_onClick: function(cal, menu){
	menu.attachEvent("onClick", function(id, zoneId, cas){
		// Delete event
		var event = new Date(cal.getEvent(window.trip2.suspendDateID).start_date);
		var dateArray = [];
	  	dateArray.push([(cal.getEvent(window.trip2.suspendDateID).single_checkbox == "0"? event.getFullYear() : "0000"), event.getMonth() + 1, event.getDate()]);
		console.log(JSON.stringify(dateArray));
		window.dhx4.ajax.post("/_apps/trip2/ext/deleteSuspendDates.php", "date="+JSON.stringify(dateArray), function(r){
			console.log(r.xmlDoc.responseText);	
			cal.deleteEvent(window.trip2.suspendDateID);	
		});
	});
  }

};