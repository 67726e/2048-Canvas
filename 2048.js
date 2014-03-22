// Hammer.JS - v1.0.9 - 2014-03-18
!function(a,b){"use strict";function c(){d.READY||(s.determineEventTypes(),o.each(d.gestures,function(a){u.register(a)}),s.onTouch(d.DOCUMENT,m,u.detect),s.onTouch(d.DOCUMENT,n,u.detect),d.READY=!0)}var d=function(a,b){return new d.Instance(a,b||{})};d.VERSION="1.0.9",d.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},d.HAS_POINTEREVENTS=a.navigator.pointerEnabled||a.navigator.msPointerEnabled,d.HAS_TOUCHEVENTS="ontouchstart"in a,d.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android|silk/i,d.NO_MOUSEEVENTS=d.HAS_TOUCHEVENTS&&a.navigator.userAgent.match(d.MOBILE_REGEX),d.EVENT_TYPES={},d.UPDATE_VELOCITY_INTERVAL=16,d.DOCUMENT=a.document;var e=d.DIRECTION_DOWN="down",f=d.DIRECTION_LEFT="left",g=d.DIRECTION_UP="up",h=d.DIRECTION_RIGHT="right",i=d.POINTER_MOUSE="mouse",j=d.POINTER_TOUCH="touch",k=d.POINTER_PEN="pen",l=d.EVENT_START="start",m=d.EVENT_MOVE="move",n=d.EVENT_END="end";d.plugins=d.plugins||{},d.gestures=d.gestures||{},d.READY=!1;var o=d.utils={extend:function(a,c,d){for(var e in c)a[e]!==b&&d||(a[e]=c[e]);return a},each:function(a,c,d){var e,f;if("forEach"in a)a.forEach(c,d);else if(a.length!==b){for(e=-1;f=a[++e];)if(c.call(d,f,e,a)===!1)return}else for(e in a)if(a.hasOwnProperty(e)&&c.call(d,a[e],e,a)===!1)return},hasParent:function(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1},getCenter:function(a){var b=[],c=[];return o.each(a,function(a){b.push("undefined"!=typeof a.clientX?a.clientX:a.pageX),c.push("undefined"!=typeof a.clientY?a.clientY:a.pageY)}),{pageX:(Math.min.apply(Math,b)+Math.max.apply(Math,b))/2,pageY:(Math.min.apply(Math,c)+Math.max.apply(Math,c))/2}},getVelocity:function(a,b,c){return{x:Math.abs(b/a)||0,y:Math.abs(c/a)||0}},getAngle:function(a,b){var c=b.pageY-a.pageY,d=b.pageX-a.pageX;return 180*Math.atan2(c,d)/Math.PI},getDirection:function(a,b){var c=Math.abs(a.pageX-b.pageX),d=Math.abs(a.pageY-b.pageY);return c>=d?a.pageX-b.pageX>0?f:h:a.pageY-b.pageY>0?g:e},getDistance:function(a,b){var c=b.pageX-a.pageX,d=b.pageY-a.pageY;return Math.sqrt(c*c+d*d)},getScale:function(a,b){return a.length>=2&&b.length>=2?this.getDistance(b[0],b[1])/this.getDistance(a[0],a[1]):1},getRotation:function(a,b){return a.length>=2&&b.length>=2?this.getAngle(b[1],b[0])-this.getAngle(a[1],a[0]):0},isVertical:function(a){return a==g||a==e},toggleDefaultBehavior:function(a,b,c){if(b&&a&&a.style){o.each(["webkit","moz","Moz","ms","o",""],function(d){o.each(b,function(b,e){d&&(e=d+e.substring(0,1).toUpperCase()+e.substring(1)),e in a.style&&(a.style[e]=!c&&b)})});var d=function(){return!1};"none"==b.userSelect&&(a.onselectstart=!c&&d),"none"==b.userDrag&&(a.ondragstart=!c&&d)}}};d.Instance=function(a,b){var e=this;return c(),this.element=a,this.enabled=!0,this.options=o.extend(o.extend({},d.defaults),b||{}),this.options.stop_browser_behavior&&o.toggleDefaultBehavior(this.element,this.options.stop_browser_behavior,!1),this.eventStartHandler=s.onTouch(a,l,function(a){e.enabled&&u.startDetect(e,a)}),this.eventHandlers=[],this},d.Instance.prototype={on:function(a,b){var c=a.split(" ");return o.each(c,function(a){this.element.addEventListener(a,b,!1),this.eventHandlers.push({gesture:a,handler:b})},this),this},off:function(a,b){var c,d,e=a.split(" ");return o.each(e,function(a){for(this.element.removeEventListener(a,b,!1),c=-1;d=this.eventHandlers[++c];)d.gesture===a&&d.handler===b&&this.eventHandlers.splice(c,1)},this),this},trigger:function(a,b){b||(b={});var c=d.DOCUMENT.createEvent("Event");c.initEvent(a,!0,!0),c.gesture=b;var e=this.element;return o.hasParent(b.target,e)&&(e=b.target),e.dispatchEvent(c),this},enable:function(a){return this.enabled=a,this},dispose:function(){var a,b;for(this.options.stop_browser_behavior&&o.toggleDefaultBehavior(this.element,this.options.stop_browser_behavior,!0),a=-1;b=this.eventHandlers[++a];)this.element.removeEventListener(b.gesture,b.handler,!1);return this.eventHandlers=[],s.unbindDom(this.element,d.EVENT_TYPES[l],this.eventStartHandler),null}};var p=null,q=!1,r=!1,s=d.event={bindDom:function(a,b,c){var d=b.split(" ");o.each(d,function(b){a.addEventListener(b,c,!1)})},unbindDom:function(a,b,c){var d=b.split(" ");o.each(d,function(b){a.removeEventListener(b,c,!1)})},onTouch:function(a,b,c){var e=this,f=function(f){var g=f.type.toLowerCase();if(!g.match(/mouse/)||!r){g.match(/touch/)||g.match(/pointerdown/)||g.match(/mouse/)&&1===f.which?q=!0:g.match(/mouse/)&&!f.which&&(q=!1),g.match(/touch|pointer/)&&(r=!0);var h=0;q&&(d.HAS_POINTEREVENTS&&b!=n?h=t.updatePointer(b,f):g.match(/touch/)?h=f.touches.length:r||(h=g.match(/up/)?0:1),h>0&&b==n?b=m:h||(b=n),(h||null===p)&&(p=f),c.call(u,e.collectEventData(a,b,e.getTouchList(p,b),f)),d.HAS_POINTEREVENTS&&b==n&&(h=t.updatePointer(b,f))),h||(p=null,q=!1,r=!1,t.reset())}};return this.bindDom(a,d.EVENT_TYPES[b],f),f},determineEventTypes:function(){var a;a=d.HAS_POINTEREVENTS?t.getEvents():d.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],d.EVENT_TYPES[l]=a[0],d.EVENT_TYPES[m]=a[1],d.EVENT_TYPES[n]=a[2]},getTouchList:function(a){return d.HAS_POINTEREVENTS?t.getTouchList():a.touches?a.touches:(a.identifier=1,[a])},collectEventData:function(a,b,c,d){var e=j;return(d.type.match(/mouse/)||t.matchType(i,d))&&(e=i),{center:o.getCenter(c),timeStamp:(new Date).getTime(),target:d.target,touches:c,eventType:b,pointerType:e,srcEvent:d,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return u.stopDetect()}}}},t=d.PointerEvent={pointers:{},getTouchList:function(){var a=[];return o.each(this.pointers,function(b){a.push(b)}),a},updatePointer:function(a,b){return a==n?delete this.pointers[b.pointerId]:(b.identifier=b.pointerId,this.pointers[b.pointerId]=b),Object.keys(this.pointers).length},matchType:function(a,b){if(!b.pointerType)return!1;var c=b.pointerType,d={};return d[i]=c===i,d[j]=c===j,d[k]=c===k,d[a]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},u=d.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(a,b){this.current||(this.stopped=!1,this.current={inst:a,startEvent:o.extend({},b),lastEvent:!1,lastVelocityEvent:!1,velocity:!1,name:""},this.detect(b))},detect:function(a){if(this.current&&!this.stopped){a=this.extendEventData(a);var b=this.current.inst.options;return o.each(this.gestures,function(c){return this.stopped||b[c.name]===!1||c.handler.call(c,a,this.current.inst)!==!1?void 0:(this.stopDetect(),!1)},this),this.current&&(this.current.lastEvent=a),a.eventType==n&&!a.touches.length-1&&this.stopDetect(),a}},stopDetect:function(){this.previous=o.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(a){var b=this.current,c=b.startEvent;(a.touches.length!=c.touches.length||a.touches===c.touches)&&(c.touches=[],o.each(a.touches,function(a){c.touches.push(o.extend({},a))}));var e,f,g=a.timeStamp-c.timeStamp,h=a.center.pageX-c.center.pageX,i=a.center.pageY-c.center.pageY,j=b.lastVelocityEvent,k=b.velocity;return j&&a.timeStamp-j.timeStamp>d.UPDATE_VELOCITY_INTERVAL?(k=o.getVelocity(a.timeStamp-j.timeStamp,a.center.pageX-j.center.pageX,a.center.pageY-j.center.pageY),b.lastVelocityEvent=a,b.velocity=k):b.velocity||(k=o.getVelocity(g,h,i),b.lastVelocityEvent=a,b.velocity=k),a.eventType==n?(e=b.lastEvent&&b.lastEvent.interimAngle,f=b.lastEvent&&b.lastEvent.interimDirection):(e=b.lastEvent&&o.getAngle(b.lastEvent.center,a.center),f=b.lastEvent&&o.getDirection(b.lastEvent.center,a.center)),o.extend(a,{deltaTime:g,deltaX:h,deltaY:i,velocityX:k.x,velocityY:k.y,distance:o.getDistance(c.center,a.center),angle:o.getAngle(c.center,a.center),interimAngle:e,direction:o.getDirection(c.center,a.center),interimDirection:f,scale:o.getScale(c.touches,a.touches),rotation:o.getRotation(c.touches,a.touches),startEvent:c}),a},register:function(a){var c=a.defaults||{};return c[a.name]===b&&(c[a.name]=!0),o.extend(d.defaults,c,!0),a.index=a.index||1e3,this.gestures.push(a),this.gestures.sort(function(a,b){return a.index<b.index?-1:a.index>b.index?1:0}),this.gestures}};d.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,correct_for_drag_min_distance:!0,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(a,b){if(u.current.name!=this.name&&this.triggered)return b.trigger(this.name+"end",a),void(this.triggered=!1);if(!(b.options.drag_max_touches>0&&a.touches.length>b.options.drag_max_touches))switch(a.eventType){case l:this.triggered=!1;break;case m:if(a.distance<b.options.drag_min_distance&&u.current.name!=this.name)return;if(u.current.name!=this.name&&(u.current.name=this.name,b.options.correct_for_drag_min_distance&&a.distance>0)){var c=Math.abs(b.options.drag_min_distance/a.distance);u.current.startEvent.center.pageX+=a.deltaX*c,u.current.startEvent.center.pageY+=a.deltaY*c,a=u.extendEventData(a)}(u.current.lastEvent.drag_locked_to_axis||b.options.drag_lock_to_axis&&b.options.drag_lock_min_distance<=a.distance)&&(a.drag_locked_to_axis=!0);var d=u.current.lastEvent.direction;a.drag_locked_to_axis&&d!==a.direction&&(a.direction=o.isVertical(d)?a.deltaY<0?g:e:a.deltaX<0?f:h),this.triggered||(b.trigger(this.name+"start",a),this.triggered=!0),b.trigger(this.name,a),b.trigger(this.name+a.direction,a);var i=o.isVertical(a.direction);(b.options.drag_block_vertical&&i||b.options.drag_block_horizontal&&!i)&&a.preventDefault();break;case n:this.triggered&&b.trigger(this.name+"end",a),this.triggered=!1}}},d.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(a,b){switch(a.eventType){case l:clearTimeout(this.timer),u.current.name=this.name,this.timer=setTimeout(function(){"hold"==u.current.name&&b.trigger("hold",a)},b.options.hold_timeout);break;case m:a.distance>b.options.hold_threshold&&clearTimeout(this.timer);break;case n:clearTimeout(this.timer)}}},d.gestures.Release={name:"release",index:1/0,handler:function(a,b){a.eventType==n&&b.trigger(this.name,a)}},d.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_min_touches:1,swipe_max_touches:1,swipe_velocity:.7},handler:function(a,b){if(a.eventType==n){if(a.touches.length<b.options.swipe_min_touches||a.touches.length>b.options.swipe_max_touches)return;(a.velocityX>b.options.swipe_velocity||a.velocityY>b.options.swipe_velocity)&&(b.trigger(this.name,a),b.trigger(this.name+a.direction,a))}}},d.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},has_moved:!1,handler:function(a,b){var c,d,e;a.eventType==l?this.has_moved=!1:a.eventType!=m||this.moved?a.eventType==n&&"touchcancel"!=a.srcEvent.type&&a.deltaTime<b.options.tap_max_touchtime&&!this.has_moved&&(c=u.previous,d=c&&c.lastEvent&&a.timeStamp-c.lastEvent.timeStamp,e=!1,c&&"tap"==c.name&&d&&d<b.options.doubletap_interval&&a.distance<b.options.doubletap_distance&&(b.trigger("doubletap",a),e=!0),(!e||b.options.tap_always)&&(u.current.name="tap",b.trigger(u.current.name,a))):this.has_moved=a.distance>b.options.tap_max_distance}},d.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(a,b){return b.options.prevent_mouseevents&&a.pointerType==i?void a.stopDetect():(b.options.prevent_default&&a.preventDefault(),void(a.eventType==l&&b.trigger(this.name,a)))}},d.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1,transform_within_instance:!1},triggered:!1,handler:function(a,b){if(u.current.name!=this.name&&this.triggered)return b.trigger(this.name+"end",a),void(this.triggered=!1);if(!(a.touches.length<2)){if(b.options.transform_always_block&&a.preventDefault(),b.options.transform_within_instance)for(var c=-1;a.touches[++c];)if(!o.hasParent(a.touches[c].target,b.element))return;switch(a.eventType){case l:this.triggered=!1;break;case m:var d=Math.abs(1-a.scale),e=Math.abs(a.rotation);if(d<b.options.transform_min_scale&&e<b.options.transform_min_rotation)return;u.current.name=this.name,this.triggered||(b.trigger(this.name+"start",a),this.triggered=!0),b.trigger(this.name,a),e>b.options.transform_min_rotation&&b.trigger("rotate",a),d>b.options.transform_min_scale&&(b.trigger("pinch",a),b.trigger("pinch"+(a.scale<1?"in":"out"),a));break;case n:this.triggered&&b.trigger(this.name+"end",a),this.triggered=!1}}}},"function"==typeof define&&define.amd?define(function(){return d}):"object"==typeof module&&module.exports?module.exports=d:a.Hammer=d}(window);

(function() {
	"use strict";

	// TODO: Change animation calculations to include time for non-janky animation
	// TODO: Make tile font-box slightly smaller than the tile width

	var Metrics = (function() {
		var PIXEL_RATIO = (function () {
			//noinspection JSUnresolvedVariable
			var ctx = document.createElement("canvas").getContext("2d"),
				dpr = window.devicePixelRatio || 1,
				bsr = ctx.webkitBackingStorePixelRatio ||
					ctx.mozBackingStorePixelRatio ||
					ctx.msBackingStorePixelRatio ||
					ctx.oBackingStorePixelRatio ||
					ctx.backingStorePixelRatio || 1;

			return dpr / bsr;
		})();
		var body = document.getElementById("body");

		var Metrics = {
			getPixelRatio: function() {
				return PIXEL_RATIO;
			},
			getSize: function() {
				var e = document.documentElement,
					width = window.innerWidth || e.clientWidth || body.clientWidth,
					height = window.innerHeight|| e.clientHeight|| body.clientHeight;

				return Math.min(width, height);
			},
			getSlideSpeed: function() {
				return this.getSize() / 25;
			},
			getGrowthSpeed: function() {
				return this.getSize() / 100;
			},
			getHeaderSize: function() {
				return Math.floor(this.getSize() / 8.33);
			},
			getTileSize: function(width, height) {
				return Math.floor(Math.min(width, height) / 1.94);
			},
			getBorder: function() {
				return this.getSize() / 40;
			}
		};

		// public interface
		return {
			getPixelRatio: function() {
				return Metrics.getPixelRatio();
			},
			getSize: function() {
				return Metrics.getSize();
			},
			getSlideSpeed: function() {
				return Metrics.getSlideSpeed();
			},
			getGrowthSpeed: function() {
				return Metrics.getGrowthSpeed();
			},
			getHeaderSize: function() {
				return Metrics.getHeaderSize();
			},
			getTileSize: function(width, height) {
				return Metrics.getTileSize(width, height);
			},
			getBorder: function() {
				return Metrics.getBorder();
			}
		};
	})();

	var Input = (function() {
		// Log key presses
		var KEY_TO_COMMAND = {
			"37": "LEFT",
			"38": "UP",
			"39": "RIGHT",
			"40": "DOWN"};
		var direction;

		// Handle normal keypress events
		addEventListener("keydown", function(event) {
			// Only prevent the default action for valid moves
			if (!!KEY_TO_COMMAND[event.keyCode]) {
				event.preventDefault();
			}

			direction = event.keyCode;
		});

		// Handle touch moves
		var hammer = new Hammer(document.getElementById("body"));
		hammer.on("swipeup", function() { direction = "UP"; });
		hammer.on("swipedown", function() { direction = "DOWN"; });
		hammer.on("swipeleft", function() { direction = "LEFT"; });
		hammer.on("swiperight", function() { direction = "RIGHT"; });

		var Input = {
			getCommand: function() {
				var command = KEY_TO_COMMAND[direction];
				direction = undefined;

				return command;
			}
		};

		// Public interface
		return {
			getCommand: function() {
				return Input.getCommand();
			}
		};
	})();

	var Animation = (function() {
		var Animation = {
			animate: function(canvas, context, grid) {
				// Used to determine if we need to block user input for the duration of an animation
				var blockInput = false;

				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						var tile = grid.tiles[x][y];
						var mergedTile = grid.mergedTiles[x][y];

						if (!!tile) {
							if (tile.triggerGrowth || !!tile.growing) {
								this.animateGrowth(canvas, context, tile);
							}

							if (tile.triggerSlide || !!tile.sliding) {
								this.animateSliding(canvas, context, tile);
								blockInput = true;
							}
						}

						if (!!mergedTile) {
							if (mergedTile.triggerSlide || !!mergedTile.sliding) {
								this.animateSliding(canvas, context, mergedTile);
								blockInput = true;
							}
						}
					}
				}

				return blockInput;
			},

			animateGrowth: function(canvas, context, tile) {
				var MODIFIER = { GROW: "GROW", SHRINK: "SHRINK" };
				var GROWTH_SPEED = Metrics.getGrowthSpeed();

				if (tile.growing === undefined) {
					// If we are not yet animating, setup the data
					tile.growing = {
						modifier: MODIFIER.GROW,
						value: GROWTH_SPEED,
						maxSize: 15,
						minSize: 0
					};
				} else if (tile.growing.modifier === MODIFIER.GROW) {
					// Increase the growth size
					tile.growing.value += GROWTH_SPEED;

					// If we've reached the max growth, start shrinking
					if (tile.growing.value >= tile.growing.maxSize) {
						tile.growing.modifier = MODIFIER.SHRINK;
					}
				} else if (tile.growing.modifier === MODIFIER.SHRINK) {
					tile.growing.value -= GROWTH_SPEED;

					// If we've shrunk back to normal, remove animation data
					if (tile.growing.value <= tile.growing.minSize) {
						// Remove the trigger value
						delete tile.triggerGrowth;
						delete tile.growing;
					}
				}
			},
			animateSliding: function(canvas, context, tile) {
				var SLIDE_RATE = Metrics.getSlideSpeed();

				if (tile.sliding === undefined) {
					tile.sliding = { value: 0 };
				} else {
					var slidingData = tile.slidingData;

					// Slide rate should be multiplied by number of cells moved across
					switch (slidingData.direction) {
						case "UP":
						case "DOWN":
							SLIDE_RATE += (Math.abs(slidingData.startY - slidingData.endY) * SLIDE_RATE);
							break;
						case "LEFT":
						case "RIGHT":
							SLIDE_RATE += (Math.abs(slidingData.startX - slidingData.endX) * SLIDE_RATE);
							break;
					}

					tile.sliding.value += SLIDE_RATE;
				}
			}
		};

		// Public interface
		return {
			animate: function(canvas, context, grid) {
				return Animation.animate(canvas, context, grid);
			}
		};
	})();

	var Renderer = (function() {
		var BACKGROUND_COLOR = {
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
		};
		var FONT_COLOR = {
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
		};

		var Renderer = {
			render: function(canvas, context, grid) {
				// Draw the background
				context.fillStyle = "#bbada0";
				context.fillRect(0, 0, canvas.width, canvas.height);

				var cellHeight = (canvas.height - (Metrics.getBorder() * (grid.height + 1))) / grid.height;
				var cellWidth = (canvas.width - (Metrics.getBorder() * (grid.width + 1))) / grid.width;

				// Draw the empty cells
				this.drawCells(context, grid, cellWidth, cellHeight);

				// Draw the merged tiles that are still animating
				this.drawMergedTiles(context, grid, cellWidth, cellHeight);
				// Draw tiles in their proper cells
				this.drawTiles(context, grid, cellWidth, cellHeight);
			},
			showGameOver: function(canvas, context) {
				this.showOverlay(canvas, context, "rgba(238, 228, 218, 0.5)");

				// Draw "Game Over!" text
				context.font = "bold " + Metrics.getHeaderSize() + "px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillStyle = "#776e65";
				context.fillText("Game Over!", (canvas.width / 2), (canvas.height / 2), canvas.width);

				// TODO: Draw "Try again" button
			},
			showGameWon: function(canvas, context) {
				this.showOverlay(canvas, context, "rgba(237, 194, 46, 0.5)");

				// Draw "Game Won!" message
				context.font = "bold " + Metrics.getHeaderSize() + "px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillStyle = "#f9f6f2";
				context.fillText("You win!", (canvas.width / 2), (canvas.height / 2), canvas.width);

				// TODO: Add "Try Again" button
			},

			roundedRectangle: function(context, x, y, width, height, radius) {
				context.beginPath();

				context.moveTo((x + radius), y);
				context.lineTo((x + width - radius), y);
				context.quadraticCurveTo((x + width), y, (x + width), (y + radius));
				context.lineTo((x + width), (y + height - radius));
				context.quadraticCurveTo((x + width), (y + height), (x + width - radius), (y + height));
				context.lineTo((x + radius), (y + height));
				context.quadraticCurveTo(x, (y + height), x, (y + height - radius));
				context.lineTo(x, (y + radius));
				context.quadraticCurveTo(x, y, (x + radius), y);

				context.fill();
				context.closePath();
			},
			showOverlay: function(canvas, context, fill) {
				// Draw semi-transparent background over the entire grid
				context.fillStyle = fill;
				context.fillRect(0, 0, canvas.width, canvas.height);
			},
			drawCells: function(context, grid, cellWidth, cellHeight) {
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						var coordinates = this.getCellCoordinates(grid, cellWidth, cellHeight, x, y);
						this.drawCell(context, coordinates, cellWidth, cellHeight);
					}
				}
			},
			drawCell: function(context, coordinates, width, height) {
				context.fillStyle = "rgba(238, 228, 218, 0.35)";
				this.roundedRectangle(context, coordinates.x, coordinates.y, width, height, 5);
			},
			drawTiles: function(context, grid, cellWidth, cellHeight) {
				// Iterate over all tiles and render on screen
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.tiles[x][y]) {
							var coordinates = this.getCellCoordinates(grid, cellWidth, cellHeight, x, y);
							this.drawTile(context, grid, grid.tiles[x][y], coordinates, cellWidth, cellHeight);
						}
					}
				}
			},
			drawTile: function(context, grid, tile, coordinates, width, height) {
				var x = coordinates.x;
				var y = coordinates.y;

				// Handle tile sliding animation
				if (!!tile.sliding) {
					var direction = tile.slidingData.direction;
					var value = tile.sliding.value;
					var startCoordinates = this.getCellCoordinates(grid, width, height, tile.slidingData.startX, tile.slidingData.startY);
					var stopCoordinates = this.getCellCoordinates(grid, width, height, tile.slidingData.endX, tile.slidingData.endY);

					if (direction === "UP") {
						y = startCoordinates.y - value;
						y = (y <= stopCoordinates.y) ? stopCoordinates.y : y;
					} else if (direction === "DOWN") {
						y = startCoordinates.y + value;
						y = (y >= stopCoordinates.y) ? stopCoordinates.y : y;
					} else if (direction === "LEFT") {
						x = startCoordinates.x - value;
						x = (x <= stopCoordinates.x) ? stopCoordinates.x : x;
					} else if (direction === "RIGHT") {
						x = startCoordinates.x + value;
						x = (x >= stopCoordinates.x) ? stopCoordinates.x : x;
					}

					if ((direction === "UP" && y <= stopCoordinates.y) ||
						(direction === "DOWN" && y >= stopCoordinates.y) ||
						(direction === "LEFT" && x <= stopCoordinates.x) ||
						(direction === "RIGHT" && x >= stopCoordinates.x)) {
						delete tile.sliding;
						delete tile.slidingData;
						delete tile.triggerSlide;
					}
				}

				// Handle growth animation
				if (!!tile.growing) {
					var growth = (!!tile.growing && !tile.sliding) ? tile.growing.value : 0;
					x -= (growth / 2);
					y -= (growth / 2);
					width += growth;
					height += growth;
				}

				// Fill in the cell with the proper background color
				context.fillStyle = BACKGROUND_COLOR[tile.value];
				this.roundedRectangle(context, x, y, width, height, 5);

				// Draw the tile value in the center of the cell
				var textX = x + (width / 2);
				var textY = y + (height / 2);
				context.font = "bold " + Metrics.getTileSize(width, height) + "px Helvetica Neue";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.fillStyle = FONT_COLOR[tile.value];
				context.fillText(tile.value, textX, textY, width);
			},
			drawMergedTiles: function(context, grid, cellWidth, cellHeight) {
				// Iterate over the merged tiles and draw them on screen
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.mergedTiles[x][y]) {
							var tile = grid.mergedTiles[x][y];
							var coordinates = this.getCellCoordinates(grid, cellWidth, cellHeight, tile.slidingData.endX,
								tile.slidingData.endY);
							this.drawTile(context, grid, tile, coordinates, cellWidth, cellHeight);

							// If the tile is done sliding, remove it from the merged tile grid
							if (!tile.sliding) {
								grid.mergedTiles[x][y] = undefined;
							}
						}
					}
				}
			},
			getCellCoordinates: function(grid, cellWidth, cellHeight, row, column) {
				// For some reason, row/column are sometimes a string which fucks the calculations
				row = parseInt(row, 10);
				column = parseInt(column, 10);

				// Convert the row/column number into x/y coordinates on the actual canvas
				return {
					x: (row * cellWidth) + ((row + 1) * Metrics.getBorder()),
					y: (column * cellHeight) + ((column + 1) * Metrics.getBorder())
				};
			}
		};

		// Public interface
		return {
			render: function(canvas, context, grid) {
				return Renderer.render(canvas, context, grid);
			},
			showGameOver: function(canvas, context) {
				Renderer.showGameOver(canvas, context);
			},
			showGameWon: function(canvas, context) {
				Renderer.showGameWon(canvas, context);
			}
		};
	})();

	var Movement = (function() {
		var Movement = {
			move: function(direction, grid) {
				if (!!direction) {
					var action = function(grid) {};

					switch (direction) {
						case "UP":
							action = this.moveUp;
							break;
						case "DOWN":
							action = this.moveDown;
							break;
						case "LEFT":
							action = this.moveLeft;
							break;
						case "RIGHT":
							action = this.moveRight;
							break;
					}

					return action(grid);
				}

				return false;
			},
			canMove: function(direction, grid) {
				switch (direction) {
					case "UP":
						return this.canMoveUp(grid);
					case "DOWN":
						return this.canMoveDown(grid);
					case "LEFT":
						return this.canMoveLeft(grid);
					case "RIGHT":
						return this.canMoveRight(grid);
				}

				return false;
			},

			canMoveUp: function(grid) {
				// Check if there is an open space above any tile
				for (var x = 0; x < grid.width; x++) {
					// Skip `y = 0` because the top row cannot move up
					for (var y = 1; y < grid.height; y++) {
						// Check if there is a tile in the current coordinates
						if (!!grid.tiles[x][y]) {
							// If the cell above is unoccupied, we can move up
							if (!grid.tiles[x][y-1]) {
								return true;
							} else if (grid.tiles[x][y].value === grid.tiles[x][y-1].value) {
								// If the tile in the cell above, we can move up and combine
								return true;
							}
						}
					}
				}

				return false;
			},
			canMoveDown: function(grid) {
				// Check if we can move downward
				for (var x = 0; x < grid.width; x++) {
					// Skip `y = grid.height` since the bottom cannot move down
					for (var y = 0; y < grid.height - 1; y++) {
						// Check if there is a tile in the current cell
						if (!!grid.tiles[x][y]) {
							// We can move down in the below cell is empty
							if (!grid.tiles[x][y+1]) {
								return true;
							} else if (grid.tiles[x][y].value === grid.tiles[x][y+1].value) {
								// We can move down if the below tile has the same value
								return true;
							}
						}
					}
				}

				return false;
			},
			canMoveLeft: function(grid) {
				// Check if we can move to the left
				// Skip `x = 0` because the leftmost cannot move left
				for (var x = 1; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.tiles[x][y]) {
							// We're fine if the cell to the left is empty
							if (!grid.tiles[x-1][y]) {
								return true;
							} else if (grid.tiles[x][y].value === grid.tiles[x-1][y].value) {
								// We're also fine if the tile to the left is the same as this one
								return true;
							}
						}
					}
				}

				return false;
			},
			canMoveRight: function(grid) {
				// Check if we can move to the right
				// Skip `x = grid.width` since the rightmost cannot move right
				for (var x = 0; x < grid.width - 1; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.tiles[x][y]) {
							// Fine if the cell to the right is empty
							if (!grid.tiles[x+1][y]) {
								return true;
							} else if (grid.tiles[x][y].value === grid.tiles[x+1][y].value) {
								// Fine if the tile to the right is the same value as the current one
								return true;
							}
						}
					}
				}

				return false;
			},

			moveUp: (function() {
				var getTopCell = function(column, currentY) {
					return column.reduceRight(function(top, cell, index) {
						return (index <= currentY && !cell) ? index : top;
					}, currentY);
				};
				var getBottomTile = function(column, currentY) {
					return column.reduce(function(bottom, cell, index) {
						// If we're not yet below the current tile, skip
						if (index <= currentY) { return undefined; }
						// If a tile has not been found and we have a tile, return index
						else if (!bottom && !!cell) { return index; }
						// Otherwise return the already found tile
						else { return bottom; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveUp(grid)) {
						var score = { score: 0 };

						for (var x = 0; x < grid.width; x++) {
							for (var y = 0; y < grid.height; y++) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var topCellIndex = getTopCell(grid.tiles[x], y);
									var bottomTileIndex = getBottomTile(grid.tiles[x], y);

									Movement.attemptMove(grid, "UP", x, y, x, topCellIndex);
									var mergeScore = Movement.attemptMerge(grid, "UP", x, currentTile.y, x, bottomTileIndex);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),
			moveDown: (function() {
				var getBottomCell = function(column, currentY) {
					return column.reduce(function(bottom, cell, index) {
						return (index >= currentY && !cell) ? index : bottom;
					}, currentY);
				};
				var getTopTile = function(column, currentY) {
					return column.reduceRight(function(top, cell, index) {
						// If we're not above the current tile, skip
						if (index >= currentY) { return undefined; }
						// If we don't have a top and we have a tile, return index
						else if (!top && !!cell) { return index; }
						// Otherwise return current tile
						else { return top; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveDown(grid)) {
						var score = { score: 0 };

						for (var x = 0; x < grid.width; x++) {
							for (var y = (grid.height - 1); y >= 0; y--) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var bottomCellIndex = getBottomCell(grid.tiles[x], y);
									var topTileIndex = getTopTile(grid.tiles[x], y);

									Movement.attemptMove(grid, "DOWN", x, y, x, bottomCellIndex);
									var mergeScore = Movement.attemptMerge(grid, "DOWN", x, currentTile.y, x, topTileIndex);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),
			moveLeft: (function() {
				var getLeftmostCell = function(grid, currentX, currentY) {
					return grid.tiles.reduceRight(function(left, row, index) {
						return (index <= currentX && !row[currentY]) ? index : left;
					}, currentX);
				};
				var getRightTile = function(grid, currentX, currentY) {
					return grid.tiles.reduce(function(right, row, index) {
						// If we're still left of the current tile, skip
						if (index <= currentX) { return undefined; }
						// If we do not have a right and have a tile, we've found it
						else if (!right && !!row[currentY]) { return index; }
						// Otherwise keep passing the current right
						else { return right; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveLeft(grid)) {
						var score = { score: 0 };

						for (var y = 0; y < grid.height; y++) {
							for (var x = 0; x < grid.width; x++) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var leftCellIndex = getLeftmostCell(grid, x, y);
									var rightTileIndex = getRightTile(grid, x, y);

									Movement.attemptMove(grid, "LEFT", x, y, leftCellIndex, y);
									var mergeScore = Movement.attemptMerge(grid, "LEFT", currentTile.x, y, rightTileIndex, y);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),
			moveRight: (function() {
				var getRightCell = function(grid, currentX, currentY) {
					return grid.tiles.reduce(function(right, row, index) {
						return (index >= currentX && !row[currentY]) ? index : right;
					}, currentX);
				};
				var getLeftTile = function(grid, currentX, currentY) {
					return grid.tiles.reduceRight(function(left, row, index) {
						// If we are right of the current tile, skip
						if (index >= currentX) { return undefined; }
						// If we do not yet have a left tile and we have found one, return it
						else if (!left && !!row[currentY]) { return index; }
						// Otherwise, keep passing the found left
						else { return left; }
					}, undefined);
				};

				return function(grid) {
					if (Movement.canMoveRight(grid)) {
						var score = { score: 0 };

						for (var y = 0; y < grid.height; y++) {
							for (var x = (grid.width - 1); x >= 0; x--) {
								if (!!grid.tiles[x][y]) {
									var currentTile = grid.tiles[x][y];
									var rightCellIndex = getRightCell(grid, x, y);
									var leftTileIndex = getLeftTile(grid, x, y);

									Movement.attemptMove(grid, "RIGHT", x, y, rightCellIndex, y);
									var mergeScore = Movement.attemptMerge(grid, "RIGHT", currentTile.x, y, leftTileIndex, y);

									if (!!mergeScore && isFinite(mergeScore.score)) {
										score.score += mergeScore.score;
									}
								}
							}
						}

						return score;
					}

					return false;
				};
			})(),

			setupSlide: function(grid, direction, startX, startY, endX, endY) {
				var tile = grid.tiles[startX][startY];

				tile.sliding = { value: 0 };
				tile.triggerSlide = true;
				tile.slidingData = {
					direction: direction,
					startX: startX,
					startY: startY,
					endX: endX,
					endY: endY
				};
			},

			attemptMove: function(grid, direction, currentX, currentY, newX, newY) {
				if (isFinite(currentX) && isFinite(currentY) && isFinite(newX) && isFinite(newY)) {
					if (currentX !== newX || currentY !== newY) {
						var currentTile = grid.tiles[currentX][currentY];
						currentTile.x = newX;
						currentTile.y = newY;

						// Setup data needed for slide animation
						this.setupSlide(grid, direction, currentX, currentY, newX, newY);

						grid.tiles[newX][newY] = currentTile;
						grid.tiles[currentX][currentY] = undefined;

						return true;
					}
				}

				return false;
			},
			attemptMerge: function(grid, direction, currentX, currentY, neighborX, neighborY) {
				if (isFinite(currentX) && isFinite(currentY) && isFinite(neighborX) && isFinite(neighborY)) {
					if (grid.tiles[currentX][currentY].value === grid.tiles[neighborX][neighborY].value) {
						// Double the value of the current cell
						grid.tiles[currentX][currentY].value *= 2;
						// Set growth animation flag for merged tile
						grid.tiles[currentX][currentY].triggerGrowth = true;

						// Setup the merged cell for the slide animation
						this.setupSlide(grid, direction, neighborX, neighborY, currentX, currentY);
						grid.mergedTiles[neighborX][neighborY] = grid.tiles[neighborX][neighborY];
						// Erase the neighboring cell from the map
						grid.tiles[neighborX][neighborY] = undefined;

						return { score: grid.tiles[currentX][currentY].value };
					}
				}

				return false;
			}
		};

		// Public interface
		return {
			move: function(direction, grid) {
				return Movement.move(direction, grid);
			},
			canMove: function(direction, grid) {
				return Movement.canMove(direction, grid);
			}
		};
	})();

	var Game = (function() {
		var Game = {
			reset: function(grid) {
				// Set the score
				grid.score = 0;
				// Create new set of tiles
				grid.tiles = [];
				grid.mergedTiles = [];

				// Fill the set of tiles as empty
				for (var x = 0; x < grid.width; x++) {
					grid.tiles[x] = [];
					grid.mergedTiles[x] = [];

					for (var y = 0; y < grid.height; y++) {
						grid.tiles[x][y] = undefined;
						grid.mergedTiles[x][y] = undefined;
					}
				}

				// Randomly generate and place two tiles to start
				var firstTile = randomTile(grid);
				grid.tiles[firstTile.x][firstTile.y] = firstTile;
				var secondTile = randomTile(grid);
				grid.tiles[secondTile.x][secondTile.y] = secondTile;
			},
			hasLost: function(grid) {
				return (!Movement.canMove("UP", grid) && !Movement.canMove("DOWN", grid) && !Movement.canMove("LEFT", grid) &&
					!Movement.canMove("RIGHT", grid));
			},
			hasWon: function(grid) {
				for (var x = 0; x < grid.width; x++) {
					for (var y = 0; y < grid.height; y++) {
						if (!!grid.tiles[x][y] && grid.tiles[x][y].value === grid.winningValue) {
							return true;
						}
					}
				}

				return false;
			}
		};

		return {
			reset: function(grid) {
				Game.reset(grid);
			},
			hasLost: function(grid) {
				return Game.hasLost(grid);
			},
			hasWon: function(grid) {
				return Game.hasWon(grid);
			}
		};
	})();




	var getEmptyCells = function(grid) {
		var emptyCells = {};

		for (var x = 0; x < grid.width; x++) {
			var row = [];

			for (var y = 0; y < grid.height; y++) {
				if (!grid.tiles[x][y]) {
					row.push(y);
				}
			}

			if (row.length > 0) {
				emptyCells[x] = row;
			}
		}

		return emptyCells;
	};

	var randomTile = function(grid) {
		var emptyCells = getEmptyCells(grid);
		var keys = [];
		//noinspection JSHint
		for (var key in emptyCells) {
			//noinspection JSUnfilteredForInLoop
			keys.push(key);
		}

		// First-level index represents the actual grid-row
		var row = keys[Math.floor(Math.random() * keys.length)];
		// Values of inner-array are available columns
		var column = Math.floor(Math.random() * emptyCells[row].length);

		return {
			// Allow 2 or 4 as a starting value, to spice things up
			value: Math.ceil(Math.random() * 2) * 2,
			// Starting random coordinates within the grid
			x: row,
			y: emptyCells[row][column],
			triggerGrowth: true,
			growing: {
				modifier: "GROW",
				value: -25,
				maxSize: 0,
				minSize: 0
			}
		};
	};




	// Initialize game and controls
	(function() {
		// Pixel Density for Devices - http://stackoverflow.com/a/15666143/372743
		var pixelRatio = Metrics.getPixelRatio();
		var size = Metrics.getSize();

		var body = document.getElementById("body");
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		canvas.width = size * pixelRatio;
		canvas.height = size * pixelRatio;
		canvas.style.width = (size + "px");
		canvas.style.height = (size + "px");

		// Seems to fuck up the iOS UIWebView by splitting the quartering the canvas
//		context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

		body.appendChild(canvas);

		// tile: {value: 2, x: 0, y: 0} - Includes value and coordinates (redundant, but error correcting)
		var grid = {
			// column x row
			tiles: [],
			// Used for tiles that are merged but need to be animated
			mergedTiles: [],
			width: 4,
			height: 4,
			winningValue: 2048,
			score: 0
		};

		// Initialize game data
		Game.reset(grid);

		// Determine if we need a random tile on the next input
		var insertTile = false;

		// Setup the render loop
		(function mainLoop() {
			// Handle calculations for animations
			var blockInput = Animation.animate(canvas, context, grid);

			// Handle the user input
			if (!blockInput) {
				// Insert a new random tile if needed
				if (insertTile) {
					insertTile = false;
					var tile = randomTile(grid);
					grid.tiles[tile.x][tile.y] = tile;
				} else {
					// Allow the user to move tiles
					var score = Movement.move(Input.getCommand(), grid);
					if (!!score) {
						// Update the score
						grid.score += score.score;
						// If we've moved successfully, set a new tile for insertion
						insertTile = true;
					}
				}
			}

			// Draw the game screen
			Renderer.render(canvas, context, grid);

			// Check if we need to continue playing
			if (Game.hasWon(grid)) {
				// Draw the game won screen
				Renderer.showGameWon(canvas, context);
			} else if (Game.hasLost(grid)) {
				// Draw game over screen
				Renderer.showGameOver(canvas, context);
			} else {
				// Continue running the main loop
				setTimeout(mainLoop, 25);
			}
		})();
	})();
})();

