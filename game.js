window.addEventListener("load", function () {

  var Vector = wrect.Physics.Vector;

  var zoomLevel = 1;

  var background = document.getElementById('looptest').contentDocument;

  var parent = background.getElementById('svg8');
  parent = SVG.adopt(parent);

  var sceneParent = parent.nested();

  parent.viewbox(0, 0, 1920, 1080);

  sceneParent.viewbox(parent.viewbox());

  //Scene 1

  var scene1Group = background.getElementById('scene1Group');
  scene1Group = SVG.adopt(scene1Group);

  var nestedParent1 = sceneParent.nested();

  var nestedScene1 = scene1Group.toParent(nestedParent1);
  var nestedScene1Parent = nestedScene1.parent();

  nestedScene1Parent.x(nestedScene1Parent.x());

  var scene1 = background.getElementById('scene1');
  scene1 = SVG.adopt(scene1);

  //Scene 2

  var scene2Group = background.getElementById('scene2Group');
  scene2Group = SVG.adopt(scene2Group);

  var nestedParent2 = sceneParent.nested();

  var nestedScene2 = scene2Group.toParent(nestedParent2);
  var nestedScene2Parent = nestedScene2.parent();

  nestedScene2Parent.x(nestedScene2Parent.x());

  var scene2 = background.getElementById('scene2');
  scene2 = SVG.adopt(scene2);

  // Sun and Moon 1
  var sunGroup1 = background.getElementById('sunGroup1');
  sunGroup1 = SVG.adopt(sunGroup1);

  sunGroup1.toParent(sceneParent);

  var sunPath1 = background.getElementById('sunPath1');
  sunPath1 = SVG.adopt(sunPath1);
  var sunPath1Length = sunPath1.length();

  var sunDial1 = background.getElementById('sunDial1');
  sunDial1 = SVG.adopt(sunDial1);

  var sun1 = background.getElementById('sun1');
  sun1 = SVG.adopt(sun1);

  var sun1Animation = sun1.animate(8000, '-').during(function(pos, morph, eased){
    var offset = 0;
    var p = sunPath1.pointAt((eased + offset) * sunPath1Length);

    sun1.translate(
        p.x - ((sun1.node.getBBox().x + (sun1.node.getBBox().width / 2)) * sun1.transform().scaleX),
        p.y - ((sun1.node.getBBox().y + (sun1.node.getBBox().height / 2)) * sun1.transform().scaleY)
    );
  }).loop();

  var moon1 = background.getElementById('moon1');
  moon1 = SVG.adopt(moon1);

  /*var moon1Animation = moon1.animate(8000, '-').during(function(pos, morph, eased){
    var offset = 0.25;
    var p = sunPath1.pointAt((eased + offset) * sunPath1Length);

    moon1.translate(
        p.x - ((moon1.node.getBBox().x + (moon1.node.getBBox().width / 2)) * moon1.transform().scaleX),
        p.y - ((moon1.node.getBBox().y + (moon1.node.getBBox().height / 2)) * moon1.transform().scaleY)
    );
  }).loop();*/


  // sunGroup1.front();

  // Sun and Moon 2
  // var sunGroup2 = background.getElementById('sunGroup2');
  // sunGroup2 = SVG.adopt(sunGroup2);
  //
  // sunGroup2.toParent(sceneParent);
  //
  // var sunPath2 = background.getElementById('sunPath2');
  // sunPath2 = SVG.adopt(sunPath2);
  //
  // var sunDial2 = background.getElementById('sunDial2');
  // sunDial2 = SVG.adopt(sunDial2);
  //
  // sunDial2.animate(6000).rotate(360, sunPath2.cx(), sunPath2.cy()).loop();
  // sunGroup2.front();
  //
  // sunGroup2.hide();

  // var sunPath = background.getElementById('sunPath');
  // sunPath = SVG.adopt(sunPath);

  //Camera

  var cameraGraphic = background.getElementById('cameraGroup');
  cameraGraphic = SVG.adopt(cameraGraphic);

  cameraGraphic.front();

  var focusEffect = background.getElementById('focusEffect');
  focusEffect = SVG.adopt(focusEffect);

  focusEffect.x(parent.viewbox().x);
  focusEffect.y(parent.viewbox().y);
  focusEffect.width(parent.viewbox().width);
  focusEffect.height(parent.viewbox().height);

/*  focusEffect.style('opacity', 0);
  focusEffect.animate().style('opacity', 1);
  focusEffect.animate().style('opacity', 0);*/

  focusEffect.front();
  focusEffect.hide();

  var camera = background.getElementById('cameraReticle');
  camera = SVG.adopt(camera);

  // Book

  var book = background.getElementById('bookGroup'); //        "ego/map-geopunt-module": "4.1.*@dev",
  book = SVG.adopt(book);

  book.toParent(parent);
  book.front();
  book.hide();

  // Animals
  var rhino = background.getElementById('rhino'); //        "ego/map-geopunt-module": "4.1.*@dev",
  rhino = SVG.adopt(rhino);

  rhino.toParent(scene1Group);

  var capturedCount = 0;

  function captureAnimal(animal) {
    capturedCount += 1;

    var bookSlot = background.getElementById('bookSlot.' + capturedCount); //        "ego/map-geopunt-module": "4.1.*@dev",
    bookSlot = SVG.adopt(bookSlot);

    animal.toParent(book);
    animal.front();

    animal.transform(bookSlot.transform());

    var ratio = animal.width() / animal.height();

    animal.width(bookSlot.width() - 10);
    animal.height(animal.width() / ratio);
    animal.cx(bookSlot.cx());
    animal.cy(bookSlot.cy());
  }

  rhino.click(function(event) {
    captureAnimal(this.clone());
  });

  const mutationConfig = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: true
  };

  var scene1Observer = new MutationObserver(function (mutationsList) {
    mutationsList.forEach(mutation => {
      var scene1Width = scene1Group.node.getBBox().width;
      var scene2Width = scene2Group.node.getBBox().width;
      var centerParent1 = scene1.x() + nestedScene1Parent.x() + (scene1Width / 2);
      var centerParent2 = scene2.x() + nestedScene2Parent.x() + (scene2Width / 2);

      var fixSeam = 5;

      if (camera.cx() > centerParent2 && centerParent2 > centerParent1) {
        nestedScene1Parent.x(nestedScene1Parent.x() + scene1Width + scene2Width - fixSeam);

        sunGroup1.x(sunGroup1.x() + scene1Width + scene2Width - fixSeam);
      }

      if (camera.cx() > centerParent1 && centerParent1 > centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() + scene1Width + scene2Width - fixSeam);

        // sunGroup2.x(sunGroup2.x() + scene1Width + scene2Width - fixSeam);
      }

      if (camera.cx() < centerParent2 && centerParent2 < centerParent1) {
        nestedScene1Parent.x(nestedScene1Parent.x() - scene1Width - scene2Width + fixSeam);

        sunGroup1.x(sunGroup1.x() - scene1Width - scene2Width + fixSeam);
      }

      if (camera.cx() < centerParent1 && centerParent1 < centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() - scene1Width - scene2Width + fixSeam);

        // sunGroup2.x(sunGroup2.x() - scene1Width - scene2Width + fixSeam);
      }
    });
  });
  scene1Observer.observe(nestedScene1Parent.node, mutationConfig);

  var cameraZoom = function (sceneParent, zoom) {
    var viewbox = sceneParent.viewbox();

    if (zoom === 0) {
      return viewbox;
    }

    var zoomMod = (1 / Math.abs(zoom)) * (1/2);

    viewbox.x = camera.bbox().x;
    viewbox.y = camera.bbox().y;
    viewbox.width = camera.bbox().width;
    viewbox.height = camera.bbox().height;

    if (zoom < 0) {
      zoomMod = 1 / zoomMod;
    }

    var xMod = viewbox.width - (viewbox.width * (zoomMod));
    var yMod = viewbox.height - (viewbox.height * (zoomMod));

    viewbox.x += xMod / 2;
    viewbox.y += yMod / 2;
    viewbox.width = viewbox.width * (zoomMod);
    viewbox.height = viewbox.height * (zoomMod);

    sceneParent.viewbox(viewbox);

    return viewbox;
  };
  zoomLevel = -2;
  cameraZoom(sceneParent, zoomLevel);

  const useEventType = (typeof window.PointerEvent === 'function') ? 'pointer' : 'mouse';

  var moveDistance = {
    x: 0,
    y: 0
  };

  var cameraDeadZone = background.getElementById('cameraDeadZone');
  cameraDeadZone = SVG.adopt(cameraDeadZone);

  var pointerHandler = (event) => {
    if (book.visible()) {
      return event;
    }

    event.preventDefault();

    var deadZone = cameraDeadZone.width() / 2;
    var mouseVector = new Vector(event.x, event.y);
    var cameraCenterVector = new Vector(camera.cx(), camera.cy());
    var distanceVector = mouseVector.distance(cameraCenterVector);

    if (distanceVector > deadZone) {
      moveDistance.x = camera.cx() - event.x;
      moveDistance.y = camera.cy() - event.y;
    } else {
      moveDistance.x = 0;
      moveDistance.y = 0;
    }

    if (focusEnabled) {
      moveDistance.x *= 0.5;
      moveDistance.y *= 0.5;
    }

    moveDistance.x *= (Math.abs(moveDistance.x) / 500);
    moveDistance.y *= (Math.abs(moveDistance.y) / 500);
  };

  background.addEventListener('pointermove', pointerHandler);

  var mouseWheelHandler = (event) => {
    //event.preventDefault();

    zoomLevel -= event.deltaY / 50;

    cameraZoom(sceneParent, zoomLevel);
  };

  background.addEventListener('mousewheel', mouseWheelHandler);

  background.addEventListener('keydown',
      function (event) {
        //event.stopPropagation();
        //event.preventDefault();

        var movement = 50 / (Math.abs(zoomLevel));

        switch (event.keyCode) {
          case 69:
            if (book.visible()) {
              book.hide();
              cameraGraphic.show();
            } else {
              book.show();
              cameraGraphic.hide();
              moveDistance.x = 0;
              moveDistance.y = 0;
            }
            break;
          case 37:
            nestedScene1Parent.x(nestedScene1Parent.x() + movement);
            nestedScene2Parent.x(nestedScene2Parent.x() + movement);
            break;
          case 39:
            nestedScene1Parent.x(nestedScene1Parent.x() - movement);
            nestedScene2Parent.x(nestedScene2Parent.x() - movement);
            break;
          case 38:
            nestedScene1Parent.y(nestedScene1Parent.y() + movement);
            nestedScene2Parent.y(nestedScene2Parent.y() + movement);
            break;
          case 40:
            nestedScene1Parent.y(nestedScene1Parent.y() - movement);
            nestedScene2Parent.y(nestedScene2Parent.y() - movement);
            break;
          case 90:
            zoomLevel += 1;

            cameraZoom(sceneParent, zoomLevel);
            break;
          case 83:
            zoomLevel -= 1;

            cameraZoom(sceneParent, zoomLevel);
            break;
          case 32:
            focusEnabled = !focusEnabled;
            break;
        }
      }
  );

  var focusEnabled = false;

  background.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    return false;
  });

  background.addEventListener('mousedown', function(event) {

    switch (event.button) {
      case 0:
        break;
      case 2:
        focusEnabled = true;
        break;
    }

    return false;
  });

  background.addEventListener('mouseup', function(event) {
    switch (event.button) {
      case 0:
        break;
      case 2:
        focusEnabled = false;
        break;
    }

    return false;
  });

  function update(progress) {
    // Update the state of the world for the elapsed time since last render
    if (moveDistance.x) {
      nestedScene1Parent.x(nestedScene1Parent.x() + moveDistance.x);
      nestedScene2Parent.x(nestedScene2Parent.x() + moveDistance.x);

      sunGroup1.x(sunGroup1.x() + moveDistance.x);
      // sunGroup2.x(sunGroup2.x() + moveDistance.x);
    }

    if (moveDistance.y) {
      nestedScene1Parent.y(nestedScene1Parent.y() + moveDistance.y);
      nestedScene2Parent.y(nestedScene2Parent.y() + moveDistance.y);

      sunGroup1.y(sunGroup1.y() + moveDistance.y);
      // sunGroup2.y(sunGroup2.y() + moveDistance.y);
    }
  }

  function loop(timestamp) {
    var progress = timestamp - lastRender;

    update(progress);

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
  }
  var lastRender = 0;
  window.requestAnimationFrame(loop);
});
