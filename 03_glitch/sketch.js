let s;
let b0, b1, b2;
let t = 0;
let w, h;
let c = [];
let c0, c1, c2, c3;
let r1, r2,r3,r4,r5,r6,r7,r8 = 0.0;
const WX = Math.round(window.innerHeight/1)
const HX = window.innerHeight
const DIM = Math.min(WX, HX)

function setup() {
  createCanvas(DIM, DIM, WEBGL);
  b0 = createGraphics(DIM, DIM, WEBGL);
  b1 = createGraphics(DIM, DIM, WEBGL);
  b2 = createGraphics(DIM, DIM, WEBGL);
  w = width; h = height;
  s  = b0.createShader(vs, fs);
  setAttributes('alpha', true)
  b0.setAttributes('alpha', true)
  b1.setAttributes('alpha', true)
  b2.setAttributes('alpha', true)
  b2.colorMode(HSB)
  noStroke();
  b2.noStroke()
  b0.clear()
  b0.push()
  b0.noStroke()
  b0.beginShape()
  for (i = 0; i < 16; i++) {
    b0.fill(random(50, 155), 10);
    b0.vertex(random(-w, w), random(-h, h));
  }
  b0.endShape(CLOSE)
  b0.pop()

  r1 = round(random(14, 32))
  r2 = round(random(17, 27))
  r3 = random(0.01, 0.0005) 
  r4 = round(random(0.91, 0.03));
  r5 = random(0.005, 0.1)

  c0 = floor(random(359));

  }

function draw() { 
  b0.shader(s);
  b0.reset()
  let nx = noise(1111, 3333, t)*(w*2)
  let ny = noise(4444, 7777, t)*(h*2)
  let size = map(noise(6666, 9999, t), 0, 1, 40, 250);
  b2.push()
  b2.translate(-w/2, -h/2)
  b2.fill(t*50.0 %360, 100, 100, 0.5)
  b2.circle(nx-w/2, ny-h/2, size)
  b2.pop()
  t += 0.011;

  if (frameCount < 1 || frameCount% 100 === 0) {
    r1 = round(random(4, 22))
    r2 = round(random(7, 17))
    r3 = random(0.001, 0.005) 
    r4 = round(random(0.51, 0.03));
    r5 = random(0.05, 0.001)
    r6 = random(0.005, -0.005)

    c0 = floor(random(359));
    c1 = (c0 + 150) % 360;
    c2 = (c0 + 210) % 360;
    c3 = (c0 + 30) % 360;
    c = [c0, c1, c2, c3];
    b2.clear()
    b2.push()
    b2.translate(-w/2, -h/2)
    b2.beginShape()
    for(i = 0; i < 12; i++){
      b2.fill(c[i%3], 100, 100, random(0, 100));
      b2.vertex(random(0, w), random(0, h));
    }
    b2.endShape(CLOSE);
    b2.pop()
    b0.push()
    b0.image(b2, -w/2, -h/2, w, h)
    b0.pop()
  }
  s.setUniform('tex0', b0);
  s.setUniform('tex1', b1);
  s.setUniform('resot', [w, h]);
  s.setUniform('boxy', [r1, r2]);
  s.setUniform('separation', r3);
  s.setUniform('scanlines', r4);
  s.setUniform('separate', r5);
  s.setUniform('size', r6);
  b0.image(b2, -w/2, -h/2, w, h)
  b0.rect(-w/2, -h/2, w, h);
  push()
  translate(-w/2, -h/2)
  image(b0,0 ,0 ,w, h);
  pop()
  b1.image(b0, -w/2, -h/2, w, h);
}

vs = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
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

  vec4 poo = texture2D(tex0, uv);
  
  float lod6 = 1.0-poo.r*.001;
  uv.x += (sin(floor(uv.y*0.33*lod6)/lod6))*space; 

  vec2 lod2 = vec2(boxy.r, 8.);
  vec2 zuv1 = uv;
  zuv1 += (rand(floor(zuv1*lod2)/lod2)*2.0-1.)*separation+(poo.r*0.1);

  vec2 lod3 = vec2(16.0, boxy.g);
  vec2 zuv2 = uv;
  zuv2 += (rand(floor(zuv2*lod3)/lod3)*2.0-1.)*0.004+(poo.r*0.1);//(poo.r*0.1)
  uv = vec2(zuv1.s, zuv2.t);

  vec4 tex = texture2DNearest(tex0, uv, resot);
  vec4 texb = texture2DNearest(tex0, fbuv, resot);

  float gray = luma(texb.rgb);
  float stepper = step(0.5, gray);
  //ccol.rgb = mix(ccol.rgb, 1.0 - ccol.gbr, step(1.0, -ccol.r) ); 
  vec4 ccol = vec4(mix(tex, texb, gray));

//ccol.rgb = mix(ccol.rgb, 1.0 - ccol.gbr, step(1.0, -ccol.r) ); 
 gl_FragColor = ccol;
}`