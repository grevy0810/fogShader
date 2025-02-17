
let cam;
let timeInterval = 60;
let rot =  0;
let canvas, img, offset;
let shaderFog;
let sliderNear;
let sliderFar;
let fogDensity, fogFarValue;
let fogColor = [0.8, 0.9, 1, 1];
let font;
let farInit =0.5;
let nearInit =0.25;
function preload() {
  img = loadImage('https://webglfundamentals.org/webgl/resources/f-texture.png');
}

function setup() {
  createCanvas(windowWidth,  windowHeight, WEBGL);

  frameRate(60);
  angleMode(DEGREES);
  shaderFog = createShader(shaderFogVert, shaderFogFrag);

  sliderNear = createSlider(0, 1.0, nearInit , 0.05);
  sliderNear.position(windowWidth/2 - 100, 130);
  sliderNear.size(200);

  let pNear = createP('Near:');
  pNear.position(sliderNear.x- 40, sliderNear.y -17);
  let pNearValue = createP(`${nearInit}`);
  pNearValue.position(sliderNear.x + 220, sliderNear.y -17);
  sliderNear.input(() => updateFogValue(pNearValue, sliderNear));


  sliderFar = createSlider(0, 1.0, farInit, 0.05); // Nuevo slider para el fogFar
  sliderFar.position(windowWidth / 2 - 100, 160);
  sliderFar.size(200);

  let pFar = createP('Far:');
  pFar.position(sliderFar.x- 40, sliderFar.y -17);
  let pFarValue = createP(`${farInit}`);
  pFarValue.position(sliderFar.x + 220, sliderFar.y -17);
  sliderFar.input(() => updateFogValue(pFarValue, sliderFar));
  noStroke();
}

function draw() {
  background(fogColor[0]*255,fogColor[1]*255,fogColor[2]*255);

  if (!isMouseOverSlider()) {
    orbitControl(0.5, 0, 0);
  }

  rot += 0.3;
  fogDensity = sliderNear.value();
  fogFarValue = sliderFar.value();

  shaderFog.setUniform("uFogColor", fogColor);
  shaderFog.setUniform("uFogFar", fogFarValue);
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
function updateFogValue(label, slider) {
  label.html(`${slider.value()}`);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sliderNear.position(windowWidth / 2 - 100, 130);
  sliderFar.position(windowWidth / 2 - 100, 160);
}


function isMouseOverSlider() {
  let x = windowWidth / 2 - 100;
  let w = 200;
  let h = 20;

  let yNear = 130;
  let yFar = 160; 

  if (
    (mouseX > x && mouseX < x + w && mouseY > yNear && mouseY < yNear + h) ||
    (mouseX > x && mouseX < x + w && mouseY > yFar && mouseY < yFar + h)
  ) {
    return mouseIsPressed;
  }
  return false
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
uniform float uFogFar;

void main() {
  
   vec4 col = texture2D(sTexture, vTexCoord).rgba;

  float fogAmount = smoothstep(uFogNear, uFogFar, gl_FragCoord.z);
  // Mezcla entre el color original y el color de la niebla.
  gl_FragColor = mix(col, uFogColor, fogAmount);
}

`;
