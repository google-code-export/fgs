/*
setTimeout(checkContainer, 100);

function checkContainer()
{
	if($('#requestScroller').children().length > 1)
	{
		$('#requestScroller').children().each(function()
		{
			if($(this).find('.fgsLinkGifts').length == 0)
			{
				$(this).find('.sectionHeader').append('<span style="position: absolute;right: 15px; top: 12px; display: block; font-family: Arial; color: SteelBlue; text-decoration: none; font-size: 12px; font-weight: bold;"><a class="fgsLinkExpand" style="font-family: Arial; color: fireBrick; text-decoration: none; font-size: 12px; font-weight: bold;" href="javascript:void(0);" onmouseover="this.style.color=\'SteelBlue\'" onclick="javascript:(function(el){ jQuery(el).closest(\'[id^=\\\'sectionContainer_\\\']').find(\'.textCell\').click(); })(this)" onmouseout="this.style.color=\'fireBrick\'">Expand all</a> - <a class="fgsLinkGifts" style="font-family: Arial; color: fireBrick; text-decoration: none; font-size: 12px; font-weight: bold;" href="javascript:void(0);" onmouseover="this.style.color=\'SteelBlue\'" onclick="javascript:(function(el){ jQuery(el).parent().parent().parent().find(\'[id^=\\\'acceptButton_\\\']:first\').each(function() { console.log(\'a\'); })(this)" onmouseout="this.style.color=\'fireBrick\'">Collect all</a> (Powered with <img style="width: 14px; height: 14px" src="'+chrome.extension.getURL('icons/icon16.png')+'" /> )</span>');
				$(this).find('.fgsLinkGifts').click(processClick);
			}
		});
		setTimeout(checkContainer, 100);
	}
	else
	{
		setTimeout(checkContainer, 100);
	}
}

function processClick(el)
{
	
	$(this).parent().parent().parent().find('[id^="acceptButton_"]:first').each(function()
	{
		//var e = $(this).data("events");
		//console.log(e);
	});
}
*/