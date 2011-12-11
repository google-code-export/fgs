FGS.ravenwood.MessageCenter = 
{
	Start: function(params, retry) {
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;

		$.ajax({
			type: "GET",
			url: 'https://apps.facebook.com/ravenwoodfair/',
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
					
					FGS.ravenwood.MessageCenter.Click2(params);
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
					var pos1 = dataStr.indexOf("window.location = '");
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=19;
					var pos2 = dataStr.indexOf("'", pos1);
					
					var nextUrl = dataStr.slice(pos1, pos2);
					
					var re = new RegExp('^((?:f|ht)tp(?:s)?\://([^/]+))', 'im');
					params.domain = nextUrl.match(re)[1].toString();
					
					FGS.ravenwood.MessageCenter.Click3(params);
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
			type: "POST",
			url: params.domain+'/app/1/messagecenter?'+params.step1params,
			data: 'cachebuster='+Math.random()+'&is_ajax=true',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var obj = JSON.parse(dataStr);
					
					var giftArr = [];
					
					var dataStr = FGS.processPageletOnFacebook(obj.html);
					dataStr = dataStr.replace(/\sitem_name=\"/g, ' hreflang="').replace(/\sitem_ident=\"/g, ' coords="').replace(/\sto=\"/g, ' target="').replace(/\sids=\"/g, ' datetime="').replace(/\sto=\"/g, ' target="');
					var dataHTML = FGS.HTMLParser(dataStr);					
					
					$('.message', dataHTML).each(function(k,v)
					{
						var data = {};

						if($(this).find('a.btn[hreflang]').length > 0 && $(this).siblings('h3').attr('id') != 'title_neighbor')
						{
							var bTitle = $(this).find('a.btn[hreflang]').attr('hreflang');
						}
						else
						{
							var bTitle = $.trim($(this).find('.description:first').find('span').text());
						}
						
						$(this).find('.description:first').find('span, br').remove();
						
						var newText = $.trim($(this).find('.description:first').text());
						
						data.success = $(this).find('.description.reply:first').text().replace(/\s[0-9]+\s/g, ' 1 ');
						data.thankYou = {};
						
						var id = $(this).find('.btn[datetime]').attr('datetime');
						
						if(typeof id == 'undefined')
							return true;
							
						
						if($(this).find('.icon').length > 0)
						{
							var type = $(this).find('.icon:last').children('img').attr('longdesc');
						}
						else
						{
							var type = 'unknown';
						}
						
						var curTime = Math.round(new Date().getTime() / 1000);
						
						var el = $(this);
						
						$(id.split(',')).each(function(k,v) {
							data.item_id = v;
							
							var stats = [];
							
							if(el.find('a.btn[target]').length > 0)
							{
								var ids = el.find('a.btn[target]').attr('target').split(',');
								
								if(typeof ids[k] != 'undefined')
								{
									data.thankYou = {
										gift: el.find('a.btn[coords]').attr('coords'),
										destInt: ids[k]
									}
									stats.push(ids[k]);
									stats.push(params.gameID);
									stats.push(curTime);					
								}
							}
							
							var dataPost = JSON.stringify(data);
							var gift = [v, params.gameID, bTitle, newText, type, dataPost, curTime, stats];
							giftArr.push(gift);			
						});
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
			url: 'https://apps.facebook.com/ravenwoodfair/',
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
					
					FGS.ravenwood.MessageCenter.Receive2(params);
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
					
					
					var pos1 = dataStr.indexOf("window.location = '");
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=19;
					var pos2 = dataStr.indexOf("'", pos1);
					
					var nextUrl = dataStr.slice(pos1, pos2);
					
					var re = new RegExp('^((?:f|ht)tp(?:s)?\://([^/]+))', 'im');
					params.domain = nextUrl.match(re)[1].toString();
					
					
					if(typeof params.deleteItem != 'undefined')
						params.receive_url = params.domain+'/app/1/apprequest/ignore?'+params.step1params;
					else
						params.receive_url = params.domain+'/app/1/apprequest/accept?'+params.step1params;
					
					params.receive_post = 'request_ids='+params.data.item_id;
					
					FGS.ravenwood.MessageCenter.Receive3(params);
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
			type: "POST",
			url: params.receive_url,
			data: params.receive_post,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					if(typeof params.deleteItem != 'undefined')
						return;
					
					var resp = JSON.parse(dataStr);
					
					if(resp.success == false)
					{
						var error_text = 'Gift already received';
						FGS.endWithError('limit', params.info.type, params.info.id, error_text);					
						return;
					}
					
					if(typeof params.data.thankYou != 'undefined' && typeof params.data.thankYou.destInt != 'undefined')
					{
						var sendInfo = {
							gift: params.data.thankYou.gift,
							destInt: params.data.thankYou.destInt
						}
						info.thanks = sendInfo;	
					}
					
					info.image = '';
					info.title = '';					
					info.text  = params.data.success;
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

FGS.ravenwood.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'https://apps.facebook.com/ravenwoodfair/'+addAntiBot,
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
					
					FGS.ravenwood.Freegifts.Click2(params);
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
					var pos1 = dataStr.indexOf("window.location = '");
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=19;
					var pos2 = dataStr.indexOf("'", pos1);
					
					var nextUrl = dataStr.slice(pos1, pos2);
					
					var re = new RegExp('^((?:f|ht)tp(?:s)?\://([^/]+))', 'im');
					params.domain = nextUrl.match(re)[1].toString();
					
					params.step3url = nextUrl;
					
					FGS.ravenwood.Freegifts.Click3(params);
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
			url: params.step3url+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf("var tagged_friends = [");
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=21;
					var pos2 = dataStr.indexOf("];", pos1)+1;
					
					var frArr = JSON.parse(dataStr.slice(pos1, pos2));
					
					var friends = [];
					var finalArr = [];
					
					for(var i=0; i<frArr.length; i++)
					{
						var fr = frArr[i];
						
						if(fr.tags.indexOf('india') != -1 && fr.tags.indexOf('received_gift') == -1)
						{
							var x = {};							
							x[fr.id] = {'name': fr.name};
							
							finalArr.push(x);
							friends.push(fr.id);
						}
					}
					
					params.items = finalArr;
					
					var giftName = '';
					
					for(var id in FGS.giftsArray[params.gameID])
					{
						if(id == params.gift)
						{
							giftName = FGS.giftsArray[params.gameID][id].name;
							break;
						}
					}
					
					params.giftName = giftName;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						if(frArr.length == 0)
						{
							params.reqData = {
								title: "abc",
								message: "abc"
							}
							params.channel = 'https://fbcanvas.ravenwoodfair.com/';
							FGS.getAppAccessTokenForSending(params, function(){});
						}
						else
						{
							FGS.sendView('updateNeighbors', finalArr, params.gameID);
						}
						return;
					}

					params.step4url = params.domain+'/app/1/apprequest/prepare?'+params.step1params;
					
					params.step4params = 
					{
						props: JSON.stringify({
							message: "Here's __GIFTNAME__ for your City in Ravenwood Fair! Could you help me by sending a gift back?".replace('__GIFTNAME__', giftName),
							data: {
								'requestType': "gift",
								'clickType': "20300",
								'item': {'ident': params.gift, 'name': giftName, "preselectedIds":[]}
							},
							method: 'apprequests',
							to: params.sendTo
						})
					};
					
					/*
					{
							"message":"\n Here's an Autumn Leaf for your City in Ravenskye City! Could you help me by sending a gift back?\n ",							"data":
							{
								"requestType":"gift",
								"clickType":"20300",
								"item":{
									"ident":"AutumnLeaf",
									"img":"https://ravenskye-cdn.6waves.com/img/thumbs/large/materials/AutumnLeaf.png",
									"name":"Autumn Leaf"
								}
							},
							"method":"apprequests",
							"to":["100000221046960"]
					}
					
					*/
					
					var reqData = {};
					if(friends.length > 0)
						reqData.filters = JSON.stringify( [{name: 'Ravenwood Friends', user_ids: friends}] );
					
					params.reqData = reqData;
					params.channel = 'https://fbcanvas.ravenwoodfair.com/';
					
					//params.step3url = nextUrl;
					
					FGS.ravenwood.Freegifts.Click4(params);
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
	
	Click4: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "POST",
			url: params.step4url+addAntiBot,
			data: params.step4params,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var obj = JSON.parse(dataStr);
					if(obj.status != 'ok')
						throw {message: 'some error'}
					
					params.reqData.message = obj.data.props.message;
					params.reqData.data = JSON.stringify(obj.data.props.data);
					
					FGS.getAppAccessTokenForSending(params, function(params, d) {
						
						var pos0 = d.indexOf('&result=')+8;
						var pos1 = d.indexOf('"', pos0);
						
						var str = d.slice(pos0, pos1);
						var data = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc));
						var postUrl = params.domain+'/app/1/apprequest/add_request?'+params.step1params;
						
						var x = JSON.parse(params.step4params.props);
						
						x.data.item.name = params.giftName;
						
						if(typeof FGS.giftsArray[params.gameID][params.gift].image != 'undefined')
							x.data.item.img = FGS.giftsArray[params.gameID][params.gift].image;
							
						$.ajax({
							type: "POST",
							url: postUrl,
							data: {props: JSON.stringify(x)},
							dataType: 'text'
						});
					});
					
					/*
						{
							"status": "ok", 
							"data": 
							{
								"props": 
								{
									"to": ["100000221046960"],
									"message": "\n Here's One Energy for your City in Ravenskye City! Could you help me by sending a gift back?\n ",
									"data": 
									{
										"requestType": "gift", 
										"clickType": "20300", 
										"tv2": "MTAwMDAxNDk5NzEzOTQyLDIwMzAwLDAsMTMyMTEwNDcwOA==", 
										"item": 
										{
											"ident": "OneEnergy"
										}
									},
									"method": "apprequests"
								}
							}
						}

					*/
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