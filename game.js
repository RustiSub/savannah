window.addEventListener("load", function () {

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

  // Sun and Moon
  // var sunGroup = background.getElementById('sunGroup');
  // sunGroup = SVG.adopt(sunGroup);
  //
  // var sunPath = background.getElementById('sunPath');
  // sunPath = SVG.adopt(sunPath);
  //
  // sunGroup.toParent(sceneParent);
  //
  // sunGroup.animate().rotate(360, sunPath.cx(), sunPath.cy());

  //Camera

  var cameraGraphic = background.getElementById('cameraGroup');
  cameraGraphic = SVG.adopt(cameraGraphic);

  //cameraGraphic.transform({ scale: 2 });
  //camera.x(scene1Group.node.getBBox().width + camera.node.getBBox().x - (camera.node.getBBox().width / 2));
  //camera.y(scene1Group.node.getBBox().height + camera.node.getBBox().y - (camera.node.getBBox().height / 2));

  cameraGraphic.front();

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
      }

      if (camera.cx() > centerParent1 && centerParent1 > centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() + scene1Width + scene2Width - fixSeam);
      }

      if (camera.cx() < centerParent2 && centerParent2 < centerParent1) {
        nestedScene1Parent.x(nestedScene1Parent.x() - scene1Width - scene2Width + fixSeam);
      }

      if (camera.cx() < centerParent1 && centerParent1 < centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() - scene1Width - scene2Width + fixSeam);
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

  cameraZoom(sceneParent, zoomLevel);

  const useEventType = (typeof window.PointerEvent === 'function') ? 'pointer' : 'mouse';

  var moveDistance = {
    x: 0,
    y: 0
  };

  var pointerHandler = (event) => {
    if (book.visible()) {
      return event;
    }

    //event.preventDefault();

    var deadZone = 10;

    if (Math.abs(camera.cx() - event.x) > deadZone) {
      moveDistance.x = camera.cx() - event.x;
    } else {
      moveDistance.x = 0;
    }

    if (Math.abs(camera.cy() - event.y) > deadZone) {
      moveDistance.y = camera.cy() - event.y;
    } else {
      moveDistance.y = 0;
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
            console.log('test');
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

            //zoomLevel = zoomLevel <= 0 ? 1 : zoomLevel;

            cameraZoom(sceneParent, zoomLevel);
            break;
          case 83:
            zoomLevel -= 1;

            //zoomLevel = zoomLevel <= 0 ? 1 : zoomLevel;

            cameraZoom(sceneParent, zoomLevel);
            break;
        }
      }
  );

  background.addEventListener('click', function(event) {

  });

  function update(progress) {
    // Update the state of the world for the elapsed time since last render
    if (moveDistance.x) {
      nestedScene1Parent.x(nestedScene1Parent.x() + moveDistance.x);
      nestedScene2Parent.x(nestedScene2Parent.x() + moveDistance.x);
    }

    if (moveDistance.y) {
      nestedScene1Parent.y(nestedScene1Parent.y() + moveDistance.y);
      nestedScene2Parent.y(nestedScene2Parent.y() + moveDistance.y);
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
