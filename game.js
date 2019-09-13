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

      console.log(camera.cx(), centerParent1, centerParent2, scene1Width, scene2Width);

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
    //zoom *= 2;


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

    viewbox.x *= zoomMod;
    viewbox.y *= zoomMod;
    viewbox.width *= zoomMod;
    viewbox.height *= zoomMod;

    //console.log(viewbox);
    console.log(zoom);
    console.log(zoomMod);

    sceneParent.viewbox(viewbox);

    return viewbox;
  };

  cameraZoom(sceneParent, zoomLevel);

  document.onkeydown = function (event) {
    var movement = 50 / (Math.abs(zoomLevel));

    switch (event.keyCode) {
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
  };
});
