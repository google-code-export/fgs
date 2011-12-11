var portLogin = chrome.extension.connect({name: "FBloginPage"});

checkLogged();

function checkLogged()
{
	if($("#logout_form").length > 0)
	{
		portLogin.postMessage({loggedIn: true, html: document.body.parentNode.innerHTML});
	}
	else if($("#login_form").length > 0)
	{
		portLogin.postMessage({loggedIn: false, html: undefined});
	}
}

chrome.extension.onRequest.addListener(
	function(obj) 
	{
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
					portLogin.postMessage(obj);
				},
				error: function() {
					obj.response = {
						success: false,
						data: ''
					};
					portLogin.postMessage(obj);
				}
			});		
		}
		//sendResponse({farewell: "goodbye"});
  });