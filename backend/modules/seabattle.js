function createSeaBattle () {
  // every call of createSeaBattle generates randomly placed ships
  const { sea, shipsCoordinates } = createSeaMap();

  return function (x) {
     return function (y) {
        if (sea[y][x] === 0) {
           sea[y][x] = 'shot';
           return -1;
        }

        // find the ship which was shot
        const ship = shipsCoordinates.find(s => s.includes(`${y}-${x}`));

        // get the index of coordinates in ship
        const coordinatesIndex = ship.indexOf(`${y}-${x}`);
        ship[coordinatesIndex] = 'shot';
        sea[y][x] = 'shot';

        // check if all coordinates in a ship are shot and return 1(kill) or 0 (just shot)
        return ship.every(coordinate => coordinate.includes('shot')) ? 1 : 0;
     };
  };
}

// map and ships' positioning generator
function createShips () {
  const ships = getShips();
  const shipsCoordinates = [];

  const sea = [];
  // initialize empty map
  for (let i = 0; i < 10; i++) {
     sea.push(new Array(10).fill(0));
  }

  let ship;
  let randomX;
  let randomY;
  let rotation;

  while (Object.keys(ships).length !== 0) {
     // get ship's name to refer to it in ships' properties
     ship = Object.keys(ships)[0];

     // position of a ship in x
     randomX = Math.round(Math.random() * (sea.length - ships[ship].size - 1));
     // position of a ship in y
     randomY = Math.round(Math.random() * (sea.length - ships[ship].size - 1));

     if (ships[ship].size > 1) {
        rotation = isRotate();
     }
     if (rotation) {
        rotate(sea, true);
     }

     // check if ship is not about to be positioned close to another ship
     if (isItClearAround(ships, ship, sea, randomX, randomY)) {
        // add ship on the map
        sea[randomY].splice(randomX, ships[ship].size, ...new Array(ships[ship].size).fill(1));
        ships[ship].amount--;

        // calculate coordinates of a ship
        // and add coordinates of a ship into global array of coordinates
        shipsCoordinates.push(calculateShipCoordinates(ships, ship, randomX, randomY, rotation));
     }

     // rotate it back to initial state
     if (rotation) {
        rotate(sea);
        rotation = false;
     }

     // if the specific ship is no longer need to be positioned delete it from ships obj and move to another ship
     if (ships[ship].amount === 0) {
        delete ships[ship];
     }
  }

  return shipsCoordinates;
}

// checker for empty space to put a ship
function isItClearAround (ships, ship, sea, randomX, randomY) {
  // cells around ship
  const surroundings = [
     // top row
     ...sea[Math.max(randomY - 1, 0)].slice(Math.max(randomX - 1, 0), Math.min(randomX + ships[ship].size + 1, sea.length)),
     // middle row
     ...sea[randomY].slice(Math.max(randomX - 1, 0), Math.min(randomX + ships[ship].size + 1, sea.length)),
     // bottom row
     ...sea[Math.min(randomY + 1, sea.length - 1)].slice(Math.max(randomX - 1, 0), Math.min(randomX + ships[ship].size + 1, sea.length))
  ];

  return !surroundings.includes(1);
}

// 90 degree rotation clockwise and counterclockwise for positioning ships vertically as well
function rotate (matrix, isClockwise) {
  // reverse the rows
  if (isClockwise) {
     matrix = matrix.reverse();
  } else {
     matrix = matrix.map((row) => row.reverse());
  }

  // swap the symmetric elements
  for (let i = 0; i < matrix.length; i++) {
     for (let j = 0; j < i; j++) {
        [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
     }
  }
};

// a switcher to randomly set ships in vertical or horizontal way
function isRotate () {
  return Math.random() - 0.5 > 0;
}

function getShips () {
  return {
     'four-deck': {
        amount: 1,
        size: 4
     },
     'three-deck': {
        amount: 2,
        size: 3
     },
     'two-deck': {
        amount: 3,
        size: 2
     },
     'one-deck': {
        amount: 4,
        size: 1
     }
  };
}

function calculateShipCoordinates (ships, ship, randomX, randomY, rotation) {
  const coordinates = [];
  for (let i = randomX; i < randomX + ships[ship].size; i++) {
     coordinates.push({
      y: rotation ? 9 - i : randomY,
      x: rotation ? randomY : i,
      value: 1,
      condition: 'alive'
    });
  }

  return coordinates;
}

module.exports = {
  createShips,
};
