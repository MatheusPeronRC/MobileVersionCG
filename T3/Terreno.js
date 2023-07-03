import * as THREE from 'three';
import { Plano } from "./plano.js";

export class Terreno {
    constructor(scene,velocidade, posZ) {
      this.scene = scene;
      this.velocidade = velocidade; // a velocidade de movimento do terreno.
      this.planos = []; // uma lista de planos que compõem o terreno.
      this.numAleatorio;
      this.posZ = posZ; // posição global do avião
      this.BBox_planos = [];
      this.init(); // inicializa o terreno
      this.torretas = [];
      this.torretasBBox = [];
      this.funcaoP = null;
      this.argsFuncaoP = [];
    }
  
    init() {
      // criando os planos
      for(let i = 0; i < 8; i++){
        let plano = new Plano(this.scene, i);
        plano.BBoxPlano = new THREE.Box3().setFromBufferAttribute(plano.plano.geometry.attributes.position);
        this.BBox_planos.push(plano.BBoxPlano);
        this.scene.add(plano.plano);
        this.planos.push(plano); // adicionando o OBJETO Plano
      }
    }
//     atualizaOpacidade(i){
//       for(let j = 0; j < this.planos[i].arvores.length; j++){
//           let posicaoGlobal = new THREE.Vector3();
//           posicaoGlobal = this.planos[i].arvores[j].posGlobal(); // pego a posição global do objeto no eixo z
//           let distanciaArvore = this.posZ - (posicaoGlobal + 170); // calcula distancia do avião para o objeto
//           const opacidade = 1 - (distanciaArvore) / ((4) *70 - this.posZ); // calcula a opacidade baseado na distância
//           this.planos[i].arvores[j].setOpacidade(opacidade);
//         }
// }
    atualizaOpacidadePlano(i){
      let distancia = this.posZ - (this.planos[i].plano.position.z + 150);
      const opacidade = 1 - (distancia)/((4 *70) - this.posZ);
      this.planos[i].plano.material.opacity = opacidade;
      this.planos[i].plano.traverse((child) => {
        if (child instanceof THREE.LineSegments) {
            child.material.opacity = opacidade;
        }});
      for(let k = 0; k < 8; k++)
      {
        this.planos[i].cubos[k].material.opacity = opacidade;
        this.planos[i].cubos[k].traverse((child) => {
          if (child instanceof THREE.LineSegments) {
            child.material.opacity = opacidade;
          }});
      }
    }
    setFuncaoP(funcaoP, i){
      this.funcaoP = funcaoP;
      this.argsFuncaoP = i;
    }
    update() { 
      // atualizando a posição dos planos para simular o movimento. Ideia de uma fila.
     for (let i = 0; i < 8; i++) { // itera sobre todos os planos adicionados na lista
          this.planos[i].plano.position.z += this.velocidade; // pega cada plano
           //this.atualizaOpacidade(i);
           this.atualizaOpacidadePlano(i);
          if (this.planos[i].plano.position.z > 140 ) { // se a posição do plano for menor que o negativo do dobro do seu comprimento
            this.planos[i].plano.position.z  -= 70* 8;
            this.argsFuncaoP = i;
            this.funcaoP(this.argsFuncaoP);
           // this.atualizaOpacidade(i);
            this.atualizaOpacidadePlano(i);
          }
     }

    }
    setVelocidade(vel){
      this.velocidade = vel;
    }

}