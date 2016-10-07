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
    var newImageData;

    // Blur the image to remove noises
    newImageData = remove_noise(imageData, ctx);
    newImageData = remove_noise(newImageData, ctx);
    newImageData = remove_noise(newImageData, ctx);
    newImageData = remove_noise(newImageData, ctx);

    // Convert into binary
    for (x = 0; x < imageData.width-1; ++x) {
        for(y = 0;y < imageData.height-2;++y) {
            var idx = (y * newImageData.width + x) * 4;
            var avg = get_binary_color(newImageData.data, y, x, newImageData.width, true);
            newImageData.data[idx] = avg;
            newImageData.data[idx + 1] = avg;
            newImageData.data[idx + 2] = avg;
            newImageData.data[idx + 3] = imageData.data[idx + 3];
        }
    }

    // Repeat the same algorithm again to enhance pixels
    newImageData = convert_into_binary(newImageData, ctx);
    newImageData = convert_into_binary(newImageData, ctx);

	ctx.putImageData(newImageData,0,0);

}

// returns new color of a pixel (i.e black or white) at threshold = 215
function get_binary_color(data, Y, X, max_w, invert, doMedianFilter) {
    var sum = [], idx, n=0, x, y;
    for(x = -1;x <= 1;++x) {
        for (y = -1; y <= 1; ++y) {
            idx = ( (Y + y) * max_w + (X + x) ) * 4;
            sum[n++] = parseInt( parseFloat("0.33") *( parseFloat(data[idx]) + parseFloat(data[idx+1]) + parseFloat(data[idx+2])));
        }
    }
    sum.sort();
    var threshold = 215;
    if(doMedianFilter)  return parseInt(sum[4]);
    if(invert)          return ((parseInt(sum[8] - sum[0]) < threshold) && (parseInt(sum[4]) < threshold)) ? 255 : 0;
    else                return ((parseInt(sum[8] - sum[0]) < threshold) && (parseInt(sum[4]) < threshold)) ? 0 : 255;
}

// converts into binary
function convert_into_binary(imageData, ctx) {
    var newImageData = ctx.createImageData(imageData.width, imageData.height);
    for (x = 0; x < imageData.width; ++x) {
        for(y = 0;y < imageData.height;++y) {
            var idx = (y * imageData.width + x) * 4;
            var avg = get_binary_color(imageData.data, y, x, imageData.width, false, false);
            newImageData.data[idx] = avg;
            newImageData.data[idx + 1] = avg;
            newImageData.data[idx + 2] = avg;
            newImageData.data[idx + 3] = imageData.data[idx + 3];
        }
    }
    return newImageData;
}

// returns average of 8 neighboring pixel values
function get_average(data, X, Y, max_w, color) {
    var sum = 0, x, y;
    for (x = -1; x <= 1; ++x)
        for (y = -1; y <= 1; ++y) {
            idx = ( (Y + y) * max_w + (X + x) ) * 4;
            sum += data[idx+color];
        }
    return sum/9;
}

// replaces each pixel by the average of the neighboring pixel values
function remove_noise(imageData, ctx) {
    var newImageData = ctx.createImageData(imageData.width, imageData.height);
    for (x = 1; x < imageData.width-1; ++x) {
        for(y = 1;y < imageData.height-2;++y) {
            var idx = (y * imageData.width + x) * 4;
            newImageData.data[idx] = get_average(imageData.data, x, y, imageData.width, 0);
            newImageData.data[idx + 1] = get_average(imageData.data, x, y, imageData.width, 1);
            newImageData.data[idx + 2] = get_average(imageData.data, x, y, imageData.width, 2);
            newImageData.data[idx + 3] = imageData.data[idx + 3];
        }
    }
    return newImageData;
}

// auxiliary function for median filtering
function get_median(data, Y, X, max_w) {
    return get_binary_color(data, Y, X, max_w, false, true);
}

// replaces each pixel by the median of the neighboring pixel values
function median_filter(imageData, ctx) {
    var newImageData = ctx.createImageData(imageData.width, imageData.height);
    for (x = 1; x < imageData.width-1; ++x) {
        for(y = 1;y < imageData.height-2;++y) {
            var idx = (y * imageData.width + x) * 4;
            newImageData.data[idx] = get_median(imageData.data, y, x, imageData.width);
            newImageData.data[idx + 1] = get_median(imageData.data, y, x, imageData.width);
            newImageData.data[idx + 2] = get_median(imageData.data, y, x, imageData.width);
            newImageData.data[idx + 3] = imageData.data[idx + 3];
        }
    }
    return newImageData;
}