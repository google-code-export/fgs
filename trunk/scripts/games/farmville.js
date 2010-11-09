var farmvilleRequests = 
{	
	APPID: '102452128776',
	
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
							
							var i1 = URI.indexOf('addneighbo');
							
							if(i1 != -1)
							{
								console.log('New neighbour');

								info.image = 'icons/reqs/noimage.png';
								info.title = 'New neighbour';
								info.text  = '';
								info.time = Math.round(new Date().getTime() / 1000);
																
								database.updateItem('requests', id, info);
								sendView('requestSuccess', id, info);
								return;
							}

							if($('.giftFrom_img', data).length > 0 && $(".giftConfirm_img",data).length > 0)
							{
								//gift sukces
								console.log('New gift');
								
								info.image = $(".giftConfirm_img",data).children().attr("src");
								info.title = $(".giftConfirm_name",data).children().text();
								info.text  = $(".giftFrom_name",data).children().text();
								info.time = Math.round(new Date().getTime() / 1000);
								
								database.updateItem('requests', id, info);
								sendView('requestSuccess', id, info);
							}
							else if($('.giftFrom_img', data).length == 0 && $(".giftConfirm_img",data).length > 0)
							{
								//gift sukces
								console.log('New gift sent');
								
								info.image = $(".giftConfirm_img",data).children().attr("src");
								info.title = $(".giftConfirm_name",data).children().text();
								info.text  = $(".padding_content",data).find('h3').text();
								info.time = Math.round(new Date().getTime() / 1000);
								
								database.updateItem('requests', id, info);
								sendView('requestSuccess', id, info);
							}
							else if($('.giftLimit', data).length > 0)
							{
								info.error = 'limit';
								info.time = Math.round(new Date().getTime() / 1000);
								
								database.updateErrorItem('requests', id, info);
								sendView('requestError', id, info);
							}
							else
							{
								if(typeof(retry) == 'undefined')
								{
									console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
									farmvilleRequests.Click(id, dataPost, true);
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
								farmvilleRequests.Click(id, dataPost, true);
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
						farmvilleRequests.Click(id, dataPost, true);
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
					farmvilleRequests.Click(id, dataPost, true);
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


var farmvilleBonuses = 
{
	APPID: '102452128776',

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
				var dataFull = data;
				data = data.substr(data.indexOf('<body'),data.lastIndexOf('</body'));

				if($('.inputsubmit[value="OK"]',data).length > 0)
				{
					console.log(getCurrentTime()+'[B] Bonus already claimed - deleting bonus with ID: '+id);
					
					info.error = 'limit';
					info.time = Math.round(new Date().getTime() / 1000);
					
					database.updateErrorItem('bonuses', id, info);
					sendView('bonusError', id, info);						
				}
				else if($('.main_giftConfirm_cont', data).length > 0)
				{
				
					var i1 = dataFull.indexOf('URL=');
					if(i1 != -1)
					{
						var i2 = dataFull.indexOf('" />', i1);
						url = decodeStrings('http://apps.facebook.com'+dataFull.slice(i1+4,i2));
						
						var giftReceiveUrl = url;
					}
					else
					{
						url = unescape(url);
						url = url.substr(url.indexOf('next')+5);
						
						var giftReceiveUrl = 'http://apps.facebook.com/onthefarm/'+url;
					}
					
					
					var num = 1;

					var giftReceivePost = $('.inner_giftConfirm_cont', data).find('form:nth-child('+num+')').serialize()+'&'+escape($('.inner_giftConfirm_cont', data).find('form:nth-child('+num+')').find('input[type="submit"]').attr('name'))+'='+$('.inner_giftConfirm_cont', data).find('form:nth-child('+num+')').find('input[type="submit"]').attr('value');
					
					info.title = $(".giftConfirm_name",data).children().text();
					info.image = $(".giftConfirm_img",data).children().attr("src");
					info.text  = $(".main_giftConfirm_cont", data).find('h3').text();
					
					$.ajax({
						type: "POST",
						data: giftReceivePost,
						url: giftReceiveUrl,
						success: function(d)
						{
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
								farmvilleBonuses.Click(id, url, true);
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
				else				
				{
					if(typeof(retry) == 'undefined')
					{
						var i1 = dataFull.indexOf('URL=');
						if(i1 != -1)
						{
							var i2 = dataFull.indexOf('" />', i1);
							var newUrl = 'http://apps.facebook.com'+dataFull.slice(i1+4,i2);
							farmvilleBonuses.Click(id, decodeStrings(newUrl), true);
						}
						else
						{
							info.error = 'receiving';
							info.time = Math.round(new Date().getTime() / 1000);
							database.updateErrorItem('bonuses', id, info);
							sendView('bonusError', id, info);
						}
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
					farmvilleBonuses.Click(id, url, true);
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