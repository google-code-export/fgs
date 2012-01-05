FGS.treasure.MessageCenter = 
{
	Start: function(params, retry) {
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;

		$.ajax({
			type: "GET",
			url: 'https://apps.facebook.com/treasureisle/',
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
			
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url) throw {message: 'fail'}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.treasure.MessageCenter.Click2(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
			}
		});
	},
	
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;

		$.ajax({
			type: "POST",
			url: params.step1url,
			data: params.step1params,
			//url: params.step2url+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/<iframe[^>].*src=\s*["](.*treasure\.zynga\.com\/flash.php.*[^"]+)[^>]*\/>/gm).exec(dataStr);
					if(tst != null && !retry)
					{
						params.step1url = $(FGS.HTMLParser('<p class="link" href="'+tst[1]+'">abc</p>')).find('p.link').attr('href');
						retryThis(params, true);						
						return;
					}				
				
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash || zyParam.snapi_auth;
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					params.zyParam = FGS.jQuery.param(zyParam);
					
					params.step1url = 'http://'+params.domain+'/zsc/evt_data.php';
					params.step1params = params.zyParam;
					
					FGS.treasure.MessageCenter.Click3(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
			}
		});
	},
	
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;

		$.ajax({
			type: "GET",
			url: params.step1url,
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var obj = JSON.parse(dataStr);
					var giftArr = [];
					
					for(var id in obj)
					{
						var item = obj[id];
						
						var uid = item.metadata.sender.replace('1:', '');
						
						if(typeof uid == 'undefined')
							uid = 0;
							
						if(item.metadata.subtype == '_subtype' || item.metadata.subtype == '')
						{
							var bTitle = item.metadata.type_text;
						}
						else
						{
							var bTitle = item.metadata.subtype;
						}
						
						var curTime = item.metadata.timestamp;
						var newText = item.data[0].body;
						
						if(typeof item.data[0].image == 'undefined' || item.data[0].image == '')
						{
							if(uid != 0)
							{
								var type = 'https://graph.facebook.com/'+uid+'/picture';
							}
							else
							{
								var type = 'unknown';
							}
						}
						else
						{
							var type = item.data[0].image;
						}
						
						obj[id].item_id = id;
						
						var dataPost = JSON.stringify(obj[id]);	
						var stats = [uid, params.gameID, curTime];
						
						var gift = [id, params.gameID, bTitle, newText, type, dataPost, curTime, stats];
						
						
						giftArr.push(gift);
					}
					
					giftArr.sort(function(a,b) {
						if(a[6] < b[6])
							return 1;
						return -1;
					});
					
					if(giftArr.length > 0)
					{
						FGS.database.addRequest(giftArr);
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
			}
		});
	},
	
	Receive: function(params, retry) {
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: 'https://apps.facebook.com/treasureisle/',
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
			
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url) throw {message: 'fail'}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.treasure.MessageCenter.Receive2(params);
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
						FGS.endWithError('receiving', params.info.type, params.info.id);
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
					FGS.endWithError('connection', params.info.type, params.info.id);
				}
			}
		});
	},
	
	Receive2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;

		$.ajax({
			type: "POST",
			url: params.step1url,
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var tst = new RegExp(/<iframe[^>].*src=\s*["](.*treasure\.zynga\.com\/flash.php.*[^"]+)[^>]*\/>/gm).exec(dataStr);
					if(tst != null && !retry)
					{
						params.step1url = $(FGS.HTMLParser('<p class="link" href="'+tst[1]+'">abc</p>')).find('p.link').attr('href');
						retryThis(params, true);						
						return;
					}
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					var nextUrl = 'https://'+params.domain+'/';				
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash;
					
					params.zyParam = FGS.jQuery.param(zyParam);
					
					if(typeof params.deleteItem != 'undefined')
						params.receive_url = params.data.data[0].ignore_post+'&'+params.zyParam+'&eventIds[]='+params.data.item_id+'&all=all&zy_ctoken=null';
					else
						params.receive_url = params.data.data[0].button_post+'&'+params.zyParam+'&eventIds[]='+params.data.item_id+'&all=all&zy_ctoken=null';
					
					FGS.treasure.MessageCenter.Receive3(params);
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
						FGS.endWithError('receiving', params.info.type, params.info.id);
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
					FGS.endWithError('connection', params.info.type, params.info.id);
				}
			}
		});
	},
	
	Receive3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {};
		
		$.ajax({
			type: "GET",
			url: params.receive_url,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					if(typeof params.deleteItem != 'undefined')
						return;
						
					var obj = JSON.parse(dataStr);
					
					var resp = obj[0];
					
					if(resp.success == false)
					{
						var error_text = 'Gift already received';
						FGS.endWithError('limit', params.info.type, params.info.id, error_text);					
						return;
					}
					
					console.log(resp);
					
					if(typeof resp.giftBack != 'undefined' && typeof resp.from_uid != 'undefined')
					{
						var sendInfo = {
							gift: resp.giftBack.contentID,
							destInt: resp.from_uid
						}
						info.thanks = sendInfo;	
					}
					
					if(typeof resp.giftIcon != 'undefined')
						info.image = resp.giftIcon;
					else
						info.image = '';
					
					info.title = '';					
					info.text  = resp.message;
					info.time = Math.round(new Date().getTime() / 1000);
					FGS.endWithSuccess(params.info.type, params.info.id, info);
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
						FGS.endWithError('receiving', params.info.type, params.info.id);
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
					FGS.endWithError('connection', params.info.type, params.info.id);
				}
			}
		});
	}
};

FGS.treasure.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/treasureisle/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url) throw {message: 'fail'}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.treasure.Freegifts.Click2(params);
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
			url: params.step1url+addAntiBot,
			data: params.step1params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					
					var tst = new RegExp(/<iframe[^>].*src=\s*["](.*treasure\.zynga\.com\/flash.php.*[^"]+)[^>]*\/>/gm).exec(dataStr);
					if(tst != null && !retry)
					{
						params.step1url = $(FGS.HTMLParser('<p class="link" href="'+tst[1]+'">abc</p>')).find('p.link').attr('href');
						retryThis(params, true);						
						return;
					}
					
					
					var pos1 = dataStr.indexOf('new ZY({');
					if (pos1 == -1) throw {message:'no zyparams'}
					pos1 += 7;
					pos2 = dataStr.indexOf('"},', pos1)+2;
					var dataParam	= dataStr.slice(pos1,pos2);				
					
					var dataStrTmp = JSON.parse(dataParam);
					
					params.zyParam = $.param(dataStrTmp);

					FGS.treasure.Freegifts.Click3(params);
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
			url: 'http://'+params.domain+'/gifts_send.php?overlayed=1&refMsg=tab&gift='+params.gift+'&'+unescape(params.zyParam)+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var app_key = '234860566661';
					var channel_url = 'http://zc-prod.treasure.zynga.com/FBProxy.php';
					
					var tst = new RegExp(/(<fb:fbml[^>]*?[\s\S]*?<\/fb:fbml>)/m).exec(dataStr);
					if(tst == null) throw {message:'no fbml tag'}
					var fbml = tst[1];
					
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
	}
};

FGS.treasure.Requests = 
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
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_266989143414', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.treasure.Requests.Click2(currentType, id, url, params);
					/*
					*/
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
				var dataHTML = FGS.HTMLParser(dataStr);
				
				var pos1 = dataStr.indexOf('top.location.href = "');
				if(pos1 != -1)
				{
					var pos2 = dataStr.indexOf('"', pos1+21);
					var url = dataStr.slice(pos1+21, pos2);
					
					FGS.treasure.Requests.Click(currentType, id, url);
					return;
				}
				
				var pos1 = dataStr.indexOf("top.location.href='");
				if(pos1 != -1 && dataStr.slice(pos1-1,pos1) != '"')
				{
					var pos2 = dataStr.indexOf("'", pos1+19);
					var url = dataStr.slice(pos1+19, pos2);
					
					FGS.treasure.Requests.Click(currentType, id, url);
					return;
				}
				
				try
				{
					var redirectUrl2 = FGS.checkForGoURI(dataStr);
					if(redirectUrl2 != false)
					{
						retryThis(currentType, id, redirectUrl2, params, true);
						return;
					}
					
					if(dataStr.indexOf('<h1>Oh no!</h1>') != -1)
					{
						var error_text = $('h2', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length == 0)
					{
						if(dataStr.indexOf('Great! You helped the ') != -1 || dataStr.indexOf('Thanks for helping out!') != -1)
						{
							info.image = $(".giftFrom_img",dataHTML).children().attr("longdesc");
							info.title = '';
							info.text = $('h2', dataHTML).text();
							info.time = Math.round(new Date().getTime() / 1000);
						}
						else if(dataStr.indexOf('You helped train the Dragon') != -1)
						{
							info.image = $(".giftFrom_img",dataHTML).children().attr("longdesc");
							info.title = 'Train the Dragon';
							info.text  = 'You helped train the Dragon!';
							info.time = Math.round(new Date().getTime() / 1000);
						}
						else
						{
							info.image = '';
							info.title = 'New neighbour';
							info.text  = '';
							info.time = Math.round(new Date().getTime() / 1000);
						}
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);					
						var pos1 = tmpStr.indexOf('&gift=');
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
								
							var giftName = tmpStr.slice(pos1+6,pos2);
							
							var pos1 = tmpStr.indexOf('&senderId=1:');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+12,pos2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $(".giftFrom_img",dataHTML).siblings('p').text(),
								}
						}
						info.thanks = sendInfo;
						
						info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
						info.title = $(".giftConfirm_img",dataHTML).siblings('p').text();
						info.text  = $(".giftFrom_img",dataHTML).siblings('p').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if(dataStr.indexOf("explorer's pack?") != -1)
					{
						var URL = unescape($('.acceptButtons', dataHTML).children('a:first').attr('href'));
						
						FGS.treasure.Requests.Click3(currentType, id, URL, params);
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
	
	Click3: function(currentType, id, currentURL, params, retry)
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
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length > 0)
					{
						info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
						info.title = $(".giftConfirm_img",dataHTML).siblings('p').text();
						info.text  = $(".giftFrom_img",dataHTML).siblings('p').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
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
						retryThis(currentType, id, currentURL, params,  true);
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
					retryThis(currentType, id, currentURL, params,  true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	}
};


FGS.treasure.Bonuses = 
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
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_266989143414', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.treasure.Bonuses.Click1(currentType, id, url, params);
					/*
					*/
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
	
	Click1:	function(currentType, id, currentURL, params, retry)
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
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+21);
						var url = dataStr.slice(pos1+21, pos2);
						
						FGS.treasure.Bonuses.Click(currentType, id, url);
						return;
					}
					
					var pos1 = dataStr.indexOf("top.location.href='");
					if(pos1 != -1 && dataStr.slice(pos1-1,pos1) != '"')
					{
						var pos2 = dataStr.indexOf("'", pos1+19);
						var url = dataStr.slice(pos1+19, pos2);
						
						FGS.treasure.Bonuses.Click(currentType, id, url);
						return;
					}
					
					
					if(dataStr.indexOf('<h1>Oh no!</h1>') != -1)
					{
						var error_text = $('h2', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					var URL = $('.acceptButtons', dataHTML).children('a:first').attr('href');
					if(typeof(URL) == 'undefined') throw {message: 'no url'}
					var URL = unescape(URL);
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					var domain = currentURL.match(re)[1].toString();
					
					URL = URL.replace('apps.facebook.com/treasureisle', domain);
					
					FGS.treasure.Bonuses.Click2(currentType, id, URL, params);
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
	
	Click2:	function(currentType, id, currentURL, params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "POST",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if(dataStr.indexOf('<h1>Oh no!</h1>') != -1)
					{
						var error_text = $('h2', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if($(".giftConfirm_img",dataHTML).siblings('p').length != 0)
					{
						info.title = $(".giftConfirm_img",dataHTML).siblings('p').text();
					}
					else
					{
						info.title = 'Celebration';
					}
					info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
					info.text = '';
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
	}
};