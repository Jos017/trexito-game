// Agregar el evento de click al boton de start
const btnStart = document.querySelector('.start');

btnStart.addEventListener('click', () => {
  clearInterval(idInterval);
  startGame();
});

// IdInterval
let idInterval;

// Imagenes
const trexito = new Image();
trexito.src = './trex1.webp';

const cactusImg = new Image();
cactusImg.src = './cactus1.webp';

const huesoImg = new Image();
huesoImg.src = './hueso.png';

// Sprites
const cero = new Image();
cero.src = "./frames/0.gif"
const uno = new Image();
uno.src = "./frames/1.gif"
const dos = new Image();
dos.src = "./frames/2.gif"
const tres = new Image();
tres.src = "./frames/3.gif"
const cuatro = new Image();
cuatro.src = "./frames/4.gif"
const cinco = new Image();
cinco.src = "./frames/5.gif"
const seis = new Image();
seis.src = "./frames/6.gif"
const siete = new Image();
siete.src = "./frames/7.gif"

// arreglo de las imagenes
const sprites = [cero, uno, dos, tres, cuatro, cinco, seis, siete]
let posicion = 0;

// Seleccionar canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Lista de enemigos/otros elementos
const nopalitos = [];
const huesos = [];

// Nuestro Personaje --> class
class Trex {
  constructor(x, y, w, h, color, vida, imagen) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.vida = vida;
    this.imagen = imagen;
    this.saltar = false;
    this.score = 0;
  }
  goForward() {
    if (this.x + this.w < 314) {
      this.x += 5;
    }
  }
  goBackwards() {
    if (this.x > 0) {
      this.x -= 5;
    }
  }
  jump() {
    this.saltar = true;
  }
  crouch() {
    // console.log('Agacharse');
  }
  drawItself() {
    // imagen
    ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(this.imagen, this.x, this.y, this.w, this.h);
  }
  die() {
    // console.log('Morirse');
  }
  fire() {
    // console.log('dispara');
    const huesito = new Hueso(
      this.x + this.w, 
      this.y + this.h / 2 - 20,
      40,
      40,
      huesoImg
    );
    huesos.push(huesito);
    // console.log(huesos);
  }
}

// Nuestro Enemigo --> cactus
class Cactus {
  constructor(x, y, w, h, imagen, nivel) {
    this.x = x;
    this.y = y;
    this.w = w
    this.h = h;
    this.imagen = imagen;
    this.nivel = nivel;
  }
  drawItself() {
    ctx.fillStyle = 'green';
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(this.imagen, this.x, this.y, this.w, this.h);
    if (this.nivel === 'facil') {
      this.x -= 1;
    } else {
      this.x -= 5;
    }
  }
}

// Proyectil/hueso
class Hueso {
  constructor(x, y, w, h, imagen) {
    this.x = x;
    this.y = y;
    this.w = w
    this.h = h;
    this.imagen = imagen;
  }
  drawItself() {
    ctx.fillStyle = 'green';
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.drawImage(this.imagen, this.x, this.y, this.w, this.h);
    this.x += 3;
  }
}

// Dibujar linea
function drawFloor() {
  ctx.beginPath();
  ctx.moveTo(0, 180);
  ctx.lineTo(314, 180);
  ctx.stroke();
  ctx.closePath();
}
drawFloor();

// Mostrar el nombre del juego
function showInfo(distancia, score, vida) {
  // fillText(texto, x, y)
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText('T-Rexito', 115, 55);
  // distancia
  ctx.font = '18px Arial';
  ctx.fillText(`Distance: ${distancia}m`, 20, 25);
  // score
  ctx.fillText(`Score: ${score}`, 220, 25);
  // vida
  ctx.fillText(`Vida: ${vida}`, 220, 50);
}

// Escuchar teclas
function keys(dinosaur) {
  document.addEventListener('keydown', (event) => {
    // console.log('keydown', event.code);
    switch(event.code) {
      case 'Space':
        dinosaur.jump();
        event.preventDefault(); // Para evitar el scroll en la pantalla
        break;
      case 'ArrowRight':
        dinosaur.goForward();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        dinosaur.goBackwards();
        event.preventDefault();
        break;
      case 'ArrowUp':
        dinosaur.jump();
        event.preventDefault();
        break;
      case 'ArrowDown':
        dinosaur.crouch(); 
        event.preventDefault();
        break;
      case 'KeyF':
        dinosaur.fire();
        break
    }
  });
}


// Crear enemigos
function spawnEnemies() {
  const num = Math.floor(Math.random() * 100);
  if (num === 1) {
    const cactus = new Cactus(300, 150, 30, 50, cactusImg, 'facil')
    nopalitos.push(cactus);
  }
}

function startGame() {
  let distancia = 0;
  const dinosaur = new Trex(50, 150, 30, 50, 'green', 100, cero);
  keys(dinosaur);
  // console.log(dinosaur);

  idInterval = setInterval(() => {
    ctx.clearRect(0, 0, 314, 234);
    // Mostrar Datos
    showInfo(distancia, dinosaur.score, dinosaur.vida);
    distancia +=1;

    drawFloor();
    // console.log(sprites[posicion])
    dinosaur.imagen = sprites[posicion];
    posicion++;
    if (posicion === 8) {
      posicion = 0;
    }
    dinosaur.drawItself();

    // Esta saltando?? y gravedad
    if (dinosaur.saltar === true) {
      // altura maxima de salto
      if (dinosaur.y > 50) {
        dinosaur.y -= 5;
        if (dinosaur.x + dinosaur.w < 314) {
          dinosaur.x += 1 ;
        }
      } else {
        dinosaur.saltar = false;
      }
    }
    if (dinosaur.saltar === false && dinosaur.y < 150) {
      dinosaur.y += 5;
      if (dinosaur.x + dinosaur.w < 314) {
        dinosaur.x += 4;
      }
    }

    // Dibujar enemigos/elementos extra
    nopalitos.forEach((cactus, index) => {
      cactus.drawItself();
      if (
        cactus.x <= dinosaur.x + dinosaur.w &&
        cactus.x >= dinosaur.x &&
        cactus.y <= dinosaur.y + dinosaur.h
        ) {
        // eliminar elemento de nopalitos
        // array.splice
        nopalitos.splice(index, 1);
        dinosaur.vida -= 25;
        if (dinosaur.vida < 25) {
          clearInterval(idInterval);
        }
      }
    });

    // Proyectil
    huesos.forEach((hueso, hindex) => {
      hueso.drawItself();
      nopalitos.forEach((cactus, cindex) => {
        // console.log('posicion x cactus', cactus.x)
        if (hueso.x + hueso.w >= cactus.x) {
          // quitar el hueso y el cactus
          huesos.splice(hindex, 1);
          nopalitos.splice(cindex, 1);
          dinosaur.score += 1;
        }
      }); 
    });

    spawnEnemies();
  }, 1000 / 30);
}
// startGame();

// Listo - Pagina de inicio
// Listo - Agregar la imagen del trex
// Listo - crear los cactus
// brincar
// Listo - recibir daño trex
// Listo - contador de avance
// Score
// Perder
// Listo - Trex dispare
// agregar sonido
// gane
// reiniciar juego
