Ideas

Use something similar to mindmups foreground contrast:
MAPJS.contrastForeground = function (background) {
	'use strict';
	/*jslint newcap:true*/
	var luminosity = Color(background).luminosity();
	if (luminosity < 0.5) {
		return '#EEEEEE';
	}
	if (luminosity < 0.9) {
		return '#4F4F4F';
	}
	return '#000000';
};