var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var lives = 3;
var livesText;
var hearts;
var timeLeftToEndOfTheGame = 120; //time left in seconds
var fallingHearts;
var game = new Phaser.Game(config);


function preload()
{
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.image("heart", "assets/heart.png");
    //this.load.image("shield", "assets/shield.png");
}

function create()
{
    //  A simple background for our game
    this.add.image(400, 300, "sky");

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    // The player and its settings
    player = this.physics.add.sprite(100, 450, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "turn",
        frames: [{
            key: "dude",
            frame: 4
        }],
        frameRate: 20
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: {
            x: 12,
            y: 0,
            stepX: 70
        }
    });

    stars.children.iterate(function (child)
    {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    hearts = this.physics.add.staticGroup({
        key: "heart",
        setXY: {
            x: 725,
            y: 30
        }
    });

    // The falling hearts
    fallingHearts = this.physics.add.group();
    this.physics.add.overlap(player, fallingHearts, collectHeart, null, this);
    this.physics.add.collider(fallingHearts, platforms);


    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, "score: 0", {
        fontSize: "32px",
        fill: "#000"
    });

    //  The lives
    livesText = this.add.text(750, 16, "x" + lives, {
        fontSize: "32px",
        fill: "#000"
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    // Collide the player with bomb and call hitBomb if does
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.input.addDownCallback(function ()
    {

        if (game.sound.context.state === 'suspended')
        {
            game.sound.context.resume();
        }

    });
}

var jumpMax = 2;
var jumpsLeft = jumpMax;
var isUpPressed = false;

function update()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play("left", true);
    }
    else
    {
        if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play("right", true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play("turn");
        }
    }
    //resets jumps left to maximum when touching ground
    if (player.body.touching.down)
    {
        jumpsLeft = jumpMax;
    }
    //check if Up key is down
    if (cursors.up.isDown)
    {
        //to catch just the first key down event
        if (isUpPressed === false)
        {
            //check if there is jumps left
            if (jumpsLeft > 0)
            {
                //jumps
                player.setVelocityY(-330);
                //updating the counter
                jumpsLeft--;
                //to catch just the first key down event
                isUpPressed = true;
            }
        }
    }
    else
    {
        //after realse of Up key, you may now click again
        isUpPressed = false;
    }

    if (cursors.down.isDown)
    {
        player.setVelocityY(330);
    }
}




