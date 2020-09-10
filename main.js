const score = document.querySelector('.score'),
    easily = document.querySelector('.easily'),
    normal = document.querySelector('.normal'),
    hard = document.querySelector('.hard'),
    audio = document.querySelector('.audio'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};
const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};
const level = {
    easily: true,
    normal: false,
    hard: false
}
let bestScore = 0;
car.classList.add('car')
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
easily.addEventListener('click', levelEasily);
normal.addEventListener('click', levelNormal);
hard.addEventListener('click', levelHard);
easily.classList.add('active')



function getQuantityElements(heidghtElement) {
    return document.documentElement.clientHeight / heidghtElement + 1;
}

function startGame() {
    start.classList.add('hiden');
    gameArea.innerHTML = '';
    levelChange();
    console.log(setting.speed);
    audio.autoplay = 'true';
    audio.play();
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        if (i == 0) {
            enemy.style.background = 'transparent url(./image/enemy-1.png)  center / cover no-repeat';
        } else if (i == 1) {
            enemy.style.background = 'transparent url(./image/enemy-2.png)  center / cover no-repeat';
        } else {
            enemy.style.background = 'transparent url(./image/enemy-3.png)  center / cover no-repeat';
        }


        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = (gameArea.offsetWidth / 2 - car.offsetWidth / 2) + 'px';
    car.style.top = 'auto'
    car.style.bottom = '10px'
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {

    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = "Score<br>" + setting.score;
        moveRoad();
        moveEnemy();


        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }

}

function startRun(event) {
    event.preventDefault();

    keys[event.key] = true;
}

function stopRun() {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -150;
        }
    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {

        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            setting.start = false;
            console.warn("ДТП");
            audio.pause();

            if (setting.score > bestScore) {
                localStorage.setItem('myKey', setting.score);
                bestScore = setting.score;
                alert("Ви побили попередній рекорд.Новий рекорд " + bestScore);
            }
            reload()
            start.classList.remove('hiden');
            start.style.top = score.offsetHeight + 'px';
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -150 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            let x = Math.floor(Math.random() * 6);

            if (x == 0 || x == 1) {
                item.style.background = 'transparent url(./image/enemy-1.png)  center / cover no-repeat';
            } else if (x == 2 || x == 3) {
                item.style.background = 'transparent url(./image/enemy-2.png)  center / cover no-repeat';
            } else {
                item.style.background = 'transparent url(./image/enemy-3.png)  center / cover no-repeat';
            }
        }
    });

}

function levelChange() {
    if (level.easily) {
        setting.speed = 3;
    } else if (level.normal) {
        setting.speed = 5;
    } else if (level.hard) {
        setting.speed = 7;
    }
}

function levelEasily() {
    level.easily = true;
    level.normal = false;
    level.hard = false;
    easily.classList.add('active')
    normal.classList.remove('active')
    hard.classList.remove('active')
}

function levelNormal() {
    level.easily = false;
    level.normal = true;
    level.hard = false;
    normal.classList.add('active')
    easily.classList.remove('active')
    hard.classList.remove('active')
}

function levelHard() {
    level.easily = false;
    level.normal = false;
    level.hard = true;
    easily.classList.remove('active')
    normal.classList.remove('active')
    hard.classList.add('active')
}

function reload() {
    keys.ArrowDown = false;
    keys.ArrowUp = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}