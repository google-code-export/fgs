FGS.vampirewars.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/vampiresgame/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					params.step1url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					params.step1params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					FGS.vampirewars.Freegifts.Click2(params);
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
			url: params.step1url,
			data: params.step1params+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf('window.top.location="');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+28);
						params.loginUrl = dataStr.slice(pos1+21, pos2);
						FGS.vampirewars.Freegifts.Login(params);
						return;
					}
					
					var dataStr = FGS.processPageletOnFacebook(dataStr);
					
					var pos0 = dataStr.indexOf('<body');
					var pos1 = dataStr.lastIndexOf('</body');
					
					var pos0a = dataStr.indexOf('>', pos0)+1;
					
					if(pos1 == -1)
					{
						
						dataStr = dataStr.slice(pos0a);
					}
					else
					{
						dataStr = dataStr.slice(pos0a, pos1);
					}
					dataStr = '<div><div>'+dataStr+'</div></div>';
					
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var url = $(dataHTML).find('form#index_redirector').attr('action');
					var paramTmp = $(dataHTML).find('form#index_redirector').serialize();
					
					if(typeof url != 'undefined')
					{
						var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
						params.domain = url.match(re)[1].toString();
						
						params.step3url = 'http://'+params.domain+'/send_gifts_mfs.php';
						params.step3param = 'ajax=1&noredirect=1&giftId='+params.gift+'&mfsID=5&sf_xw_user_id='+FGS.Gup('sf_xw_user_id', paramTmp)+'&sf_xw_sig='+FGS.Gup('sf_xw_sig', paramTmp)+'&xw_client_id=8&skipLink=index2.php&source=normal&'+params.step1params;	
						
						FGS.vampirewars.Freegifts.Click3(params);
						return;
					}
					
					
					throw {message: dataStr}
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
			type: "GET",
			url: params.step3url,
			data: params.step3param,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var app_key = '25287267406';
					var channel_url = 'http://static.ak.fbcdn.net/connect/xd_proxy.php';
					
	
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);
					
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
	},
};

FGS.vampirewars.Requests = 
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
				
				try
				{
					var pos1 = dataStr.indexOf('window.top.location="');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+28);
						var url = dataStr.slice(pos1+21, pos2);
						FGS.vampirewars.Requests.Login(currentType, id, url);
						return;
					}
					throw {message: dataStr}
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
	
	Login:	function(currentType, id, currentURL, retry)
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
				var dataHTML = FGS.HTMLParser(dataStr);
				
				if(typeof(retry) == 'undefined')
				{
					retry = 0;
				}
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined' || retry < 4)
					{
						retryThis(currentType, id, redirectUrl, retry++);
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
					
					FGS.vampirewars.Requests.Click4(currentType, id, url, params);
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
	
	Click4:	function(currentType, id, currentURL, params, retry)
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
					var redirectUrl = FGS.checkForLocationReload(dataStr);
					
					if(redirectUrl != false)
					{
						if(typeof(retry) == 'undefined')
						{
							FGS.vampirewars.Requests.Login(currentType, id, redirectUrl, true);
						}
						else
						{
							FGS.endWithError('receiving', currentType, id);
						}
						return;
					}
					
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+28);
						var url = dataStr.slice(pos1+21, pos2);
						FGS.vampirewars.Requests.Login(currentType, id, url);
						return;
					}
					
					var pos0 = dataStr.indexOf('"content":{"pagelet_canvas_content":');
					
					if(pos0 != -1)
					{
						var dataStr = FGS.processPageletOnFacebook(dataStr);
						var dataHTML = FGS.HTMLParser(dataStr);
						
						var redirectUrl2 = FGS.checkForGoURI(dataStr);
						if(redirectUrl2 != false)
						{
							retryThis(currentType, id, redirectUrl2, params, retry);
							return;
						}
						
						var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
						var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
						
						retryThis(currentType, id, url, params, retry);						
						return;
					}
					
					
					
					
					if($('div.title', dataHTML).text().indexOf('You must accept gifts within') != -1)
					{
						var error_text = $.trim($('div.title', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('div.title', dataHTML).text().indexOf('You have already accepted this gift') != -1)
					{
						var error_text = $.trim($('div.title', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					info.image = $('img:first', dataHTML).attr('longdesc');
					info.title = $('img:first', dataHTML).attr('title');
					info.text = $('div.senderPic', dataHTML).parent().find('p').text();
					
					
					var sendInfo = '';
					
					var tmpStr = unescape(currentURL);
					
					var pos1 = tmpStr.indexOf('&iid=');
					if(pos1 != -1)
					{
						var pos2 = tmpStr.indexOf('&', pos1+1);
							
						var giftName = tmpStr.slice(pos1+5,pos2);
						
						var pos1 = tmpStr.indexOf('senderId=');
						var pos2 = tmpStr.indexOf('&', pos1+1);
						
						var giftRecipient = tmpStr.slice(pos1+9,pos2);						
							
						sendInfo = {
							gift: giftName,
							destInt: giftRecipient,
							destName: $('div.senderPic', dataHTML).parent().find('p').text(),
							}
					}
					info.thanks = sendInfo;
					info.time = Math.round(new Date().getTime() / 1000);					
					
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
	},
};