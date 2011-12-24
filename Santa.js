$('body').append('<div id="span0" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/elch.gif"></div><div id="span1" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/elch.gif"></div><div id="span2" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/elch.gif"></div><div id="span3" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/elch.gif"></div><div id="span4" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/elch.gif"></div><div id="span5" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/elch.gif"></div><div id="span6" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/zuegel.gif"></div><div id="span7" style="position:absolute;visibility:hidden;"><img src="http://fgs.googlecode.com/svn/branches/js/santaclaus.gif"></div><div id="span8" style="position:absolute;visibility:hidden;"></div>');

$('body').css('overflow-x', "hidden");

// CREDITS:
// Christmas Cursor Trailer 2
// by Peter Gehrig 
// Copyright (c) 2010 Peter Gehrig. All rights reserved.
// Permission given to use the script provided that this notice remains as is.
// Additional scripts can be found at http://www.fabulant.com

// IMPORTANT: 
// If you add this script to a script-library or script-archive 
// you have to add a link to http://www.fabulant.com on the webpage 
// where this script will be running.

var step=8 
var stepbasic=8
var numberofimages=8
var spacebetweenimgs=32
var x,y
var flag=0
var xpos=new Array()

var ns6=document.getElementById&&!document.all?1:0

for (i=0;i<=8;i++) {
	xpos[i]=-100
}

var ypos=new Array()
for (i=0;i<=numberofimages;i++) {
	ypos[i]=-100
}

function handlerMM(e) {
	x = (document.layers || ns6) ? e.pageX : document.body.scrollLeft+event.clientX
	y = (document.layers || ns6) ? e.pageY : document.body.scrollTop+event.clientY
	flag=1
}

function initiatetracker() {
	if (document.all) {
		for (i=0; i<numberofimages; i++) {
    		var thisspan=eval("span"+(i)+".style")
			thisspan.posLeft=xpos[i]
			thisspan.posTop=ypos[i]
    		thisspan.visibility="visible"
    	}
		makesnake()
	}
    
   if (ns6) {
		for (i=0; i<numberofimages; i++) {
			document.getElementById("span"+i).style.left=xpos[i]
			document.getElementById("span"+i).style.top=ypos[i]
    		document.getElementById("span"+i).style.visibility="visible"
    	}
		makesnake()
	}
	if (document.layers) {
		for (i=0; i<numberofimages; i++) {
    		var thisspan=eval("document.span"+i)
			thisspan.left=xpos[i]
			thisspan.top=ypos[i]
			thisspan.visibility="visible"
		}

    	makesnake()
	}
}

function makesnake() {
	if (flag==1 && document.all) {
    	for (i=numberofimages; i>=1; i--) {
   			xpos[i]=xpos[i-1]+spacebetweenimgs
			ypos[i]=ypos[i-1]
    	}
		xpos[0]=x+stepbasic
		ypos[0]=y
	
		for (i=0; i<numberofimages; i++) {
    		var thisspan = eval("span"+(i)+".style")
    		thisspan.posLeft=xpos[i]
			thisspan.posTop=ypos[i]
    	}
	}
    
    if (flag==1 && ns6) {
    	for (i=numberofimages; i>=1; i--) {
   			xpos[i]=xpos[i-1]+spacebetweenimgs
			ypos[i]=ypos[i-1]
    	}
		xpos[0]=x+stepbasic
		ypos[0]=y
	
		for (i=0; i<numberofimages; i++) {
    		document.getElementById("span"+i).style.left=xpos[i]
			document.getElementById("span"+i).style.top=ypos[i]
    	}
	}
	
	else if (flag==1 && document.layers) {
    	for (i=numberofimages; i>=1; i--) {
   			xpos[i]=xpos[i-1]+spacebetweenimgs
			ypos[i]=ypos[i-1]
    	}
		xpos[0]=x+stepbasic
		ypos[0]=y
	
		for (i=0; i<numberofimages; i++) {
    		var thisspan = eval("document.span"+i)
    		thisspan.left=xpos[i]
			thisspan.top=ypos[i]
    	}
	}
		var timer=setTimeout("makesnake()",30)
}

if (document.layers){
	document.captureEvents(Event.MOUSEMOVE);
}
document.onmousemove=handlerMM;
setTimeout(initiatetracker, 100);