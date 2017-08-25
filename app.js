(function() {

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');

    var fps = 60;
    var ballSpeedX = 5;
    var ballSpeedY = 2;
    var ballRadius = 10;
    var ballX = (canvas.width / 2);
    var ballY = (canvas.height / 2);

    var player1Height = 100;
    var player1Width = 5;
    var player1Y = (canvas.height / 2) - (player1Height / 2);

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;

        return {
            x: mouseX,
            y: mouseY
        }
    }

    function followMouse(x) {
        player1Y = x - (player1Height / 2);
    }

    function drawRect(color, x, y, height, width) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, height, width);
    }

    function drawBall(color, x, y, radius) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function bounceBall() {
        if (ballX >= canvas.width) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX <= 0) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        } else if (ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        bounceBall();
    }

    // draws crosshair for testing purpose
    function drawCrosshair(draw) {
        if (draw) {
            drawRect('grey', 0, (canvas.height / 2), canvas.width, 1);
            drawRect('grey', (canvas.width / 2), 0, 1, canvas.height);
        } else {
            return;
        }
    }

    function draw() {
        // draw the background
        drawRect('black', 0, 0, canvas.width, canvas.height);

        // draw player 1
        drawRect('white', 0, player1Y, player1Width, player1Height);

        //draw the ball
        drawBall('white', ballX, ballY, ballRadius);

        drawCrosshair(true);

        // Move the ball
        moveBall();
    }

    function update() {
        setInterval(draw, 1000 / fps);
    }

    window.onload = function () {
        update();

        canvas.addEventListener('mousemove', function (evt) {
            followMouse(getMousePos(evt).y);
        })
    }



})();