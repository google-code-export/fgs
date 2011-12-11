FGS.adventureworld.MessageCenter = 
{
	Start: function(params, retry) {
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;

		$.ajax({
			type: "GET",
			url: 'https://apps.facebook.com/playadventureworld/',
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
					
					FGS.adventureworld.MessageCenter.Click2(params);
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
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					var nextUrl = 'https://'+params.domain+'/';
					
					var pos1 = dataStr.indexOf('var g_friendData = [');
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=19;
					
					var pos2 = dataStr.indexOf('];', pos1)+1;
					
					var friends = JSON.parse(dataStr.slice(pos1,pos2));
					var zids = {};
					
					for(var i=0;i<friends.length;i++)
					{
						var f = friends[i];
						var uid = f.pic.replace(/[^0-9]/g, '');
						var zid = f.zid;
						
						zids[zid] = uid;
					}
					
					params.zyFriends = zids;
					
					var nextUrl = 'https://'+params.domain+'/';
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash;
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					params.zyParam = FGS.jQuery.param(zyParam);
					
					params.step1url = 'http://'+params.domain+'/zsc/evt_data.php';
					params.step1params = params.zyParam;
					
					FGS.adventureworld.MessageCenter.Click3(params);
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
						
						var uid = params.zyFriends[item.metadata.sender];
						
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
			url: 'https://apps.facebook.com/playadventureworld/',
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
					
					FGS.adventureworld.MessageCenter.Receive2(params);
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
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					
					var nextUrl = 'https://'+params.domain+'/';
					
					var pos1 = dataStr.indexOf('var g_friendData = [');
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=19;
					
					var pos2 = dataStr.indexOf('];', pos1)+1;
					
					var friends = JSON.parse(dataStr.slice(pos1,pos2));
					var zids = {};
					
					for(var i=0;i<friends.length;i++)
					{
						var f = friends[i];
						var uid = f.pic.replace(/[^0-9]/g, '');
						var zid = f.zid;
						
						zids[zid] = uid;
					}
					
					params.zyFriends = zids;					
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash;
					
					params.zyParam = FGS.jQuery.param(zyParam);
					
					if(typeof params.deleteItem != 'undefined')
						if(params.data.data[0].ignore_post.indexOf('http') == 0)
						{
							params.receive_url = params.data.data[0].ignore_post+'?'+params.zyParam+'&eventIds[]='+params.data.item_id+'&all=all&action=ignore&zy_ctoken=null&eventTypeId='+params.data.metadata.type_id;
						}
						else
						{
							params.receive_url = 'http://'+params.domain+'/'+params.data.data[0].ignore_post+'?'+params.zyParam+'&eventIds[]='+params.data.item_id+'&all=all&action=ignore&zy_ctoken=null&eventTypeId='+params.data.metadata.type_id;
						}
					else
						if(params.data.data[0].button_post.indexOf('http') == 0)
						{
							params.receive_url = params.data.data[0].button_post+'?'+params.zyParam+'&eventIds[]='+params.data.item_id+'&action=accept&all=all&zy_ctoken=null&eventTypeId='+params.data.metadata.type_id;
						}
						else
						{
							params.receive_url = 'http://'+params.domain+'/'+params.data.data[0].button_post+'?'+params.zyParam+'&eventIds[]='+params.data.item_id+'&action=accept&all=all&zy_ctoken=null&eventTypeId='+params.data.metadata.type_id;
						}
					
					FGS.adventureworld.MessageCenter.Receive3(params);
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
					
					if(typeof resp.giftBack != 'undefined' && typeof params.zyFriends[resp.from_uid] != 'undefined')
					{
						var sendInfo = {
							gift: resp.giftBack.contentID,
							destInt: params.zyFriends[resp.from_uid]
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

FGS.adventureworld.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'https://apps.facebook.com/playadventureworld/'+addAntiBot,
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
					
					FGS.adventureworld.Freegifts.Click2(params);
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
					
					var nextUrl = 'https://'+params.domain+'/';			
					
					var pos1 = dataStr.indexOf('var g_friendData = [');
					if(pos1 == -1) throw {message: 'No friends data'}
					pos1+=19;
					
					var pos2 = dataStr.indexOf('];', pos1)+1;
					
					var friends = JSON.parse(dataStr.slice(pos1,pos2));
					var zids = {};
					
					for(var i=0;i<friends.length;i++)
					{
						var f = friends[i];
						var uid = f.pic.replace(/[^0-9]/g, '');
						var zid = f.zid;
						
						zids[zid] = uid;
					}
					
					params.zyFriends = zids;
					
					var pos1 = dataStr.indexOf('new ZY(');
					if(pos1 == -1) throw {message: 'No new ZY'}
					pos1+=7;
					var pos2 = dataStr.indexOf('},', pos1)+1;
					
					var zyParam = JSON.parse(dataStr.slice(pos1,pos2));
					
					zyParam.snapi_auth = zyParam.zyAuthHash;
					
					var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
					params.domain = params.step1url.match(re)[1].toString();
					params.zyParam = FGS.jQuery.param(zyParam);
					
					FGS.adventureworld.Freegifts.Click3(params);
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
					
					var pos1 = dataStr.indexOf('var data = [');
					
					if(pos1 == -1) throw {message: 'no people'}
					pos1+=11;
					
					var pos2 = dataStr.indexOf('];', pos1);
					
					var sets = JSON.parse(dataStr.slice(pos1, pos2+1));
					
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
						
						var id = params.zyFriends[p.key];
						
						if(typeof id == 'undefined') continue;
						
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
					
					var s1 = dataStr.indexOf('"body":', s0);
					var s1a = dataStr.indexOf('"', s1+7)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var body = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf('"title":', s0);
					var s1a = dataStr.indexOf('"', s1+8)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var title = dataStr.slice(s1a, s1b);
					

					
					var s1a = dataStr.indexOf("senderId=", s0)+9;
					var s1b = dataStr.indexOf('&', s1a);
					
					var sender = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf("eventTypeId': ", s0);
					var s1a = s1+14;
					var s1b = dataStr.indexOf(" ", s1a);
					
					var event = dataStr.slice(s1a, s1b).replace("\n", '');
					
					var s1a = dataStr.indexOf("signature=", s0)+10;
					var s1b = dataStr.indexOf('&', s1a);
					
					var signature = dataStr.slice(s1a, s1b);
					
					var s1 = dataStr.indexOf("'data':", s0);
					var s1a = dataStr.indexOf('{', s1+8);
					var s1b = dataStr.indexOf('"},', s1a)+2;
					
					var dataObj = JSON.parse(dataStr.slice(s1a, s1b));
					
					dataObj.request_ids = {};
					dataObj.signature = signature;

					params.snapi = {
						js: 1,
						method: 'request.send',
						params: {
							gameId: 88,
							toZid: zySendArr,
							type: 'gift',
							data: dataObj,
							eventTypeId: event
						},
						cmd_id: new Date().getTime(),
						app_id: 88,
						snid: 1,
						authHash: FGS.Gup('zyAuthHash', params.zyParam),
						zid: sender,
					};
					
					params.request = {
						action: 'send',
						'requestData[title]': title,
						'requestData[body]': body,
						//'requestData[imageUrl]': image,
					};
					
					params.request_ids = request_ids;		
					
					params.items = finalArr;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', finalArr, params.gameID);
						return;
					}
					
					var reqData = {};
					
					reqData.filters = JSON.stringify( [{name: 'Adventure World Friends', user_ids: friends}] );
					reqData.title = title;
					reqData.message = body;
					
					params.reqData = reqData;
					params.channel = 'http://fb-0.adventure.zynga.com/';
					
					FGS.getAppAccessTokenForSending(params, FGS.adventureworld.Freegifts.Click_Snapi);
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
		
		params.request_data = params.snapi.params.data;
		
		params.snapi.params = JSON.stringify(params.snapi.params);
		
		$.ajax({
			type: "POST",
			url: 'https://fb-0.adventure.zynga.com/snapi_proxy.php',
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
					var postData2 = {};
					
					var arr = [];
					for(var i in obj.body)
					{
						postData2['ids['+i+']'] = obj.body[i];
					}
					
				//	recipients: arr.join(',')
				
					var postData = {
						gift: params.gift,
						ts: params.request_data.ts,
						outgoingSendkey: params.request_data.sendKey,
						isCrew: 'n',
						isReq2: 1
					}
					
					//var postData2 = ids[20037965750]	534064854ee487f9cd9fb
					
					var postUrl = 'https://fb-0.adventure.zynga.com/gifts.php?&action=sent&'+params.zyParam+'&'+$.param(postData);
					
					$.post(postUrl, postData2);
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

FGS.adventureworld.Bonuses = 
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
					
					FGS.adventureworld.Bonuses.Click2(currentType, id, url, params);
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
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);

					
					
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
					
					if(newUrl.indexOf('http:') == 0 || newUrl.indexOf('https:') == 0 )
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
					
					
					FGS.adventureworld.Bonuses.Click3(currentType, id, newUrl);
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

					if(dataStr.indexOf('You can only collect feed rewards from your allies!') != -1)
					{
						var error_text = 'You can only collect feed rewards from your allies!';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if(dataStr.indexOf('The train has already finished its trip') != -1)
					{
						var error_text = 'The train has already finished its trip';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					
					if(dataStr.match(/<!DOCTYPE/g) != null && dataStr.indexOf('<div class="rightPanel">') != -1)
					{
						var pos0 = dataStr.indexOf('<div class="rightPanel">');
						
						var pos1 = dataStr.indexOf('<!DOCTYPE', pos0);
						
						var dataStr = dataStr.slice(pos0, pos1)+'</div></div>';
						
						dataStr = dataStr.replace(/<!--/g, '').replace(/-->/g, '');						
					}
					
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if($('.rewardFail', dataHTML).length > 0 || $('.giftLimit', dataHTML).length > 0 || dataStr.indexOf('Always accept requests as soon as possible') != -1 || dataStr.indexOf('You are already neighbors with this person') != -1 || $('.main_crewError_cont	', dataHTML).length > 0)
					{
						if($('.rewardFail', dataHTML).length > 0)
						{
							var error_text = $.trim($('.rewardFail', dataHTML).text());
						}
						else if($('.giftLimit', dataHTML).length > 0)
						{
							var error_text = $.trim($('.giftLimit', dataHTML).text());
						}			
						else if($('.main_crewError_cont	', dataHTML).length > 0)
						{
							var error_text = $.trim($('.main_crewError_cont', dataHTML).text());
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

					info.text = $('.rewardFrom_name', dataHTML).text();
					info.title = $(".rewardConfirm_name",dataHTML).text();
					info.image = $(".rewardConfirm_img",dataHTML).children().attr("longdesc");
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