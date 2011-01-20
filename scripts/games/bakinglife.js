FGS.bakinglifeRequests = 
{
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
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
						$retry(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
					return;
				}
				
				try
				{
					var src = FGS.findIframeAfterId('#app_content_338051018849', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
					FGS.bakinglifeRequests.Click2(currentType, id, src);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	},
	
	Click2: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
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
					if(dataStr.indexOf('Make sure you click on the request within one week') != -1)
					{
						var error_text = 'Make sure you click on the request within one week.';
						FGS.endWithError('limit', $type, id, error_text);
						return;
					}
					
					if($('.gift', dataHTML).length > 0)
					{
						info.image = $(".gift",dataHTML).children('img').attr("src");
						info.title = $(".gift",dataHTML).children('img').attr("alt");
						info.text  = $(".friendContainer2",dataHTML).find('b:first').text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess($type, id, info);
					}
					else if($('td.boxPadding', dataHTML).find('h1').length > 0)
					{
						info.image = $('td.boxPadding', dataHTML).find('img:first').attr('src');
						
						if($('td.boxPadding', dataHTML).find('.bigGreen').length > 0)
						{
							info.title = $('td.boxPadding', dataHTML).find('.bigGreen').text();
						}
						else
						{
							info.title = $('td.boxPadding', dataHTML).find('h1:first').text();
						}
						info.text  = $.trim($('td.boxPadding', dataHTML).find('p:first').text());
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess($type, id, info);
					}
					else
					{
						throw {message: dataStr}
					}
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	}
};

FGS.bakinglifeBonuses = 
{
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
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
						$retry(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
					return;
				}
								
				try 
				{
					var src = FGS.findIframeAfterId('#app_content_338051018849', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					FGS.bakinglifeBonuses.Click2(currentType, id, src);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var out = $.trim($('td.boxPadding', dataHTML).find('p:first').text());
					var out2 = $.trim($('td.boxPadding', dataHTML).find('h1:first').text());
					
					if(out.indexOf('already received') != -1 || out.indexOf('Make sure you click on the story within') != -1 || out2.indexOf('Bad News!') != -1 || out2.indexOf('Oops!') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', 'bonuses', id, error_text);						
						return;
					}
					
					info.image = $('td.boxPadding', dataHTML).find('img:first').attr('src');
					
					if($('td.boxPadding', dataHTML).find('.bigGreen').length > 0)
					{
						info.title = $('td.boxPadding', dataHTML).find('.bigGreen').text();
					}
					else
					{
						info.title = $('td.boxPadding', dataHTML).find('h1:first').text();
					}
					info.text  = $.trim(out);
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess($type, id, info);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	},
}