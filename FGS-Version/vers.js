var port = chrome.extension.connect({name: "FBloginPage"});


port.onMessage.addListener(function(msg)
{
	if(msg.info)
	{
		if(msg.info.length > 0)
		{
			$(msg.id).html('<br /><strong style="font-size: 1.3em">FGS: '+msg.info[0].version+'</strong><br />Browser: '+msg.info[0].browser+ ' ('+msg.uid+')');
		}
	}
});



function check()
{
	var el = $('.gigaboxx_thread_header_authors');
	
	if(el.length > 0 && el.children('div').length == 0)
	{
		try
		{
			var link = $('div.message_pane').find('.GBThreadMessageRow_ReportLink:first').children('a').attr('href');

			var i1 = link.indexOf('rid=');
			var i2 = link.indexOf('&', i1);
			var uid = link.slice(i1+4, i2);
			
			el.append('<div id="fgsVersionInfo"></div>');
			
			port.postMessage({uid: uid, id: '#fgsVersionInfo'});
		}
		catch(e){}
	}
	
	var el = $('.ginormousProfileName');
	
	if(el.length > 0 && el.children('div').length == 0)
	{
		try
		{
			var link = $('.profile-picture').find('.photo:first').attr('src');
			var pos0 = link.lastIndexOf('/');
			
			link = link.slice(pos0+1);
			
			var pos1 = link.indexOf('_');
			var pos2 = link.indexOf('_', pos1+1);
			
			var uid = link.slice(pos1+1, pos2);
			
			el.append('<div id="fgsVersionProfileInfo" style="font-size: 0.5em"></div>');
			
			port.postMessage({uid: uid, id: '#fgsVersionProfileInfo'});
		}
		catch(e){}
	}
}


$('body').bind('DOMNodeInserted', check);