(function (global) {
	var Paddle = function () {
		var text = document.querySelector("span.bg.s_ipt_wr.quickdelete-wrap")
		var button = document.querySelector("#su")
		text.style.position = "fixed"
		button.style.position = "fixed"
		var textStyle = text.getClientRects()[0]
		var buttonWidth = button.getClientRects()[0].width
		button.style.left = (textStyle.left + textStyle.width) + "px"
		var o = {
			text: text,
			button: button,
			left: textStyle.left,
			top: textStyle.top,
			height: textStyle.height,
			width: textStyle.width + buttonWidth,
			speed: 15,
		}
		o.moveLeft = function () {
			var a = o.left - o.speed
			if (a <= 0) {
				o.left = 0
			} else {
				o.left = a
			}
		}
		o.moveRight = function () {
			var a = o.left + o.speed
			if (a + o.width >= window.innerWidth) {
				o.left = window.innerWidth - o.width
			} else {
				o.left = a
			}
		}
		o.collide = function (y) {
			if (o.left >= y.left + y.width || o.left + o.width <= y.left) {
				return false
			} else if (o.top >= y.top + y.height || o.top + o.height <= y.top) {
				return false
			}
			var coByLR = function (x, y) {
				return Math.abs(x.left + x.width - y.left)
			}
			var coByTB = function (x, y) {
				return Math.abs(x.top + x.height - y.top)
			}
			var dist = Math.min(coByLR(o, y), coByLR(y, o), coByTB(o, y), coByTB(y, o))
			switch (dist) {
				case coByLR(y, o):
					return 'L'
				case coByLR(o, y):
					return 'R'
				case coByTB(y, o):
					return 'T'
				case coByTB(o, y):
					return 'B'
			}
		}
		o.drawObj = function () {
			text.style.left = o.left + "px"
			button.style.left = o.left + textStyle.width + "px"
		}
		return o
	}
	var Ball = function () {
		var ball = document.querySelector("div.qrcode-img")
		ball.style.position = "fixed"
		var ballStyle = ball.getClientRects()[0]
		var o = {
			ball: ball,
			left: ballStyle.left,
			top: ballStyle.top,
			width: ballStyle.width,
			height: ballStyle.height,
			speedTop: 20,
			speedLeft: 20,
			fired: false,
		}
		o.fire = function () {
			o.fired = true
		}
		o.move = function () {
			if (o.fired) {
				if (o.left < 0 || o.left + o.width > window.innerWidth) {
					o.speedLeft = -o.speedLeft
				}
				if (o.top < 0 || o.top + o.height > window.innerHeight) {
					o.speedTop = -o.speedTop
				}
				o.top += o.speedTop
				o.left += o.speedLeft
			}
		}
		o.moveBack = function (type) {
			var t = type
			switch (t) {
				case 'L':
					o.speedLeft = -Math.abs(o.speedLeft)
					break
				case 'R':
					o.speedLeft = Math.abs(o.speedLeft)
					break
				case 'T':
					o.speedTop = -Math.abs(o.speedTop)
					break
				case 'B':
					o.speedTop = Math.abs(o.speedTop)
					break
			}
		}
		o.drawObj = function () {
			ball.style.left = o.left + "px"
			ball.style.top = o.top + "px"
		}
		return o
	}
	var GouGame = function () {
		var g = {
			actions: {},
			keydowns: {},
		}
		window.addEventListener('keydown', function (event) {
			g.keydowns[event.key] = true
		})
		window.addEventListener('keyup', function (event) {
			g.keydowns[event.key] = false
		})
		g.registerAction = function (key, callback) {
			g.actions[key] = callback
		}
		setInterval(function () {
			var actions = Object.keys(g.actions)
			for (var i = 0; i < actions.length; i++) {
				var key = actions[i]
				if (g.keydowns[key]) {
					g.actions[key]()
				}
			}
			g.update()
			g.draw()
		}, 1000 / 60)
		return g
	}
	var __main = function () {
		var game = GouGame()
		var paddle = Paddle()
		var ball = Ball()
		game.registerAction('a', function () {
			paddle.moveLeft()
		})
		game.registerAction('d', function () {
			paddle.moveRight()
		})
		game.registerAction('f', function () {
			ball.fire()
		})
		game.update = function () {
			var i = paddle.collide(ball)
			if (i) {
				ball.moveBack(i)
			}
			ball.move()
		}
		game.draw = function () {
			paddle.drawObj()
			ball.drawObj()
		}
	}
	__main()
})(window)