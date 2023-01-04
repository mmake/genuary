let shady;
let b0;
let b1;
let c = [];
let c0, c1, c2, c3;
let count = 0;
let r1,r2,r3,r4,r5,r6,r7,r8;
let wx = window.innerWidth
let hx = window.innerHeight
let w, h;
//let vs, fs;

function setup() {
  createCanvas(wx, hx, WEBGL);
  b0 = createGraphics(wx, hx, WEBGL);
  b1 = createGraphics(wx, hx)
  w = width; h = height;
  shady = b0.createShader(vs, fs);
  
  setAttributes('alpha', true)
  b0.setAttributes('alpha', true)
  //b1.setAttributes('alpha', true)
  
  b0.noStroke()
  colorMode(HSB)
  b0.colorMode(HSB)
  //b1.colorMode(HSB)

  c0 = floor(random(359));
  c1 = (c0 + 150) % 360;
  c2 = (c0 + 210) % 360;
  c3 = (c0 + 30) % 360;
  c = [c0, c1, c2, c3];
  //background(col1, 5, 15);
  
  b0.translate(-w/2, -h/2);
  b0.beginShape()
  for (i = 0; i < 16; i++) {
    b0.fill(c[i%3], 100, 100);
    b0.vertex(random(w), random(h), random(-10, 10))
  }
  b0.endShape(CLOSE);  
}

function draw() {
  b0.shader(shady);

  if (frameCount % 60 === 0) {    
    c0 = floor(random(359));
    c1 = (c0 + 150) % 360;
    c2 = (c0 + 210) % 360;
    c3 = (c0 + 30) % 360;
    c = [c0, c1, c2, c3];
    //b0.background(c0, 25, 45);
    b0.push()
    //b0.translate(-w/2, -h/2, 0)

    b0.beginShape()
    for(i = 0; i < 16; i++) {
      b0.fill(c[i%3], 100, 100);
      //b0.fill(random(100), 100, 100)
      b0.vertex(random(w), random(h), random(-10, 10))
    }
    b0.endShape(CLOSE);
    b0.pop()
    //separation, scanlines
    r3 = random(-0.005, 0.005) 
    r4 = round(random(-35.0, 35.0));
    //crash* separate-size
    r5 = random(0.005, 0.01)
    r6 = random(15.0, 100.0)
    }
  
  shady.setUniform('tex0', b0);
  shady.setUniform('tex1', b1);
  shady.setUniform('res', [w, h]);
  shady.setUniform('separation', r3);
  shady.setUniform('scanlines', r4);
  shady.setUniform('separate', r5);
  shady.setUniform('size', r6);
  
  b0.rect(-w/2, -h/2, w, h);
  translate(-width/2, -height/2)
  
  image(b0, 0, 0, w, h);//-w/2, -h/2
  //b1.image(b0, -w/2, -h/2, w, h);
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
uniform vec2 res;
uniform float separation;
uniform float scanlines;
uniform float separate;
uniform float size;

const float space = 0.001;
const float amt = 1.5;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}
/*
float rand(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
*/
float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec2 fbuv = uv;
  
  //vec4 poo = texture2D(tex0, uv);
  fbuv = uv * 2.0 - 1.0;
  fbuv *= 1.01;
  fbuv = fbuv * 0.5 + 0.5;
  /*
  uv = uv * 2.0 - 1.0;
  //uv *= 0.9999;
  uv = uv * 0.5 + 0.5;

  uv -= .5; 
  float dir = sin(abs(uv.y*scanlines));
  uv.x += sign(dir)*separation;
  uv += .5;
  
  float lod = -10.0;
  uv.x += (tan(floor(uv.y*amt*lod)/lod))*space;
  
  vec2 lod2 = res.xy/size;
  uv += (rand(floor(uv*lod2)/lod2)*2.-1.)*separate;

  //fbuv += 1.1;

  uv.x -= sin(uv.y * 3.33)*.01;
  */
  vec4 tex = texture2D(tex0, uv);
  //vec4 copy = tex;
  vec4 texb = texture2D(tex1, fbuv);

  float gray = luma(texb.rgb);
  float stepped = step(0.5, gray);

  vec4 ccol = vec4(mix(tex, texb, stepped));//-0.5
  /*
  copy.rgb += tex.rgb*0.8;
  copy.rgb = mix(copy.rgb, 1.0 -copy.gbr, step(1.0, copy.r) );
  */
  
  //ccol.rgb = mix(ccol.rgb, 1.0 - ccol.gbr, step(1.0, ccol.r) );
  gl_FragColor = tex; 
}`