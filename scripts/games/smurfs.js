FGS.smurfs.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/thesmurfsco/?ref=ts'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					params.step1params = params2;
					
					FGS.smurfs.Freegifts.Click2(params);
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
			type: "GET",
			url: 'http://thesmurfsco.ubi.com/facebook/requestSend.php?type=Gift&filter=1&params='+params.gift+'',
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var app_key = '130095157064351';
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var paramsStr = 'app_key='+app_key+'&fbml='+encodeURIComponent(fbml);

					params.nextParams = paramsStr;
					
					FGS.getFBML(params);
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
	}
};

FGS.smurfs.Requests =
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
					var redirectUrl2 = FGS.checkForGoURI(dataStr);
					if(redirectUrl2 != false)
					{
						retryThis(currentType, id, redirectUrl2, true);
						return;
					}
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.smurfs.Requests.Click2(currentType, id, url, params);
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
					var pos1 = dataStr.indexOf("loadPageFrame('http");
					
					if(pos1 == -1)
						throw {}
					
					var pos2 = dataStr.indexOf("')", pos1);
					
					pos1+=15;
					
					var nextUrl = dataStr.slice(pos1,pos2);
					
					FGS.smurfs.Requests.Click3(currentType, id, nextUrl);
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
				var dataHTML = FGS.HTMLParser(dataStr);
				
				
				try
				{
					if(dataStr.indexOf('You can only collect feed rewards from your allies!') != -1)
					{
						var error_text = 'You can only collect feed rewards from your allies!';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}

					
					if(dataStr.indexOf(' are now neighbors.') != -1)
					{
						info.image = $(".request_accept_friendbox:last",dataHTML).children().attr("longdesc");
						info.title = 'New neighbour';
						info.text  = $(".request_accept_name:last",dataHTML).text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
						
					}
					else if($(".request_accept_giftbox",dataHTML).length > 0)
					{
						info.image = $(".request_accept_giftbox",dataHTML).children().attr("longdesc");
						info.title = $.trim($(".request_accept_name:first",dataHTML).text());
						info.text  = $(".request_accept_title:last",dataHTML).text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						for(var gift in FGS.giftsArray['130095157064351'])
						{
							if(FGS.giftsArray['130095157064351'][gift].name == info.title)
							{
								var txtG = $(".request_accept_friendbox",dataHTML).children().attr("longdesc").attr('src');
								
								var pos1 = txtG.indexOf('graph.facebook.com')+19;
								var pos2 = txtG.indexOf('/', pos1);
								
								var giftRecipient = txtG.slice(pos1, pos2);					
								var destName = $.trim($(".request_accept_name:last",dataHTML).text());
								
								info.thanks = 
								{
									gift: gift,
									destInt: giftRecipient,
									destName: destName,
								}
								break;
							}
						}
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else
					{
						throw {message: dataStr}
					}
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


FGS.smurfs.Bonuses = 
{
	Click:	function(currentType, id, currentURL, retry)
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
				var dataHTML = FGS.HTMLParser(dataStr);
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
					var redirectUrl2 = FGS.checkForGoURI(dataStr);
					if(redirectUrl2 != false)
					{
						retryThis(currentType, id, redirectUrl2, true);
						return;
					}
					
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.smurfs.Bonuses.Click2(currentType, id, url, params);
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
					if($('.errorMessage', dataHTML).length > 0)
					{ 
						var error_text = $.trim($('.errorMessage', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('You can only claim rewards from your neighbors') != -1)
					{
						var error_text = 'You can only claim rewards from your neighbors';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('You can only help your neighbors.') != -1)
					{
						var error_text = 'You can only help your neighbors.';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('You have already helped this neighbor') != -1)
					{
						var error_text = 'You have already helped this neighbor';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('You have already claimed this reward') != -1)
					{
						var error_text = 'You have already claimed this reward';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					info.text  = $('#box2', dataHTML).find('.request_accept_title').text();
					info.title = $("#box2",dataHTML).find('.request_accept_name:first').text();
					info.image = $("#box2",dataHTML).find('.request_accept_giftbox').children().attr("longdesc");
					info.time  = Math.round(new Date().getTime() / 1000);
					
					var el = $('.bt_green_big > span', dataHTML);				
					if(el.length > 0)
					{
						//gift ID
						var giftStr = el.parent().attr('onclick').toString();
						var pos0 = giftStr.indexOf("sendGift('")+10;
						var pos1 = giftStr.indexOf("'", pos0);
						var gift = giftStr.slice(pos0, pos1);
						
						//message
						var pos0 = dataStr.indexOf('message: "')+10;
						var pos1 = dataStr.indexOf('"', pos0);
						var message = dataStr.slice(pos0, pos1);
						
						//receiver
						var pos0 = dataStr.indexOf("var receiver = '")+16;
						var pos1 = dataStr.indexOf("'", pos0);
						var receiver = dataStr.slice(pos0, pos1);
						
						// user_id
						var pos0 = dataStr.indexOf("user_id : '", pos0)+11;
						var pos1 = dataStr.indexOf("'", pos0);
						var user_id = dataStr.slice(pos0, pos1);
						
						// feed_id
						var pos0 = dataStr.indexOf("feed_id: '", pos0)+10;
						var pos1 = dataStr.indexOf("'", pos0);
						var feed_id = dataStr.slice(pos0, pos1);
						
						// feed_token
						var pos0 = dataStr.indexOf("feed_token:'", pos0)+12;
						var pos1 = dataStr.indexOf("'", pos0);
						var feed_token = dataStr.slice(pos0, pos1);
						
						// feed_ts
						var pos0 = dataStr.indexOf("feed_ts: '", pos0)+10;
						var pos1 = dataStr.indexOf("'", pos0);
						var feed_ts = dataStr.slice(pos0, pos1);
						
						var params = {};
						params.gameID  = '130095157064351';
						params.channel = 'http://thesmurfsco.ubi.com/channel.html';
						
						params.bonusData = {
							id: id,
							currentType: currentType,
							info: info
						};
						
						params.giftData = {
							action: 'gift',
							user_id: user_id,
							gift_id: gift,
							receiver: receiver,
							feed_id: feed_id,
							feed_token: feed_token,
							feed_ts: feed_ts
						}
						
						params.reqData = {
							message: message,
							data: gift,
							to: receiver
						};
						
						FGS.getAppAccessTokenForSingleItem(params, function(params, d)
						{
							var ids = params.request_ids.join(';');
							
							var url = 'http://thesmurfsco.ubi.com/facebook/feedAction.php';
							
							params.giftData.request_ids = ids;
							
							$.post(url, params.giftData, function(data) {
							});
							
							FGS.endWithSuccess(params.bonusData.currentType, params.bonusData.id, params.bonusData.info);
							
						}, function(params) {
							FGS.endWithError('receiving', params.bonusData.currentType, params.bonusData.id);
						});
						return;
					}

					FGS.endWithSuccess(currentType, id, info);
					
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
	}
};