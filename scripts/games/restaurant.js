FGS.restaurantRequests = 
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
					if(dataStr.indexOf('have already accepted this gift or it has expired') != -1)
					{
						var error_text = 'You have already accepted this gift or it has expired.';					
						FGS.endWithError('limit', $type, id, error_text);
						return;
					}

					var tempText = $('#app43016202276_gift_text', dataHTML).text();
					info.text = tempText;
					
					var i1 = tempText.indexOf('You have accepted ');
					if(i1 != -1)
					{
						var i2 = tempText.indexOf('from', i1);
						if(i2 != -1)
						{
							info.title = tempText.slice(i1+18,i2);
						}
						else
						{
							info.title = tempText;
						}
					}
					else
					{
						info.title = tempText;
					}
					
					
					info.image = $('#app43016202276_gift_img', dataHTML).children('img').attr('src');
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
	}
};