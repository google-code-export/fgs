	var bkP = chrome.extension.getBackgroundPage().FGS;

	
	function ListNeighbours(gameID, neigh)
	{
		var game = bkP.gamesData[gameID].systemName;
		var opt = 'SendFreeGiftsList';
	
		$('.sendToNeighboursList','div#'+game+opt).html('<br style="clear:both" />');

		var html = '';
		
		$(neigh).each(function(k,val)
		{
			for(var i in val)
			{
				var id = i;
			}
			var v = val[id];
			
			
			if(v.name.length > 20)
			{
				var nameText = v.name.substring(0,20)+'...';
			}
			else
			{
				var nameText = v.name;
			}
			
			html += '<div style="float: left; width: 250px;margin-right: 10px;"><input type="checkbox" neighName="'+v.name+'" gameID="'+gameID+'" neighID="'+id+'" value="'+id+'" class="neighborCheckbox" name="neighArr[]"> <img src="icons/favourite-bw.png" class="addToSendFav" title="Click to add to favourites"> '+nameText+'</div>';
		});
		
		$('.sendToNeighboursList','div#'+game+opt).children('br').before(html);

		
		$('.neighborCheckbox', 'div#'+game+opt).click(processSelectSendTo);	
		$('.addToSendFav',$('.sendToNeighboursList','div#'+game+opt)).bind('click',processAddFavourite);
		
		$('.sendToFavouritesList','div#'+game+opt).html('');
		
		bkP.database.db.transaction(function(tx)
		{
			tx.executeSql("SELECT * FROM neighbours where gameID = ?", [gameID], function(tx, res)
			{
				for(var i = 0; i < res.rows.length; i++)
				{
					$('input[neighID="'+res.rows.item(i)['id']+'"]', 'div#'+game+opt).siblings('img').trigger('click');
				}
				$('.sendToFavouritesList','div#'+game+opt).append('<br style="clear:both" />');
			}, null, bkP.database.onSuccess, bkP.database.onError);
		});

	}
	
	function ClearManualBonuses(gameID)
	{
		var game = bkP.gamesData[gameID].systemName;
		
		bkP.database.db.transaction(function(tx)
		{
			$('#'+game+'ManualBonusesList').children('div').not('.hideScreenLocked').each(function()
			{
				var elID = $(this).attr('id');
				if($(this).hasClass('manualRequest'))
				{
					var postData = $(this).attr('postData');
					var i1 = postData.indexOf('&actions%5B');
					
					var postData = postData.slice(0,i1);
					postData += '&actions[reject]=Ignore';
					bkP.emptyUnwantedGifts(postData);
					tx.executeSql('DELETE FROM requests where id = ? and gameID = ?', [elID, gameID], bkP.database.onSuccess, bkP.database.onError);
				}
				else
				{
					tx.executeSql('DELETE FROM bonuses where id = ? and gameID = ?', [elID, gameID], bkP.database.onSuccess, bkP.database.onError);
				}
				
			
				$(this).remove();
			});
			updateCount(gameID);			
		});
	}

	function loadBonuses()
	{
		bkP.database.db.transaction(function(tx)
		{
			tx.executeSql('delete from neighbours where exists (select 1 from neighbours t2 where neighbours.id = t2.id and neighbours.gameID = t2.gameID and  neighbours.autoID > t2.autoID)');
			
			if(bkP.options.deleteHistoryOlderThan != 0)
			{
				var now = Math.floor(new Date().getTime()/1000);
				var newerThan = now-bkP.options.deleteHistoryOlderThan;
				
				tx.executeSql("DELETE FROM bonuses where status = '1' and time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
				tx.executeSql("DELETE FROM requests where status = '1' and time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
				tx.executeSql("DELETE FROM freegifts where time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
			}
			
			if(bkP.options.deleteOlderThan != 0)
			{
				var now = Math.floor(new Date().getTime()/1000);
				var newerThan = now-bkP.options.deleteOlderThan;
				
				tx.executeSql("DELETE FROM bonuses where status = '0' and time < ? ", [newerThan], bkP.database.onSuccess, bkP.database.onError);
			}

			// wczytywanie bonusow czekajacych			
			tx.executeSql("SELECT * FROM bonuses where status = '0' order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				var htmlsManual = {};				
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}

					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
						htmlsManual[gameID] = '';
					}
					
					
					if(checkIfBonusIsManual(gameID, v.title))
					{
						htmlsManual[gameID] += getNewManualBonusRow(gameID, v);
					}
					else
					{		
						htmls[gameID] += getNewBonusRow(gameID, v);
					}
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					$('div#'+game+'ManualBonusesList').prepend(htmlsManual[tmp]);
					$('div#'+game+'ManualBonusesList').children('div.manualBonus').removeClass('awaitingClick').click(processManualBonusClick);
					
					$('div#'+game+'BonusesPendingList').prepend(htmls[tmp]);
					$('div#'+game+'BonusesPendingList').children('div').removeClass('awaitingClick').click(processBonusClick);
					
					selectFirstTab(tmp);
				}
				
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM requests where status = '0' order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				var htmlsManual = {};				
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}

					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
						htmlsManual[gameID] = '';
					}

					if(checkIfRequestIsManual(gameID, v.text))
					{
						htmlsManual[gameID] += getNewManualRequestRow(gameID, v);
					}
					else
					{		
						htmls[gameID] += getNewRequestRow(gameID, v);
					}
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					$('div#'+game+'ManualBonusesList').prepend(htmlsManual[tmp]);
					$('div#'+game+'ManualBonusesList').children('div.manualRequest').removeClass('awaitingClick').click(processManualRequestClick);
					
					$('div#'+game+'RequestsPendingList').prepend(htmls[tmp]);
					$('div#'+game+'RequestsPendingList').children('div').removeClass('awaitingClick').click(processRequestsClick);
				}
				
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM bonuses where status = '1' order by time DESC", [], function(tx, res)
			{
				var htmls = {};
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}
					
					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
					}
					
					
					htmls[gameID] += getBonusHistoryRow(v);
				}
				
				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'BonusesHistoryList').prepend(htmls[tmp]);
					
					
					$('div#'+game+'BonusesHistoryList').children('div.receivingErrorClass').removeClass('receivingErrorClass').css('cursor', 'pointer !important').attr('title', 'Click to manually receive').click(processManualBonusClick);
					
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.bonusError').css('height', '23px');
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.likeBonus').click(processLikeBonus);
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.commentBonus').click(processCommentBonus);
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').find('.sendBack').click(processSendBack);	
										
					$('div#'+game+'BonusesHistoryList').children('div.noErrorClass').removeClass('noErrorClass');
				}
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM requests where status = '1' order by time DESC", [], function(tx, res)
			{
				var htmls = {};				
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}
					
					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
					}

					htmls[gameID] += getRequestHistoryRow(v);
				}

				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'RequestsHistoryList').prepend(htmls[tmp]);

					$('div#'+game+'RequestsHistoryList').children('div.receivingErrorClass').removeClass('receivingErrorClass').css('cursor', 'pointer !important').attr('title', 'Click to manually receive').click(processManualRequestClick);
					
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').find('.bonusError').css('height', '23px');
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').find('.sendBack').click(processSendBack);	
					$('div#'+game+'RequestsHistoryList').children('div.noErrorClass').removeClass('noErrorClass');
				}

				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);

			tx.executeSql("SELECT * FROM freegifts order by time DESC", [], function(tx, res)
			{
				
				var htmls = {};
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var v = res.rows.item(i);
					var gameID = v.gameID;

					if(!bkP.options.games[gameID].enabled)
					{
						continue;
					}
					
					if(typeof(htmls[gameID]) == 'undefined')
					{
						htmls[gameID] = '';
					}
					
					htmls[gameID] += getGiftHistoryRow(gameID, res.rows.item(i), res.rows.item(i).is_thank_you);
				}

				for(var tmp in htmls)
				{
					var game = bkP.gamesData[tmp].systemName;
					
					$('div#'+game+'SendFreeGiftsHistoryList').prepend(htmls[tmp]);
				}
				updateLoaded();
			}, bkP.database.onSuccess, bkP.database.onError);
			
			
			for(var gameID in bkP.options.games)
			{
				if(!bkP.options.games[gameID].enabled)
				{
					continue;
				}
				prepareNeighboursList(gameID);
			}
		});
	}