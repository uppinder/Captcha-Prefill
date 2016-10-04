function loadImages() {
	for(var i = 1;i <= 9;i++) {
		var elem = '<img src="images/' + i.toString() + '.png" id="img' + i.toString() + '" onload="onLoadImage(this);">&nbsp;&nbsp;<canvas width="252" height="65" id="canvas-img' + i.toString()+ '"></canvas></br>'
		$(document.body).append(elem);
	}
}

/***
 *
 * Median filtering to remove
 * salt and pepper noise
 */
function onLoadImage(img) {

	var canvasId = 'canvas-img' + img.id.slice(-1);
	var canvas = document.getElementById(canvasId);
	var ctx =  canvas.getContext('2d');
	ctx.drawImage(img,0,0);

    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var newImageData = ctx.createImageData(imageData.width, imageData.height);

    for (x = 0; x < imageData.width; ++x) {
        for(y = 0;y < imageData.height;++y) {
            var idx = (y * imageData.width + x) * 4;
            var avg = get_color(imageData.data, y, x, imageData.width);
            newImageData.data[idx] = avg;
            newImageData.data[idx + 1] = avg;
            newImageData.data[idx + 2] = avg;
            newImageData.data[idx + 3] = imageData.data[idx + 3];
        }
    }

    // Repeat the same algorithm again to remove more noise
    newImageData = remove_noise(newImageData, ctx);

	ctx.putImageData(newImageData,0,0);

}


function get_color(data, Y, X, max_w) {
    var sum = [], idx, n=0, x, y;
    for(x = 0;x <= 3;++x) {
        for (y = 0; y <= 3; ++y) {
            idx = ( (Y + y) * max_w + (X + x) ) * 4;
            sum[n++] = parseInt( parseFloat("0.33") *( parseFloat(data[idx]) + parseFloat(data[idx+1]) + parseFloat(data[idx+2])));
        }
    }
    sum.sort();
    return ((parseInt(sum[8] - sum[0]) < 210) && (parseInt(sum[4]) < 200)) ? 255 : 0;
}


function remove_noise(imageData, ctx) {
    var newImageData = ctx.createImageData(imageData.width, imageData.height);
    for (x = 0; x < imageData.width; ++x) {
        for(y = 0;y < imageData.height;++y) {
            var idx = (y * imageData.width + x) * 4;
            var avg = get_color(imageData.data, y, x, imageData.width);
            newImageData.data[idx] = avg;
            newImageData.data[idx + 1] = avg;
            newImageData.data[idx + 2] = avg;
            newImageData.data[idx + 3] = imageData.data[idx + 3];
        }
    }
    return newImageData;
}