FGS.rockyoupets.Bonuses = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Bonuses.Click(currentType, id, currentURL);
	}
};

FGS.rockyoupets.Requests = 
{	
	Click: function(currentType, id, currentURL)
	{
		FGS.zooworld.Requests.Click(currentType, id, currentURL);
	}
};

FGS.rockyoupets.Freegifts = 
{
	Click: function(params, retry)
	{
		params.zooAppname = 'superpets';
		params.zooAppId	  = '59';
		params.checkID = '44111361632';
		params.gameName = 'rysuperpets';
		
		FGS.zooworld.Freegifts.Click(params);
	}
};