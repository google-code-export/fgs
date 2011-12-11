FGS.zombielane.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/zombielane/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var paramTmp = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					params.click2params = paramTmp;
					params.click2url = url;
					
					if(!url)
					{
						throw {}
					}
					
					FGS.zombielane.Freegifts.Click2(params);
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
			url: params.click2url+addAntiBot,
			data: params.click2params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.click2url.match(re)[1].toString();
					
					
					var pos0 = dataStr.indexOf('var flashVars');
					if(pos0 == -1) throw {message: 'no flashvars'}

					var pos1 = dataStr.indexOf('uid:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars_uid'}
					var pos1 = pos1+5;
					var pos1b = dataStr.indexOf(',', pos1+1);
					var uid = dataStr.slice(pos1, pos1b).replace('"', '').replace('"', '');
					
					var pos1 = dataStr.indexOf('href="gifts?');
					if(pos1 == -1) throw {message: 'no flashvars_crm'}
					var pos1b = dataStr.indexOf('"', pos1+12);
					
					params.click2param = dataStr.slice(pos1+12, pos1b);
					
					
					

					
					var pos1 = dataStr.indexOf('sessionKey');
					if(pos1 == -1) throw {message: 'no flashvars_crm'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var sig = dataStr.slice(pos1+1, pos1b);
					
					
					
					params.click3param = 'gid='+params.gift+'&uid='+uid+'&sender='+uid+'&sig='+sig+'&ref=&product_detail=Default&platform=2&src=vir_sendgift_'+params.gift;

					FGS.zombielane.Freegifts.Click2a(params);
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

	
	Click2a: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://'+params.domain+'/dead/gifts',
			data: params.click2param,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf("commonApi.launchGiftPage('")+26;
					pos1 = dataStr.indexOf("'", pos1)+1;
					pos1 = dataStr.indexOf("'", pos1)+1;
					var pos2 = dataStr.indexOf("'", pos1);
					
					var utid = dataStr.slice(pos1, pos2);
					params.utid = utid;	
					params.click3param += '&utid='+utid;
					
					FGS.zombielane.Freegifts.Click3(params);					
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
			url: 'http://'+params.domain+'/dead/send_gift',
			data: params.click3param,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var app_key = '169557846404284';
					var channel_url = 'http://zlane.digitalchocolate.com/dead/channel.jsp';
					
					var reqData = {};
					
					
					var pos0 = dataStr.indexOf('openSendRequestDialog(');
					if(pos0 == -1) throw {}
					pos0+=22;
					
					var pos1 = dataStr.indexOf('},', pos0);
					
					eval("var reqData = " + dataStr.slice(pos0, pos1+1));
					
					

					var pos2a = dataStr.indexOf('"', pos1)+1;
					var pos2b = dataStr.indexOf('"', pos2a);
					
					var pos3a = dataStr.indexOf('"', pos2b+1)+1;
					var pos3b = dataStr.indexOf('"', pos3a+1);
					
					reqData.data = reqData.type+','+dataStr.slice(pos2a,pos2b)+','+dataStr.slice(pos3a,pos3b);
					
					params.reqData = reqData;
					
					FGS.zombielane.Freegifts.ClickRequest(params);
					
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
		
		params.channel = 'http://zlane.digitalchocolate.com/dead/channel.jsp';
		
		FGS.getAppAccessTokenForSending(params, function(params, d){
		
			/*
			
<script type="text/javascript">
parent.postMessage("cb=f1&origin=http\u00253A\u00252F\u00252Fzlane.digitalchocolate.com\u00252Fdead\u00252Fchannel.jsp\u00252Ff2cc&relation=parent&transport=postmessage&frame=f1&result=\u00257B\u002522request\u002522\u00253A131481013626176\u00252C\u002522to\u002522\u00253A[100000854367347\u00252C100001223903960]\u00257D", "http:\/\/zlane.digitalchocolate.com\/dead\/channel.jsp\/f2cc");
</script>

*/
			
			
			var pos0 = d.indexOf('&result=')+8;
			var pos1 = d.indexOf('"', pos0);
			
			var str = d.slice(pos0, pos1);
			console.log(str);
			
			var arr = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc));
			
			
			var str = arr.to.join(',');
			$.get('https://zlane.digitalchocolate.com/dead/GiftSentCallback?platform=2&gid='+params.gift+'&sender='+FGS.userID+'&request='+arr.request+'&ids%5B%5D='+str+'&src=vir_sendgift_'+params.gift+'&utid='+params.utid+'&_='+new Date().getTime());
		
		//MysteryGift&sender=100001178615702&request=255165131182409&ids%5B%5D=100000485017010,100000225088753&src=vir_sendgift_MysteryGift&utid=5704453872730460&_=1320435183044
		//https://zlane.digitalchocolate.com/dead/GiftSentCallback?gid=EnergyCola&sender=100001178615702&request=160271497402562&ids%5B%5D=100001301082495&src=vir_sendgift_EnergyCola&utid=5704332722840356&_=1320434987834
		
		//https://zlane.digitalchocolate.com/dead/GiftSentCallback?gid=Shotgun&request=213976455338056&ids[]=100000854367347,100001223903960&src=vir_sendgift_Shotgun&utid=7120836659399149
		
		});
	},
};


FGS.zombielane.Requests = 
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
						var paramTmp = FGS.findIframeAfterId('#app_content_169557846404284', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.zombielane.Requests.Click2(currentType, id, url, params);
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
	
	
	Click2: function(currentType, id, currentURL, params, retry)
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
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);

					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'This has expired or have been already claimed!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					if(dataStr.indexOf('You Just Accepted a New Neighbor') != -1)
					{
						
						var pos1 = dataStr.indexOf('Text_Description:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						
						var from = 'New neighbor';
						
						var pos1 = dataStr.indexOf('Item_1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					else
					{
						var pos1 = dataStr.indexOf('Text_Description:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var title = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('Text_Description_2:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var from = dataStr.slice(pos1+1, pos1b);
						
						var pos1 = dataStr.indexOf('Item_1:', pos0);
						if(pos1 == -1) throw {message: 'no flashvars'}
						var pos1 = dataStr.indexOf('"', pos1);
						var pos1b = dataStr.indexOf('"', pos1+1);
						var image = dataStr.slice(pos1+1, pos1b);
					}
					
					info.title = title;						
					info.image = image;
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = from;
						
						
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

FGS.zombielane.Bonuses = 
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
				
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
					
				try 
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_169557846404284', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.zombielane.Bonuses.Click2(currentType, id, url, params);
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
	
	Click2: function(currentType, id, currentURL, params, retry)
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
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if(dataStr.indexOf('Stream reward already collected') != -1)
					{
						var error_text = 'Stream reward already collected!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(dataStr.indexOf('Oops! Something went wrong...') != -1)
					{
						var error_text = 'Stream post has been expired!';
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					var pos0 = dataStr.indexOf('var flashvars');
					if(pos0 == -1) throw {message: 'no flashvars'}
					
					var pos1 = dataStr.indexOf('Text_Title:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var title = dataStr.slice(pos1+1, pos1b);
					
					var pos1 = dataStr.indexOf('Text_Description:', pos0);
					if(pos1 == -1) throw {message: 'no flashvars'}
					var pos1 = dataStr.indexOf('"', pos1);
					var pos1b = dataStr.indexOf('"', pos1+1);
					var text = dataStr.slice(pos1+1, pos1b);
					
					info.title = title;						
					info.image = 'gfx/90px-check.png';
					info.time  = Math.round(new Date().getTime() / 1000);
					info.text  = text;
						
						
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