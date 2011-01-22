function readChat(start)
{
	if(bkP.userID == null) return;
	
	if(bkP.options.chatSessions == undefined)
	{
		var newUser = 
		{
			sessID: '',
			lastPrivateID: 0,
			lastPublicID: 0
		};
		
		bkP.options.chatSessions = newUser;
	}
	
	if(start == true)
	{
		bkP.options.chatSessions.lastPrivateID = bkP.options.chatSessions.lastPublicID = 0;
	}

	indicator_switch('on');
	
	
	$.ajax({
		type: "GET",
		url: 'http://rzadki.eu:81/projects/fgs/jsonp/chat.php?callback=?',
		cache: false,
		data: {action: 'read',  userName: bkP.userName, userID: bkP.userID,
					lastPrivateID: bkP.options.chatSessions.lastPrivateID, lastPublicID: bkP.options.chatSessions.lastPublicID, sessionID: bkP.options.chatSessions.sessID},
		dataType: 'jsonp',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				indicator_switch('off');
				return false;
			}
			bkP.options.chatSessions.sessID = data.sessID;
			bkP.options.chatSessions.lastPrivateID = data.lastPrivateID;
			bkP.options.chatSessions.lastPublicID = data.lastPublicID;			
			parseChatData(data, false);
		},
		complete: function()
		{
			indicator_switch('off');
		}
	});
}

function sendChat(msg, isPrivate)
{
	if(msg == '')
		return;
	
	indicator_switch('on');
	
	
	$.ajax({
		type: "POST",
		url: 'http://rzadki.eu:81/projects/fgs/jsonp/chat.php?callback=?',
		cache: false,
		data:  {action: 'send', text: msg, userName: bkP.userName, userID: bkP.userID, private: isPrivate,
					lastPrivateID: bkP.options.chatSessions.lastPrivateID, lastPublicID: bkP.options.chatSessions.lastPublicID, sessionID: bkP.options.chatSessions.sessID},
		dataType: 'jsonp',
		success: function(data)
		{
			if(data == null || data == undefined)
			{
				indicator_switch('off');
				return false;
			}
			bkP.options.chatSessions.sessID = data.sessID;
			bkP.options.chatSessions.lastPrivateID = data.lastPrivateID;
			bkP.options.chatSessions.lastPublicID = data.lastPublicID;	
			parseChatData(data, true);
		},
		complete: function()
		{
			indicator_switch('off');
		}
	});
}