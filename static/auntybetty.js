let APressed = false;
let bullets = [];

const SPRITE_WIDTH = 64 / 4 - 1;
const SPRITE_HEIGHT = 51 / 3 - 1;

const ENEMY_WIDTH = 13;
const ENEMY_HEIGHT = 14;

const BORDER_WIDTH = 1;
const SPACING_WIDTH = 1;

let playerHP = 500;

setInterval(demonMove, 1000);
setInterval(pestMove, 1000);

let date = new Date();
let timeLimitInSecond = 20;

let isPaused = false;

let demon_x = 16;
let demon_y = 18;

let pest_x = 16;
let pest_y = 9;

let bulletImage = new Image();
bulletImage.src = `static/bullet.png`;

let enemySpriteSheetOne = new Image();
enemySpriteSheetOne.src = `static/demon_spritesheet.png`;

let enemySpriteSheetTwo = new Image();
enemySpriteSheetTwo.src = `static/pest_spritesheet.png`;

let loadMapImg = new Image();
loadMapImg.src = 'static/map.png';

let demonShootingIntervalId;
let pestShootingIntervalId;

let selectedSprite;

let obstacle = 20;

let x_zero;
let y_zero;

let x_move = 2;
let y_move = 2;

x_zero = x_move / 0;
y_zero - y_move / 0;

let demonBullets = [];
let pestBullets = [];

let frameIndexArr;
let spriteSheet;
let mapImage;

let demonHP = 100;
let pestHP = 200;

let canvasWidth;
let canvasHeight;

let tileWidth;
let tileHeight;

let rowIndx = 0;
let colIndx = 0;
let movementKeyPressed = false;
let animationController = null;

tileWidth = 22;
tileHeight = 21.7;

let playerAnimationMoveIntervalId = 0;

let playerInterval;

function spritePositionToImagePosition(row, col) {
    return {
        x: (BORDER_WIDTH + col * (SPACING_WIDTH + SPRITE_WIDTH)),
        y: (BORDER_WIDTH + row * (SPACING_WIDTH + SPRITE_HEIGHT))
    };
}

class Sprite {
    constructor(imagePath, frameWidth, frameHeight, frames) {
        this.image = new Image();
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frames = frames;
        this.currentFrame = 0;
        this.loaded = false;
        this.x = 50;
        this.y = 50;
        this.animation = "idle";
        this.direction = "down";
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = imagePath;
    }

    drawFrame(ctx, frameIndex) {
        if (!this.loaded) {
            console.error('Image not loaded for sprite:', this.image.src);
            return;
        }
        const frameX = frameIndex * this.frameWidth;
        const frameY = 0;
        ctx.drawImage(
            this.image,
            frameX, frameY, this.frameWidth, this.frameHeight,
            this.x, this.y, this.frameWidth, this.frameHeight
        );
    }
}

class Player extends Sprite {
    constructor(imagePath, frameWidth, frameHeight, frames) {
        super(imagePath, frameWidth, frameHeight, frames);
        this.animation = "idle";
        this.animationDuration = 500;
        this.direction = "down";
        this.absX = 0;
        this.absY = 0;
        this.isMoving = false;

    }
}

let player = new Player();

class EnemySprite {
    constructor(imagePath, frameWidth, frameHeight, frames) {
        this.image = new Image();
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frames = frames;
        this.currentFrame = 0;
        this.loaded = false;
        this.x = 50;
        this.y = 50;
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = imagePath;
    }

    drawFrame(ctx, frameIndex) {
        if (!this.loaded) {
            console.error('Image not loaded for enemy sprite:', this.image.src);
            return;
        }
        const frameX = frameIndex * this.frameWidth;
        const frameY = 0;
        ctx.drawImage(
            this.image,
            frameX, frameY, this.frameWidth, this.frameHeight,
            this.x, this.y, this.frameWidth, this.frameHeight
        );
    }
}

class Bullet {
    constructor(new_x, new_y, direction) {
        this.x = new_x;
        this.y = new_y;
        this.direction = direction;
        this.distance = 4;
        this.intervalID = 0;
    };
}

const enemySprites = {
    'demon': new EnemySprite('static/demon_spritesheet.png', 44, 44, [0, 1, 2, 3]),
    'pest': new EnemySprite('static/pest_spritesheet.png', 22, 22, [0, 1, 2, 3]),
};

function demonMove() {
    if (demon_x < x_move) {
        if (map[demon_y][demon_x + 1] == obstacle) {
            return;
        }

        demon_x++;
        checkPlayerToDemonLoseCondition();
    }
    else if (demon_x > x_move) {
        if (map[demon_y][demon_x - 1] == obstacle) {
            return;
        }
        demon_x--;
        checkPlayerToDemonLoseCondition();
    }
    else if (demon_y < y_move) {
        if (map[demon_y + 1][demon_x] == obstacle) {
            return;
        }
        demon_y++;
        checkPlayerToDemonLoseCondition();
    }
    else if (demon_y > y_move) {
        if (map[demon_y - 1][demon_x] == obstacle) {
            return;
        }
        demon_y--;
        checkPlayerToDemonLoseCondition();
    }

}

function pestMove() {
    if (pest_x < x_move) {
        if (map[pest_y][pest_x + 1] == obstacle) {
            return;
        }

        pest_x++;
        checkPlayerToPestLoseCondition();
    }
    else if (pest_x > x_move) {
        if (map[pest_y][pest_x - 1] == obstacle) {
            return;
        }
        pest_x--;
        checkPlayerToPestLoseCondition();
    }
    else if (pest_y < y_move) {
        if (map[pest_y + 1][pest_x] == obstacle) {
            return;
        }
        pest_y++;
        checkPlayerToPestLoseCondition();
    }
    else if (pest_y > y_move) {
        if (map[pest_y - 1][pest_x] == obstacle) {
            return;
        }
        pest_y--;
        checkPlayerToPestLoseCondition();
    }

}

const sprites = {
    'hero': new Player('static/hero_spritesheet.png', 75, 75, [0, 1, 2, 3]),
    'mystic': new Player('static/mystic_spritesheet.png', 75, 75, [0, 1, 2, 3]),
    'rogue': new Player('static/rogue_spritesheet.png', 75, 75, [0, 1, 2, 3]),
    'warrior': new Player('static/warrior_spritesheet.png', 75, 75, [0, 1, 2, 3])
};

var character = "{{ session['characterName'] }}";


function leaderboardStats() {
    const formData = new URLSearchParams();
    formData.append('character', encodeURIComponent(character));
    formData.append('score', encodeURIComponent(score));
    formData.append('countdown', encodeURIComponent(countdown));
    fetch('./store_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },

        body: formData.toString(),

    })
        .then(response => response.text())
        .then(data => console.log);
}


function selectCharacter(characterKey) {
    console.log(characterKey.trim());
    console.log(sprites[characterKey.trim()]);
    selectedSprite = sprites[characterKey.trim()];
    if (!selectedSprite) {
        console.error('Selected sprite image not loaded yet:', characterKey);
        return;
    }

    pickCharacter();

}

function pickCharacter() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 75 * 2.26;
    canvas.height = 75 * 2.8;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedSprite) {
        const characterKey = Object.keys(sprites).find(key => sprites[key] === selectedSprite);
        const spriteSheetImg = new Image();
        spriteSheetImg.src = `static/${characterKey}_spritesheet.png`;

        frameIndexArr = sprites[characterKey].frames.slice();
        const frameIndex = frameIndexArr[0];
        const framePosition = spritePositionToImagePosition(Math.floor(frameIndex / 4), frameIndex % 4);

        spriteSheetImg.onload = () => {
            spriteSheet = spriteSheetImg;
            ctx.drawImage(
                spriteSheetImg,
                framePosition.x, framePosition.y, SPRITE_WIDTH, SPRITE_HEIGHT,
                0, 0, 75 * 2.26, 75 * 2.8
            );
        };

        const loadMapImg = new Image();
        loadMapImg.src = 'static/map.png';
        loadMapImg.onload = () => {
            mapImage = loadMapImg;
        };
    }
    startEnemyShooting();

}

function drawCharacter() {
    const canvas = document.getElementById('gameCanvas');

    canvas.width = 704;
    canvas.height = 704;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    if (mapImage !== undefined) {
        ctx.drawImage(
            mapImage,
            0, 0, canvas.width, canvas.height
        );
    }


    if (selectedSprite) {
        const framePosition = spritePositionToImagePosition(rowIndx % 3, colIndx);
        if (spriteSheet !== undefined)
            ctx.drawImage(
                spriteSheet,
                framePosition.x, framePosition.y, SPRITE_WIDTH, SPRITE_HEIGHT,
                x_move * tileWidth, y_move * tileHeight, tileHeight, tileWidth
            );
    }


    for (let i = 0; i < bullets.length; i++) {
        ctx.drawImage(bulletImage,
            bullets[i].x * tileWidth, bullets[i].y * tileHeight, 22, 22);
    }
    for (let i = 0; i < demonBullets.length; i++) {
        ctx.drawImage(bulletImage,
            demonBullets[i].x * tileWidth, demonBullets[i].y * tileHeight, 22, 22);
    }
    for (let i = 0; i < pestBullets.length; i++) {
        ctx.drawImage(bulletImage,
            pestBullets[i].x * tileWidth, pestBullets[i].y * tileHeight, 22, 22);
    }

    if (enemySpriteSheetOne !== undefined)
        ctx.drawImage(
            enemySpriteSheetOne,
            18, 18, ENEMY_WIDTH, ENEMY_HEIGHT,
            demon_x * tileWidth, demon_y * tileHeight, tileHeight, tileWidth
        );

    if (enemySpriteSheetTwo !== undefined)
        ctx.drawImage(
            enemySpriteSheetTwo,
            34, 34, ENEMY_WIDTH, ENEMY_HEIGHT,
            pest_x * tileWidth, pest_y * tileHeight, tileHeight, tileWidth
        );

    demonShootBullet();
    pestShootBullet();
    animationController = requestAnimationFrame(drawCharacter);


    const elapsed = Math.floor((Date.now() - startMillisecond) / 1000);
    let timeLimit = (timeLimitInSecond - elapsed);
    console.log(timeLimit)
    keepTime();

}

function pauseGame() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    if (isPaused) {
        pauseButton.textContent = 'Resume';
        cancelAnimationFrame(animationController);
        animationController = null;
    } else {
        pauseButton.textContent = 'Pause';
        animationController = requestAnimationFrame(drawCharacter);
    }
}

function restartGame() {
    let modal = document.getElementById("restartGame");
    modal.style.display = "block";
    cancelAnimationFrame(animationController);
    animationController = null;
}

function restart() {
    let modal = document.getElementById("restartGame");
    modal.style.display = "none";

    demonBullets = [];
    pestBullets = [];
    bullets = [];
    x_move = 2;
    y_move = 2;
    demon_x = 16;
    demon_y = 18;
    pest_x = 16;
    pest_y = 9;
    playerHP = 500;
    demonHP = 100;
    pestHP = 200;
    document.getElementById("HPDisplay").textContent = `Player HP: 500`;
    animationController = requestAnimationFrame(drawCharacter);
}

function bulletTraveled(bullet, bulletArray) {
    if (bullet.distance === 0) {
        clearInterval(bullet.intervalID);
        if (Array.isArray(bulletArray)) {
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
        }
    }

    if (Array.isArray(bulletArray) && bulletArray.length > 0) {
        if (bullet.x === demon_x && bullet.y === demon_y) {
            playerAttackedDemon();
            clearInterval(bullet.intervalID);
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
            return;
        }

        if (bullet.x === pest_x && bullet.y === pest_y) {
            playerAttackedPest();
            clearInterval(bullet.intervalID);
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
            return;
        }
    }

    if (bullet.direction === "left") {
        bullet.x--;
        bullet.distance--;
    } else if (bullet.direction === "right") {
        bullet.x++;
        bullet.distance++;
    } else if (bullet.direction === "up") {
        bullet.y--;
        bullet.distance--;
    } else if (bullet.direction === "down") {
        bullet.y++;
        bullet.distance++;
    }
}

function pestBulletTraveled(bullet, bulletArray, bullet_x, bullet_y) {
    if (bullet.distance === 0) {
        clearInterval(bullet.intervalID);
        if (Array.isArray(bulletArray)) {
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
        }
    }

    if (Array.isArray(bulletArray) && bulletArray.length > 0) {
        if (bullet.x === x_move && bullet.y === y_move) {
            pestAttackedPlayer();
            clearInterval(bullet.intervalID);
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
            return;
        }
    }


    if (bullet.direction === "left") {
        bullet.x--;
        bullet.distance--;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.x++;
        }
    }
    else if (bullet.direction === "right") {
        bullet.x++;
        bullet.distance++;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.x--;
        }

    } else if (bullet.direction === "up") {
        bullet.y--;
        bullet.distance--;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.y++;
        }
    } else if (bullet.direction === "down") {
        bullet.y++;
        bullet.distance++;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.y--;
        }
    }

}

function demonBulletTraveled(bullet, bulletArray) {
    if (bullet.distance === 0) {
        clearInterval(bullet.intervalID);
        if (Array.isArray(bulletArray)) {
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
        }
    }

    if (Array.isArray(bulletArray) && bulletArray.length > 0) {
        if (bullet.x === x_move && bullet.y === y_move) {
            demonAttackedPlayer();
            clearInterval(bullet.intervalID);
            const bulletIndex = bulletArray.indexOf(bullet);
            if (bulletIndex !== -1) {
                bulletArray.splice(bulletIndex, 1);
            }
            return;
        }
    }

    if (bullet.direction === "left") {
        bullet.x--;
        bullet.distance--;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.x++;
        }
    }
    else if (bullet.direction === "right") {
        bullet.x++;
        bullet.distance++;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.x--;
        }

    } else if (bullet.direction === "up") {
        bullet.y--;
        bullet.distance--;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.y++;
        }
    } else if (bullet.direction === "down") {
        bullet.y++;
        bullet.distance++;
        if (map[bullet.y][bullet.x] == obstacle) {
            bullet.distance = 0;
            bullet.y--;
        }
    }
}

function playerShootBullet(event) {
    if (isPaused) return;
    if (event.code === 'KeyA') {
        APressed = true;
        let bullet = new Bullet(x_move, y_move, "left");
        bullet.intervalID = setInterval(function () {
            bulletTraveled(bullet, bullets);
        }, 250);
        bullets.push(bullet);
    } else if (event.code === 'KeyW') {
        APressed = true;
        let bullet = new Bullet(x_move, y_move, "up");
        bullet.intervalID = setInterval(function () {
            bulletTraveled(bullet, bullets);
        }, 250);
        bullets.push(bullet);
    } else if (event.code === 'KeyD') {
        APressed = true;
        let bullet = new Bullet(x_move, y_move, "right");
        bullet.intervalID = setInterval(function () {
            bulletTraveled(bullet, bullets);
        }, 250);
        bullets.push(bullet);
    } else if (event.code === 'KeyS') {
        APressed = true;
        let bullet = new Bullet(x_move, y_move, "down");
        bullet.intervalID = setInterval(function () {
            bulletTraveled(bullet, bullets);
        }, 250);
        bullets.push(bullet);
    }
}

function startEnemyShooting() {
    demonShootingIntervalId = setInterval(demonAttackedPlayer, 1);
    pestShootingIntervalId = setInterval(pestAttackedPlayer, 1);
}

function demonAttackedPlayer() {
    for (let i = 0; i < demonBullets.length; i++) {
        const bullet = demonBullets[i];
        if (bullet.x === x_move && bullet.y === y_move) {
            playerHP -= 10;
            demonBullets.splice(i, 1);
            i--;
            document.getElementById("HPDisplay").textContent = `Player HP: ${playerHP}`;
            if (playerHP <= 0) {
                document.getElementById("HPDisplay").textContent = `Player HP: 0`;
                restartGame();
            }
        }
    }
}

function pestAttackedPlayer() {
    for (let i = 0; i < pestBullets.length; i++) {
        const bullet = pestBullets[i];
        if (bullet.x === x_move && bullet.y === y_move) {
            playerHP -= 5;
            pestBullets.splice(i, 1);
            i--;
            document.getElementById("HPDisplay").textContent = `Player HP: ${playerHP}`;
            if (playerHP <= 0) {
                document.getElementById("HPDisplay").textContent = `Player HP: 0`;
                restartGame();
            }
        }
    }
}

function demonShootBullet() {
    const distanceToPlayer = calculateDistance(demon_x, demon_y, x_move, y_move);
    const visionRange = 10;

    if (distanceToPlayer < visionRange) {
        let direction;
        if (x_move < demon_x) {
            direction = "left";
        } else if (x_move > demon_x) {
            direction = "right";
        } else if (y_move < demon_y) {
            direction = "up";
        } else {
            direction = "down";
        }

        const bullet = new Bullet(demon_x, demon_y, direction);
        bullet.intervalID = setInterval(function () {
            demonBulletTraveled(bullet, demonBullets);
        }, 250);
        demonBullets.push(bullet);
    }
}

function pestShootBullet() {
    const distanceToPlayer = calculateDistance(pest_x, pest_y, x_move, y_move);
    const visionRange = 10;

    if (distanceToPlayer < visionRange) {
        let direction;
        if (x_move < pest_x) {
            direction = "left";
        } else if (x_move > pest_x) {
            direction = "right";
        } else if (y_move < pest_y) {
            direction = "up";
        } else {
            direction = "down";
        }

        const bullet = new Bullet(pest_x, pest_y, direction);
        bullet.intervalID = setInterval(function () {
            pestBulletTraveled(bullet, pestBullets);
        }, 250);
        pestBullets.push(bullet);
    }
}

function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function playerAnimationMove(destinationX = 1000) {
    clearInterval(playerInterval);

    const animate = () => {
        if (player.absX >= destinationX) {
            player.absX = 0;
        } else {
            player.absX += 1;
        }

        updatePlayerPosition();

        requestAnimationFrame(animate);
    };

    animate();
}

function updatePlayerPosition() {
    if (movementKeyPressed) {
        colIndx = 0;
        rowIndx = player.absX;
        switch (player.direction) {
            case "left": colIndx = 3; break;
            case "right": colIndx = 1; break;
            case "up": colIndx = 2; break;
            case "down": colIndx = 0; break;

        }
    } else {
        colIndx = 0;
        rowIndx = 0;
    }
}

playerAnimationMove();
playerAnimationMove(500);

function keyDownMovement(event) {
    if (isPaused) return;
    if (event.code === 'ArrowLeft') {
        movementKeyPressed = true;
        player.direction = "left";
        if (x_move - 1 <= -1) {
            return;
        }
        if (map[y_move][x_move - 1] == obstacle) {
            return;
        }

        x_move += -1;
        checkWinCondition();
    } else if (event.code === 'ArrowRight') {
        movementKeyPressed = true;
        player.direction = "right";
        if (x_move + 1 >= map[0].length) {
            return;
        }
        if (map[y_move][x_move + 1] == obstacle) {
            return;
        }
        x_move += 1;
        checkWinCondition();
    } else if (event.code === 'ArrowUp') {
        movementKeyPressed = true;
        player.direction = "up";
        if (y_move - 1 <= -1) {
            return;
        }
        if (map[y_move - 1][x_move] == obstacle) {
            return;
        }
        y_move += -1;
        checkWinCondition();
    } else if (event.code === 'ArrowDown') {
        movementKeyPressed = true;
        player.direction = "down";
        if (y_move + 1 >= map[0].length) {
            return;
        }
        if (map[y_move + 1][x_move] == obstacle) {
            return;
        }
        y_move += 1;
        checkWinCondition();
    }
}

function keyUpMovement(event) {
    if (event.code === 'ArrowLeft') {
        movementKeyPressed = false;
    } else if (event.code === 'ArrowRight') {
        movementKeyPressed = false;
    } else if (event.code === 'ArrowUp') {
        movementKeyPressed = false;
    } else if (event.code === 'ArrowDown') {
        movementKeyPressed = false;
    }
}

function checkWinCondition() {
    if (map[y_move][x_move] == 14) {
        const winMessageDiv = document.createElement('div');
        alert(`YOU WIN! Score: ${score} seconds`);
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(winMessageDiv);
        leaderboardStats();
    }
}

function checkPlayerToDemonLoseCondition() {
    demonAttackedPlayer();
    if (demon_x == x_move && demon_y == y_move) {
        playerHP -= 100;
        document.getElementById("HPDisplay").innerHTML = playerHP;
        if (playerHP <= 0) {
            alert("YOU LOSE!");
        }
    }

}

function checkPlayerToPestLoseCondition() {
    pestAttackedPlayer();
    if (pest_x == x_move && pest_y == y_move) {
        playerHP -= 100;
        document.getElementById("HPDisplay").innerHTML = playerHP;
        if (playerHP <= 0) {
            alert("YOU LOSE!");
        }
    }

}

let score = 0


let demonScore = 0;

function checkDemonLoseCondition() {

    if (demonHP <= 0) {
        alert("DEMON DEFEATED!");
        demonScore = 100;
    }

    demonHP = 100;
    document.getElementById("demonHPDisplay").textContent = `Demon HP: ${demonHP}`;
    keepScore(demonScore);

    resetDemonPosition();
}

let pestScore = 0;

function checkPestLoseCondition() {

    if (pestHP <= 0) {
        alert("PEST DEFEATED!");
        pestScore = 100;
    }
    pestHP = 100;
    document.getElementById("pestHPDisplay").textContent = `Pest HP: ${pestHP}`;
    keepScore(pestScore);
    resetPestPosition();
}


function keepScore(subscore) {
   
    score += subscore 
    
    document.getElementById("ScoreDisplay").textContent = `Score: ${score}`;

}
let load_assets;

function init(){ 
    load_assets([
        {"var": mapImage, "url": 'static/map.png'},
    ])
}

let finishTime = Date.now() + 50 * 1000;
let countdown;
let startMillisecond = Date.now();

function keepTime() {
    countdown = (finishTime - Date.now()) / 1000;
    document.getElementById("TimeDisplay").textContent = `Time: ${countdown}`;
}

function playerAttackedDemon() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        if (bullet.x === demon_x && bullet.y === demon_y) {
            demonHP -= 10;
            bullets.splice(i, 1);
            i--;
            document.getElementById("demonHPDisplay").textContent = `Demon HP: ${demonHP}`;
            if (demonHP <= 0) {
                checkDemonLoseCondition();
            }
        }
    }
    clearInterval(demonShootingIntervalId);

}

function playerAttackedPest() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        if (bullet.x === pest_x && bullet.y === pest_y) {
            pestHP -= 10;
            bullets.splice(i, 1);
            i--;
            document.getElementById("pestHPDisplay").textContent = `Pest HP: ${pestHP}`;
            if (pestHP <= 0) {
                checkPestLoseCondition();
            }
        }
    }
    clearInterval(pestShootingIntervalId);

}

function preventDefaultForArrowKeys(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault();
    }
}

function getRandomInt() {
    return Math.floor(Math.random() * 30) + 1;
}

function resetDemonPosition() {
    demon_x = getRandomInt();
    demon_y = getRandomInt();
    while (map[demon_y][demon_x] == obstacle) {
        if (demon_y--) {
            getRandomInt();
        }
    }
}

function resetPestPosition() {
    pest_x = getRandomInt();
    pest_y = getRandomInt();
    while (map[pest_y][pest_x] == obstacle) {
        if (pest_y--) {
            getRandomInt();
        }

    }
}

let map = [
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
    [20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 20, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 14, 14, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 20, 20, 20, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 20, 23, 14, 14, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 23, 20, 20],
    [20, 20, 20, 20, 20, 23, 23, 20, 23, 23, 20, 20, 20, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 20, 20, 20, 20, 23, 23, 23, 20, 23, 23, 23, 20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 20, 23, 23, 20, 23, 23, 23, 20, 20, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 20, 20, 20, 20, 20, 20, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 20, 20, 20, 20, 23, 20, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 20, 20, 23, 23, 23, 20, 20, 20, 20, 20],
    [20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 23, 23, 23, 20, 23, 23, 20, 20, 20, 23, 23, 20, 20, 23, 23, 23, 20],
    [20, 23, 23, 20, 20, 20, 20, 20, 20, 20, 23, 20, 23, 20, 20, 20, 20, 20, 20, 23, 20, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 20, 23, 20, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 20, 23, 20, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 23, 23, 23, 23, 23, 23, 20, 23, 20, 20, 20, 20, 23, 20, 20, 23, 23, 23, 23, 20],
    [20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 20, 23, 20, 20, 20, 20, 23, 20, 23, 23, 23, 23, 23, 20],
    [20, 23, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 20, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 20, 20, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 20, 23, 23, 23, 20, 20, 20, 20, 20, 20, 20, 20, 20, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 20],
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
];


document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', keyDownMovement);
    document.addEventListener('keyup', keyUpMovement);
    document.addEventListener('keydown', playerShootBullet);
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', pauseGame);
    const restartButton = document.getElementById('restartButton'); restartButton.addEventListener('click', restartGame);
    const restartButtonTwo = document.getElementById('restartButtonTwo');
    restartButtonTwo.addEventListener('click', restart);
    window.addEventListener('keydown', preventDefaultForArrowKeys);
});
