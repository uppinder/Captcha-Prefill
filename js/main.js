function onLoadImage(img) {

	var canvasId = 'canvas-img' + img.id.slice(-1);
	var canvas = document.getElementById(canvasId);
	var ctx =  canvas.getContext('2d');
	ctx.drawImage(img,0,0);
	
	var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	console.log(imageData);

	var data = imageData.data;

	/*
	*	Implement median filtering on data array.
	*/



	ctx.putImageData(imageData,0,0);

}