FGS.pioneertrail.Freegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/pioneertrail/?crt=&aff=tab&src=direct&newUser=&sendkey=&ref=tab'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataStr = FGS.processPageletOnFacebook(dataStr);
				var dataHTML = FGS.HTMLParser(dataStr);				
				
				try
				{
					var url = $('form[target]', dataHTML).not(FGS.formExclusionString).first().attr('action');
					var params2 = $('form[target]', dataHTML).not(FGS.formExclusionString).first().serialize();
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_266989143414', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					params.step1url = url;
					params.step1params = params2;
					
					FGS.pioneertrail.Freegifts.ClickForm(params);
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
	
	ClickForm: function(params, retry)
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
					var dataHTML = FGS.HTMLParser(dataStr);
				
					var tst = new RegExp(/<iframe[^>].*src=\s*["].*populateFbCache\.php[?]([^"]+)/m).exec(dataStr);
					if(tst == null) throw {message:'no pioneertrail iframe tag'}
					
					var zyParams = {}
					
					var qry = tst[1].replace(/&amp;/g,'&');
					
					for(var idd in FGS.jQuery.unparam(qry))
					{
						if(idd.indexOf('zy') == 0)
						{
							zyParams[idd] = FGS.jQuery.unparam(qry)[idd];
						}
					}
					params.zyParam = $.param(zyParams);
					
					FGS.pioneertrail.Freegifts.Click2(params);
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
			url: 'http://zc-prod-pt-fb.frontier.zynga.com/gifts_send.php?inner_iframe=1&'+params.zyParam+'&overlayed=1&'+params.step1params+'#overlay',
			data: 'giftRecipient=&ref=tab&send_gift=Ready&gift='+params.gift+'&'+params.zyParam,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var pos1 = dataStr.indexOf('mfs.setDataSet([');
					
					if(pos1 == -1) throw {message: 'no people'}
					pos1+=15;
					
					var pos2 = dataStr.indexOf(']);', pos1)+1;
					
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
						
						x[p.key] = {'name': p.value};
						
						finalArr.push(x);
						
						friends.push(p.key);						
					}
					
					
					var s0 = dataStr.indexOf('ZRequests2.sendRequests(result.data');
					var s1a = dataStr.indexOf('"', s0)+1;
					var s1b = dataStr.indexOf('"', s1a);
					
					var message = dataStr.slice(s1a, s1b);
					
					var s0 = dataStr.indexOf('this.sendToServer');
					var s1 = dataStr.indexOf('url:', s0);
					var s1a = dataStr.indexOf("'", s1)+1;
					var s1b = dataStr.indexOf("'", s1a);
					
					params.finishRequestUrl = dataStr.slice(s1a, s1b);
					
					var s0 = dataStr.indexOf('var requestData');
					var s1a = dataStr.indexOf("{", s0);
					var s1b = dataStr.indexOf("};", s1a)+1;
					
					params.requestDataPost = JSON.parse(dataStr.slice(s1a, s1b));
					
					params.requestDataPost.view = 'Pioneer Trail Friends';
					params.requestDataPost.ref = 'tab';
					params.requestDataPost.type = 'freegift';
					
					params.items = finalArr;
					
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('updateNeighbors', finalArr, params.gameID);
						return;
					}
					
					var reqData = {};
					
					reqData.filters = JSON.stringify( [{name: 'PT Friends', user_ids: friends}] );
					reqData.message = message;
					
					params.reqData = reqData;
					params.channel = 'http://zc-prod-pt-fb.frontier.zynga.com/';
					
					FGS.getAppAccessTokenForSending(params, function(params, d) {
						var pos0 = d.indexOf('&result=')+8;
						var pos1 = d.indexOf('"', pos0);
						
						var str = d.slice(pos0, pos1);
						var response = JSON.parse(decodeURIComponent(JSON.parse('{"abc": "'+str+'"}').abc));
					
					console.log(response);

						if (response && response.request_ids) {
							var requestIds = response.request_ids;
						} else if (response && response.request && response.to) {
							var requestIds = response.request;
						}
						else {
							return false;
						}
						
						var postData = '1=1';
						for (var i = 0; i < params.sendTo.length; i ++) {
							var pInt = parseInt(params.sendTo[i]);
							if(!isNaN(pInt)) {
							postData += '&ids[]=' + params.sendTo[i];
						}
						}

						postData += '&request_ids=' + requestIds;
						for (prop in params.requestDataPost) {
							postData += '&' + prop + '=' + params.requestDataPost[prop];
						}
						
						$.post(params.finishRequestUrl, postData);
					});
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

FGS.pioneertrail.Requests = 
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
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_266989143414', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.pioneertrail.Requests.Click2(currentType, id, url, params);
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
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(FGS.checkForNotFound(redirectUrl) === true)
					{
						FGS.endWithError('not found', currentType, id);
					}
					else if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, params, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+21);
						var url = dataStr.slice(pos1+21, pos2);
						
						FGS.pioneertrail.Requests.Click(currentType, id, url);
						return;
					}
					
					var pos1 = dataStr.indexOf("top.location.href='");
					if(pos1 != -1 && dataStr.slice(pos1-1,pos1) != '"')
					{
						var pos2 = dataStr.indexOf("'", pos1+19);
						var url = dataStr.slice(pos1+19, pos2);
						
						FGS.pioneertrail.Bonuses.Click(currentType, id, url);
						return;
					}
					
					
					if($('div.giftLimit', dataHTML).length > 0)
					{
						var error_text = $.trim($('div.giftLimit', dataHTML).text());
						FGS.endWithError('limit', currentType, id, error_text);					
						return;
					}				
				
					if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img",dataHTML).length == 0)
					{
						info.image = $(".giftFrom_img",dataHTML).children().attr("longdesc");
						info.title = 'New neighbour';
						info.text  = $(".giftFrom_name",dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
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
								destName: $('.giftFrom_img', dataHTML).find('img').attr('title'),
								}
						}
						info.thanks = sendInfo;					
						
						info.image = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
						info.title = $(".giftConfirm_name",dataHTML).children().text();
						info.text  = $(".giftFrom_name",dataHTML).children().text();
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

FGS.pioneertrail.Bonuses = 
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
					
					if(!url)
					{
						var paramTmp = FGS.findIframeAfterId('#app_content_266989143414', dataStr);
						if(paramTmp == '') throw {message: 'no iframe'}
						var url = paramTmp;
					}
					
					FGS.pioneertrail.Bonuses.Click2(currentType, id, url, params);
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
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				try
				{
					var pos1 = dataStr.indexOf('top.location.href = "');
					if(pos1 != -1)
					{
						var pos2 = dataStr.indexOf('"', pos1+21);
						var url = dataStr.slice(pos1+21, pos2);
						
						FGS.pioneertrail.Bonuses.Click(currentType, id, url);
						return;
					}
					
					var pos1 = dataStr.indexOf("top.location.href='");
					if(pos1 != -1 && dataStr.slice(pos1-1,pos1) != '"')
					{
						var pos2 = dataStr.indexOf("'", pos1+19);
						var url = dataStr.slice(pos1+19, pos2);
						
						FGS.pioneertrail.Bonuses.Click(currentType, id, url);
						return;
					}
					
					if($('.fail_message', dataHTML).length > 0)
					{
						var error_text = $('.fail_message', dataHTML).text();
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					else if($('.morePending_bttn', dataHTML).length > 0)
					{
						var giftReceiveUrl = $('.morePending_bttn > form:first', dataHTML).attr("action");
						var giftReceivePost = $('.morePending_bttn > form:first', dataHTML).serialize();
						
						var testStr = $('.gift_from > h3', dataHTML).text();
						var testStr = testStr.replace(/^\s+|\s+$/g, '');
						
						if(testStr == 'ToHelp' || testStr == 'To Help')
						{
							var tempTitle = $(".morePending_cont > div.text:first", dataHTML).text().replace('Help out and receive', '');
						}
						else
						{
							var tempTitle = $(".giftConfirm_name",dataHTML).children().text();
						}
						
						var tempImage = $(".giftConfirm_img",dataHTML).children().attr("longdesc");
						
						if($.trim(tempTitle).match(/^a \d{1,5} XP$/))
						{
							var tempImage = 'http://assets.frontier.zgncdn.com/production/R.1.6.018.001.67197/assets/assets/inventory/xp.png';
						}
						else if($.trim(tempTitle).match(/^a \d{1,5} Coins$/))
						{
							var tempImage = 'http://images.wikia.com/pioneertrail/images/a/a3/Coins-icon.png';
						}
						
						FGS.jQuery.ajax({
							type: "POST",
							data: giftReceivePost,
							url: giftReceiveUrl,
							success: function(d)
							{
								if(d.indexOf('giftLimit') != -1)
								{
									var pos1 = d.indexOf('class="giftLimit')+16;
									pos1 = d.indexOf('>', pos1)+1;
									var pos2 = d.indexOf('div>', pos1)-2;
									
									var error_text = $.trim(d.slice(pos1,pos2));
									
									if(error_text.indexOf('your friend will still get their') != -1)
									{
										info.title = tempTitle;
										info.image = tempImage;
										info.text = '';
										info.time = Math.round(new Date().getTime() / 1000);
									
										FGS.endWithSuccess(currentType, id, info);
									}
									else
									{
										FGS.endWithError('other', currentType, id, error_text);
									}
								}
								else
								{
									
									info.title = tempTitle;
									info.image = tempImage;
									info.text = '';
									info.time = Math.round(new Date().getTime() / 1000);
								
									FGS.endWithSuccess(currentType, id, info);
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
};