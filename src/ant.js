// Get the canvas and context for drawing
const canvas = document.getElementById('ant');
const ctx = canvas.getContext('2d');

// Some constant values
const color = {
  white: '#ecf0f1',
  green: '#2ecc71',
  red: '#e74c3c',
  blue: '#3498db',
  gray: '#171717'
}

const tile = {
  clear: {
    rotate: 90
  },
  red: {
    color: color.red,
    rotate: -90
  },
  green: {
    color: color.green,
    rotate: 90
  }
};

// Code for controlling the option panel
const timeScaleInput = document.getElementById('timeScale');
timeScaleInput.addEventListener('change', onTimeScaleChange);

// Config data for the ant
const drawSimInfo = true;

const gridDimension = {
  width: 120,
  height: 100
};

const startTile = tile.red;

const startPoint = {
  x: Math.floor(gridDimension.width / 2),
  y: Math.floor(gridDimension.height / 2)
};

let timeScale = parseInt(timeScaleInput.value);

let steps = 0;

// Create a clear map
const map = [];

for (let x = 0; x < gridDimension.width; x++)
{
  let yTiles = [];
  
  for (let y = 0; y < gridDimension.height; y++)
  {
    yTiles.push(tile.clear);
  }

  map.push(yTiles);
}

// Create ant
let ant = {
  x: startPoint.x,
  y: startPoint.y,
  rotation: -180,
  createTile: null
};

// Calculate the unit size
const unit = {
  horizontal: canvas.width / gridDimension.width,
  vertical: canvas.height / gridDimension.height
};

// Create starting point
map[startPoint.x][startPoint.y] = startTile;

// Main loop
let mainLoopInterval = setInterval(mainLoop, timeScale);

function mainLoop()
{
  callUpdate();
  callDraw();
}

// Logic function
function callUpdate()
{
  const currentTile = map[ant.x][ant.y];
  
  // Define what tile to create at destination
  detectTile(currentTile);

  // Rotate ant to current rotation
  rotateAnt(currentTile.rotate);

  // Create tile under ant
  map[ant.x][ant.y] = ant.createTile;

  // Move to destination
  moveAnt();

  steps++;
}

// Draw function
function callDraw()
{
  // Clear canvas every update
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  for (let x = 0; x < gridDimension.width; x++)
  {
    for (let y = 0; y < gridDimension.height; y++)
    {
      if (map[x][y] !== tile.clear)
      {
        drawRect(ctx, x * unit.horizontal, y * unit.vertical, unit.horizontal, unit.vertical, map[x][y].color);
      }
    }
  }

  // Draw ant
  drawAnt(ctx, ant.x, ant.y);

  // Draw grid
  for (let i = 0; i < gridDimension.width; i++)
  {
    drawLine(ctx, unit.horizontal * i, 0, unit.horizontal * i, canvas.height);
  }

  for (let i = 0; i < gridDimension.height; i++)
  {
    drawLine(ctx, 0, unit.vertical * i, canvas.width, unit.vertical * i);
  }

  // Draw info about simulation
  if (drawSimInfo)
  {
    drawInfo(ctx);
  }
}

// Utility functions
function detectTile(currentTile)
{
  switch (currentTile)
  {
    case tile.clear:
      ant.createTile = tile.red;
      break;

    case tile.red:
      ant.createTile = tile.green;
      break;
    
    case tile.green:
      ant.createTile = tile.red;
      break;
  }
}

function moveAnt()
{
  switch (ant.rotation)
  {
    // Move right
    case 0:
      ant.x++;
      break;

    // Move forward
    case 90:
      ant.y--;
      break;

    // Move left
    case 180:
      ant.x--;
      break;

    // Move backward
    case 270:
      ant.y++;
      break;

    // Move red
    case 360:
      ant.x++;
      break;
  }
}

function rotateAnt(delta)
{
  const rotation = ant.rotation + delta;

  if (rotation < 0)
  {
    ant.rotation = 270;
  }
  else if (rotation > 360)
  {
    ant.rotation = 90;
  }
  else
  {
    ant.rotation = rotation;
  }
}

function drawAnt(ctx, x, y)
{
  const averageUnit = (unit.vertical + unit.horizontal) / 2;

  ctx.fillStyle = color.white;
  ctx.strokeStyle = color.white;
  ctx.lineWidth = 1;

  for (let i = 0; i < 3; i++)
  {
    const bodyX = x * unit.horizontal + (unit.horizontal / 2);
    const bodyY = (y * unit.vertical + ((unit.vertical / 2) * i * 0.4)) + unit.vertical / 3;

    // Body
    ctx.beginPath();
    ctx.arc(bodyX, bodyY, averageUnit * 0.15, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    // Legs
    ctx.beginPath();
    ctx.moveTo(bodyX - unit.vertical * 0.25, bodyY);
    ctx.lineTo(bodyX + unit.vertical * 0.25, bodyY);
    ctx.stroke();
    ctx.closePath();
  }
}

function drawLine(ctx, startX, startY, endX, endY)
{
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = color.white;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function drawRect(ctx, x, y, width, height, color)
{
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height, color);
}

function drawInfo(ctx)
{
  // Configure font
  ctx.font = '16px Arial';

  // Draw background
  drawRect(ctx, 0, 0, 150, 36, color.gray);

  // Time scale
  ctx.fillStyle = color.white;
  ctx.fillText('Step/ms: 1/'+timeScale, 10, 26); 
}

// Functions for input handling

function onTimeScaleChange(event)
{
  const value = parseInt(event.target.value);
  
  if (value === 0)
  {
    timeScale = 1;
  }
  else
  {
    timeScale = value;
  }

  clearInterval(mainLoopInterval);

  mainLoopInterval = setInterval(mainLoop, timeScale);
}