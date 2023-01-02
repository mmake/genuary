let w, h;
function preload(){
  s = loadShader('basic.vert', 'rand.frag');
}
function setup() {
  createCanvas(400, 400, WEBGL);
  b0 = createGraphics(400, 400, WEBGL);
  b1 = createGraphics(400, 400, WEBGL);
  b2 = createGraphics(400, 400, WEBGL);
  background(34, 28, 155)
  w = width; h = height;
  b2.setAttributes("alpha", true);
  b0.translate(-w/2, -h/2);
  b1.translate(-w/2, -h/2);
  b0.noStroke(); b1.noStroke();
  b0.background(20, 45, 190);
  b2.shader(s);

  b0.beginShape()
  b1.beginShape()
  for(i = 0; i < 12; i++){
    //b0.fill(random(250), random(250), random(250))
    b0.fill(random(250))
    b0.bezier(random(w), random(h), random(w), random(h),
              random(w), random(h), random(w), random(h));
    //b1.fill(random(50, 255));
    b1.fill(255);
    b1.vertex(random(w), random(h))
  }
  b0.endShape();
  b1.endShape();
  
    b0.beginShape()
  for(i = 0; i < 24; i++){
    b0.fill(random(250), random(250), random(250))
    b0.vertex(random(width), random(height))
  }
  b0.endShape();

  image(b0, -w/2, -h/2, w, h)

  s.setUniform('tex0', b0);
  s.setUniform('tex1', b1);

  b2.rect(-w/2, -h/2, w, h);
  image(b2, -w/2, -h/2, w, h)
}