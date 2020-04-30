function collectStar(player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child)
        {
            child.enableBody(true, child.x, 0, true, true);
        });
        createBomb();
        createFallingHearts();
    }
}

function createBomb()
{
    var x =
        player.x < 400 ?
            Phaser.Math.Between(400, 800) :
            Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
}
// when player hits the bomb, lives decrease and updated
function hitBomb(player, bomb)
{
    bomb.disableBody(true, true);
    //
    lives--;
    livesText.setText("x" + lives);
    //if lives are 0, the game ends.
    if (lives === 0)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        gameOver = true;
    }
}


function createFallingHearts()
{
    var random = Phaser.Math.Between(1, 10);
    // 30% chance of falling a heart
    if (random <= 3)
    {
        var x = Phaser.Math.Between(10, 790);
        var fallingHeart = fallingHearts.create(x, 16, "heart");
        fallingHeart.setBounce(0.4);
    }
}

function collectHeart(player, fallingHeart)
{
    fallingHeart.disableBody(true, true);
    //  Add and update the lives
    lives++;
    livesText.setText("x" + lives);
  
}

