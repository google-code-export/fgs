var treasureRequests = 
{	
	APPID: '234860566661',
	
	Click: function(id, dataPost, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "POST",
			url: 'http://www.facebook.com/ajax/reqs.php?__a=1',
			data: dataPost,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var strTemp = data;
					var i1      =   strTemp.indexOf('goURI');
					if (i1 == -1) throw {message:"Cannot find goURI in page"}

					var i2        =   strTemp.indexOf(');"]',i1);
					strTemp   =   "'"+strTemp.slice(i1+6,i2)+"'";

					eval("strTemp =" + strTemp);

					var URI = JSON.parse(strTemp);
					
					$.ajax({
						type: "GET",
						url: URI,
						dataType: 'text',
						success: function(data2)
						{
							var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
							

							if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length == 0)
							{
							
								if(data.indexOf('You helped train the Dragon') != -1)
								{
									info.image = $(".giftFrom_img",data).children().attr("src");
									info.title = 'Train the Dragon';
									info.text  = 'You helped train the Dragon!';
									info.time = Math.round(new Date().getTime() / 1000);
								}
								else
								{
									info.image = $(".giftFrom_img",data).children().attr("src");
									info.title = 'New neighbour';
									info.text  = $(".giftFrom_name",data).children().text();
									info.time = Math.round(new Date().getTime() / 1000);
								}
								
								database.updateItem('requests', id, info);
								sendView('requestSuccess', id, info);
							}
							else if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length > 0)
							{
								console.log('New gift');
								
								info.image = $(".giftConfirm_img",data).children().attr("src");
								info.title = $(".giftConfirm_img",data).siblings('p').text();
								info.text  = $(".giftFrom_img",data).siblings('p').text();
								info.time = Math.round(new Date().getTime() / 1000);
								
								database.updateItem('requests', id, info);
								sendView('requestSuccess', id, info);
							}
							else
							{
								if(data.indexOf("explorer's pack?") != -1)
								{
									var URL = unescape($('.acceptButtons', data).children('a:first').attr('href'));
																	
									treasureRequests.Click2(id, URL);
									return;
								}
								
								if(typeof(retry) == 'undefined')
								{
									console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
									treasureRequests.Click(id, dataPost, true);
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
								treasureRequests.Click(id, dataPost, true);
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
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						treasureRequests.Click(id, dataPost, true);
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
					treasureRequests.Click(id, dataPost, true);
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
	Click2: function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "GET",
			url: url,
			dataType: 'text',
			success: function(data2)
			{
				var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));

				if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length > 0)
				{
					console.log('New gift');
					
					info.image = $(".giftConfirm_img",data).children().attr("src");
					info.title = $(".giftConfirm_img",data).siblings('p').text();
					info.text  = $(".giftFrom_img",data).siblings('p').text();
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateItem('requests', id, info);
					sendView('requestSuccess', id, info);
				}
				else
				{
					info.error = 'receiving';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateErrorItem('requests', id, info);
					sendView('requestError', id, info);
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					treasureRequests.Click2(id, url, true);
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


var treasureBonuses = 
{
	APPID: '234860566661',

	Click:	function(id, url, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
	
		console.log(getCurrentTime()+'[B] Receiving bonus with ID: '+id);
		
		$.ajax({
			type: "GET",
			url: url,
			success: function(data)
			{
				data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));
				
				try
				{
					
					var URL = $('.acceptButtons', data).children('a:first').attr('href');
					if(typeof(URL) == 'undefined') throw {message: 'No url'}
					
					var URL = unescape(URL);

					$.ajax({
						type: "GET",
						url: URL,
						success: function(d)
						{
							if(d.indexOf('<h1>Oh no!</h1>') != -1)
							{
								info.error = 'limit';
								info.time = Math.round(new Date().getTime() / 1000);
								
								database.updateErrorItem('bonuses', id, info);
								sendView('bonusError', id, info);	
								return;
							}
											
							
							if($(".giftConfirm_img",d).siblings('p').length != 0)
							{
								info.title = $(".giftConfirm_img",d).siblings('p').text();
							}
							else
							{
								info.title = 'Celebration';
							}
							info.image = $(".giftConfirm_img",d).children().attr("src");
							info.text = '';
							info.time = Math.round(new Date().getTime() / 1000);
							
							database.updateItem('bonuses', id, info);
							sendView('bonusSuccess', id, info);
															
							console.log(getCurrentTime()+'[B] Bonus collected SUCCESSFULLY - ID: '+id);
						},
						error: function()
						{
							if(typeof(retry) == 'undefined')
							{
								console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
								treasureBonuses.Click(id, url, true);
							}
							else
							{
								info.error = 'connection';
								info.time = Math.round(new Date().getTime() / 1000);
								sendView('bonusError', id, info);
							}
						}
					});
				}
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						treasureBonuses.Click(id, url, true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('bonuses', id, info);
						sendView('bonusError', id, info);	
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					treasureBonuses.Click(id, url, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('bonusError', id, info);
				}
			}
		});
	},
};