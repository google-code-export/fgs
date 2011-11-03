var port = chrome.extension.connect({name: "FGSoperator"});

port.onMessage.addListener(function(obj) {
	
	if(typeof obj.arguments.url != 'undefined')
	{
		$.ajax({
			type: obj.arguments.type,
			url: obj.arguments.url,
			data: obj.arguments.data,
			dataType: 'text',
			success: function(d) {
				obj.response = {
					success: true,
					data: d
				};
				port.postMessage(obj);
			},
			error: function() {
				obj.response = {
					success: false,
					data: ''
				};
				port.postMessage(obj);
			}
		});		
	}
});