window.addEventListener("load", function() {

  var background = document.getElementById('background').contentDocument;
  var svgBackground = background.getElementById('svg8');

  var animal = document.getElementById('animal').contentDocument;

  var svgAnimal = animal.getElementById('rhino');
  svgAnimal = SVG.adopt(svgAnimal);

  svgBackground = SVG.adopt(svgBackground);

  var nestedBackground = svgBackground.nested();

  var svgAnimalLayer = background.getElementById('animalLayer');
  svgAnimalLayer = SVG.adopt(svgAnimalLayer);

  var svgAnimalLayerRect = background.getElementById('rect2481');
  svgAnimalLayerRect = SVG.adopt(svgAnimalLayerRect);

  var nestedAnimalLayer = svgAnimalLayer.nested();

  svgAnimal.toParent(nestedAnimalLayer);

  nestedAnimalLayer.x(svgAnimalLayerRect.x());
  nestedAnimalLayer.y(svgAnimalLayerRect.y());

  // svgBackground.viewbox(0, 0, 1920, 1080);

  var camera = document.getElementById('camera').contentDocument;
  var svgCamera = camera.getElementById('g3300');
  svgCamera = SVG.adopt(svgCamera);
  var dimensions = camera.getElementById('dimensions');

  dimensions = SVG.adopt(dimensions);

  svgCamera.toParent(nestedBackground);

  svgCamera.scale(0.5);


  var rect4648 = background.getElementById('rect4648');
  rect4648 = SVG.adopt(rect4648);

  svgCamera.x(rect4648.width() / 2);


  // dimensions = SVG.adopt(dimensions);

  //console.log(svgCamera.select('#dimensions'));

  // svgCamera.x(rect4648.width() / 2 );

/*

  animal.toParent(svgAnimalLayer);*/

/*


  var instanceSvgAnimal = svgAnimal.clone();

  instanceSvgAnimal.toParent(svgAnimalLayer);


  instanceSvgAnimal.x(200);
  instanceSvgAnimal.y(270);
  instanceSvgAnimal.scale(0.25, 0.25);

  var instanceSvgAnimal1 = instanceSvgAnimal.clone();

  instanceSvgAnimal1.x(instanceSvgAnimal1.x() + 50);
  instanceSvgAnimal1.y(instanceSvgAnimal1.y() + 20);

  var instanceSvgAnimal2 = instanceSvgAnimal.clone();

  instanceSvgAnimal2.x(instanceSvgAnimal1.x() + 50);
  instanceSvgAnimal2.y(instanceSvgAnimal1.y() - 20);

  var instanceSvgAnimal3 = instanceSvgAnimal.clone();
  instanceSvgAnimal3.x(instanceSvgAnimal1.x() + 120);
  instanceSvgAnimal3.scale(0.15, 0.15);*/

/*  instanceSvgAnimal.x(0);
  instanceSvgAnimal.y(0);*/

  //svgBackground.viewbox(0, 0,, 508, 285.8);
  //svgBackground.viewbox(0, 0, 507.99999 * 1.5 , 285.75001 * 1.5);
  //svgBackground.viewbox(0, 0, 507.99999, 285.75001);

/*  var svg = svgObject.getElementById('test123');

  var background = SVG.adopt(svg);

  var viewbox = background.viewbox();*/


  //svgBackground.viewbox(100, 40, 508 / 100, 285.8 / 100);
  /*viewbox.width /= 10;
  viewbox.height /= 10;*/

/*  var x = (100 - 0) / 10;
  var y = (40- 0) / 10;
  var h = ((508/15) - 508) / 10;
  var w = ((285.8 /15) - 285.8) / 10;


  for(i=0; i<=2; i++) {
    setTimeout(function(i) {
      viewbox.x += x;
      viewbox.h += h;
      viewbox.w += w;

      background.viewbox(viewbox);
    },1000 * i,i);*/
    //1000 ms is 1 sec, here I have give 0.5 seconds as a delay.
  /*}*/
});
