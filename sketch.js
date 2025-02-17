
let cam;
let timeInterval = 60;
let rot =  0;
let canvas, img, offset;
let shaderFog;
let sliderNear;
let fogDensity = 0.002;
let fogColor = [0.8, 0.9, 1, 1];
function preload() {
  img = loadImage('https://webglfundamentals.org/webgl/resources/f-texture.png');
}

function setup() {
  createCanvas(windowWidth,  windowHeight, WEBGL);

  frameRate(60);
  angleMode(DEGREES);
  shaderFog = createShader(shaderFogVert, shaderFogFrag);
  
  sliderNear = createSlider(0, 1.0, 0.25, 0.05);
  sliderNear.position(windowWidth/2 - 100, 130);
  sliderNear.size(200);

  noStroke();
}

function draw() {
  background(fogColor[0]*255,fogColor[1]*255,fogColor[2]*255);

  if (!isMouseOverSlider()) {
    orbitControl(0.5, 0, 0);
  }

  rot += 0.3;
  fogDensity = sliderNear.value();

  shaderFog.setUniform("fillCol", [0.2,0.2,0.5]);
  shaderFog.setUniform("uFogColor", fogColor);
  shaderFog.setUniform("uFogNear", fogDensity);
  
  shader(shaderFog);
  translate(-100,0,700);
  push();
  for (let i = 0; i < 20; i++){
    translate(16, 0, -64);
    push();
    rotateZ(rot);
    rotateX(rot);
    rotateY(rot);
    shaderFog.setUniform("sTexture", img);
    box(32);
    pop();
  }
  pop();

}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  sliderNear.position(windowWidth/2 - 100, 130);
}


function isMouseOverSlider() {
  let x = windowWidth / 2 - 100;
  let y = 130;
  let w = 200;
  let h = 20;

  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h && mouseIsPressed) {
    return true;
  }
  return false;
}


const shaderFogVert = `
precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;

varying vec3 vPos;

void main() {
  // Camera looking objects
  vTexCoord = aTexCoord;
  gl_Position = uProjectionMatrix * 
    uModelViewMatrix *
    vec4(aPosition, 1.0); 

  // Position in camera perspective
  vPos = (uModelViewMatrix * vec4(aPosition, 1.0)).xyz;
}

`;

const shaderFogFrag = `
precision mediump float;
 
// Passed in from the vertex shader.
varying vec2 vTexCoord;
varying vec3 vPos;
// The texture.
uniform sampler2D sTexture;
 
uniform vec4 uFogColor;
uniform float uFogNear;
 
uniform vec3 fillCol;

void main() {
  // dibuja la textura y el color de relleno
  vec3 filler;
  filler= fillCol ;
  
  vec4 col = texture2D(sTexture, vTexCoord).rgba;
  if (col.a < 1.0){
    col = vec4(filler,1.0);
  }

  #define LOG2 1.442695
  // Se añade el fog
  float fogDist = length(vPos)/100.0;
  float fogAmount = 1. - exp2(-uFogNear * uFogNear * fogDist * fogDist * LOG2);
  fogAmount = clamp(fogAmount, 0., 1.);
  gl_FragColor = mix(col, uFogColor, fogAmount);  
}

`;
