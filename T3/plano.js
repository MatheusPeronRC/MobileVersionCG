import * as THREE from 'three';

export class Plano {
  constructor(scene, i) {
    this.scene = scene;
    this.index = i;
    this.plano;
    this.posicaoZ;
    this.cubos = [];
    this.torreta;
    this.torretas = [];
    this.BBoxPlanos = [];
    this.BBoxPlanosHelpes = [];
    this.BBoxPlano;
    this.BBoxHelper;
    this.BBoxLateral;
    this.BBoxHelperLateral;
    this.cont = 0;
    this.init();
    this.numArvore;
    this.pos;
    this.obj;
  }
  init() {
    let planoGeometry = new THREE.BoxGeometry(70, 70, 70, 1, 0, 1); /// Caso de problema: (70,70,70,1,1,1);
    let planoMaTerial = new THREE.MeshPhongMaterial({ color: '' });
    let arestas1 = new THREE.EdgesGeometry(planoGeometry);
    this.plano = new THREE.Mesh(planoGeometry, planoMaTerial);
    this.plano.material.transparent = true;
    this.plano.material.depthWrite = false; // evita que o grid do cubo sobreponha indevidamente os pixels do cubo durante a renderização.
    this.plano.receiveShadow = true;
    this.plano.position.set(0, -35, -(this.index * 70));
    this.posicaoZ = -(this.index * 70);

    var textureLoader1 = new THREE.TextureLoader();
    var textura1 = textureLoader1.load('./Texture/txt5.jpg');
    this.plano.material.map = textura1;

    var textureLoader3 = new THREE.TextureLoader();
    var textura3 = textureLoader3.load('./Texture/txtponte.jpg');
    this.plano.material.map = textura3;

    let lineMaterial1 = new THREE.LineBasicMaterial({ color: 0xffffff });
    lineMaterial1.transparent = true;
    let grid1 = new THREE.LineSegments(arestas1, lineMaterial1);
    grid1.material.depthWrite = false;   // evita que o grid do cubo sobreponha indevidamente os pixels do cubo durante a renderização.
    //this.plano.add(grid1);
    let aux = 0;
    let aux2 = 0;
    for (let i = 0; i < 8; i++) {
      let cuboMat = new THREE.MeshPhongMaterial({ color: '' });
      let cuboGeo = new THREE.BoxGeometry(17.5, 17.5, 17.5, 1, 1, 1); // (17.5,17.5,17.5,0,1,1)
      let arestas = new THREE.EdgesGeometry(cuboGeo);
      let cubo1 = new THREE.Mesh(cuboGeo, cuboMat);
      cubo1.castShadow = true;
      cubo1.receiveShadow = true;
      cubo1.material.transparent = true;
      cubo1.material.depthWrite = false; // evita que o grid do cubo sobreponha indevidamente os pixels do cubo durante a renderização.
      cubo1.geometry.renderOrder = 1;
      let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      lineMaterial.transparent = true;
      lineMaterial.depthWrite = false; // evita que o grid do cubo sobreponha indevidamente os pixels do cubo durante a renderização.
      let grid = new THREE.LineSegments(arestas, lineMaterial);

      cubo1.material.map = textura1;
      //cubo1.add(grid);
      //cubo1.material.map = textura2;

      if (i < 4) {
        cubo1.position.set(-(70 / 2) - 8.75, 43.75, ((70 / 2) - 8.75) + aux);
        aux = aux - 17.5;
        const bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        bbox.setFromObject(cubo1);
        //const boxHelper = new THREE.BoxHelper(cubo1, 0xffff00);
        // this.plano.add(boxHelper);
        this.plano.add(cubo1);
        this.cubos.push(cubo1);
      }
      else {
        cubo1.position.set((70 / 2) + 8.75, 43.75, ((70 / 2) - 8.75) + aux2);
        aux2 = aux2 - 17.5;
        const bbox = new THREE.Box3().setFromObject(cubo1);
        // const boxHelper = new THREE.BoxHelper(cubo1, 0xffff00);
        // this.plano.add(boxHelper);
        this.plano.add(cubo1);
        this.cubos.push(cubo1);




        const quintoCubo = this.cubos[4]; //cubo 3 com "turretas cenograficas"

        var body = createCylinder(2.0, 2.7, 2.0, 20, 20, false, 1);
        //cubo1.add(body);
        body.position.set(2.0, 9, 20.0)
        var body2 = createCylinder(0.4, 0.4, 5);
        body2.rotateZ(THREE.MathUtils.degToRad(50));
        //cubo1.add(body2);
        this.cubos[4].add(body);
        this.cubos[4].add(body2);
        body2.position.set(1.0, 11, 20.0)



        var textureLoader = new THREE.TextureLoader();
        var textura = textureLoader.load('./Texture/tech2.jpg');

        var textureLoader2 = new THREE.TextureLoader();
        var textura2 = textureLoader2.load('./Texture/cobre.jpg');
        body.material.map = textura;

        body2.material.map = textura;




        const primeirocubo = this.cubos[0]; //cubo 1com tubos de cobre 

        var body3 = createCylinder(0.5, 0.5, 8);
        this.cubos[0].add(body3);
        body3.position.set(10.0, 5, 20.0)
        body3.rotateX(THREE.MathUtils.degToRad(90));
        var body4 = createCylinder(0.5, 0.5, 8);
        this.cubos[0].add(body4);
        body4.position.set(10.0, 3, 20.0)
        body4.rotateX(THREE.MathUtils.degToRad(90));
        var body5 = createCylinder(0.5, 0.5, 8);
        this.cubos[0].add(body5);
        body5.position.set(10.0, 1, 20.0)
        body5.rotateX(THREE.MathUtils.degToRad(90));

        var body6 = createCylinder(0.5, 0.5, 2);
        this.cubos[0].add(body6);
        body6.position.set(9.0, 1, 24.0)
        body6.rotateZ(THREE.MathUtils.degToRad(90));

        var body7 = createCylinder(0.5, 0.5, 2);
        this.cubos[0].add(body7);
        body7.position.set(9.0, 3, 24.0)
        body7.rotateZ(THREE.MathUtils.degToRad(90));

        var body8 = createCylinder(0.5, 0.5, 2);
        this.cubos[0].add(body8);
        body8.position.set(9.0, 5, 24.0)
        body8.rotateZ(THREE.MathUtils.degToRad(90));

        body3.material.map = textura2;
        body4.material.map = textura2;
        body5.material.map = textura2;
        body6.material.map = textura2;
        body7.material.map = textura2;
        body8.material.map = textura2;



        const segundocubo = this.cubos[1]; //cubo com pontes 



        var cubeGeometry = new THREE.BoxGeometry(80, 0.5, 5);
        var material = new THREE.MeshPhongMaterial({});
        var cube = new THREE.Mesh(cubeGeometry, material);
        cube.material.map = textura3;
        cube.receiveShadow = true;
        cube.castShadow = true;
        var repeatFactor = 2;
        var wrapModeS = THREE.RepeatWrapping;
        var wrapModeT = THREE.RepeatWrapping;
        var minFilter = THREE.LinearFilter;
        var magFilter = THREE.LinearFilter;
        updateTexture(true);


        function updateTexture(firstUse = false) {
          if (!firstUse) plane.material.map.dispose();
          cube.material.map.wrapS = wrapModeS;
          cube.material.map.wrapT = wrapModeT;
          cube.material.map.minFilter = minFilter;
          cube.material.map.magFilter = magFilter;
          cube.material.map.repeat.set(repeatFactor, repeatFactor);
          body.material.map.wrapS = wrapModeS;
          body.material.map.wrapT = wrapModeT;
          body.material.map.minFilter = minFilter;
          body.material.map.magFilter = magFilter;
          body.material.map.repeat.set(repeatFactor, repeatFactor);
        }

        this.cubos[1].add(cube);
        cube.position.set(35.0, 8, 20.0)
        var cube1 = new THREE.Mesh(cubeGeometry, material);
        cube1.castShadow = true;
        cube1.receiveShadow = true;
        this.cubos[1].add(cube1);
        cube1.position.set(35.0, 5, 20.0)

        var clponte1 = createCylinder(0.4, 0.4, 4.5);
        clponte1.rotateZ(THREE.MathUtils.degToRad(50));
        clponte1.position.set(15, 6.5, 21)
        this.cubos[1].add(clponte1);

        var clponte2 = createCylinder(0.4, 0.4, 4.5);
        clponte2.rotateZ(THREE.MathUtils.degToRad(50));
        clponte2.position.set(25, 6.5, 21)
        this.cubos[1].add(clponte2);

        var clponte3 = createCylinder(0.4, 0.4, 4.5);
        clponte3.rotateZ(THREE.MathUtils.degToRad(50));
        clponte3.position.set(35, 6.5, 21)
        this.cubos[1].add(clponte3);

        var clponte4 = createCylinder(0.4, 0.4, 4.5);
        clponte4.rotateZ(THREE.MathUtils.degToRad(50));
        clponte4.position.set(45, 6.5, 21)
        this.cubos[1].add(clponte4);

        var clponte5 = createCylinder(0.4, 0.4, 4.5);
        clponte5.rotateZ(THREE.MathUtils.degToRad(50));
        clponte5.position.set(55, 6.5, 21)
        this.cubos[1].add(clponte5);

        var clponte6 = createCylinder(0.4, 0.4, 4.5);
        clponte6.rotateZ(THREE.MathUtils.degToRad(-50));
        clponte6.position.set(65, 6.5, 21)
        this.cubos[1].add(clponte6);

        var clponte7 = createCylinder(0.4, 0.4, 4.5);
        clponte7.rotateZ(THREE.MathUtils.degToRad(-50));
        clponte7.position.set(15, 6.5, 21)
        this.cubos[1].add(clponte7);

        var clponte8 = createCylinder(0.4, 0.4, 4.5);
        clponte8.rotateZ(THREE.MathUtils.degToRad(-50));
        clponte8.position.set(25, 6.5, 21)
        this.cubos[1].add(clponte8);

        var clponte9 = createCylinder(0.4, 0.4, 4.5);
        clponte9.rotateZ(THREE.MathUtils.degToRad(-50));
        clponte9.position.set(35, 6.5, 21)
        this.cubos[1].add(clponte9);

        var clponte10 = createCylinder(0.4, 0.4, 4.5);
        clponte10.rotateZ(THREE.MathUtils.degToRad(-50));
        clponte10.position.set(45, 6.5, 21)
        this.cubos[1].add(clponte10);

        var clponte11 = createCylinder(0.4, 0.4, 4.5);
        clponte11.rotateZ(THREE.MathUtils.degToRad(-50));
        clponte11.position.set(55, 6.5, 21)
        this.cubos[1].add(clponte11);

        var clponte12 = createCylinder(0.4, 0.4, 4.5);
        clponte12.rotateZ(THREE.MathUtils.degToRad(50));
        clponte12.position.set(65, 6.5, 21)
        this.cubos[1].add(clponte12);

        clponte1.material.map = textura;
        clponte2.material.map = textura;
        clponte3.material.map = textura;
        clponte4.material.map = textura;
        clponte5.material.map = textura;
        clponte6.material.map = textura;
        clponte7.material.map = textura;
        clponte8.material.map = textura;



        var cubeGeometry1 = new THREE.BoxGeometry(1, 15.2, 10.2);
        var material2 = new THREE.MeshPhongMaterial({});
        material2.receiveShadow = true;
        var cube3 = new THREE.Mesh(cubeGeometry1, material2);
        cube3.receiveShadow = true;
        cube3.castShadow = true;
        this.cubos[1].add(cube3);
        cube3.position.set(10, 0, 0.0)

        var tubo = createCylinder(1.4, 1, 1.5);
        tubo.rotateZ(THREE.MathUtils.degToRad(90));
        tubo.position.set(12, 3, 2.5)
        this.cubos[1].add(tubo);

        var tubo1 = createCylinder(1.4, 1, 1.5);
        tubo1.rotateZ(THREE.MathUtils.degToRad(90));
        tubo1.position.set(12, -1, 2.5)
        this.cubos[1].add(tubo1);

        var tubo2 = createCylinder(1.4, 1, 1.5);
        tubo2.rotateZ(THREE.MathUtils.degToRad(90));
        tubo2.position.set(12, -5, 2.5)
        this.cubos[1].add(tubo2);

        cube3.material.map = textura1;
        tubo.material.map = textura;
        tubo1.material.map = textura;
        tubo2.material.map = textura;


        var cubeGeometry4 = new THREE.BoxGeometry(0.5, 15, 10);
        var material4 = new THREE.MeshPhongMaterial({ color: '' });
        material2.receiveShadow = true;
        var cube4 = new THREE.Mesh(cubeGeometry4, material4);
        this.cubos[1].add(cube4);
        cube4.receiveShadow = true;
        cube4.castShadow = true;
        cube4.position.set(10, 0, 0.0)


        const quintocubo = this.cubos[4]; //cubo com pontes 

        var tubo3 = createCylinder(0.5, 0.5, 25);
        tubo3.rotateX(THREE.MathUtils.degToRad(90));
        tubo3.position.set(-10, -2, 25)
        this.cubos[4].add(tubo3);

        var cubeGeometry2 = new THREE.BoxGeometry(2, 2, 2);
        var material3 = new THREE.MeshPhongMaterial({ color: 'gray' });
        var cube5 = new THREE.Mesh(cubeGeometry2, material3);
        cube5.castShadow = true;
        cube5.receiveShadow = true;
        cube5.position.set(-10, -2, 38)
        this.cubos[4].add(cube5);
        var cube6 = new THREE.Mesh(cubeGeometry2, material3);
        cube6.position.set(-10, -2, 12)
        this.cubos[4].add(cube6);
        cube6.receiveShadow = true;
        cube6.castShadow = true;
        tubo3.material.map = textura2;
        cube5.material.map = textura2;
        cube6.material.map = textura2;

        var cubeGeometry2 = new THREE.BoxGeometry(3, 2, 2);
        var material4 = new THREE.MeshPhongMaterial({ color: 'white' });
        material4.receiveShadow = true;

        var cube7 = new THREE.Mesh(cubeGeometry2, material4);
        var randomX1 = Math.random() * -65; 
        cube7.position.set(randomX1, -7.5, 10);
        this.cubos[4].add(cube7);
        cube7.material.map = textura1;
        cube7.receiveShadow = true;
        cube7.castShadow = true;
        var cubeGeometry5 = new THREE.BoxGeometry(3, 2, 2);
        var material5 = new THREE.MeshPhongMaterial({ color: '' });
        
        var cube8 = new THREE.Mesh(cubeGeometry5, material5);
        var randomX2 = Math.random() * -65;
        cube8.position.set(randomX2, -7.5, 20);
        this.cubos[4].add(cube8);
        cube8.material.map = textura1;
        cube8.receiveShadow = true;
        cube8.castShadow = true;
        var tubo7 = createCylinder(1, 2, 2);
        // tubo3.rotateX(THREE.MathUtils.degToRad(90));
        var randomX3 = Math.random() * -65; 
        tubo7.position.set(randomX3, -7, 0);
        this.cubos[4].add(tubo7);
        tubo7.material.map = textura;
      }
      function createCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, color) {
        var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
        var material;
        if (!color)
          material = new THREE.MeshPhongMaterial({ color: '' });
        else
          material = new THREE.MeshPhongMaterial({ color: '' });
        var object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;
        return object;

      }

    }
  }

}