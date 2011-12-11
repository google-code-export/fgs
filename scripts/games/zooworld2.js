FGS.zooworld2.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		if(!params.zooAppId	)
		{
			params.zooAppname = 'zooparent';
			params.zooAppId	  = '74';
			params.checkID = '167746316127';
			params.gameName = 'playzoo';
		}

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/playzoo/zoo/landingZoo2.php'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{

				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
					
				try
				{
					params.click2param = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();

					FGS.zooworld2.Freegifts.Click2(params);
				
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: 'http://zoo2-dev.rockyou.com/facebook_apps/zoo2/classes/Gifts/Zoo2GiftService.php',
			dataType: 'text',
			data: params.click2param+'&selectedGiftId='+params.gift,
			success: function(dataStr)
			{
				try
				{
					var x = $.unparam(params.click2param);
					
					var name = FGS.userName
					
					var obj =
					{
						method: 'mg.gift.getGiftData',
						giftId: params.gift,
						signed_request: x.signed_request,
						userid: FGS.userID,
						appid: 86,
						username: FGS.userName,
						giftType: 'sendGift'
					};
				
					params.click3param = obj;

					FGS.zooworld2.Freegifts.Click3(params);
					
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: "http://zoo2-dev.rockyou.com/services/rest/",
			dataType: 'text',
			data: params.click3param,
			success: function(dataStr)
			{
				try
				{
					var obj = JSON.parse(dataStr);
					
					params.reqData = {
						message: obj.data.giftText,
						frictionless: false,
						data: JSON.stringify({
							giftId : obj.data.giftId,
							giftKey : obj.data.giftKey,
							giftSentMsg : obj.data.giftSentMsg,  
							trackingTag: "fb-zoo2-invite2-giftPage-dashboard-click"
						})
					}
					
					if(typeof obj.data.exclude != 'undefined' && obj.data.exclude != '')
					{
						params.excludeUsers = obj.data.exclude.split(',');
					}
					
					FGS.zooworld2.Freegifts.ClickRequest(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('updateNeighbors', false, params.gameID);
						}
						else
						{
							FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', false, params.gameID);
					}
					else
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	ClickRequest: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		params.channel = 'https://zoo2-dev.rockyou.com';
		
		FGS.getAppAccessTokenForSending(params, function(params, d){
		
			var pos0 = d.indexOf('&result=')+8;
			var pos1 = d.indexOf('"', pos0);
			
			var str = d.slice(pos0, pos1);
			
			var arr = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc));
			
			var arr2 = [];
			
			for(var i=0; i < arr.request_ids.length; i++)
			{
				arr2.push({request_id: arr.request_ids[i], friend_id: params.sendTo[i]});
			}
			
			var obj = {
				method: 'mg.gift.sendGifts',
				signed_request: params.click3param.signed_request,
				userid: FGS.userID,
				appid: 86,
				requests: JSON.stringify(arr2),
				giftid: params.gift
			}
			
			/*
			
			signed_request	m2vNIXtySHuN8fmS0wjLOLt40dL7B9X7xjC2lw5_jjM.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImV4cGlyZXMiOjAsImlzc3VlZF9hdCI6MTMyMzYwNzI0OSwib2F1dGhfdG9rZW4iOiJBQUFBQUp3NTFwMThCQU1GNTZvNU1XV1RFa1pCaDlVbEUzRkR1dWZRZzBTNGxpYmVESG54V2RXT0dsWEkwZUJTSFlMMXZBZ1pDYXhaQ2RiYndBakc1T2M3QjFaQVczNEJhalpDSFpCNWxlOExnWkRaRCIsInVzZXIiOnsiY291bnRyeSI6InBsIiwibG9jYWxlIjoiZW5fVVMiLCJhZ2UiOnsibWluIjoxOCwibWF4IjoyMH19LCJ1c2VyX2lkIjoiMTAwMDAxNDk5NzEzOTQyIn0
			userid	100001499713942
			appid	86
			requests	[{"request_id":"2858637868909","friend_id":"1348518822"},{"request_id":"260047217382360","friend_id":"100001312504636"}]
			giftid	297
			*/
			
			//
			$.post('https://zoo2-dev.rockyou.com/services/rest/', obj);		
		});
	},
};

FGS.zooworld2.Requests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(FGS.checkForNotFound(redirectUrl) === true)
					{
						FGS.endWithError('not found', currentType, id);
					}
					else if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if(dataStr.indexOf('<h3>Cannot accept gift.') != -1)
					{
						var error_text = 'This gift is too old.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					if(dataStr.indexOf('<h3>This promotion is over.') != -1)
					{
						var error_text = 'This promotion is over.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}					
					
					if($('#app_content_2405948328', dataHTML).length > 0)
					{
						var testStr = $('#app_content_2405948328', dataHTML).find('h1:first').text();
					}
					else if($('#app_content_2345673396', dataHTML).length > 0)
					{
						var testStr = $('#app_content_2345673396', dataHTML).find('h1:first').text();
					}
					else if($('#app_content_2339854854', dataHTML).length > 0)
					{
						var testStr = $('#app_content_2339854854', dataHTML).find('h1:first').text();
					}
					else if($('#app_content_14852940614', dataHTML).length > 0)
					{
						var testStr = $('#app_content_14852940614', dataHTML).find('h1:first').text();
					}
					else
					{
						var testStr = $('#app_content_167746316127', dataHTML).find('h1:first').text();
					}
					
					if(testStr.indexOf('You are now ZooMates') != -1)
					{
						info.image = $('.zoomaccept5-box', dataHTML).find('img:first').attr('longdesc');
						info.title = 'New neighbour';
						info.text  = $('.zoomaccept5-box', dataHTML).find('img:first').attr('title');
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
					
						var sendInfo = '';
						
						
						var tmpStr = unescape(currentURL);
						
						var pos1 = tmpStr.indexOf('?itemId=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&itemId=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftName = tmpStr.slice(pos1+8,pos2);
							
							var pos1 = tmpStr.indexOf('&giftSenderId=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+14,pos2);			
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('img[uid]', dataHTML).attr('title')
								}
						}
						
						var pos1 = tmpStr.indexOf('?giftId=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&giftId=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftName = tmpStr.slice(pos1+8,pos2);
							
							var pos1 = tmpStr.indexOf('&senderId=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+10,pos2);			
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('img[uid]', dataHTML).attr('title')
								}
						}
						
						info.thanks = sendInfo;				
					
					
						info.image = $('.main_body', dataHTML).find('img:first').attr('longdesc');
						info.title = $('.main_body', dataHTML).find('p:first').text();
						info.text  = $('.main_body', dataHTML).find('p:last').text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};


FGS.zooworld2.Bonuses = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						if($('#app_content_167746316127', dataHTML).length > 0)
						{
							var src = FGS.findIframeAfterId('#app_content_167746316127', dataStr);
						}
						else
						{
							throw {message: 'not zoo?'}
						}
						url = src;
					}

					if (url == '') throw {message:"no iframe"}
					
					FGS.zooworld2.Bonuses.Click2(currentType, id, url, params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			data: params,
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var pos1 = 0;
					var pos2 = currentURL.lastIndexOf('/')+1;
					var domain = currentURL.slice(pos1,pos2);
					
					var i0 = dataStr.indexOf('feedLanding_iframe.php');
					if(i0 == -1) throw {}
					var i1 = dataStr.indexOf('"', i0);
					
					
					var nextUrl = domain+dataStr.slice(i0,i1);
					
					FGS.zooworld2.Bonuses.Click3(currentType, id, nextUrl);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click3:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('All of the bonuses from this post have been claimed.') != -1)
					{
						var error_text = 'All of the bonuses from this post have been claimed.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Oops, there was a problem with this reward.') != -1)
					{
						var error_text = 'Oops, there was a problem with this reward.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					var el = $('#zw2_feed_landing_content', dataHTML);
					
					info.title = $.trim(el.children('li:first').text());
					info.text = $('#zw2_feed_landing_unsuccessful', dataHTML).text();
					info.image = $('#zw2_feed_landing_item_image', dataHTML).attr('longdesc');					
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};