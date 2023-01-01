let s;
let b0, b1;
var t;
let w, h;
let c_arr = [];
let p_arr = [];
let c0, c1, c2, c3;
let r1, r2,r3,r4,r5,r6,r7,r8 = 0.0;
const WX = Math.round(window.innerHeight/1)
const HX = window.innerHeight
const DIM = Math.min(WX, HX)
/*
function preload(){
  s = loadShader('s.vert', 's.frag');
}
*/
function setup() {
  createCanvas(DIM, DIM, WEBGL);
  b0 = createGraphics(DIM, DIM, WEBGL);
  b1 = createGraphics(DIM, DIM, WEBGL);
  w = width; h = height;

  s  = b0.createShader(vs, fs);

  b0.setAttributes('alpha', true)
  noStroke();
 
 for (i = 0; i < 18; i ++) {
    p_arr.push([random(-w, w), random(-h, h), 0]);
  }
  b0.clear()
  b0.push()
  b0.noStroke()
  b0.beginShape()
  for (i = 0; i < p_arr.length; i++) {

    b0.fill(205);
    b0.vertex(p_arr[i][0], p_arr[i][1]);
  }
  b0.endShape(CLOSE)
  b0.pop()


  r1 = round(random(4, 32))
  r2 = round(random(7, 27))
  r3 = random(0.01, 0.00005) 
  r4 = round(random(0.1, 0.03));
  r5 = random(0.005, 0.1)


  }

function draw() { 
  b0.shader(s);
  //b0.reset()

  if (frameCount % 50 === 0) {

    

    //r1 = random(8, 24)
    //r2 = random(7, 24)
    r1 = round(random(14, 32))
    r2 = round(random(17, 27))
    r3 = random(0.01, 0.00005) 
    r4 = round(random(0.1, 0.03));
    r5 = random(0.005, 0.1)
    //r6 = random(0.005, -0.005)

  }

  if (frameCount % 33 === 0){
    r6 = random(0.005, -0.005)
  }
  
  s.setUniform('tex0', b0);
  s.setUniform('tex1', b1);
  s.setUniform('resot', [w, h]);
  s.setUniform('boxy', [r1, r2]);
  s.setUniform('separation', r3);
  s.setUniform('scanlines', r4);
  s.setUniform('separate', r5);
  s.setUniform('size', r6);
  
  b0.rect(-w/2, -h/2, w, h);
  
  translate(-w/2, -h/2)
  image(b0,0 ,0 ,w, h);
  b1.image(b0, -w/2, -h/2, w, h);
  
}


vs = `
// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  // copy the texcoords
  vTexCoord = aTexCoord;

  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);

  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}`





fs = `
precision highp float;
varying vec2 vTexCoord;
uniform float time;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform vec2 resot;
uniform float separation;
uniform float scanlines;
uniform float separate;
uniform float size;
uniform vec2 boxy;
const float space = 0.01;

vec4 texture2DNearest(sampler2D tex, vec2 coord, vec2 textureSize){
  vec2 pixel = coord * textureSize;
  vec2 texelSize = 1.0 / textureSize; 
  vec2 frac = fract(pixel);
  pixel = (floor(pixel) / textureSize);
  return texture2D(tex, pixel + vec2(texelSize/4.0));
}

float rand(vec2 co) {
			  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec2 fbuv = uv;
  
  float lod6 = 1.0;
  uv.x += (sin(floor(uv.y*0.33*lod6)/lod6))*space; 

  vec2 lod2 = vec2(boxy.r, 4.);
  vec2 zuv1 = uv;
  zuv1 += (rand(floor(zuv1*lod2)/lod2)*2.0-1.)*separation;

  vec2 lod3 = vec2(9.0, boxy.g);
  vec2 zuv2 = uv;
  zuv2 += (rand(floor(zuv2*lod3)/lod3)*2.0-1.)*0.002;
  uv = vec2(zuv1.s, zuv2.t);

  vec4 tex = texture2DNearest(tex0, uv, resot);
  vec4 texb = texture2DNearest(tex0, fbuv, resot);

  float gray = luma(texb.rgb);
  //ccol.rgb = mix(ccol.rgb, 1.0 - ccol.gbr, step(1.0, -ccol.r) ); 
  vec4 ccol = vec4(mix(tex, texb, -gray));

if (ccol.r < 0.1){
  ccol.r += 0.1;
}
if (ccol.r > 0.9){
  ccol.r -= 0.1;
}

if (ccol.g < 0.1){
  ccol.g += 0.1;
}
if (ccol.g > 0.9){
  ccol.g -= 0.1;
}

if (ccol.b < 0.1){
  ccol.b += 0.1;
}
if (ccol.b > 0.9){
  ccol.b -= 0.1;
}

 gl_FragColor = ccol;
}`