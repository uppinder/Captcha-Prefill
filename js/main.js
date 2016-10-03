function loadImages() {
	for(var i = 1;i <= 9;i++) {
		var elem = '<img src="images/' + i.toString() + '.png" id="img' + i.toString() + '" onload="onLoadImage(this);">&nbsp;&nbsp;<canvas width="252" height="65" id="canvas-img' + i.toString()+ '"></canvas></br>'
		$(document.body).append(elem);
	}
}

function onLoadImage(img) {

	var canvasId = 'canvas-img' + img.id.slice(-1);
	var canvas = document.getElementById(canvasId);
	var ctx =  canvas.getContext('2d');
	ctx.drawImage(img,0,0);
	
	var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	// console.log(imageData);

	var data = imageData.data;
	// console.log(data);
	
	var T = 170;
	/*
	*	Median filtering to remove
	*	salt and pepper noise.
	*/
	for(y = 0;y < canvas.height;++y) 
		for(x = 0;x < canvas.width;++x) {
			
			var idx = (y*canvas.width+x)*4;
			for(n = 0;n < 3;++n) {
				var sum = 0;
				for(j = y-1;j <= y+1;++j) { 
					for(i = x-1;i <= x+1;++i) 
						sum += data[(j*canvas.width+i)*4+n];
				}

				// sum -= data[idx+n];
				var avg = sum/9;
				avg = (avg < T?0:255);
				
				data[idx+n] = avg;	
			}
		}

	ctx.putImageData(imageData,0,0);

}