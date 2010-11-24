var fishvilleRequests = 
{	
	Click: function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			dataType: 'text',
			success: function(data2)
			{
				var dataFull = data2;
				var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
				
				if($('#app151044809337_iframe_canvas', data). length > 0)
				{
					fishvilleRequests.Click2(id, $('#app151044809337_iframe_canvas', data).attr('src'));
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						fishvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					fishvilleRequests.Click(id, URI+'&_fb_noscript=1', true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('requestError', id, info);
				}
			}
		});
	},
	Click2: function(id, URI, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: URI,
			dataType: 'text',
			success: function(data2)
			{
				var data = data2.slice(data2.indexOf('<div class="padding_content center">'),data2.lastIndexOf('</div'))+'</div>';	
				
				
				if(data2.indexOf('seem to have already accepted this request') != -1)
				{
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					info.error_text = 'Sorry, you seem to have already accepted this request from the Message Center';
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);		
				}
				else if($('.reqFrom_img', data).length > 0)
				{
					info.image = $(".reqFrom_img",data).children().attr("src");
					info.title = 'New neighbour';
					info.text  = $(".reqFrom_name",data).children().text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length > 0)
				{
					var sendInfo = '';
					
					var tmpStr = unescape(URI);
					
					var i1 = tmpStr.indexOf('&gift=');
					if(i1 != -1)
					{
						var i2 = tmpStr.indexOf('&', i1+1);
							
						var giftName = tmpStr.slice(i1+6,i2);
						
						var i1 = tmpStr.indexOf('&senderId=');
						var i2 = tmpStr.indexOf('&', i1+1);
						
						var giftRecipient = tmpStr.slice(i1+10,i2);						
							
						sendInfo = {
							gift: giftName,
							destInt: giftRecipient,
							destName: $(".giftFrom_name",data).children().text(),
							}
					}
					//info.thanks = sendInfo;					
					
					info.image = $(".giftConfirm_img",data).children().attr("src");
					info.title = $(".giftConfirm_name",data).children().text();
					info.text  = $(".giftFrom_name",data).children().text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else
				{							
					if(typeof(retry) == 'undefined')
					{
						fishvilleRequests.Click2(id, URI+'&_fb_noscript=1', true);
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					fishvilleRequests.Click2(id, URI+'&_fb_noscript=1', true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('requestError', id, info);
				}
			}
		});
	}
};