// {
//   name: <STRING>
//   canvasBackground: <STRING> // COLOR
//   cellBackground: <STRING> // COLOR
//   tileBackground: {
//     // INT -> COLOR
//     <STRING>: <STRING>
//   },
//   tileText: {
//     // INT -> COLOR
//     <STRING>: <STRING>
//   }
// }


var GameAssets = (function() {
	"use strict";

	var CLASSIC_MODE = {
		name: "Classic",
		getCanvasBackground: function() {
			return "#bbada0";
		},
		getCellBackground: function() {
			return "rgba(238, 228, 218, 0.35)";
		},
		getTileBackground: function(value) {
			return this.tileBackground[value];
		},
		getTileText: function(value) {
			return this.tileText[value];
		},

		tileBackground: {
			"2": "#eee4da",
			"4": "#ede0c8",
			"8": "#f2b179",
			"16": "#f59563",
			"32": "#f67c5f",
			"64": "#f65e3b",
			"128": "#edcf72",
			"256": "#edcc61",
			"512": "#edc850",
			"1024": "#edc53f",
			"2048": "#edc22e"
		},
		tileText: {
			"2": "#776e65",
			"4": "#776e65",
			"8": "#f9f6f2",
			"16": "#f9f6f2",
			"32": "#f9f6f2",
			"64": "#f9f6f2",
			"128": "#f9f6f2",
			"256": "#f9f6f2",
			"512": "#f9f6f2",
			"1024": "#f9f6f2",
			"2048": "#f9f6f2"
		}
	};

	// Public interface
	return {
		getClassicAssets: function() {
			return CLASSIC_MODE;
		}
	};
})();
