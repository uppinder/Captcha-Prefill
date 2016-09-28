function loadImages() {
	for(i = 1;i <= 20;i++) {
		var elem = '<img src="images/' + i.toString() + '.png" id="img' + i.toString() + '" onload="onLoadImage(this);">&nbsp;&nbsp;<canvas width="252" height="65" id="canvas-img' + i.toString()+ '"></canvas></br>'
		$(document.body).prepend(elem);
	}
}

function onLoadImage(img) {

	var canvasId = 'canvas-img' + img.id.slice(-1);
	var canvas = document.getElementById(canvasId);
	var ctx =  canvas.getContext('2d');
	ctx.drawImage(img,0,0);
	
	var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	//console.log(imageData);

	var data = imageData.data;

	/*
	*	Implement median filtering on data array.
	*/



	ctx.putImageData(imageData,0,0);

}