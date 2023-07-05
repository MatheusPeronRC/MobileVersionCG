import * as THREE from 'three';
import { Terreno } from './Terreno.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import Stats from "../build/jsm/libs/stats.module.js";
import KeyboardState from '../libs/util/KeyboardState.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initCamera,
  onWindowResize,
  onOrientationChange
} from "../libs/util/util.js";
import {Buttons} from "../libs/other/buttons.js";

let buttons = new Buttons();

let scene, renderer, camera, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
camera = initCamera(new THREE.Vector3(0, 25, 75)); // Init camera in this position

var listener = new THREE.AudioListener();
const sound = new THREE.Audio( listener ); 
var audioLoader = new THREE.AudioLoader();
audioLoader.load( './Sound/imperial.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true ); //continar tocando mesmo quando acabar
	sound.setVolume( 1.1 );
  sound.play();

});
window.addEventListener('deviceorientation', handleOrientation);
function handleOrientation(event) {
  const beta = event.beta;
  const gamma = event.gamma; 
  
  // Atualize as coordenadas do joystick com base nos valores de beta e gamma
  // Certifique-se de normalizar os valores para o intervalo desejado (-1 a 1, por exemplo)
}

// luz ambiente
var ambientLight = new THREE.AmbientLight("rgb(60,60,60)");
scene.add(ambientLight);

let position = new THREE.Vector3(30.0, 40, 150); // posição da luz
let pause = false;
var keyboard = new KeyboardState();
let tiros = [];
var tirosBB = [];
var tirosBBHelper = [];
var stats = new Stats();
document.getElementById("webgl-output").appendChild(stats.domElement);
let loader = new GLTFLoader();

// const axisHelper = new THREE.AxesHelper(200);
// scene.add(axisHelper);
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
document.addEventListener('keydown', function(event) {
  event.preventDefault();
});
window.addEventListener( 'orientationchange', onOrientationChange );


// adicionando luz direcional
light = new THREE.DirectionalLight("rgb(255,255,255)", 2.5);
light.position.copy(position);
light.castShadow = true;
// alterando os parâmetros da luz
light.shadow.mapSize.width = 2048; // alterar para 1024 caso esteja pesando
light.shadow.mapSize.height = 2048; // // alterar para 1024 caso esteja pesando
light.shadow.camera.near = -10.1;
light.shadow.camera.far = 500;
light.shadow.camera.left = -55;
light.shadow.camera.right = 100;
light.shadow.camera.bottom = -35;
light.shadow.camera.top = 150;
light.shadow.bias = -0.0010;  // parâmetro importante para o uso do VSM, tira o shadow acne (sombras acinzentadas);
scene.add(light);
// const helper = new THREE.DirectionalLightHelper(light, 15);
// scene.add(helper);
// const shadowHelper = new THREE.CameraHelper(light.shadow.camera);
//   shadowHelper.visible = true;
// scene.add(shadowHelper);

renderer = new THREE.WebGLRenderer(); //= initRenderer();  
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // ativa o mapeamento de sombras
renderer.shadowMap.type = THREE.VSMShadowMap; // ativando a sombra com VSM
//renderer.autoClear = false;
//orbit = new OrbitControls(camera, renderer.domElement);

let auxGeo = new THREE.CylinderGeometry(0.001, 0.001, 0.01, 1);
let auxMat = new THREE.MeshLambertMaterial({ color: 'rgb(180,180,255)', visible: false, });
let aviao = new THREE.Mesh(auxGeo, auxMat);
aviao.position.set(0, 10, 10);
loader.load('./Assets/xwing.glb',
  function (gltf) {
    let obj;
    obj = gltf.scene;
    obj.visible = true;
    obj.traverse(function (child) {
      if (child.isMesh){
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if(child.material){
        child.material.side = THREE.DoubleSide;
        child.material.transparent = true;
      }
    });
    obj.scale.set(1.5,1.5 ,1.5);
    aviao.add(obj);
    scene.add(aviao);
   // aviao.translateZ(-100);
  }, null, null);
  aviao.translateZ(20);

let torretas = [];
let idTorretas = [];
let bboxTorretas = [];
//let bboxTorretasHelpers = [];

function loadObject() {
  return new Promise((resolve, reject) => {
    loader.load('./Assets/torreta.glb', (gltf) => {
      const obj = gltf.scene;
      obj.updateMatrixWorld(true);
      obj.name = 'torreta';
      obj.visible = true;
      obj.translateY(35);
      obj.rotateY(THREE.MathUtils.degToRad(270));
      obj.traverse(function (child) {
        if (child) {
          
        }
        if (child.isMesh) {
          // Criação de cópias independentes da geometria e do material
          const geometry = child.geometry.clone();
          const material = child.material.clone();
          // Aplicação da geometria e do material clonados ao filho
          const clonedChild = new THREE.Mesh(geometry, material);
          geometry.applyMatrix4(child.matrixWorld);
          clonedChild.name = child.name;
          clonedChild.material.transparent = true;
          clonedChild.position.copy(child.position);
          clonedChild.quaternion.copy(child.quaternion);
          // Substituição do filho pelo filho clonado no objeto (torreta)
          obj.remove(child);
          obj.add(clonedChild);
        }
      });
      let bboxTorreta = new THREE.Box3().setFromObject(obj);
      // let bboxTorretaHelper = new THREE.BoxHelper(obj);
      if (obj !== null) {
        for (let j = 0; j < 3; j++) {
          const clonedObject = new THREE.Group(); // Crie um novo grupo vazio para a torreta clonado
          obj.traverse((child) => {
            if (child.isMesh) {
              const clonedGeometry = child.geometry.clone(); // Clone a geometria da mesh
              const clonedMaterial = child.material.clone(); // Clone o material da mesh
              const mesh = new THREE.Mesh(clonedGeometry, clonedMaterial); // Crie um novo Mesh com a geometria e o material clonados
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              clonedObject.add(mesh); // Adicione o novo Mesh ao objeto clonado
              child.visible = false;
            }
          });
          clonedObject.scale.set(3, 3, 3);
          clonedObject.position.copy(obj.position);
          clonedObject.quaternion.copy(obj.quaternion);
          torretas.push(clonedObject); // Clone o objeto antes de adicionar ao array
          idTorretas.push(0);
          bboxTorretas.push(bboxTorreta.clone());
          // bboxTorretasHelpers.push(bboxTorretaHelper.clone());
        }
        resolve(torretas);
      } else {
        reject(new Error('Falha ao carregar o objeto externo'));
      }
    }, null, null);
  });
}

let aviaoBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
aviaoBB.setFromObject(aviao);
//let boxHelper = new THREE.BoxHelper(aviao, 0xffff00);
//scene.add(boxHelper);

const posZ = aviao.position.z;
const terreno = new Terreno(scene, 0.5, posZ);

function adicionaTorretaPlano() {
  for (let i = 0; i < 3; i++) {
    let x;
    let z;
    x = Math.floor(Math.random() * (70 - 9)) - (70 / 2 - 5);
    z = Math.floor(Math.random() * (70) - (70 / 2));
    if(i < 3 && torretas[i] !== null)
    {
      terreno.planos[i].plano.add(torretas[i]);
      torretas[i].position.set(x, 35, 0);
    }
  }
}
function torretaUpdate(i) {
  let x;
  let z;
  x = Math.floor(Math.random() * (70 - 9)) - (70 / 2 - 5);
  z = Math.floor(Math.random() * (70) - (70 / 2));
  if (i < 3 && torretas[i] != null) {
    torretas[i].position.set(x, 35, 0);
    torretas[i].traverse(function (child) {
      if(child){
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = 1.0;
      }
    })
    torretas[i].scale.copy(new THREE.Vector3(3, 3, 3));
    idTorretas[i] = 0;
  }
}

terreno.setFuncaoP(torretaUpdate);
const posicaoGlobal = new THREE.Vector3(0, 10, 50);
aviao.getWorldPosition(posicaoGlobal);

const mouse = new THREE.Vector2(); // armazena as coordenadas normalizadas do mouse
const raycaster = new THREE.Raycaster(); // projeta as coordenadas do mouse à cena usando o plano screenToWorld
var posicao = new THREE.Vector3(); // armazena o ponto de intersecção do raycaster ao screenToWorld
//screenToWorld é o plano invisível na cena que determina a area onde o avião podera navegar
const screenToWorldGeometry = new THREE.PlaneGeometry(70 * 3, 70 * 2);
const screenToWorldMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.0, side: THREE.DoubleSide });
const screenToWorld = new THREE.Mesh(screenToWorldGeometry, screenToWorldMaterial);
var raycasterGroup = new THREE.Group(); // grupo de objetos que podem interagir com o raycaster
raycasterGroup.add(screenToWorld);
// Por padrão, todos os objetos em Three.js são exibidos em todas as camadas. Então foi necessário alterar a camada do plano
screenToWorld.layers.set(1);
scene.add(raycasterGroup);


//document.addEventListener('touchmove', onTouchMove, false); // executa a função onMouseMove quando o mouse se move na tela


// function onTouchMove(event) {
//   // calcula e armazena a posição normalizada de coordenadas do dispositivo para o x e o y do mouse
  
//   var touch = event.touches[0];
//   mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
// }
document.addEventListener('touchend', onTouchEnd, false);
let on = true;
function onTouchEnd(event) {
  switch (event.target.id) {
    case "atirar":
      onTouchStart();
      break;
    case "desliga":
      if(on){
        sound.pause();
        on = false;
      }
      else{
        sound.play();
        on = true;
      }
      break;
    case "full":
      buttons.setFullScreen();
      break;
    case "Pause":
      if (pause == false) {
        pause = true;
      } else {
        pause = false;
      }
      break;
  }
}

let steerX = 0 , steerY = 0;
function addJoysticks() {
    let joystick = nipplejs.create({
      zone: document.getElementById('joystickWrapper1'),
      mode: 'static',
    });

    // Capture os movimentos do joystick
    joystick.on('move', function (evt, data) {
      steerX = data.vector.x;
      steerY = data.vector.y;
      AvMove(steerX, steerY);
    });

    //joystick.on('end', function (evt) {
   // });
}

function onTouchStart(){
  const audio = new Audio('./Sound/shotaviao.mp3');
  audio.play();
  let tiro = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshPhongMaterial({
    color: "yellow"
  }));
  tiro.castShadow = true;
  tiro.receiveShadow = true;

  let pos = new THREE.Vector3();
  aviao.getWorldPosition(pos);
  tiro.position.copy(pos);

  tiro.lookAt(mira.position);
  scene.add(tiro);
  
  tiros.push(tiro);
  let tirobb = new THREE.Box3().setFromObject(tiro);
  tirosBB.push(tirobb);

  // armazena a posição inicial do tiro
  tiro.userData = {};
  tiro.userData.initialPosition = new THREE.Vector3().copy(tiro.position);
}
const geometry = new THREE.BufferGeometry();
const vertices = [
  0, 0, 0, // centro
  0, 10, 0, // cima
  0, -10, 0, // baixo
  -10, 0, 0, // esquerda
  10, 0, 0 // direita
];
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// Adicionar um círculo na parte de cima
const circleGeometry = new THREE.CircleGeometry(1, 4);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const mira = new THREE.Mesh(circleGeometry, circleMaterial);
mira.position.set(0, 10, 0);
mira.renderOrder = 9999; //ser renderizada por ultimo
mira.material.transparent = true;
// Configurar o blending para a mira
//mira.material.blending = THREE.NormalBlending;
// Configurar o depthTest como false para os materiais dos objetos
mira.material.depthTest = false;
// Adicionar a mira na cena
scene.add(mira);

let turretShots = [];
let turretShotsBB = [];
let tirosColididos = [];
let id = 0;



function TurretShot(){ // tiro da torreta
  
  const audio = new Audio('./Sound/hitaviao2.mp3');
  audio.volume = 0.1;
  audio.play();

  let tiro = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 4), new THREE.MeshPhongMaterial({
     color: 'white', 
     shininess: 100 }));
  tiro.castShadow = true;
  tiro.receiveShadow = true;

  tirosColididos.push(id);
  id++; // identificador do tiro

  let random = Math.floor(Math.random() * 3);
  let pos = new THREE.Vector3();
  torretas[random].getWorldPosition(pos);
  tiro.position.copy(pos);
  tiro.lookAt(aviao.position);

  if(idTorretas[random] == 1) // se a torreta foi atingida, ela não atira
    return;

  scene.add(tiro);
  turretShots.push(tiro);
  let tirobb = new THREE.Box3().setFromObject(tiro);
  turretShotsBB.push(tirobb);

  // armazena a posição inicial do tiro
  tiro.userData = {};
  tiro.userData.initialPosition = new THREE.Vector3().copy(tiro.position);
}

function continuarGame() {
  pause = false;
}

function AvMove(steerX, steerY) {
  raycaster.setFromCamera(new THREE.Vector2(steerX, steerY), camera); // inicializa ponto de origem do raycaster
  raycaster.layers.set(1);  //detectar  objetos na camada 1
  var intersection = raycaster.intersectObjects(raycasterGroup.children, true); // armazena os objetos atualmente com interseccão ao raycaster
  if (intersection.length > 0) { // se existe um objeto com itercecção ao raycaster, armazene o ponto de intercecção e faça o avião dar lerp a ele e rotacionar em direção a ele (tudo somente no plano XY)
    const maxSteerX = 40; // Valor máximo de movimento ao longo do eixo x
    const maxSteerY = 20; // Valor máximo de movimento ao longo do eixo y
  
    const adjustedSteerX = steerX * maxSteerX;
    const adjustedSteerY = steerY * maxSteerY;

    const increment2 = 0.2;
    const targetMiraX = mira.position.x + (adjustedSteerX - mira.position.x) * increment2;
    const targetMiraY = mira.position.y + (adjustedSteerY - mira.position.y) * increment2;
    mira.position.x = THREE.MathUtils.lerp(mira.position.x, targetMiraX, increment2);
    mira.position.y = THREE.MathUtils.lerp(mira.position.y, targetMiraY, increment2);

    const increment = 0.08;
    const targetX = aviao.position.x + (mira.position.x - aviao.position.x) * increment;
    const targetY = aviao.position.y + (mira.position.y - aviao.position.y) * increment;

    posicao.x = targetX;
    posicao.y = targetY;
    posicao.z = posicaoGlobal.z;
    aviao.position.lerp(posicao, 0.25);
    if (aviao.position.y < 2) aviao.position.y = 2; // limita o avião em y para não atravesar o chão
    if (aviao.position.y > 20) aviao.position.y = 20;
    if (aviao.position.x < -70 / 2) {
      aviao.position.x = -70 / 2;
    }
    if (aviao.position.x > 70 / 2) {
      aviao.position.x = 70 / 2;
    }
    if (aviao.position.x > 20) {
      let pos = new THREE.Vector3();
      pos.y = camera.position.y;
      pos.z = camera.position.z;
      pos.x = 10;
      camera.position.lerp(pos, 0.05);
    }
    if (aviao.position.x < -20) {
      let pos = new THREE.Vector3();
      pos.y = camera.position.y;
      pos.z = camera.position.z;
      pos.x = -10;
      camera.position.lerp(pos, 0.05);
    }
    else {
      let pos = new THREE.Vector3();
      pos.y = camera.position.y;
      pos.z = camera.position.z;
      pos.x = 0
      camera.position.lerp(pos, 0.05);
    }
    aviao.lookAt((posicao.x), (posicao.y), 0);
    var limiteDeRotZ = 0.6; // limita a rotação em Z do avião
    aviao.rotateZ(Math.atan(-(aviao.position.x - posicao.x)) * limiteDeRotZ); // controla rotação em z baseado no angulo entre a posição em x do joystick com a do avião
  }
}

let velocidade = 2;
loadObject().then(() => {
  adicionaTorretaPlano();
  loadSkybox();
  addJoysticks();
  render();
}).catch((error) => {
  console.error('Erro ao carregar recursos:', error);
});

let collisionSound;

// Function to load the collision sound
function loadCollisionSound() {
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('./Sound/explosiontrt.mp3', function(buffer) {
    collisionSound = buffer;
  });
}

//funcao para adicionar som a explosao da turreta

function playCollisionSound() {
  if (collisionSound) {
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    audio.setBuffer(collisionSound);
    audio.setLoop(false);
    audio.setVolume(0.1);
    audio.play();
  }
}

loadCollisionSound();

function animateTorreta(torreta) {
  const initialScale = torreta.scale.clone(); // Escala inicial da torreta
  const FinalScale = new THREE.Vector3(0, 0, 0); // Escala final da torreta (0 para desaparecer)

  const duracao = 1000; // Duração da animação em milissegundos
  const inicioTime = Date.now(); // Tempo de início da animação
  
  
  playCollisionSound(); //EXEC DO AUDIO DA TURRETA SENDO ATINGIDA
  
  
  function update() {
    const tempoDecorrido = Date.now() - inicioTime; // Tempo decorrido desde o início da animação
    const progress = Math.min(tempoDecorrido / duracao, 1); // Progresso da animação

    const scale = initialScale.clone().lerp(FinalScale, progress); // Interpolação linear da escala
    torreta.scale.copy(scale); // Atualiza a escala da torreta

    if (progress < 1) {
      requestAnimationFrame(update); // Continua a animação se não estiver concluída
    }
  }
  update(); // Inicia a animação
}




function checkCollision(t) {
  if (t != null && torretas != null) {
    let collision;
    let i;
    for (i = 0; i < bboxTorretas.length; i++) {
      collision = bboxTorretas[i].intersectsBox(t);
      if (collision) {
        idTorretas[i] = 1;
        animateTorreta(torretas[i]);
        return true;
      }
     
    }
  }
  return false;
}
let gb = 255;

// Create a listener and audioLoader
const listener1 = new THREE.AudioListener();
const audioLoader1 = new THREE.AudioLoader();

// Create a variable to store the audio object
let collisionSound2;

// Load the collision sound file
audioLoader1.load('./Sound/hitaviao2.mp3', function(buffer) {
  // Create an Audio object and set the buffer
  collisionSound2 = new THREE.Audio(listener1).setBuffer(buffer);
});

function checkCollision2(t, p) {
  if (t != null) {
    let collision;
    let i = 0;
    if (!tirosColididos.includes(p)) {
      collision = aviaoBB.intersectsBox(t);
      if (collision) {
        tirosColididos.push(p);
        gb -= 50;
        aviao.traverse(function(child) {
          if (child.material) {
            if (gb > 0) {
              child.material.color.set('rgb(255,' + gb + ',' + gb + ')');
            }
          }
        });
        if (id >= 3) {
          id = 0;
          tirosColididos.splice(0);
        }
        // Play the collision sound
        collisionSound2.play();
        return true;
      }
      return false;
    }
  }
}

function loadSkybox() {
  return new Promise((resolve, reject) => {
    var textureLoader = new THREE.CubeTextureLoader();
    textureLoader.setPath('./Texture/'); 

    var texture = textureLoader.load([
      '6.png',
      '5.png',
      '4.png',
      '3.png',
      '2.png',
      '1.png'
    ]);
    const loader = new THREE.CubeTextureLoader();
    scene.background = texture;
  });
}

function atualizaOpacidadeTorreta() {
  for (let i = 0; i < 3; i++) {
    let pos = new THREE.Vector3();
    torretas[i].getWorldPosition(pos)
    let distancia = posZ - (pos.z + 150);
    let opacidade = 1 - (distancia) / ((4 * 70) - posZ);
    torretas[i].traverse(function (child) {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = opacidade;
      }
    })
  }
}

let cont = 0;
function render() {
  if (pause == false) {
    document.body.style.cursor = 'none'
    terreno.update();
    stats.update();
    AvMove(steerX, steerY);
    atualizaOpacidadeTorreta();
    cont++;
    if(cont > 200)
    {
      TurretShot();
      cont = 0;
    }
    // cont = 0;
    for (let i = 0; i < 3; i++) {
      if (torretas[i] !== null) {
        torretas[i].traverse(function (child) {
          if (child.isMesh) {
            bboxTorretas[i].copy(child.geometry.boundingBox).applyMatrix4(child.matrixWorld);
          }
        })
      }
    }
    aviaoBB.copy(aviao.geometry.boundingBox).applyMatrix4(aviao.matrixWorld);
    aviaoBB.setFromObject(aviao);
    if (tiros != null) {
      tiros.forEach((b, i) => {
        b.translateZ(2);
        tirosBB[i].copy(b.geometry.boundingBox).applyMatrix4(b.matrixWorld);
        tirosBB[i].setFromObject(b);
        let distancia = b.position.distanceTo(b.userData.initialPosition);
        let collision = checkCollision(tirosBB[i]);
        if (b.position.y < 0 || distancia > 400 || b.position.x < -35 || b.position.x > 35 || b.position.y > 40 || collision) {
          scene.remove(b);
          // scene.remove(tirosBBHelper[index]);
          tiros.splice(i, 1);
          tirosBB.splice(i, 1);
          // tirosBBHelper.splice(index, 1);
          i--;
        }
        
      });
    }
    if (turretShots != null) {
      turretShots.forEach((b, i) => {
        b.translateZ(velocidade);
        turretShotsBB[i].copy(b.geometry.boundingBox).applyMatrix4(b.matrixWorld);
        turretShotsBB[i].setFromObject(b);
        let distancia = b.position.distanceTo(b.userData.initialPosition);
        let collision = checkCollision2(turretShotsBB[i],id);
        if (b.position.y < 0 || distancia > 400 || b.position.x < -35 || b.position.x > 35 || b.position.y > 40 || collision ){
          scene.remove(b);
          turretShots.splice(i, 1);
          turretShotsBB.splice(i, 1);
          i--;
        }
      });
    }
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}