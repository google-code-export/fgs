FGS.crimecityFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/crimecitygame/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var src = FGS.findIframeAfterId('#app_content_129547877091100', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					params.click2url = src;
					
					FGS.crimecityFreegifts.Click2(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: params.click2url+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
				
				
					var i1 = dataStr.indexOf('var cc_fbuid = "');
					if(i1 == -1) throw {}
					i1+=16;
					
					var i2 = dataStr.indexOf('"', i1);
					
					params.cc_fbuid = dataStr.slice(i1,i2);
					
					var i1 = dataStr.indexOf('var token = "');
					if(i1 == -1) throw {}
					i1+=13;
					
					var i2 = dataStr.indexOf('"', i1);
					
					params.token = dataStr.slice(i1,i2);					
				
					FGS.crimecityFreegifts.Click3(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "POST",
			url: 'http://prod-cc-app-lb-1877943370.us-east-1.elb.amazonaws.com/crimetown/index.php/gifts/choose/'+addAntiBot,
			data: {gift_id: params.gift, cc_fbuid: params.cc_fbuid, token: params.token},
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var i1,i2, myParms;
					var strTemp = dataStr;
					
					i1 	 	 =	strTemp.indexOf('var api_key = "');
					if (i1 == -1) throw {message:"Cannot find FB.init"}
					i1+=15;
					i2       =  strTemp.indexOf('"',i1);

					myParms  =  'app_key='+strTemp.slice(i1,i2);
					
					i1 	 	 =	strTemp.indexOf('var channel_path = "');
					if (i1 == -1) throw {message:"Cannot find FB.init"}
					i1+=20;
					i2       =  strTemp.indexOf('"',i1);
					
					myParms +=  '&channel_url='+ encodeURIComponent(strTemp.slice(i1,i2));

					i1       =  strTemp.indexOf('<fb:fbml');
					i2       =  strTemp.indexOf('/script>',i1)-1;
					myParms +=  '&fbml='+encodeURIComponent(strTemp.slice(i1,i2));
					
					params.myParms = myParms;
					
					
					FGS.getFBML(params);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
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
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	}
};

FGS.crimecityRequests = 
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
				
				try
				{
					var src = FGS.findIframeAfterId('#app_content_129547877091100', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
					FGS.crimecityRequests.Click2(currentType, id, src);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
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
					if($('.streamRewardAllRewardsClaimed', dataHTML).length > 0)
					{ 
						var error_text = $.trim($('.streamRewardAllRewardsClaimed', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.acceptMafiaMemberBox', dataHTML).length > 0)
					{
						info.image = '';
						info.title = '';
						info.text  = 'New neighbour';
						info.time = Math.round(new Date().getTime() / 1000);
					}
					else
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var i1 = tmpStr.indexOf('?gift_id=');
						if(i1 == -1)
						{
							i1 = tmpStr.indexOf('&gift_id=');
						}
						if(i1 != -1)
						{
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftName = tmpStr.slice(i1+9,i2);
							
							var i1 = tmpStr.indexOf('sender_facebook_id=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftRecipient = tmpStr.slice(i1+19,i2);			
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: "Can't say"
								}
						}
						
						info.thanks = sendInfo;
						
						info.image = $('.acceptGiftGiftBoxImage', dataHTML).children('img').attr('src');
						info.title = '';						
						info.text  = $('.acceptGiftGiftBoxTitle', dataHTML).text();
						info.time = Math.round(new Date().getTime() / 1000);
					}
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};

FGS.crimecityBonuses = 
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
				
				try 
				{
					var src = FGS.findIframeAfterId('#app_content_129547877091100', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
					FGS.crimecityBonuses.Click2(currentType, id, src);
				} 
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
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
					if($('.streamRewardAllRewardsClaimed', dataHTML).length > 0)
					{ 
						var error_text = $.trim($('.streamRewardAllRewardsClaimed', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					
					info.image = $('.streamRewardGiftBoxImage', dataHTML).children('img').attr('src');
					info.title = $('.streamRewardGiftBoxTitle', dataHTML).text();
					info.text  = $('.streamRewardGiftBoxTitle', dataHTML).text();//$.trim($('.streamRewardBoxTitle', dataHTML).text());
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					FGS.endWithSuccess(currentType, id, info);		
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};