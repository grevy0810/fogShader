let shaderProgram;
let img;
let angleX = 0;
let angleY = 0;
let fogColor = [0.8, 0.9, 1, 1]; // Color de la niebla
let fogNear = 0.7;
let fogFar = 0.9;
let xOff = 1.1;
let zOff = 1.4;
let numCubes = 40;

// Sliders
let fogNearSlider, fogFarSlider;

function preload() {
  img = loadImage("https://webglfundamentals.org/webgl/resources/f-texture.png");
  shaderProgram = loadShader('fog.vert', 'fog.frag');
}

function setup() {
  createCanvas(600, 400, WEBGL);

  // Crear sliders para controlar la niebla
  createP("Fog Near").style("color", "white");
  fogNearSlider = createSlider(0, 1, fogNear, 0.01);
  
  createP("Fog Far").style("color", "white");
  fogFarSlider = createSlider(0, 1, fogFar, 0.01);
}

function draw() {
  background(fogColor[0] * 255, fogColor[1] * 255, fogColor[2] * 255);

  // Actualizar valores de la niebla desde los sliders
  fogNear = fogNearSlider.value();
  fogFar = fogFarSlider.value();

  // Configurar cámara
  perspective(PI / 3, width / height, 0.1, 100);
  camera(0, 0, 2, 0, 0, 0, 0, 1, 0);

  // Activar el shader
  shader(shaderProgram);

  // Pasar parámetros al shader
  shaderProgram.setUniform("sTexture", img);
  shaderProgram.setUniform("uFogColor", fogColor);
  shaderProgram.setUniform("uFogDensity", fogNear);
  // shaderProgram.setUniform("u_fogFar", fogFar);
  shaderProgram.setUniform("fillCol", [0.2,0.2,0.5]);

  angleX += radians(0.4);
  angleY += radians(0.7);

  for (let i = 0; i <= numCubes; i++) {
    push();
    translate(-2 + i * xOff, 0, -i * zOff);
    rotateX(angleX + i * 0.1);
    rotateY(angleY + i * 0.1);
    texture(img);
    box(1);
    pop();
  }
}
