FGS.cartown.Requests = 
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
					var txt = $('#app256799621935_main_body', dataHTML).find('.popup').children('h2').text();
					
					if(txt.indexOf('This gift has expired') != -1)
					{
						var error_text = 'This gift has expired.';
						FGS.endWithError('limit', currentType, id, error_text);	
						return;
					}
					
					if($('.item-holder',dataHTML).length > 0)
					{
						info.image = $('.item-holder',dataHTML).find('img:first').attr('src');
						info.title = $('.item-holder',dataHTML).find('.title:first').text();
					}
					else if($('.popup',dataHTML).length > 0)
					{
						info.image = $('.popup',dataHTML).find('img:first').attr('src');
						info.title = txt;
					}
					else
					{
						throw {message: 'unknown page'}
					}
					
					
					info.text  = txt;
					info.time = Math.round(new Date().getTime() / 1000);
					
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
	}
};