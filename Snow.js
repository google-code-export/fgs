/*
* Snowing routine based on one <canvas> element dynamically 
* injected in the background of the page.
* 
* The code is not optimized, feel free to make your own edits!
*
* Copyright 2010 by David Flanagan
* http://creativecommons.org/licenses/by-nc-sa/3.0/
*
* Modified by Giorgio Sardo
* http://blogs.msdn.com/Giorgio
*/
(function () {
	try
	{
		
		console.log('start');
		// Start Animation only if browser support <canvas>
		if (document.createElement('canvas').getContext) {
			console.log('create');
			Snow();
			/*
			if (document.readyState === 'complete')
				Snow();
			else
				window.addEventListener('DOMContentLoaded', Snow, false);
			*/
		}

		var deg = Math.PI / 180;         // For converting degrees to radians
		var sqrt3_2 = Math.sqrt(3) / 2;  // Height of an equilateral triangle
		var flakes = [];               // Things that are dropping
		var scrollspeed = 64;   // How often we animate things
		var snowspeed = 500;    // How often we add a new snowflake
		var maxflakes = 20;     // Max number of flakes to be added at the same time
		var rand = function (n) { return Math.floor(n * Math.random()); }

		var canvas, sky;
		var snowingTimer;
		var invalidateMeasure = false;

		function Snow() {
			console.log('start snow');
			canvas = document.createElement('canvas');
			canvas.style.position = 'fixed';
			canvas.style.top = '0px';
			canvas.style.left = '0px';
			canvas.style.zIndex = '0';
			document.body.insertBefore(canvas, document.body.firstChild);
			sky = canvas.getContext('2d');

			ResetCanvas();

			snowingTimer = setInterval(createSnowflake, snowspeed);
			setInterval(moveSnowflakes, scrollspeed);

			window.addEventListener('resize', ResetCanvas, false);
		}

		function ResetCanvas() {
			invalidateMeasure = true;
			canvas.width = document.body.offsetWidth;
			canvas.height = window.innerHeight;
			sky.strokeStyle = '#0066CC';
			sky.fillStyle = 'white';
		}

		function drawFlake(x, y, size, order) {
			sky.save();
			sky.translate(x, y);
			snowflake(order, 0, Math.floor(sqrt3_2 * y), size);
			sky.fill();
			sky.stroke();
			sky.restore();
		}

		function snowflake(n, x, y, len) {
			sky.save();           // Save current transformation
			sky.beginPath();
			sky.translate(x, y);   // Translate to starting point
			sky.moveTo(0, 0);      // Begin a new subpath there
			leg(n);             // Draw the first leg of the fractal
			sky.rotate(-120 * deg); // Rotate 120 degrees anticlockwise
			leg(n);             // Draw the second leg
			sky.rotate(-120 * deg); // Rotate again.
			leg(n);             // Draw the final leg
			sky.closePath();      // Close the subpath
			sky.restore();        // Restore original transformation

			// Draw a single leg of a level-n Koch snowflake.
			// This function leaves the current point at the end of
			// the leg it has drawn and translates the coordinate
			// system so the current point is (0,0). This means you
			// can easily call rotate() after drawing a leg.
			function leg(n) {
				sky.save();               // Save current transform
				if (n == 0) {           // Non-recursive case:
					sky.lineTo(len, 0);   //   Just a horizontal line
				}
				else { // Recursive case:           _  _
					//     draw 4 sub-legs like:  \/
					sky.scale(1 / 3, 1 / 3);   // Sub-legs are 1/3rd size
					leg(n - 1);           // Draw the first sub-leg
					sky.rotate(60 * deg);   // Turn 60 degrees clockwise
					leg(n - 1);           // Draw the second sub-leg
					sky.rotate(-120 * deg); // Rotate 120 degrees back
					leg(n - 1);           // Third sub-leg
					sky.rotate(60 * deg);   // Back to original heading
					leg(n - 1);           // Final sub-leg
				}
				sky.restore();            // Restore the transform
				sky.translate(len, 0);    // Translate to end of leg
			}
		}

		function createSnowflake() {
			var order = 2;
			var size = 10 + rand(90);
			var t = (document.body.offsetWidth - 964) / 2;
			var x = (rand(2) == 0) ? rand(t) : t + 964 + rand(t); // Make it fit with my blog
			var y = window.pageYOffset;

			flakes.push({ x: x, y: y, vx: 0, vy: 3 + rand(3), size: size, order: order });

			if (flakes.length > maxflakes) clearInterval(snowingTimer);
		}

		function moveSnowflakes() {
			sky.clearRect(0, 0, canvas.width, canvas.height);

			var maxy = canvas.height;

			for (var i = 0; i < flakes.length; i++) {
				var flake = flakes[i];

				flake.y += flake.vy;
				flake.x += flake.vx;

				if (flake.y > maxy) flake.y = 0;
				if (invalidateMeasure) {
					var t = (canvas.width - 964) / 2;
					flake.x = (rand(2) == 0) ? rand(t) : t + 964 + rand(t);
				}

				drawFlake(flake.x, flake.y, flake.size, flake.order);

				// Sometimes change the sideways velocity
				if (rand(4) == 1) flake.vx += (rand(11) - 5) / 10;
				if (flake.vx > 2) flake.vx = 2;
				if (flake.vx < -2) flake.vx = -2;
			}
			if (invalidateMeasure) invalidateMeasure = false;
		}

		}
		catch(e) {
			console.log(e);
		}
} ()); 