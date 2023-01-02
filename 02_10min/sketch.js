let a;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  noStroke()
  translate(-width/2, -height/2)
  
  beginShape()
  fill(random(255))
  vertex(0, 0)
  vertex(width, 0)
  fill(random(255))
  vertex(width, height)
  vertex(0, height)
  endShape()
  
  beginShape()
  for(i = 0; i < 16; i ++){
    fill(random(255), random(255), random(255))
    
    vertex(random(width), random(height))
  }
  endShape()
  
  for(i = 0; i < 150; i++){
    let x = random(width)
    let y = random(height)
    let pix = get(x, y)
    let psize = random(1, 20)
    fill(pix)
    rect(x + random(-5, 5), y + random(-5, 5), psize, psize)
  }
}