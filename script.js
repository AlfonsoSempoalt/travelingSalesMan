var cities = [];
var totalCities = 20;
var populationSize = 700;
var population = [];//population es un conjunto de soluciones, también le dicen cromosomas
var fitness = [];// nos sirve para guiar el GA
var recordDistance = Infinity;
var mejorD;
var statusP;

function setup() {
  createCanvas(700, 700);
  var order = [];
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random(height));
    cities[i] = v;
    order[i] = i;
  }
  for (var i = 0; i < populationSize; i++) {
    population[i] = shuffle(order);
  }
 }

function draw() {
  background(40);
  // métodos del archivo geneticAlgorithmTSP ejecutandose
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  stroke(150);
  strokeWeight(4);
  noFill();
  beginShape();
  for (var i = 0; i < mejorD.length; i++) {
    var n = mejorD[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();
}

function swapCities(array, indexI, indexJ) {
  var temp = array[indexI];
  array[indexI] = array[indexJ];
  array[indexJ] = temp;
}


function calcDistance(points, order) {
  var suma = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var indexCityA = order[i];
    var cityA = points[indexCityA];
    var indexCityB = order[i + 1];
    var cityB = points[indexCityB];
    var distance = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    suma += distance;
  }
  return suma;
}
//de aquí son parte importantes para el GA
function calculateFitness() {
  var actualRecord = Infinity;
  for (var i = 0; i < population.length; i++) {
    var distance = calcDistance(cities, population[i]);
    if (distance < recordDistance) {
      recordDistance = distance;
      console.log("Distancia: "+recordDistance);
      mejorD = population[i];
    }
    //ponemos el 1 para asegurarnos que nunca se divida entre 0
    fitness[i] = 1 / (pow(distance, 8) + 1);
  }
}

function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;

}

function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));
  var neworder = orderA.slice(start, end);
  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}


function mutate(order, mutationRate) {
  for (var i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      var indexA = floor(random(order.length));
      var indexB = (indexA + 1) % totalCities;
      swapCities(order, indexA, indexB);
    }
  }
}

