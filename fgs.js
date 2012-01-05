var FGS = {
	alreadyOpened: false,
	transObj:
	{
		"fr_FR": 	{name: "Français (France)"},
		"ko_KR": 	{name: "한국어"},
		"af_ZA": 	{name: "Afrikaans"},
		"az_AZ": 	{name: "Azərbaycan dili"},
		"es_VE": 	{name: "Español (Venezuela)"},
		"es_LA": 	{name: "Español"},
		"ar_AR": 	{name: "العربية"},
		"mt_MT": 	{name: "Malti"},
		"ms_MY": 	{name: "Bahasa Melayu"},
		"fr_CA": 	{name: "Français (Canada)"},
		"cs_CZ": 	{name: "Čeština"},
		"fi_FI": 	{name: "Suomi"},
		"ca_ES": 	{name: "Català"},
		"sv_SE": 	{name: "Svenska"},
		"nl_BE": 	{name: "Nederlands (België)"},
		"pt_BR": 	{name: "Português (Brasil)"},
		"tl_PH": 	{name: "Filipino"},
		"es_CL": 	{name: "Español (Chile)"},
		"pt_PT": 	{name: "Português (Portugal)"},
		"el_GR": 	{name: "Ελληνικά"},
		"en_PI": 	{name: "English (Pirate)"},
		"de_DE": 	{name: "Deutsch"},
		"es_MX": 	{name: "Español (México)"},
		"en_GB": 	{name: "English (UK)"},
		"nl_NL": 	{name: "Nederlands"},
		"da_DK": 	{name: "Dansk"},
		"es_ES": 	{name: "Español (España)"},
		"th_TH": 	{name: "ภาษาไทย"},
		"tr_TR": 	{name: "Türkçe"},
		"hi_IN": 	{name: "हिन्दी"},
		"hu_HU": 	{name: "Magyar"},
		"ka_GE": 	{name: "ქართული"},
		"sk_SK": 	{name: "Slovenčina"},
		"bn_IN": 	{name: "বাংলা"},
		"zh_TW": 	{name: "中文(台灣)"},
		"id_ID": 	{name: "Bahasa Indonesia"},
		"hr_HR": 	{name: "Hrvatski"},
		"he_IL": 	{name: "עברית"},
		"bg_BG": 	{name: "Български"},
		"pl_PL": 	{name: "Polski"},
		"ro_RO": 	{name: "Română"},
		"nn_NO": 	{name: "Norsk (nynorsk)"},
		"en_US": 	{name: "English (US)"},
		"et_EE": 	{name: "Eesti"},
		"en_UD": 	{name: "English (Upside Down)"},
		"ja_JP": 	{name: "日本語"},
		"zh_HK": 	{name: "中文(香港)"},
		"mk_MK": 	{name: "Македонски"},
		"vi_VN": 	{name: "Tiếng Việt"},
		"ru_RU": 	{name: "Русский"},
		"bs_BA": 	{name: "Bosanski"},
		"kn_IN": 	{name: "ಕನ್ನಡ"},
		"zh_CN": 	{name: "中文(简体)"},
		"nb_NO": 	{name: "Norsk (bokmål)"},
		"fb_FI": 	{name: "Suomi (koe)"},
		"it_IT": 	{name: "Italiano"},
		"uk_UA": 	{name: "Українська"},
		"pa_IN": 	{name: "ਪੰਜਾਬੀ"},
		"sr_RS": 	{name: "Српски"},
	},
	
	translations: {},
	
	formExclusionString: '[action*="zbar-new\\/banner.php"],[action*="www\\.facebook\\.com\\/connect\\/connect.php"],[action*="custom_ads\\/islandAd\\.php"],[action*="www\\.facebook\\.com\\/plugins"]',
	
	initializeDefaults: function ()
	{
		FGS.giftlistFocus = false;
		
		FGS.isHTTPS = false;

		FGS.databaseAlreadyOpen = false;
		
		FGS.FBloginError  = null;
		FGS.iBonusTimeout = {};
		
		FGS.iRequestTimeout = null;
		
		FGS.options = {};
		FGS.optionsLoaded = false;
		
		FGS.defaultOptions =
		{
			defaultGame: '0',
			games: {},
			chatSessions: {},
			language: 0,
			friendlists: [],
			
			thankYouGiftMessage: '',
			
			defaultCommentsMessages: [],
			
			checkChatTimeout: 60,
			checkBonusesTimeout: 60,
			deleteOlderThan: 0,
			deleteHistoryOlderThan: 0,
			displayXbonuses: 300,
			showDescriptionsOnStartup: 0,
			collectXbonusesAtTheSameTime: 2,
			breakStartupLoadingOption: 0,
			breakStartupLoadingCount: 300,
			breakStartupLoadingTime: 300
		}

		FGS.defaultGameOptions = { customSource: false, enabled: false,	lastBonusTime: 0, likeBonus: false, likeItemsRequiringAction: false, sendbackGift: false, hideFromFeed: false, hideFromFeedLimitError: false, listOnSearch: false, filter: [], favourites: [], defaultGift: 0, useRandomTimeoutOnBonuses: false };

		for(var idd in FGS.gamesData)
		{
			FGS.defaultOptions.games[idd] = FGS.jQuery.extend(true,{},FGS.defaultGameOptions);
		}

		FGS.post_form_id = '';
		FGS.fb_dtsg = '';
		FGS.charset_test = '';
		FGS.userID				= null;
		FGS.userLoc				= null;
		FGS.userName			= null;
		FGS.newElements = 0;
		FGS.bonusLoadingProgress = {};
		
		FGS.xhrFarmQueue = [];
		FGS.xhrFarmNextBonus  = 0;		
		FGS.xhrFarmWorking = 0;
		
		FGS.xhrQueue = [];
		FGS.xhrWorking = 0;
		FGS.xhrInterval = null;
		
		
		FGS.debugLog = [];
	},
	
	timeoutToNumber: function()
	{
		var num = 50;
		
		switch(parseInt(FGS.options.checkBonusesTimeout))
		{
			case 15:
				num = 10;
				break;
			case 30:
				num = 20;
				break;
			case 60:
				num = 30;
				break;
			case 120:
				num = 40;
				break;
			case 300:
				num = 50;
				break;
			case 600:
				num = 100;
				break;
		}
		return num;
	},
	
	deleteNewRequests: function(id, access_token)
	{
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://graph.facebook.com/'+id+access_token+'&method=delete',
			dataType: 'text',
			success: function(data)
			{}
		});
	},
	
	getGameRequests: function(currentType, id, currentURL, params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://graph.facebook.com/me/apprequests',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					callback(currentType, id, currentURL, [params, data]);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, callback, true);
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
					retryThis(currentType, id, currentURL, params, callback, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	getSingleGameRequest: function(currentType, id, currentURL, params, callback, params2, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://graph.facebook.com/'+params2.single,
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					callback(currentType, id, currentURL, [params, data, params2]);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, callback, params2, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function(e)
			{
				if(e.status == 400)
				{
					FGS.endWithError('limit', currentType, id, 'Already received!');
					return;
				}
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL, params, callback, params2, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	getAppAccessTokenForSingleItem: function(params, success, error, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		var channel = 'https://static.ak.fbcdn.net/connect/xd_proxy.php?version=3#cb=f1&origin='+encodeURIComponent(params.channel)+'%2Ff2cc&relation=parent&transport=postmessage&frame=f1&result=%22xxRESULTTOKENxx%22';
		
		var useGameID = params.gameID;
		if(useGameID == '1677463161271')
			useGameID = '167746316127';
		
		params.getToken = 'api_key='+useGameID+'&app_id='+useGameID+'&channel='+encodeURIComponent(channel)+'&channel_url='+encodeURIComponent(channel)+'&redirect_uri='+encodeURIComponent(channel);
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params.getToken,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params.access = {access_token: parseStr.session.access_token};
					
					FGS.getSingleUserSendForm(params, success, error);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, success, error, true);
					}
					else
					{
						error(params);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, success, error, true);
				}
				else
				{
					error(params);
				}
			}
		});
	},
	
	getSingleUserSendForm: function(params, success, error, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/dialog/apprequests',
			data: $.param(params.reqData)+'&'+$.param(params.access)+'&'+params.getToken+'&sdk=joey&display=iframe&locale=en_US',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					if($('input[name="to"]', dataHTML).length == 0)
						throw {'message': 'no to input'}
					
					params.formUrl = $('#uiserver_form', dataHTML).attr('action');
					params.formParam = $('#uiserver_form', dataHTML).serialize();
					
					
					FGS.sendToSingleUser(params, success, error);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, success, error, true);
					}
					else
					{
						error(params);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, success, error, true);
				}
				else
				{
					error(params);
				}
			}
		});
	},
	
	sendToSingleUser: function(params, success, error, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "POST",
			url: params.formUrl,
			data: params.formParam+'&ok_clicked=Send%20Requests',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					if(dataStr.indexOf('&result=') == -1)
						throw {'message': 'no result'}
					
					var pos0 = dataStr.indexOf('&result=')+8;
					var pos1 = dataStr.indexOf('"', pos0);
					
					var str = dataStr.slice(pos0, pos1);
					var arr = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc)).request_ids;
					
					params.request_ids = arr;
					
					success(params);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, success, error, true);
					}
					else
					{
						error(params);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, success, error, true);
				}
				else
				{
					error(params);
				}
			}
		});
	},
	
	
	getSendingForm: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/dialog/apprequests',
			data: $.param(params.reqData)+'&'+$.param(params.access)+'&'+params.getToken+'&sdk=joey&display=iframe&locale=en_US',
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var tst = new RegExp(/["]bootstrapData["]:(.*)[\,]["]boo/).exec(dataStr);
					if(tst == null) throw {message:'no bootstrap tag'}					
					
					var postD = JSON.parse(tst[1]); 
					
					var newPost =
					{
						viewer: postD.viewer,
						token: postD.token,
					}
					
					var i = 0;
					for(var id in postD.filter)
					{
						newPost['filter['+i+']'] = postD.filter[id];
						i++;
					}
					
					var i = 0;
					for(var id in postD.options)
					{
						newPost['options['+i+']'] = postD.options[id];
						i++;
					}
					
					params.requestPost = $.param(newPost).replace(/%5B/g,'[').replace(/%5D/g,']');
					
					var tmpObj = {}
					var parStr = '';
					
					$(params.sendTo).each(function(k,v)
					{
						tmpObj[v] = 1;
						parStr += '&checkableitems[]='+v;
					});
					
					$('input[name="profileChooserItems"]', dataHTML).remove();
					
					var pos0 = dataStr.indexOf(').preloadCache({');
					if(pos0 != -1)
					{
						var pos1 = dataStr.indexOf('[', pos0);
						var pos2 = dataStr.indexOf(']', pos1)+1;
						
						params.custom = JSON.parse('{"abc": '+dataStr.slice(pos1, pos2)+'}').abc;
					}
					
					params.formUrl = $('#uiserver_form', dataHTML).attr('action');
					params.formParam = $('#uiserver_form', dataHTML).serialize()+parStr+'&profileChooserItems='+encodeURIComponent(JSON.stringify(tmpObj));
					
					FGS.getFriendsFromRequest(params, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
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
					retryThis(params, callback, true);
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
	
	getFriendsFromRequest: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		var useGameID = params.gameID;
		if(useGameID == '1677463161271')
			useGameID = '167746316127';
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/ajax/typeahead/apprequest/first_degree.php?__a=1&viewer='+FGS.userID+'&app_id='+useGameID+'&token=v6',
			data: params.requestPost,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var str = dataStr.substring(9);
					var str2 = JSON.parse(str).error;
					
					var data = JSON.parse(str);
					
					if(typeof(str2) != 'undefined')
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						return;
					}
					
					var arr = {};
					
					$(data.payload.entries).each(function(k,v)
					{
						arr[v.uid] = {name: v.text};
					});
					
					params.tmpFriends = arr;
					
					FGS.getFriendsFromGame(params, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
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
					retryThis(params, callback, true);
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
	
	getFriendsFromGame: function(params, callback, retry, isCallback)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		if(typeof isCallback != 'undefined')
		{
			var obj = isCallback;
			var dataStr = obj.data;
			
			if(obj.success)
			{
				try
				{
					var str = dataStr.substring(9);
					var str2 = JSON.parse(str).error;
					
					var data = JSON.parse(str);
					
					if(typeof(str2) != 'undefined')
					{
						FGS.sendView('errorWithSend', params.gameID, (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						return;
					}
					
					var finalArr = [];
					
					if(typeof params.custom != 'undefined')
						data.payload.ids = params.custom;
					
					
					$(data.payload.ids).each(function(k, v)
					{
						var x = {};
						x[v] = params.tmpFriends[v];
						if(typeof(x[v]) != 'undefined')
						{
							if(typeof params.excludeUsers != 'undefined')
							{
								if($.inArray(v, params.excludeUsers) != -1)
									return true;
							}
							if(typeof params.reqData.exclude_ids != 'undefined')
							{
								if($.inArray(v, params.reqData.exclude_ids.split(',')) != -1)
									return true;
							}
							
							finalArr.push(x);
						}
					});
					
					params.items = finalArr;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', finalArr, params.gameID);
						return;
					}
					
					$.post(params.formUrl, params.formParam+'&ok_clicked=Send%20Requests', function(dataStr2)
					{
						var curTime = Math.round(new Date().getTime() / 1000);

						var found = false;
						
						if(typeof(params.thankYou) == 'undefined')
							FGS.ListNeighbours(params.gameID);
						
						$(params.items).each(function(k,val)
						{
							for(var i in val)
							{
								var id = i;
							}
							var v = val[id];				
							
							if($.inArray(id, params.sendTo) > -1)
							{
								var sendHistory = {
									gift: params.gift,
									gameID: params.gameID,
									friend: v.name,
									time: curTime,
									friendID: id
								};
								FGS.database.addFreegift(params.gameID, v.name, params.gift, curTime, typeof(params.thankYou));
								
								if(typeof(params.thankYou) != 'undefined')
								{
									FGS.database.updateItemGiftBack((params.isRequest ? 'requests' : 'bonuses'), params.bonusID);
								}
								
								FGS.sendView('freegiftSuccess', sendHistory, (typeof(params.thankYou) != 'undefined' ? params.bonusID : ''));
								
								found = true;
							}
							i++;
						});
						
						if(!found && typeof(params.thankYou) != 'undefined')
						{
							//thank you gift
							var sendHistory = {
								gift: params.gift,
								gameID: params.gameID,
								friend: params.sendToName,
								time: curTime,
								friendID: params.sendTo[0]
							};
							
							FGS.database.addFreegift(params.gameID, params.sendToName, params.gift, curTime, typeof(params.thankYou));
							FGS.database.updateItemGiftBack((params.isRequest ? 'requests' : 'bonuses'), params.bonusID);
							
							FGS.sendView('freegiftSuccess', sendHistory, (typeof(params.thankYou) != 'undefined' ? params.bonusID : ''));
						}
						
						if(typeof callback == 'string')
						{
							eval('var callback = '+callback);
						}
						
						callback(params, dataStr2);
					});					
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
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
			}
			else
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, callback, true);
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
		}
		else
		{
			var useGameID = params.gameID;
			if(useGameID == '1677463161271')
				useGameID = '167746316127';
			
			var obj = {
				arguments:
				{
					'type': 'POST',
					'url': 'https://www.facebook.com/ajax/chooser/list/friends/app_user/?__a=1&app_id='+useGameID,
					'data': 'post_form_id='+FGS.post_form_id+'&fb_dtsg='+FGS.fb_dtsg+'&lsd&post_form_id_source=AsyncRequest'
				},
				params: [params, callback, retry],
				callback: 'FGS.getFriendsFromGame'
			};
			
			FGSoperator.postMessage(obj);
		}
	},
	
	getAppAccessTokenForSending: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');
		
		var channel = 'https://static.ak.fbcdn.net/connect/xd_proxy.php?version=3#cb=f1&origin='+encodeURIComponent(params.channel)+'%2Ff2cc&relation=parent&transport=postmessage&frame=f1&result=%22xxRESULTTOKENxx%22';
		
		var useGameID = params.gameID;
		if(useGameID == '1677463161271')
			useGameID = '167746316127';
		
		params.getToken = 'api_key='+useGameID+'&app_id='+useGameID+'&channel='+encodeURIComponent(channel)+'&channel_url='+encodeURIComponent(channel)+'&redirect_uri='+encodeURIComponent(channel);
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params.getToken,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params.access = {access_token: parseStr.session.access_token};
					
					FGS.getSendingForm(params, callback);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
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
					retryThis(params, callback, true);
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
	
	getAppAccessToken2: function(params, params2, callback)
	{
		var $ = FGS.jQuery;
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params2.access_token = parseStr.session.access_token;
					
					callback(params2);			
				}
				catch(err)
				{
				}
			},
			error: function()
			{
			}
		});
	},
	
	getAppAuthInfo: function(params, callback, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params.app_info,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					params.auth_info = parseStr;
					
					callback(params);
				}
				catch(err)
				{
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, callback, true);
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
					retryThis(params, callback, true);
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
	
	getAccessToken: function(params, id, callback)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					var params = {access_token: parseStr.session.access_token};
					
					callback(id, params);
				}
				catch(err)
				{
					//console.log(err);
				}
			}
		});
	},
	
	getAppAccessToken: function(currentType, id, currentURL, params, callback, params2, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/extern/login_status.php?locale=en_US&sdk=joey&session_version=3&display=hidden&extern=0',
			data: params,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var parseStr = data;

					var pos1 = parseStr.indexOf('var config = {');
					if(pos1 == -1) throw {message:"no URI"}
					
					var pos2 = parseStr.indexOf('};',pos1);
					
					parseStr = parseStr.slice(pos1+13,pos2+1);
					var parseStr = JSON.parse(parseStr);
					
					var access = {access_token: parseStr.session.access_token};
					
					if(!params2.single)
						FGS.getGameRequests(currentType, id, currentURL, access, callback);
					else
						FGS.getSingleGameRequest(currentType, id, currentURL, access, callback, params2);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL, params, callback, params2, true);
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
					retryThis(currentType, id, currentURL, params, callback, params2, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	prepareLinkForGameStep2: function(url, game, id, dataPost, newWindow, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {};
		
		FGS.jQuery.ajax({
			type: "GET",
			url: url,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var pos1 = data.indexOf('document.location.replace("');
					if(pos1 == -1) throw {message: 'a'}
					var pos2 = data.indexOf('"', pos1+27);
					var text = data.slice(pos1+27,pos2);
					text = text.replace(/\\u0025/g, '%');
					text = text.replace(/\\/g,'');
					var url = $(FGS.HTMLParser('<p class="link" href="'+text+'">abc</p>')).find('p.link');
					var URI = url.attr('href');							
				
					if(newWindow)
						FGS.openURI(URI, true);
					else
						FGS[game].Requests.Click("request", id, URI);
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(url, game, id, dataPost, newWindow, true);
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
					retryThis(url, game, id, dataPost, newWindow, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	prepareLinkForGame: function(game, id, dataPost, newWindow, retry, isCallback)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var currentType	= 'request';
		var info = {}
		
		
		if(FGS.Gup('secondLink', dataPost) == 1)
			var url = 'https://www.facebook.com/ajax/games/apprequest/apprequest.php?__a=1'
		else
			var url = 'https://www.facebook.com/ajax/reqs.php?__a=1';
		
		var dataPost2 = dataPost + '&post_form_id='+FGS.post_form_id+'&fb_dtsg='+FGS.fb_dtsg+'&nctr[_mod]=pagelet_requests';
		
		if(typeof isCallback != 'undefined')
		{
			var obj = isCallback;
			var data = obj.data;
			
			if(obj.success)
			{
				try
				{
					var parseStr = data;
					
					var pos1 = parseStr.indexOf('goURI');
					if(pos1 == -1) throw {message:"no URI"}

					var pos2 = parseStr.indexOf(');',pos1);
					var parseStr = '{"abc":"'+parseStr.slice(pos1+8,pos2-2)+'"}';
					var parseStr = JSON.parse(parseStr);
					
					var url2 = parseStr.abc.toString();
					
					if(url2.indexOf('l.php') == 2)
					{
						var parseStr = '{"abc":"'+url2+'"}';
						var parseStr = JSON.parse(parseStr);
						var newStr = 'https://www.facebook.com'+parseStr.abc;
						
						FGS.prepareLinkForGameStep2(newStr, game, id, dataPost, newWindow);
					}
					else
					{
						var parseStr = parseStr.abc.replace(/\\u0025/g, '%');
						
						var URI = JSON.parse('"'+parseStr+'"');
						
						if(newWindow)
							FGS.openURI(URI, true);
						else
							FGS[game].Requests.Click("request", id, URI);
					}
				}
				catch(err)
				{
					FGS.dump(err);
					FGS.dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(game, id, dataPost, newWindow, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			}
			else
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(game, id, dataPost, newWindow, true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		}
		else
		{
			var obj = {
				arguments:
				{
					'type': 'POST',
					'url': url,
					'data': dataPost2
				},
				params: [game, id, dataPost, newWindow, retry],
				callback: 'FGS.prepareLinkForGame'
			};
			
			FGSoperator.postMessage(obj);
		}
	},
	
	emptyUnwantedGifts: function(dataPost)
	{
		var url = 'https://www.facebook.com/ajax/games/apprequest/apprequest.php?__a=1'
			
		dataPost = dataPost.replace(/%5B/g,'[').replace(/%5D/g,']');
		
		var x = FGS.Gup('actions\\[(.*)\\]', dataPost);
		var y = FGS.Gup('actions\\['+x+'\\]', dataPost);
		
		dataPost = dataPost.replace('&actions['+x+']='+y, '');
		
		var dataPost2 = dataPost + '&post_form_id='+FGS.post_form_id+'&fb_dtsg='+FGS.fb_dtsg+'&nctr[_mod]=pagelet_requests&actions[reject]=&lsd=';
		
		var obj = {
			arguments:
			{
				'type': 'POST',
				'url': url,
				'data': dataPost2
			},
			params: []
		};
		
		FGSoperator.postMessage(obj);
	},
	
	stopAll: function(wait)
	{
		FGS.sendView('close');
		
		FGS.iBonusTimeout = {};
		
		if(FGS.xhrInterval !== null)
		clearInterval(FGS.xhrInterval);
		
		FGS.initializeDefaults();
		
		if(wait)
			FGS.FBloginError = null;
		else
			FGS.FBloginError = true;
		
		FGS.database.db = null;
		FGS.updateIcon();
	},
	
	loginStatusChanged: function(bool, html)
	{
		FGS.dump(FGS.getCurrentTime()+'[L] Received new login status. Checking if I have to start or stop updates.');
		
		if(bool == true)
		{
			if(FGS.userID == null)
			{
				FGS.FBloginError = null;
				FGS.updateIcon();
				
				if(html != undefined)
					FGS.parseStartupData(html);
				else
					FGS.startup();
			}
		}
		else
		{
			FGS.stopAll();
		}
	},
	
	parseStartupData: function(data2)
	{
		var data = FGS.HTMLParser(data2);	
		
		if(FGS.jQuery("#login_form", data).length > 0)
		{
			FGS.dump(FGS.getCurrentTime()+'[R] Error: probably logged out');
			FGS.stopAll();
			return true;
		}
		
		var pos1 = data2.indexOf('Env={')+4;
		
		if(pos1 == 3)
		{
			var pos1 = data2.indexOf('({"user"')+1;
			
			var pos2 = data2.indexOf('});', pos1)+1;
			
			var a = JSON.parse(data2.slice(pos1, pos2));
			
			if(typeof a.post_form_id != 'undefined')
				FGS.post_form_id = a.post_form_id;
				
			if(typeof a.fb_dtsg != 'undefined')
				FGS.fb_dtsg = a.fb_dtsg;
				
			if(typeof a.user != 'undefined')
				FGS.userID = a.user;
				
			if(typeof a.locale != 'undefined')
				FGS.userLoc = a.locale;
			
			FGS.userName = FGS.jQuery('#navAccountName', data).text() || FGS.jQuery('.headerTinymanName', data).text();
		}
		else
		{
			
			var pos2 = data2.indexOf('user:', pos1)+5;
			
			var posPF = data2.indexOf('post_form_id:', pos2);
			if(posPF != -1)
			{
				posPF+=13;
				var posPF2 = data2.indexOf(',', posPF);
				var t = data2.slice(posPF, posPF2);
				t = FGS.jQuery.trim(t.replace(/\"/g, ''));
				
				FGS.post_form_id = t;
			}
			
			var posDT = data2.indexOf('fb_dtsg:', pos2);
			if(posDT != -1)
			{
				posDT+=8;
				var posDT2 = data2.indexOf(',', posDT);
				var t = data2.slice(posDT, posDT2);
				t = FGS.jQuery.trim(t.replace(/\"/g, ''));
				
				FGS.fb_dtsg = t;
			}
			
			if(FGS.userID == null || FGS.userName == null)
			{
				var pos3 = data2.indexOf(',', pos2);

				FGS.userID = data2.slice(pos2, pos3);

				var pos4 = data2.indexOf('locale:', pos1)+7;
				var pos5 = data2.indexOf(',', pos4);
				FGS.userLoc = data2.slice(pos4+1, pos5-1).toString();
				
				FGS.userName = FGS.jQuery('#navAccountName', data).text() || FGS.jQuery('.headerTinymanName', data).text();
			}
		}
		
		FGS.userID = FGS.userID.replace(/\"/g, '').replace(/\'/g, '');
		
		if(data2.indexOf(',www_base:"https') != -1)
		{
			FGS.isHTTPS = true;
		}
		
		if(FGS.databaseAlreadyOpen == false)
		{
			FGS.loadSubmenu();
			FGS.database.open(FGS.userID);
			FGS.database.createTable();
			FGS.getGraphAccessToken();
		}
	},
	
	startup: function()
	{
		FGS.jQuery.ajax({
			type: "GET",
			url: 'https://www.facebook.com/terms.php',
			dataType: 'text',
			timeout: 30000,
			success: function(data2)
			{
				FGS.parseStartupData(data2);
			},
			error: function()
			{
				setTimeout(FGS.startup, 3000);
			}
		});		
	},
	
	finishStartup: function()
	{
		FGS.FBloginError = false;
		FGS.updateIcon();
		FGS.xhrInterval = setInterval(FGS.checkXhrQueue,100);
		FGS.restartRequests();
		FGS.restartBonuses();
	},
	
	encodeHtmlEntities: function (str) 
	{
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},

	checkForLocationReload: function(data)
	{
		var $ = jQuery = FGS.jQuery;
				
		try
		{
			var pos1 = data.indexOf('script>window.location.replace("');
			if(pos1 == -1) return false;
			var pos2 = data.indexOf('"', pos1+32);
			var text = data.slice(pos1+32,pos2);
			text = text.replace(/\\u0025/g, '%');
			text = text.replace(/\\/g,'');
			var url = $(FGS.HTMLParser('<p class="link" href="'+text+'">abc</p>')).find('p.link');
			var ret = url.attr('href');
			
			return ret;
		}
		catch(err)
		{
			FGS.dump('checkForLocationReload'+err);
			return false;
		}
	},
	
	checkForGoURI: function(dataStr)
	{
		try
		{
			var t0   = dataStr.indexOf("goURI('");
			if(t0 != -1)
			{
				t0 += 7;
				var t1 = dataStr.indexOf("'", t0)
				var redUrl = dataStr.slice(t0, t1);
				
				redUrl = redUrl.replace(/\\\\x26/g,'&').replace(/\\x26/g,'&').replace(/&amp;/g,'&');
				
				return redUrl;
				/*
				
				var parseStr = '{"abc":"'+redUrl+'"}';
				var parseStr = JSON.parse(parseStr);
				var redirectUrl = parseStr.abc.toString();
				
				return redirectUrl;
				*/
			}
			return false;			
		}
		catch(err)
		{
			return false;
		}
	},
	
	endWithSuccess: function(type, id, info)
	{
		if(type == 'request' || type == 'requests')
		{
			var viewMsg = 'requestSuccess';
			var table = 'requests';
		}
		else if(type == 'bonus' || type == 'bonuses')
		{
			var viewMsg = 'bonusSuccess';
			var table = 'bonuses';
		}
		
		FGS.sendView(viewMsg, id, info);
		FGS.database.updateItem(table, id, info);
			
	},
	
	endWithError: function(error, type, id, error_text)
	{
		var info = 
		{
			time: Math.round(new Date().getTime() / 1000),
			error: error,
			image: 'gfx/90px-cancel.png'
		};
		
		if(type == 'request' || type == 'requests')
		{
			var viewMsg = 'requestError';
			var table = 'requests';
		}
		else if(type == 'bonus' || type == 'bonuses')
		{
			var viewMsg = 'bonusError';
			var table = 'bonuses';
		}
		
		if(error == 'receiving')
		{
			FGS.database.updateErrorItem(table, id, info);
			FGS.sendView(viewMsg, id, info);	
		}
		else if(error == 'connection')
		{
			FGS.sendView(viewMsg, id, info);
		}
		else if(error == 'other')
		{
			if(typeof(error_text) != 'undefined')
			{
				info.error_text = error_text;
			}
			FGS.sendView(viewMsg, id, info);
		}
		else if(error == 'limit')
		{
			if(typeof(error_text) != 'undefined')
			{
				info.error_text = error_text;
			}
			
			FGS.database.updateErrorItem(table, id, info);
			FGS.sendView(viewMsg, id, info);	
		}
		else if(error == 'not found')
		{
			info.error_text = 'This gift has expired or was collected from requests page.';
			FGS.database.updateErrorItem(table, id, info);
			FGS.sendView(viewMsg, id, info);
			//alert('nieznany error - powiedz mezowi: '+error+' ID: '+id);
		}
	},
	
	checkForNotFound: function(url)
	{
		var errorsArr = ['gifterror=notfound', 'gifterror=invalid', 'countrylife/play', 'apps.facebook.com/ravenwoodfair/home', '/cafeworld/?ref=requests', '/cityofwonder/gift/?track=bookmark', '/myshopsgame/?ref=received_gift_failed'];
		
		var errorsFullArr = ['http://apps.facebook.com/cafeworld/?ref=requests', 'https://apps.facebook.com/cafeworld/?ref=requests'];
		
		
		var ret = false;
		
		FGS.jQuery(errorsArr).each(function(k,v)
		{
			if(url.indexOf(v) != -1)
			{
				ret = true;
				return false;				
			}		
		});
		
		FGS.jQuery(errorsFullArr).each(function(k,v)
		{
			if(url == v)
			{
				ret = true;
				return false;				
			}		
		});
		
		return ret;
	},
	
	findIframeByName: function(name, data)
	{
		var $ = jQuery = FGS.jQuery;
		
		try
		{
			var count = data.match(/<iframe[^>]*?>/gm);
			
			var v = '';
			
			$(count).each(function(k,x)
			{
				if(x.indexOf(' name="'+name+'"') != -1)
				{
					v = x;
					return false;
				}
			});
			
			if(v == '') throw {message: 'no iframe with name - '+name}
			
			var nextUrl = false;
			
			var pos1 = v.indexOf('src="');
			if(pos1 != -1)
			{
				pos1+=5;
				var pos2 = v.indexOf('"', pos1);
				var url = v.slice(pos1,pos2);
				var url = $(FGS.HTMLParser('<p class="link" href="'+url+'">abc</p>')).find('p.link');
				nextUrl = url.attr('href');
			}
			else
			{
				return '';
			}
			return nextUrl;
		}
		catch(e)
		{
			return '';
		}
	},
	
	getRandomTimeout: function()
	{
		var secs = Math.floor((Math.random()*25)+5);
		
		FGS.dump('Next bonus starts in: '+ secs);
		
		var start = secs*1000;
		return (new Date().getTime() + start);
	},
	
	findIframeAfterId: function(id, data)
	{
		var $ = jQuery = FGS.jQuery;
		
		try
		{
			var pos1 = data.indexOf('"'+id.slice(1)+'"');
			var data = data.slice(pos1);
			
			var count = data.match(/<iframe[^>]*?>/gm);
			if(count == 0) throw {message: 'iframe not found'}
			
			var nextUrl = false;
			v = count[0];
			
			var pos1 = v.indexOf('src="');
			if(pos1 != -1)
			{
				pos1+=5;
				var pos2 = v.indexOf('"', pos1);
				var url = v.slice(pos1,pos2);
				var url = $(FGS.HTMLParser('<p class="link" href="'+url+'">abc</p>')).find('p.link');
				nextUrl = url.attr('href');
			}
			else
			{
				return '';
			}
			return nextUrl;
		}
		catch(e)
		{
			return '';
		}
	},
	
	stopQueue: function()
	{
		var resetArr = FGS.xhrQueue.concat(FGS.xhrFarmQueue);
		FGS.xhrQueue = [];
		FGS.xhrFarmQueue = [];
		FGS.xhrFarmWorking = 0;
		FGS.xhrWorking = 0;
		
		return resetArr;
	},
	
	setNewFarmvilleBonus: function()
	{
		FGS.xhrFarmWorking = 0;
		FGS.xhrFarmNextBonus = FGS.getRandomTimeout();
	},
	
	checkXhrQueue: function()
	{
		if(new Date().getTime() > FGS.xhrFarmNextBonus)
		{
			if(FGS.xhrFarmQueue.length > 0 && FGS.xhrFarmWorking == 0)
			{
				FGS.xhrFarmWorking = FGS.xhrFarmQueue[0].id;
				FGS[FGS.xhrFarmQueue[0].game].Bonuses.Click("bonus", FGS.xhrFarmQueue[0].id, FGS.xhrFarmQueue[0].url);
				FGS.xhrFarmQueue = FGS.xhrFarmQueue.slice(1);				
			}
		}
	
		if(FGS.xhrWorking < FGS.options.collectXbonusesAtTheSameTime)
		{
			if(FGS.xhrQueue.length > 0)
			{
				if(FGS.xhrQueue[0].type == 'request')
				{
					FGS.prepareLinkForGame(FGS.xhrQueue[0].game, FGS.xhrQueue[0].id, FGS.xhrQueue[0].post, false);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
				else if(FGS.xhrQueue[0].type == 'request_MC')
				{
					FGS.xhrQueue[0].info = {type: 'request', id: FGS.xhrQueue[0].id};
					
					FGS[FGS.xhrQueue[0].game].MessageCenter.Receive(FGS.xhrQueue[0]);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
				else if(FGS.xhrQueue[0].type == 'bonus')
				{
					FGS[FGS.xhrQueue[0].game].Bonuses.Click("bonus", FGS.xhrQueue[0].id, FGS.xhrQueue[0].url);
					FGS.xhrQueue = FGS.xhrQueue.slice(1);
					FGS.xhrWorking++;
				}
			}
		}
	},
	
	startBonusesForGame: function(gameID)
	{
		FGS.iBonusTimeout[gameID] = setTimeout('FGS.checkBonuses("'+gameID+'");', 1000);
	},
	
	stopBonusesForGame: function(gameID)
	{
		try
		{
			delete(FGS.iBonusTimeout[gameID]);
		}
		catch(e)
		{
			FGS.dump(e);
		}
	},
	
	setTimeoutOnBonuses: function(gameID, alternative)
	{
		if(FGS.options.games[gameID].enabled)
		{
			FGS.iBonusTimeout[gameID] = setTimeout('FGS.checkBonuses("'+gameID+'");', FGS.options.checkBonusesTimeout*1000);
		}
		else
		{
			FGS.stopBonusesForGame(gameID);
		}
	},	
	
	restartBonuses: function(gameID)
	{
		if(typeof gameID == 'undefined')
			var arr = FGS.options.games;
		else
		{
			var arr = {};
			arr[gameID] = true;
		}
	
		for(var id in arr)
		{
			if(FGS.options.games[id].enabled)
			{
				if(typeof(FGS.iBonusTimeout[id]) != 'undefined' && FGS.iBonusTimeout[id] != null)
				{
					clearTimeout(FGS.iBonusTimeout[id]);
					delete(FGS.iBonusTimeout[id]);
				}
				
				if(typeof(FGS.iBonusTimeout[id]) == 'undefined' || FGS.iBonusTimeout[id] == null)
				{
					FGS.startBonusesForGame(id);
					FGS.dump(FGS.getCurrentTime()+'[B] Starting '+id);
				}
			}
		}
	},
	
	restartRequests: function()
	{
		FGS.dump(FGS.getCurrentTime()+'[R] Restarting requests');
		clearInterval(FGS.iRequestTimeout);
		FGS.iRequestTimeout = null;
		FGS.checkRequests();
		FGS.iRequestTimeout = setInterval('FGS.checkRequests();', 600000);
	},
	
	
	checkRequests: function(apps)
	{
		if(typeof(apps) == 'undefined')
			var urlIK = 'https://www.facebook.com/games';
		else
			var urlIK = 'https://www.facebook.com/?sk=apps&ap=1';
		
		
		for(var id in FGS.gamesData)
		{
			if(typeof FGS.options.games[id] != 'undefined' && FGS.options.games[id].enabled == true && typeof FGS.gamesData[id].useMessageCenter != 'undefined')
			{
				var name = FGS.gamesData[id].systemName;
				FGS[name].MessageCenter.Start({gameID: id});
			}
		}
	
		FGS.jQuery.ajax({
			type: "GET",
			url: urlIK,
			dataType: 'text',
			timeout: 180000,
			success: function(data)
			{
				if(typeof(apps) == 'undefined')
					setTimeout(function() { FGS.checkRequests(true); }, 5000);
					
				data = data.replace(/<!-- /g, '').replace(/-->/g, '');
				
				if(data.indexOf('"content":{"pagelet_requests":"') != -1)
				{
					var pos1 = data.indexOf('"content":{"pagelet_requests":"')+10;
					var pos2 = data.indexOf('"}});', pos1)+2;
					var pos2a = data.indexOf('"},', pos1)+2;
					if(pos2a < pos2 && pos2a != 1)
						pos2 = pos2a;
					
					var tempD = JSON.parse(data.slice(pos1,pos2));

					data = tempD.pagelet_requests;				
				}
				else if(data.indexOf("content: {pagelet_requests: '") != -1)
				{
					var pos1 = data.indexOf("content: {pagelet_requests: '")+9;
					var pos2 = data.indexOf("'}});", pos1)+2;
					var pos2a = data.indexOf("'},", pos1)+2;
					if(pos2a < pos2 && pos2a != 1)
						pos2 = pos2a;
					
					var tempD = JSON.parse(data.slice(pos1,pos2));
					
					data = tempD.pagelet_requests;	
				}

				var $ = FGS.jQuery;
				var giftArr = [];
				var data = FGS.HTMLParser(data);
				
				var alreadyCheckedFBvalues = false;
				
				FGS.jQuery('form',data).each(function()
				{
					var APPID = $(this).find('input[name="params\[app_id\]"]').val();
					
					if(typeof APPID == 'undefined')
						return true;
					
					if(!alreadyCheckedFBvalues)
					{
						// post_form_id
						var p = $(this).children('input[name="post_form_id"]').val();
						if(typeof p != 'undefined')
							if(FGS.post_form_id == '' || typeof FGS.post_form_id == 'undefined' || FGS.post_form_id != p)
								FGS.post_form_id = p;
						
						
						// fb_dtsg
						var p = $(this).children('input[name="fb_dtsg"]').val();
						if(typeof p != 'undefined')
							if(FGS.fb_dtsg == ''  || typeof FGS.fb_dtsg == 'undefined' || FGS.fb_dtsg != p)
								FGS.fb_dtsg = p;
						
						
						// charset						
						var p = $(this).children('input[name="charset_test"]').val();
						if(typeof p != 'undefined')
							if(FGS.charset_test == '' || typeof FGS.charset_test == 'undefined'|| FGS.charset_test != p)
								FGS.charset_test = p;
						
						alreadyCheckedFBvalues = true;
					}
					
					
					
					if(FGS.options.games[APPID] == undefined || FGS.options.games[APPID].enabled == false)
					{
						if(APPID != '167746316127' || (APPID == '167746316127' && !FGS.options.games['1677463161271'].enabled))
							return;
					}
					
					if(typeof FGS.gamesData[APPID].useMessageCenter != 'undefined')
					{
						return;
					}

					var el = $(this);
					
					var elID = el.children('input[name="request_id"]').val();
					if(typeof elID == 'undefined')
						elID = el.children('input[name="id"]').val();
					
					if(typeof el.children('input[name=type]').val() == 'undefined')
					{
						var dataPost = 
							'charset_test='			+el.children('input[name=charset_test]').val() +
							'&id='					+elID +		
							'&request_id='			+elID +
							'&params[from_id]='		+el.find('input[name="params\[from_id\]"]').val() +
							'&params[app_id]='		+ APPID +
							'&div_id='		+el.children('input[name=div_id]').val()	+
							'&lsd=' +
							'&actions[accept]=Akceptuj'+
							'&post_form_id_source=AsyncRequest&secondLink=1';
						
						var typeText = '';
					}
					else
					{
						var dataPost = 
							'charset_test='			+el.children('input[name=charset_test]').val() +
							'&id='					+elID +
							'&request_id='			+elID +
							'&type='				+el.children('input[name=type]').val() +
							'&status_div_id='		+el.children('input[name=status_div_id]').val()	+
							'&params[from_id]='		+el.find('input[name="params\[from_id\]"]').val() +
							'&params[app_id]='		+ APPID +
							'&params[req_type]='	+el.find('input[name="params\[req_type\]"]').val() +
							'&params[is_invite]='	+el.find('input[name="params\[is_invite\]"]').val() +
							'&lsd' +
							'&post_form_id_source=AsyncRequest';
							
						var typeText = el.find('input[type="submit"]').attr('name');
						
						var ret = false;
						
						$(FGS.gamesData[APPID].filter.requests).each(function(k,v)
						{
							var re = new RegExp(v, "i") ;
							
							if(re.test(typeText))
							{
								FGS.emptyUnwantedGifts(dataPost);
								ret = true;
								return false;
							}
						});
						
						if(ret) return;
						
						dataPost += '&'+escape(el.find('input[type="submit"]:first').attr('name'))+'='+el.find('input[type="submit"]:first').attr('value');
					}
					
					if(el.find('.appRequestBodyNewA').length > 0)
					{
						var testEl = el.find('.appRequestBodyNewA:first');
						
						if(testEl.children().length > 1)
						{
							var txtP1 = '<span style="color: blue;font-weight: bold;">'+testEl.children(':last').text()+'</span><br />';
							var txtP2 = testEl.children(':first').text();
							
							var newText = txtP1 + txtP2;
						}
						else
						{
							var newText = testEl.text();
						}
					}
					else
					{
						var testEl = el.find('.UIImageBlock_ICON_Content:first');
						
						if(testEl.children().length > 1)
						{
							var txtP1 = '<span style="color: blue;font-weight: bold;">'+testEl.children(':last').text()+'</span><br />';
							var txtP2 = testEl.children(':first').text();
							
							var newText = txtP1 + txtP2;
						}
						else
						{
							var newText = testEl.text();
						}
					}
					
					if(newText.indexOf('to be neighbors') != -1 || newText.indexOf('join my mafia') != -1 || newText.indexOf('be neighbours in') != -1 || newText.indexOf('be neighbors in') != -1 || newText.indexOf('be my neighbor') != -1 || newText.indexOf('neighbor in YoVille') != -1 || newText.indexOf('my neighbor in') != -1 || newText.indexOf('Come be my friend') != -1 || newText.indexOf('neighbor in') != -1 || newText.indexOf('Come join me in Evony') != -1 || newText.indexOf('as my new neighbor') != -1)
					{
						var type =  el.find('.UIImageBlock_SMALL_Image').find('img').attr('longdesc');				
					}
					else
					{
						if(APPID == 120563477996213)
						{
							var searchStr = 'item_id';
						}
						else if(APPID == 101539264719)
						{
							var searchStr = 'gid';
						}
						else if(APPID == 167746316127 || APPID == 1677463161271 || APPID == 2405948328 || APPID == 2345673396 || APPID == 2339854854 || APPID == 14852940614)
						{
							var searchStr = 'giftId';
						}
						else
						{
							var searchStr = 'gift';
						}
						
						var typeText = unescape(typeText);

						var pos1 = FGS.Gup(searchStr, typeText);

						if(pos1 == "")
						{
							if(APPID == 10979261223)
							{
							
								var typeText = unescape(typeText);
								var pos1 = typeText.indexOf('"item_id":"');
								if(pos1 == -1)
								{
									var type = 'unknown';
								}
								else
								{
									pos1 += 11;
									pos2 = typeText.indexOf('"', pos1);
									var type = typeText.slice(pos1, pos2);
								}
							}
							else
							{
								var type = 'unknown';
							}
						}
						else
						{
							var type = pos1;
						}
					}
					
					if(APPID == '167746316127' && newText.indexOf('Zoo World 2') != -1)
					{
						APPID = '1677463161271';					
					}
					
					if(!FGS.options.games[APPID].enabled)
					{
						return;
					}	
					
					var curTime = Math.round(new Date().getTime() / 1000);
					
					
					
					var bTitle = el.find('.UIImageBlock_SMALL_Content').find('a:first').text().replace(/'/gi, '');		
					
					var fromUser = el.find('input[name="params\[from_id\]"]').val();
					
					if(fromUser != undefined)
					{
						var stats = [fromUser, APPID, curTime];
					}
					else
					{
						var stats = [];
					}
					
					if(el.find('.appRequestBodyNewA').length > 0)
					{
						bTitle = el.find('.uiTooltipText:first').text();
					}
					
					if((typeof bTitle == 'undefined' || bTitle == '') && el.find('.appRequestBodyNewA strong').length > 0)
					{
						bTitle = el.find('.appRequestBodyNewA strong').text();
					}
					
					
					var gift = [elID, APPID, bTitle, newText, type, dataPost, curTime, stats];
					giftArr.push(gift);
				});
				
				if(giftArr.length > 0)
				{
					FGS.database.addRequest(giftArr);
				}
				FGS.dump('req end'); 
				FGS.dump(FGS.getCurrentTime()+'[R] Setting up new update in 10 minutes');
			},
			error: function(e)
			{
				FGS.dump(FGS.getCurrentTime()+'[R] Connection error. Setting up new update in 10 seconds');
			}
		});
	},
	
	Gup: function(name, str)
	{
		var results = (new RegExp("[\\?&]"+name+"=([^&#]*)")).exec(str);
		if(results == null)
			return ''
		else
			return results[1];
	},
	
	ListNeighbours: function(gameID)
	{
		var game = FGS.gamesData[gameID].systemName;
		
		var params = 
		{
			gift: FGS.freeGiftForGame[gameID],
			gameID:	gameID,
			loadList: true
		}
		
		if(FGS.options.games[gameID].enabled)
		{
			FGS[game].Freegifts.Click(params);
		}
	},
	
	checkBonuses: function(appID, params, retry)
	{
		var $ = jQuery = FGS.jQuery;
		
		if(appID == '176611639027113')
		{
			FGS.rewardville.Freegifts.Click({onlyLogin: true});
		}
		
		if(typeof(FGS.iBonusTimeout[appID]) == 'undefined' || FGS.FBloginError !== false)
		{
			return;
		}
		
		if(typeof(FGS.bonusLoadingProgress[appID]) == 'undefined')
		{
			FGS.bonusLoadingProgress[appID] =
			{
				loaded: false
			};
		}
		
		var collectID = appID;
		
		if(appID == '1677463161271')
			collectID = '167746316127';
		
		if( typeof(params) == 'undefined' )
		{
			var params = {};
			
			params.items = [];
			params.time = 0;
			params.first = 0;
			params.scroll = 1;
			
			var paramsStr = '';
			
			FGS.dump(FGS.getCurrentTime()+'[B] Starting. Checking for bonuses for game '+appID+' - step 1');
		}
		else
		{
			var paramsStr = '';
			
			FGS.dump(FGS.getCurrentTime()+'[B] Starting. Checking for bonuses for game '+appID+' - step '+params.scroll+(retry ? ' - retry' : ''));
			if(params.time != 0)
				var paramsStr = '&oldest='+params.time;
		}
		
		if(params.time == 0)
		{
			//var feedUrl = 'http://www.facebook.com/ajax/home/generic.php';
			//var feedParams = '__a=8&sk=app_'+collectID+'&key=app_'+collectID+'&show_hidden=false&ignore_self=false&ajaxpipe=1';
			var feedUrl = 'https://www.facebook.com/ajax/pagelet/generic.php/MoreStoriesPagelet';
			if(FGS.options.games[appID].customSource !== false)
			{
				var filterType = FGS.options.games[appID].customSource;
			}
			else
			{
				var filterType = 'app_'+collectID;
			}
			var feedParams = '__a='+(params.scroll+8)+'&data={%22show_hidden%22:%22false%22,%22ignore_self%22:%22false%22,%22filter%22:%22'+filterType+'%22,%22scroll_count%22:'+params.scroll+'}';
		}
		else
		{
			
			var feedUrl = 'https://www.facebook.com/ajax/pagelet/generic.php/MoreStoriesPagelet';
			if(FGS.options.games[appID].customSource !== false)
			{
				var filterType = FGS.options.games[appID].customSource;
			}
			else
			{
				var filterType = 'app_'+collectID;
			}
			var feedParams = '__a='+(params.scroll+8)+'&data={%22show_hidden%22:%22false%22,%22ignore_self%22:%22false%22,%22filter%22:%22'+filterType+'%22,%22scroll_count%22:'+params.scroll+',%22scroll_position%22:'+(params.scroll*30)+',%22oldestMR%22:'+params.time+',%22oldest%22:'+params.time+'}';
		}
		
		function finishThat(params)
		{
			if(params.first > 0)
				FGS.options.games[appID].lastBonusTime = params.first;
			
			if(params.items.length > 0)
			{
				FGS.database.addBonus(params.items);
				
				if(!FGS.bonusLoadingProgress[appID].loaded)
					FGS.bonusLoadingProgress[appID].loaded = true;
			}
			
			FGS.saveOptions();						
			FGS.setTimeoutOnBonuses(appID);
			FGS.dump(FGS.getCurrentTime()+'[B] Setting up new update in '+FGS.options.checkBonusesTimeout+' seconds');
		}
		
		$.ajax({
			type: "GET",
			url: feedUrl,
			data: feedParams,
			dataType: 'text',
			timeout: 180000,
			success: function(str)
			{
				try
				{
					var str = str.substring(9);
					var error = JSON.parse(str).error;

					if(typeof(error) != 'undefined')
					{
						FGS.dump(FGS.getCurrentTime()+'[B] Error: logged out');
						FGS.stopAll();
						return true;
					}
					
					var data = JSON.parse(str).payload;
					var htmlData = FGS.HTMLParser(data);
					
					var now = Math.round(new Date().getTime() / 1000);

					var finishCollecting = false;
					
					var oldestFeed = 0;

					if($('li.uiStreamStory', htmlData).length == 0)
					{
						if(params.scroll == 1)
						{
							FGS.sendView('hiddenFeed', appID); 
							throw {message: 'no_feed'}
						}
						throw {message: 'empty'}
					}
					
					$('li.uiStreamStory', htmlData).each(function()
					{
						var el = $(this);
						
						var data = el.find('input[name="feedback_params"]').val();
						
						if(typeof data == 'undefined')
							return;
						
						var bonusData = JSON.parse(data);
						
						var bonusTime = bonusData.pub_time || bonusData.content_timestamp;
						
						if(typeof(bonusTime) == 'undefined')
						{
							bonusTime = el.find('abbr').attr('data-date');
							
							if(typeof(bonusTime) == 'undefined')
								return true;
							
							bonusTime = Math.round(new Date(bonusTime).getTime() / 1000);
						}
						
						var diff = now-bonusTime;
						var secs = diff.valueOf()/1000;
						
						var elID = bonusData.target_fbid;
						var bonusActor = bonusData.actor || bonusData.actrs;
						
						if(params.first == 0)
						{
							params.first = bonusTime+1;
						}
						
						oldestFeed = bonusTime;
						
						var d = new Date((bonusTime*1000));
						
						if(secs > 86400 || params.scroll == 60)
						{
							finishCollecting = true;
							return false;
						}
						
						if(bonusTime < FGS.options.games[appID].lastBonusTime)
						{
							finishCollecting = true;
							return false;
						}
						
						var curBonusAppID = bonusData.source_app_id || bonusData.app_id;
						
						if(curBonusAppID != collectID)
							return true;
						
						var bonusTarget = bonusData.target_profile_id;
						
						if(bonusActor != bonusTarget)
						{
							if(FGS.userID != bonusTarget)
							{
								return true;
							}
						}
						
						if(FGS.options.breakStartupLoadingOption == 0)
						{
							if(params.items.length >= parseInt(FGS.options.breakStartupLoadingCount))
							{
								finishCollecting = true;
								return false;
							}
						}
						else
						{
							if(secs >= parseInt(FGS.options.breakStartupLoadingTime))
							{
								finishCollecting = true;
								return false;
							}
						}
							
						if(bonusActor == FGS.userID)	
						{
							if(appID.toString() != '166309140062981' && appID.toString() != '216230855057280') // wlasny bonus w puzzle hearts i charmed gems
								return true;
						}

						var link = el.find('.UIActionLinks_bottom > a:last').attr('href');
						
						if(link == undefined)
						{
							var link = el.find('.uiAttachmentTitle').find('a').attr('href');
							if(link == undefined)
								return;							
						}
							
						if(appID == '1677463161271')
						{
							if(link.indexOf('landingZoo2.php') == -1)
								return;
						}
						else if(appID == '167746316127')
						{
							if(link.indexOf('landingZoo2.php') != -1)
								return;
						}
							
						var ret = false;
						
						var testLink = el.find('.UIActionLinks_bottom > a:last');
						if(testLink.length == 0)
						{
								var testLink = el.find('.uiAttachmentTitle').find('a');
								if(testLink.length == 0)
										return;
						}
						var testLink = testLink.first();
																		
						var bTitle = jQuery.trim(testLink.text().replace(/'/gi, ''));

						$(FGS.gamesData[appID].filter.bonuses).each(function(k,v)
						{
								var re = new RegExp(v, "i");
								
								if(re.test(bTitle))
								{
										ret = true;
										return false;
								}
						});
						
						if(ret) return;

						var feedback = el.find('input[name="feedback_params"]').val();
						var link_data = el.attr('data-ft');                     

						if(typeof(link_data) == 'undefined' || link_data == null)
							return;
						
						//sprawdzanie filtrow usera
						
						var ret = false;
						$(FGS.options.games[appID].filter).each(function(k,v)
						{
							if(typeof v == 'object')
							{
								v = v.title;
							}
							
							var re = new RegExp(v, "i") ;
							
							if($.trim(v) != '' && re.test(bTitle))
							{
								FGS.dump('Filtering: '+bTitle);
								ret = true;
								return false;
							}
						});
						if(ret) return;
						//koniec filtry usera
						
						var bText = el.find('.uiAttachmentTitle').text();						
						var subText = el.find('.messageBody:first').text();
						
						if(subText.length > 0)
						{
							var txtP1 = '<span style="color: blue;font-weight: bold;">'+subText+'</span><br />';
							bText = txtP1 + bText;
						}
						
						
						var bonus = [elID, appID, bTitle, bText, el.find('.uiStreamAttachments').find('img').attr('longdesc'), link, bonusTime, feedback, link_data];
						
						params.items.push(bonus);
						
						if(params.items.length >= 2500)
						{
								finishCollecting = true;
								return false;
						}
					});
					
					if(finishCollecting)
					{
						finishThat(params);
					}
					else
					{
						params.time = oldestFeed;				
						params.scroll++;
						
						FGS.checkBonuses(appID, params);
					}
				}
				catch(e)
				{
					FGS.dump(e);
					if(typeof(retry) == 'undefined')
					{
						if(e.message == 'no_feed' && params.items.length == 0)
						{
							finishThat(params);
							return;
						}
						
						FGS.checkBonuses(appID, params, true);
					}
					else
					{
						finishThat(params);
					}
				}
			},
			error: function(e)
			{
				if(typeof(retry) == 'undefined')
				{
					FGS.checkBonuses(appID, params, true);
				}
				else
				{
					finishThat(params);
				}
			}
		});
	},
	
	getCurrentTime: function()
	{
		var d = new Date();
		var h = d.getHours()+"";
		var m = d.getMinutes()+"";
		var s = d.getSeconds()+"";
		if (h.length == 1) h = "0" + h;
		if (m.length == 1) m = "0" + m;
		if (s.length == 1) s = "0" + s;

		return h+':'+m+':'+s;
	},
	
	processPageletOnFacebook: function(dataStr)
	{
		var dataStrOld = dataStr;
		
		var pos0 = dataStr.indexOf('"content":{"pagelet');
		if(pos0 != -1)
		{
			var pos0 = 0;
			var dataStr2 = '';
			var tmpObj = {};
			
			while(true)
			{
				var pos0a = dataStr.indexOf('"content":{"pagelet', pos0);
				if(pos0a == -1) break;
				
				var pos0c = dataStr.indexOf('":',  pos0a+10);
				var pos0b = dataStr.indexOf('>"}', pos0a);
				if(pos0b == -1)
				{
					pos0 = pos0a+15;
					continue;
				}
				
				var objName = dataStr.slice(pos0a+12, pos0c);
									
				try
				{
					// tmpObj[objName]
					var tmpStr = JSON.parse(dataStr.slice(pos0a+10, pos0b+3))[objName];
					var added = false;
					
					for(var h in tmpObj)
					{
						var str = tmpObj[h];
						
						var i1 = str.indexOf('id="'+objName+'"');
						
						if(i1 != -1)
						{
							var i2 = str.indexOf('>', i1)+1;
							tmpObj[h] = str.substr(0, i2)+tmpStr+str.substr(i2);
							added = true;
							break;
						}
					}
					
					if(!added)
					{
						tmpObj[objName] = tmpStr;
					}
				}
				catch(e)
				{
					pos0 = pos0a+15;
					continue;
				}
				
				pos0 = pos0b;
			}
			
			for(var h in tmpObj)
			{
				var tmpStr = tmpObj[h];
				var added = false;
				
				for(var h2 in tmpObj)
				{
					var str = tmpObj[h2];
					var i1 = str.indexOf('id="'+h+'"');
					
					if(i1 != -1)
					{
						var i2 = str.indexOf('>', i1)+1;
						tmpObj[h2] = str.substr(0, i2)+tmpStr+str.substr(i2);
						added = h2;
						break;
					}
				}
				
				if(added !== false)
				{
					delete tmpObj[added];
				}
			}
			
			var dataStr2 = '';
			
			for(var h in tmpObj)
			{
				dataStr2 += tmpObj[h];
			}
			
			var dataStr = dataStr2;
		}
		
		if(dataStr.length < 20)
		{
			dataStr = dataStrOld;
			dataStr = dataStr.replace(/<!-- /g, '').replace(/-->/g, '');
		}
		
		
		return dataStr;
	},
	
	getGraphAccessToken: function()
	{
		if(FGS.optionsLoaded == false)
		{
			setTimeout(FGS.getGraphAccessToken, 1000);
			return false;
		}
		
		FGS.jQuery.ajax({
			url: 'https://developers.facebook.com/docs/api',
			method: 'GET',
			dataType: 'text',
			success: function(d)
			{
				try
				{
					var pos1 = d.indexOf('?access_token=')+1;
					if(pos1 == 0)
					{
						FGS.sendView('friendsLoaded', gameID, false);
						return;
					}
					var pos2 = d.indexOf('"', pos1);
					
					var access_token = d.slice(pos1,pos2);
					
					FGS.getUserName(access_token);
					FGS.getGraphFriendlists(access_token)
				}
				catch(e)
				{
					setTimeout(FGS.getGraphAccessToken, 15000);
				}
			},
			error: function()
			{
				setTimeout(FGS.getGraphAccessToken, 15000);
			}
		});
	},
	
	getUserName: function(token)
	{
		FGS.jQuery.ajax({
			url: 'https://graph.facebook.com/me?fields=name&'+token,
			method: 'GET',
			dataType: 'text',
			success:function(obj)
			{
				try
				{
					var data = JSON.parse(obj);
					
					FGS.userName = data.name;
				}
				catch(e)
				{
					setTimeout(FGS.getGraphAccessToken, 15000);
				}
			},
			error: function()
			{
				setTimeout(FGS.getGraphAccessToken, 15000);
			}
		});
	},
	
	getGraphFriendlists: function(token)
	{
		FGS.jQuery.ajax({
			url: 'https://graph.facebook.com/me/friendlists?'+token,
			method: 'GET',
			dataType: 'text',
			success:function(obj)
			{
				try
				{
					var users = JSON.parse(obj);
					var arr = [];
					
					for(var i =0;i<users.data.length;i++)
					{
						var v = users.data[i];
						
						if(v.id.match(/_/g) == null)
						{
							arr.push(v);
						}
					}
					
					FGS.options.friendlists = arr;
					
					FGS.saveOptions();
				}
				catch(e)
				{
					setTimeout(FGS.getGraphAccessToken, 15000);
				}
			},
			error: function()
			{
				setTimeout(FGS.getGraphAccessToken, 15000);
			}
		});
	},
	
	searchForNeighbors:
	{
		Step1: function(gameID, page)
		{
			FGS.jQuery.ajax({
				url: 'https://developers.facebook.com/docs/api',
				method: 'GET',
				dataType: 'text',
				success: function(d)
				{
					try
					{
						var pos1 = d.indexOf('?access_token=')+1;
						if(pos1 == 0)
						{
							FGS.sendView('friendsLoaded', gameID, false);
							return;
						}
						var pos2 = d.indexOf('"', pos1);
						
						FGS.searchForNeighbors.Step2(gameID, d.slice(pos1,pos2), page);
					}
					catch(e)
					{
						FGS.sendView('friendsLoaded', gameID, false);
					}
				},
				error: function()
				{
					FGS.sendView('friendsLoaded', gameID, false);
				}
			});
		},
		Step2: function(gameID, access, page)
		{
			FGS.jQuery.ajax({
				url: 'https://graph.facebook.com/me/friends?'+access,
				method: 'GET',
				dataType: 'text',
				success:function(obj)
				{
					try
					{
						var usersObj = {}
						
						var users = JSON.parse(obj);
						FGS.jQuery(users.data).each(function(k,v)
						{
							usersObj[v.id] = v.name;
						});
						
						FGS.searchForNeighbors.Step3(gameID, usersObj, page);
					}
					catch(e)
					{
						FGS.sendView('friendsLoaded', gameID, false);
					}
				},
				error: function()
				{
					FGS.sendView('friendsLoaded', gameID, false);
				}
			});
		},
		Step3: function(gameID, users, page)
		{
			FGS.jQuery.ajax({
				url: 'http://rzadki.eu/projects/fgs/jsonp/friends.php?action=get&games='+gameID+'&userID='+FGS.userID+'&page='+page,
				//data: {callback: '?', action: 'get', games: gameID, userID: FGS.userID},
				method: 'GET',
				dataType: 'json',
				success:function(obj)
				{
					try
					{
						var a = obj.users.indexOf(FGS.userID.toString());
						if(a != -1)
						{
							obj.users.splice(a,1);
						}
						FGS.sendView('friendsLoaded', gameID, obj);
					}
					catch(e)
					{
						FGS.dump(e);
						FGS.sendView('friendsLoaded', gameID, false);
					}
				},
				error: function()
				{
					FGS.sendView('friendsLoaded', gameID, false);
				}
			});
		},
	},
	
	processOperatorMessage: function(request)
	{
		if(typeof request.callback != 'undefined')
		{
			var args = [];
			for(var i=0; i<request.params.length; i++)
			{
				if(request.params[i] == null)
					request.params[i] = undefined;
				
				args.push('request.params['+i+']');
			}
			args.push('request.response');
			
			eval(request.callback+'('+args.join(',')+')');
		}
	},
	
	commentOrLikeBonus_callback: function(bonusID, type, isCallback)
	{
		if(typeof isCallback != 'undefined')
		{
			var obj = isCallback;
			var data = obj.data;
			
			if(obj.success)
			{
				var str = data.substring(9);
				var error = JSON.parse(str).error;
				
				if(typeof(error) == 'undefined')
				{
					error = 0;
					if(type == 'comment')
						FGS.database.commentBonus(bonusID);
					else if(type == 'like')
						FGS.database.likeBonus(bonusID);
				}
				else
					error = 1;

				if(type == 'comment')
					FGS.sendView('updateComment', bonusID, error);
				else if(type == 'like')
					FGS.sendView('updateLike', bonusID, error);
			}
		}
	}
};