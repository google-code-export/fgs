FGS.myshops.Freegifts =
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/myshopsgame/free_gifts.php'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
			
				try
				{
					params.nextParams = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize()+'&gift='+params.gift+'&preselected_friend=&send=Proceed';
					params.customUrl = 'http://apps.facebook.com/myshopsgame/free_gifts.php';
					params.overrideMethod = 'POST';
					
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

FGS.myshops.Requests = 
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
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_129547877091100', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.myshops.Requests.Click2(currentType, id, url, params);
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
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if(dataStr.indexOf('this reward is either expired or invalid') != -1)
					{
						var error_text = 'This reward has already been claimed or expired.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('you have already accepted this reward') != -1)
					{
						var error_text = 'You have already accepted this reward.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					info.image 	= $('#giftImage',dataHTML).children('img:first').attr('longdesc');
					info.title 	= $.trim($('#giftText',dataHTML).text());
					info.text  	=  $('#senderText',dataHTML).text();
					info.time 	= Math.round(new Date().getTime() / 1000);
					
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

FGS.myshops.Bonuses = 
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
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_129547877091100', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.myshops.Bonuses.Click2(currentType, id, url, params);
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
			url: currentURL,
			data: params,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if(dataStr.indexOf('this reward is either expired or invalid') != -1)
					{
						var error_text = 'This reward has already been claimed or expired.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('you have already accepted this reward') != -1)
					{
						var error_text = 'You have already accepted this reward.';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					var testStr = $('#content2', dataHTML).children('h1').text();

					var params  = $('#content2', dataHTML).find('form:first').serialize();
					var formUrl = $('#content2', dataHTML).find('form:first').attr('action');
					
					var pos1   = currentURL.lastIndexOf('/')+1;
					var domain = currentURL.slice(0, pos1)+formUrl;
					
					$.post(domain, params);
					
					if(testStr.indexOf('Help out and receive') != -1)
					{
						info.image  = 'gfx/90px-check.png';
						info.title 	= testStr.replace('Help out and receive ','');
						info.text  	=  $('#container',dataHTML).children('h2').text();
						info.time 	= Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if(testStr.indexOf('Would you like to accept this reward') != -1)
					{
						info.image  = $('#rewardImage', dataHTML).children('img:first').attr('longdesc');
						info.title 	= $.trim($('#rewardText', dataHTML).text());
						info.text  	= $('#senderText',dataHTML).text();
						info.time 	= Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else
					{
						throw {message: 'unknown'}
					}
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