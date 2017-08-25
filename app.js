(function() {

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');

    var fps = 60;
    var ballSpeedX = 5;
    var ballSpeedY = 2;
    var ballRadius = 10;
    var ballX = (canvas.width / 2);
    var ballY = (canvas.height / 2);
    var scoreLimit = 2;
    var pause = false;
    var centerLineLength = 10;
    var centerLineWidth = 1;

    var player1Height = 100;
    var player1Width = 5;
    var player1Y = (canvas.height / 2) - (player1Height / 2);
    var player1Score = 0;

    var player2Height = 100;
    var player2Width = 5;
    var player2Y = (canvas.height / 2) - (player1Height / 2);
    var player2Score = 0;

    function getWinner() {
        if (player1Score > player2Score) {
            return 1;
        } else {
            return 2;
        }
    }

    function getWinnerText() {
        return 'Player' + getWinner() + ' wins!';
    }

    function resetBall() {
        ballX = (canvas.width / 2);
        ballY = (canvas.height / 2);
        ballSpeedY = 2;
    }

    function getPlayerPos(playerNum) {

        if (playerNum === 1) {
            return {
                top: player1Y,
                bottom: player1Y + player1Height
            }
        } else if (playerNum === 2) {
            return {
                top: player2Y,
                bottom: player2Y + player2Height
            }
        }
    }

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

    function followBall() {
        if (ballY < (getPlayerPos(2).top + 10) ) {
            player2Y -= 5;
        } else if (ballY > (getPlayerPos(2).bottom - 10)) {
            player2Y += 5;
        }
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
        // bounce back the ball if it hits left and right wall
        if (ballX >= canvas.width) {
            ballSpeedX = -ballSpeedX;
            // check if ball hits the paddle or the wall
            if(ballY < getPlayerPos(2).top || ballY > getPlayerPos(2).bottom) {
                player1Score++;
                resetBall();
            } else {
                // calculate the speed, according to where the ball hits the paddle
                var deltaY = ballY - (player2Y + player2Height / 2);
                ballSpeedY = deltaY * 0.2;
            }

        } else if (ballX <= 0) {
            ballSpeedX = -ballSpeedX;
            // check if ball hits the paddle or the wall
            if(ballY < getPlayerPos(1).top || ballY > getPlayerPos(1).bottom) {
                player2Score++;
                resetBall();
            } else {
                // calculate the speed, according to where the ball hits the paddle
                var deltaY = ballY - (player1Y + player1Height / 2);
                ballSpeedY = deltaY * 0.2;
            }
        }

        // bounce back the ball if it hits top and bottom wall
        if (ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        } else if (ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }

        // check if game is not over
        if (scoreLimit === player1Score || scoreLimit === player2Score) {
            pause = true;
        }
    }

    function moveBall() {
        // check if game is not paused
        if (!pause) {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            bounceBall();
        } else {
            showWinScreen();
        }
    }

    function showWinScreen() {
        drawRect('black', 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px serif';
        ctx.fillText(getWinnerText(), 340, 200);

        ctx.fillText('Play again', 350, 400);
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

    function drawScore() {
        // draw the score to screen
        ctx.fillStyle = 'grey';
        ctx.font = '40px serif';
        ctx.fillText(player1Score.toString(), 100, 100);
        ctx.fillText(player2Score.toString(), canvas.width - 100, 100);
    }

    function drawCenterLine() {
        // draw dashed lines
        for (var i = 0; i <= canvas.height / centerLineLength; i++) {
            if (i % 2 === 0) {
                drawRect('white', canvas.width / 2, i * 10, centerLineWidth, centerLineLength);
            }
        }
    }

    function draw() {
        // draw the background
        drawRect('black', 0, 0, canvas.width, canvas.height);

        // draw player 1
        drawRect('white', 0, player1Y, player1Width, player1Height);

        // draw player 2
        drawRect('white', canvas.width - player2Width, player2Y, player2Width, player2Height);

        // draw the ball
        drawBall('white', ballX, ballY, ballRadius);

        // draw the score
        drawScore();

        // draw the center line
        drawCenterLine();

        // draw the crosshair for testing
        drawCrosshair(false);

        // move the ball
        moveBall();

        // game AI for following the ball with player2 paddle
        followBall();
    }

    function update() {
        setInterval(draw, 1000 / fps);
    }

    window.onload = function () {
        // start the game
        update();

        // update player1 paddle according to mouse position
        canvas.addEventListener('mousemove', function (evt) {
            followMouse(getMousePos(evt).y);
        });

        // restart the game
        canvas.addEventListener('click', function (evt) {
            pause = false;
            player1Score = 0;
            player2Score = 0;
        });
    }



})();