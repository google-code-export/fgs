FGS.cityville.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/cityville/'+addAntiBot,
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
					
					FGS.cityville.Freegifts.Click2(params);
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
			//url: params.step2url+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					var nextUrl = 'http://'+params.domain+'/';			

					dataStr = dataStr.replace(/window\.ZYFrameManager/g, '').replace("ZYFrameManager.navigateTo('invite.php", '');
					
					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf("'", pos1)+1;
						var pos3 = dataStr.indexOf("'", pos2);
						
						var newUrl = dataStr.slice(pos2,pos3);
						
						if(newUrl.indexOf('http:') == 0)
						{
							params.step1url = newUrl;
						}
						else
						{
							params.step1url = nextUrl+newUrl.replace(nextUrl, '');
						}
						
						retryThis(params);
						return;
					}
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash;
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					params.zyParam = FGS.jQuery.param(zyParam);
					
					FGS.cityville.Freegifts.Click3(params);
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
			url: 'http://'+params.domain+'/gifts.php?action=chooseRecipient&view=app&ref=&'+params.zyParam+addAntiBot,
			data: 'giftRecipient=&gift='+params.gift+'&ref=&'+params.zyParam,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1,pos2;
					
					
					var pos1 = dataStr.indexOf('mfs.setDataSet( [');
					
					if(pos1 == -1) throw {message: 'no people'}
					pos1+=16;
					
					var pos2 = dataStr.indexOf(');', pos1);
					
					var sets = JSON.parse(dataStr.slice(pos1, pos2));
					
					var key = 0;
					
					if(typeof sets[1] != 'undefined')
						key = 1;
					
					var finalArr = [];
					
					var friends = [];
					
					var zySendArr = [];
					
					var request_ids = [];
					
					for(var i=0;i<sets[key].items.length;i++)
					{
						var p = sets[key].items[i];
						
						var x = {};
						
						var id = p.pic.replace(/[^0-9]/g, '');
						
						x[id] = {'name': p.value};
						
						friends.push(id);
						
						if(typeof(params.sendTo) != 'undefined' && $.inArray(id, params.sendTo) > -1)
						{
							zySendArr.push(p.key);
							request_ids.push(id);
						}
						
						finalArr.push(x);
					}
					
					var s0 = dataStr.indexOf('mfs.wire(');
					
					var s1 = dataStr.indexOf("body  :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var body = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf("title :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var title = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf("image :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var image = dataStr.slice(s1a, s1b);
					
					var s1a = dataStr.indexOf("senderId=", s0)+9;
					var s1b = dataStr.indexOf('&', s1a);
					
					var sender = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf("eventTypeId :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var event = dataStr.slice(s1a, s1b);

					var s1 = dataStr.indexOf("signature :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var signature = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf(" sendkey :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var sendkey = dataStr.slice(s1a, s1b);
										
					var s1 = dataStr.indexOf("button_href :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var button_href = dataStr.slice(s1a, s1b);
					
					
					var s1 = dataStr.indexOf("button_post :", s0);
					var s1a = dataStr.indexOf('"', s1)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var button_post = dataStr.slice(s1a, s1b);
					
					/*
							
						{
							"gameId":"291549705119",
							"toZid":["20231959805"],
							"type":"gift",
							"data":
							{
								"data":
								{
									"item":"energy_3",
									"reverse":"",
									"ts":1321120709,
									"signature":"d81902111e69cce4f9c76a3a8ddeb3fa",
									"sendkey":"4f3c292f97e2a53792cb7b0f9a7b807a$$ccF(NVS.65kBT_WULNW8T_c!1PEZcy,IXpX6!)U.5eqN4bMmS-18SazCb,3NojjAMxsBIOaM1.ny53fMA0L"
								},
								"image":"https://zynga1-a.akamaihd.net/city/hashed/cf8f7acd2dea77fe2a06a59a39fd2c7a.png",
								"body":"Here is +3 Energy to help you out!",
								"button_href":"http://apps.facebook.com/cityville/giftAccept.php?gift=energy_3&senderId=31116193347&timestamp=1321120709&signature=d81902111e69cce4f9c76a3a8ddeb3fa&sendkey=4f3c292f97e2a53792cb7b0f9a7b807a%24%24ccF%28NVS.65kBT_WULNW8T_c%211PEZcy%2CIXpX6%21%29U.5eqN4bMmS-18SazCb%2C3NojjAMxsBIOaM1.ny53fMA0L",
								"button_post":"http://apps.facebook.com/cityville/giftAccept.php?gift=energy_3&senderId=31116193347&timestamp=1321120709&signature=d81902111e69cce4f9c76a3a8ddeb3fa&sendkey=4f3c292f97e2a53792cb7b0f9a7b807a%24%24ccF%28NVS.65kBT_WULNW8T_c%211PEZcy%2CIXpX6%21%29U.5eqN4bMmS-18SazCb%2C3NojjAMxsBIOaM1.ny53fMA0L",
								"button_text":"Accept Gift",
								"title":"Accept Gift",
								"button_text_short":"button_text_short",
								"key":"d81902111e69cce4f9c76a3a8ddeb3fa",
								"senderID":"31116193347",
								"request_ids":
									{
										"request":256058961109596,
										"to":[100000221046960]
									}
							},
							"eventTypeId":"13002"
						}
					
					*/
					
					params.snapi = {
						js: 1,
						method: 'request.send',
						params: {
							gameId: 291549705119,
							toZid: zySendArr,
							type: 'gift',
							data: {
								data: {
									item: params.gift,
									reverse: "",
									ts: Math.round(new Date().getTime() / 1000),
									signature: signature,
									sendkey: sendkey
								},
								button_post: button_post,
								button_href: button_href,
								button_text: title,
								button_text_short: 'button_text_short',
								title: title,
								body: body,
								key: signature,
								senderID: sender,
								image: image,
								request_ids: {}
							},
							eventTypeId: event
						},
						cmd_id: new Date().getTime(),
						app_id: 75,
						snid: 1,
						authHash: FGS.Gup('zyAuthHash', params.zyParam),
						zid: sender,
					};

					params.request_ids = request_ids;
					
					params.items = finalArr;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', finalArr, params.gameID);
						return;
					}
					
					var reqData = {};
					
					reqData.filters = JSON.stringify( [{name: 'Cityville Friends', user_ids: friends}] );
					reqData.title = title;
					reqData.message = body;
					
					params.reqData = reqData;
					params.channel = 'http://fb-client-0.cityville.zynga.com/';
					
					FGS.getAppAccessTokenForSending(params, FGS.cityville.Freegifts.Click_Snapi);
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
	
	Click_Snapi: function(params, d, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		var pos0 = d.indexOf('&result=')+8;
		var pos1 = d.indexOf('"', pos0);
		
		var str = d.slice(pos0, pos1);
		var data = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc));
		
		params.snapi.params.data.request_ids = data;
		
		params.request_data = params.snapi.params.data.data;
		
		params.snapi.params = JSON.stringify(params.snapi.params);
		
		$.ajax({
			type: "POST",
			url: 'https://fb-client-0.cityville.zynga.com/snapi_proxy.php',
			data: params.snapi,
			dataType: 'json',
			success: function(obj)
			{
				try
				{
					
				/*
								data: {
									item: params.gift,
									reverse: "",
									ts: Math.round(new Date().getTime() / 1000),
									signature: signature,
									sendkey: sendkey
								},
					
				*/
					var arr = [];
					for(var i in obj.body)
					{
						arr.push(i);
					}
				
					var postData = {
						gift: params.gift,
						ts: params.request_data.ts,
						outgoingSendkey: params.request_data.signature,
						error: 'none',
						recipients: arr.join(',')
					}
					
					var postUrl = 'https://fb-client-0.cityville.zynga.com/gifts.php?&action=sentZMFS&'+params.zyParam;
					
					$.post(postUrl, postData);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, d, true);
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
					retryThis(params, d, true);
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


FGS.cityville.Requests =
{
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var info = {}
		
		currentURL = currentURL.replace('fb-0.cityville.zynga.com/', 'apps.facebook.com/cityville/');
		
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
					
					FGS.cityville.Requests.Click2(currentType, id, url, params);
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
					var URL = currentURL;
					
					var pos1 = 0;
					var pos2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(pos1,pos2);
					
					dataStr = dataStr.replace(/window\.ZYFrameManager/g, '').replace("ZYFrameManager.navigateTo('invite.php", '');

					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 == -1) throw {}
					
					var pos2 = dataStr.indexOf("'", pos1)+1;
					var pos3 = dataStr.indexOf("'", pos2);
					
					var newUrl = dataStr.slice(pos2,pos3);
					
					if(newUrl.indexOf('http:') == 0)
					{
					}
					else
					{
						if(newUrl == 'gifts.php')
						{
							FGS.endWithError('not found', currentType, id);
							return;
						}
						else
						{
							newUrl = nextUrl+newUrl.replace(nextUrl, '')+'&overlayed=true&'+new Date().getTime()+'#overlay';
						}
					}

					FGS.cityville.Requests.Click3(currentType, id, newUrl);
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
					if($('.errorMessage', dataHTML).length > 0 || $('.giftLimit', dataHTML).length > 0 || dataStr.indexOf('Always accept requests as soon as possible') != -1 || dataStr.indexOf('You are already neighbors with this person') != -1)
					{
						if($('.errorMessage', dataHTML).length > 0)
						{
							var error_text = $.trim($('.errorMessage', dataHTML).text());
						}
						else if($('.giftLimit', dataHTML).length > 0)
						{
							var error_text = $.trim($('.giftLimit', dataHTML).text());
						}						
						else if(dataStr.indexOf('Always accept requests as soon as possible') != -1)
						{
							var error_text = $.trim($('.message', dataHTML).text());
						}
						else if(dataStr.indexOf('You are already neighbors with this person') != -1)
						{
							var error_text = 'You are already neighbors with this person';
						}
						else
						{						
							var error_text = 'There was problem receiving this gift. You have probably already accepted it';
						}
						
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}

					info.title = $(".giftConfirm_name",dataHTML).children().text();
					info.time = Math.round(new Date().getTime() / 1000);

					if($('h3.gift_title', dataHTML).text().indexOf('are now neighbors') != -1)
					{
						info.image = $(".giftFrom_img",dataHTML).children().attr("longdesc");
						info.title = 'New neighbour';
						info.text  = $(".giftFrom_name",dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
						return;
						
					}
					else if($('.train_message', dataHTML).length > 0)
					{
						info.image = 'http://fb-client-0.cityville.zynga.com/'+$(".train_reward_icon",dataHTML).children().attr("longdesc");
						info.title = 'Coin bonus';
						info.text  = $(".train_message",dataHTML).children().text();
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('.message', dataHTML).text().indexOf('You have adopted') != -1)
					{
						info.image 	= $(".img_container",dataHTML).children().attr("longdesc");
						info.text 	= $(".message",dataHTML).text();
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($('h3.gift_title', dataHTML).text().indexOf('have been made') != -1)
					{
						info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
						
						var tempTitle = $(".giftConfirm_name",dataHTML).children().html();
						var pos1 = tempTitle.indexOf('<br');
						if(pos1 != -1)
						{
							var pos2 = tempTitle.indexOf('>', pos1);
							tempTitle = tempTitle.replace(tempTitle.slice(pos1,pos2+1), ' ');
						}
						info.title = tempTitle;
						info.text  = $('h3.gift_title', dataHTML).text();						
						
						FGS.endWithSuccess(currentType, id, info);
						return;
					}
					else if($(".giftFrom_name",dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var pos1 = tmpStr.indexOf('?gift=');
						if(pos1 == -1)
						{
							pos1 = tmpStr.indexOf('&gift=');
						}
						if(pos1 != -1)
						{
							var pos2 = tmpStr.indexOf('&', pos1+1);
								
							var giftName = tmpStr.slice(pos1+6,pos2);
							
							var pos1 = tmpStr.indexOf('senderId=');
							var pos2 = tmpStr.indexOf('&', pos1+1);
							
							var giftRecipient = tmpStr.slice(pos1+9,pos2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('.giftFrom_name', dataHTML).children().text()
								}
						}
						info.thanks = sendInfo;
						
						info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.text = $(".giftFrom_name",dataHTML).children().text();
						
						info.time = Math.round(new Date().getTime() / 1000);
						
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

FGS.cityville.Bonuses = 
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
					
					FGS.cityville.Requests.Click2(currentType, id, url, params);
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
					var URL = currentURL;
					
					var pos1 = 0;
					var pos2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(pos1,pos2);
					
					dataStr = dataStr.replace(/window\.ZYFrameManager/g, '').replace("ZYFrameManager.navigateTo('invite.php", '');

					var pos1 = dataStr.indexOf("ZYFrameManager.navigateTo('");
					
					if(pos1 == -1) throw {message: 'no zyframe manager'}
					
					var pos2 = dataStr.indexOf("'", pos1)+1;
					var pos3 = dataStr.indexOf("'", pos2);
					
					var newUrl = dataStr.slice(pos2,pos3);
					
					if(newUrl.indexOf('http:') == 0)
					{
					}
					else
					{
						if(newUrl == 'gifts.php')
						{
							FGS.endWithError('not found', currentType, id);
							return;
						}
						else
						{
							newUrl = nextUrl+newUrl.replace(nextUrl, '')+'&overlayed=true&'+new Date().getTime()+'#overlay';
						}
					}
					
					
					FGS.cityville.Bonuses.Click3(currentType, id, newUrl);
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
					if($('.errorMessage', dataHTML).length > 0)
					{ 
						var error_text = $.trim($('.errorMessage', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('The train has already finished its trip') != -1)
					{
						var error_text = 'The train has already finished its trip';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					info.text = $('h3.gift_title', dataHTML).text();
					info.title = $(".giftConfirm_name",dataHTML).children().text();
					info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
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