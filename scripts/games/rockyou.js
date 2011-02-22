FGS.rockyou.Bonuses = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Bonuses.Click(currentType, id, currentURL);
	}
};

FGS.rockyou.Requests = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Requests.Click(currentType, id, currentURL);
	}
};

FGS.rockyou.Freegifts = 
{
	Click: function(params, retry)
	{
		params.zooAppname = 'swall';
		params.zooAppId	  = '9';
		params.checkID = '2601240224';
		params.gameName = 'superwall';
		
		FGS.zooworld.Freegifts.Click(params);
	}
};