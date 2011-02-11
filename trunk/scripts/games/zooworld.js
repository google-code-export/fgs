FGS.zooworldFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/playzoo/zoo/home.php'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var src = FGS.findIframeAfterId('#app_content_167746316127', dataStr);
					if (src == '') throw {message:"no iframe"}
					
					var pos1 = src.indexOf('?');
					src = src.slice(pos1+1);
										
					var postParams = {}
					
					for(var idd in $.unparam(src))
					{
						if(idd.indexOf('fb_') != -1)
						{
							postParams[idd] = $.unparam(src)[idd];
						}
					}
					
					postParams['service'] 	= 'dsplygiftinvite';
					postParams['giftId'] 	= params.gift;
					postParams['appname']	= 'zooparent';
					postParams['appId'] 	= '74';
					//postParams['straightToGift'] = '1';
					
					params.param2 = postParams;
					//http://fbeq.rockyou.com/facebook_apps/zoo/giftInIframe.php?service=dsplygiftinvite&giftId=977&appname=zooparent&appId=74&fb_sig_in_iframe=1&fb_sig_base_domain=rockyou.com&fb_sig_locale=pl_PL&fb_sig_in_new_facebook=1&fb_sig_time=1293477719.0314&fb_sig_added=1&fb_sig_profile_update_time=1291727948&fb_sig_expires=1293483600&fb_sig_user=100001178615702&fb_sig_session_key=2.CXT_hOTef4C_zohaK3MG1w__.3600.1293483600-100001178615702&fb_sig_ss=5ptmukWpwN3GOKXxHq2u8g__&fb_sig_cookie_sig=d7f71a284392c238406d31b01a9a8118&fb_sig_country=pl&fb_sig_api_key=daa4b920374244da1829a0df63cd815f&fb_sig_app_id=167746316127&fb_sig=b174aef00662d0cb251ceae3d091da82

					FGS.zooworldFreegifts.Click2(params);
				
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
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://fbeq.rockyou.com/facebook_apps/zoo/giftInIframe.php'+addAntiBot,
			dataType: 'text',
			data: params.param2,
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/FB[.]Facebook[.]init\("(.*)".*"(.*)"/g).exec(dataStr);
					if(tst == null) throw {message: 'no fb.init'}
					
					var app_key = tst[1];
					var channel_url = tst[2];
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
					var paramsStr = 'app_key='+app_key+'&channel_url='+encodeURIComponent(channel_url)+'&fbml='+encodeURIComponent(fbml);

					params.nextParams = paramsStr;
					
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

FGS.zooworldRequests = 
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
				
				try
				{
					// <h3>Cannot accept gift. // <h3>This promotion is over.
				
					var testStr = $('#app_content_167746316127', dataHTML).find('h1:first').text();
					
					if(testStr.indexOf('You are now ZooMates') != -1)
					{
						info.image = $('.zoomaccept5-box', dataHTML).find('img:first').attr('src');
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
					
					
						info.image = $('.main_body', dataHTML).find('img:first').attr('src');
						info.title = $('.main_body', dataHTML).find('p:first').text();
						info.text  = $('.main_body', dataHTML).find('p:last').text();
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


FGS.zooworldBonuses = 
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
					if($('#app_content_167746316127', dataHTML).length > 0)
					{
						var src = FGS.findIframeAfterId('#app_content_167746316127', dataStr);
					}
					else
					{
						var src = FGS.findIframeAfterId('#app_content_2345673396', dataStr);
					}

					if (src == '') throw {message:"no iframe"}
					FGS.zooworldBonuses.Click2(currentType, id, src);
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
					var pos1 = 0;
					var pos2 = currentURL.lastIndexOf('/')+1;
					var domain = currentURL.slice(pos1,pos2);

					var lastPos = 0;

					var count = dataStr.match(/var serviceObj/g);

					for(var i = 0; i < count.length; i++)
					{
						var ipos1 = dataStr.indexOf('var serviceObj =', lastPos);
						var pos1 = dataStr.indexOf('data:', ipos1);
						if(pos1 == -1) continue;
						pos1+=5;
						var pos2 = dataStr.indexOf('},', pos1)+1;
						lastPos = pos2;
						
						if(dataStr.slice(pos1, pos2).indexOf('zooparent') != -1 || dataStr.slice(pos1, pos2).indexOf('"hugme"') != -1)
						{
							eval('var tempVars = '+dataStr.slice(pos1,pos2));
							break;
						}
					}
					
					if(typeof(tempVars) == 'undefined') throw {message: 'no tempvars zooworld'}
					
					var getStr = '?oauth_consumer_key=facebook.com&oauth_signature=1&vip&version=100';
					
					for(var idd in tempVars)
					{
						if(idd.indexOf('fb_') != -1)
						{
							getStr += '&'+idd+'='+tempVars[idd];
						}
					}
					
					var pos3 = dataStr.indexOf('url: "', pos2);
					pos3+=6;
					var pos4 = dataStr.indexOf('"', pos3);
					
					
					var nextUrl = domain+dataStr.slice(pos3,pos4)+getStr;
					var params = tempVars;
					
					FGS.zooworldBonuses.Click3(currentType, id, nextUrl, params);
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
	
	Click3:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			data: params,
			success: function(dataStr)
			{
				try
				{
					var out = dataStr.return_data.dialogData.subtitle;
					var body = dataStr.return_data.dialogData.bodyText;
					var head = dataStr.return_data.dialogData.header;
					var image = dataStr.return_data.dialogData.image;
					
					if(head == 'HEADER_SORRY_PAL' || head == 'HEADER_UH_OH' || body.indexOf('has been helped already') != -1 || out == 'You cannot claim this drum!')
					{
						if(out.indexOf('<b>') == -1)
						{
							if(out == 'Thank You for Trying!' || out == 'Try Again!' || out == 'You cannot claim this drum!' || $.trim(out) == '')
								var error_text = body;
							else
								var error_text = out;
							
							FGS.endWithError('limit', currentType, id, error_text);
							return;						
						}
						var pos1 = out.indexOf('<b>')+3;
						var pos2 = out.indexOf('b>',pos1)-2;
						out = out.slice(pos1,pos2);
					}
					
					if(body.indexOf('You have adopted the') != -1)
					{
						out = body;
						body = '';
					}
					
					if(body.indexOf('you received a special gift') != -1)
					{
						var temp = out;

						var pos1 = body.indexOf('<b')+3;
						var pos2 = body.indexOf('</',pos1);
						out = body.slice(pos1,pos2);
						
						body = temp;
					}

					if($.trim(out) == '')
					{
						out = body;
					}
					
					if(out.indexOf("Hurray! You've claimed the") != -1)
					{
						var pos1 = out.indexOf("Hurray! You've claimed the ");
						var pos2 = out.indexOf('for', pos1);
						out = out.slice(pos1+27, pos2);
					}
					
					if(out.indexOf('For trying, you received a ') != -1)
					{
						var pos1 = out.indexOf("For trying, you received a ");
						var pos2 = out.indexOf('!', pos1);
						out = out.slice(pos1+27, pos2);
					}
					
					
					if(out.indexOf('You opened the mystery gift box and found a ') != -1)
					{
						var pos1 = out.indexOf("You opened the mystery gift box and found a ");
						var pos2 = out.indexOf('!', pos1);
						out = out.slice(pos1+44, pos2);
					}
					
					if(out.indexOf(' from ') != -1)
					{
						var pos1 = 0;
						var pos2 = out.indexOf(' from ', pos1);
						out = out.slice(pos1, pos2);
					}
					

					out = out.replace('You helped and received a','').replace(' has been added to your inventory.','').replace('You received a', '').replace('You have adopted the','').replace('You got a', '').replace('!','');
					
					info.title = out;
					info.text = body;
					info.image = image;					
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', params, true);
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
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', params, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};