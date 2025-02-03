// Variables para los cubos
let numCubes = 30;
let cubeSize = 50;
let cubes = [];

// Variables para el shader de niebla
let fogShader;
let fogNear = 50.0;
let fogFar = 200.0;

let angleX = 0;
let angleY = 0;

// Variables globales para la rotación
let rotationAnglesX = [];
let rotationAnglesY = [];
let rotationAnglesZ = [];
let rotationSpeedX, rotationSpeedY, rotationSpeedZ;

// Textura para todas las caras del cubo
let textureCube;

// Variable global para almacenar far de la perspectiva
let perspectiveFar = 2000;

function preload() {
    // Cargar el shader
    fogShader = loadShader('fog.vert', 'fog.frag');

    // Cargar la textura para el cubo
    textureCube = loadImage('f-texture.png');
}

function setup() {
    createCanvas(800, 400, WEBGL);

    // Asignar velocidades de rotación aleatorias para todos los cubos
    rotationSpeedX = 0.008;
    rotationSpeedY = 0.008;
    rotationSpeedZ = 0.008;

    // Inicializar los ángulos de rotación
    for (let i = 0; i < numCubes; i++) {
        rotationAnglesX.push(0);
        rotationAnglesY.push(0);
        rotationAnglesZ.push(0);
    }

    // Configurar la perspectiva de la cámara
    let fov = 0.9; // Ajustar el FOV para hacer zoom
    let aspect = width / height;
    let near = 1;
    perspectiveFar = 2000; // asignar el valor inicial de far a la variable global
    perspective(fov, aspect, near, perspectiveFar);

    // Crear los cubos con un espacio entre ellos
    for (let i = 0; i < numCubes; i++) {
        cubes.push(new Cube(i * ((cubeSize + 2) * 2))); // Espacio entre cubos
    }

    // Crear los sliders de niebla
    let fogNearLabel = createP('fogNear: 50');
    let fogNearSlider = createSlider(0, 100, 50);
    fogNearSlider.input(() => updateFogNear(fogNearLabel, fogNearSlider));

    let fogFarLabel = createP('fogFar: 100');
    let fogFarSlider = createSlider(0, 100, 100);
    fogFarSlider.input(() => updateFogFar(fogFarLabel, fogFarSlider));
}

function draw() {
    background(200);

    // Rotar la cámara
    camera(-40, 0, 150, 0, 0, 120, 0, 1, 0); // Mover la cámara más cerca

    // Actualizar los ángulos de rotación globales para el último cubo
    rotationAnglesX[numCubes - 1] += rotationSpeedX;
    rotationAnglesY[numCubes - 1] += rotationSpeedY;
    rotationAnglesZ[numCubes - 1] += rotationSpeedZ;

    // Propagar la rotación a los otros cubos con un retraso tipo ola desde el primer cubo
    for (let i = numCubes - 2; i >= 0; i--) {
        rotationAnglesX[i] = rotationAnglesX[numCubes - 1] - sin((numCubes - 1 - i) * 0.1) * PI / 4;
        rotationAnglesY[i] = rotationAnglesY[numCubes - 1] - sin((numCubes - 1 - i) * 0.1) * PI / 4;
        rotationAnglesZ[i] = rotationAnglesZ[numCubes - 1] - sin((numCubes - 1 - i) * 0.1) * PI / 4;
    }

    // Rotación de la escena
    rotateX(angleX);
    rotateY(angleY);

    // Usar el shader de niebla para los cubos
    shader(fogShader);
    fogShader.setUniform('fogNear', fogNear);
    fogShader.setUniform('fogFar', fogFar);
    fogShader.setUniform('fogFocus', [0.0, 0.0, 0.0]); // Establecer el punto de foco en el primer cubo
    fogShader.setUniform('tex0', textureCube); // Pasar la textura al shader

    // Imprimir valores de uniformes para verificar
    console.log(`fogNear: ${fogNear}, fogFar: ${fogFar}`);

    // Dibujar los cubos con el shader de niebla
    for (let i = 0; i < numCubes; i++) {
        cubes[i].display(rotationAnglesX[i], rotationAnglesY[i], rotationAnglesZ[i]);
    }
}

class Cube {
    constructor(x) {
        this.position = createVector(x, 0, 0);
        this.size = 58;
    }

    display(rotationAngleX, rotationAngleY, rotationAngleZ) {
        // Guardar la posición actual de la matriz de transformación
        push();

        // Mover al centro del cubo
        translate(this.position.x, this.position.y, this.position.z);

        // Aplicar rotación con ángulos específicos
        rotateX(rotationAngleX);
        rotateY(rotationAngleY);
        rotateZ(rotationAngleZ);

        // Crear cada cara del cubo con la textura
        texture(textureCube);
        box(this.size); // Cubo con la textura

        // Restaurar la matriz de transformación a su estado anterior
        pop();
    }
}

function updateFogNear(label, slider) {
    fogNear = map(slider.value(), 0, 100, 0, 200);
    label.html(`FogNear: ${slider.value()}`);
    console.log(`Updated fogNear: ${fogNear}`);
}

function updateFogFar(label, slider) {
    fogFar = map(slider.value(), 0, 100, 0, 3000);
    perspectiveFar = map(slider.value(), 0, 100, 0, 3000); // actualiza la variable global perspectiveFar
    perspective(0.9, width / height, 1, perspectiveFar); // actualizar la perspectiva con el nuevo valor de far
    label.html(`FogFar: ${slider.value()}`);
    console.log(`Updated fogFar: ${fogFar}`);
}
