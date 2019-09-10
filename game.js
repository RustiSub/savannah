window.addEventListener("load", function() {

  var background = document.getElementById('looptest').contentDocument;

  var scene1 = background.getElementById('scene1');
  scene1 = SVG.adopt(scene1);

  var scene2 = background.getElementById('scene2');
  scene2 = SVG.adopt(scene2);

  var camera = background.getElementById('camera');
  camera = SVG.adopt(camera);

  const mutationConfig = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: true
  };

  var scene2Observer = new MutationObserver(function (mutationsList) {
    mutationsList.forEach(mutation => {
      if (camera.cx() > scene2.cx() && scene2.x() > scene1.x()) {
        scene1.x(scene2.x() + scene2.width());
      }

      if (camera.cx() > scene1.cx() && scene1.x() > scene2.x()) {
        scene2.x(scene1.x() + scene1.width());
      }

      if (camera.cx() < scene2.cx() && scene2.x() < scene1.x()) {
        scene1.x(scene2.x() - scene1.width());
      }

      if (camera.cx() < scene1.cx() && scene1.x() < scene2.x()) {
        scene2.x(scene1.x() - scene2.width());
      }
    });
  });
  scene2Observer.observe(scene1.node, mutationConfig);

  camera.cx(scene1.cx());
  camera.cy(scene1.cy());

  document.onkeydown = function(event) {
    switch (event.keyCode) {
      case 37:
        scene1.x(scene1.x() + 10);
        scene2.x(scene2.x() + 10);
        break;
      case 38:
        console.log('Up key pressed');
        break;
      case 39:
        scene1.x(scene1.x() - 10);
        scene2.x(scene2.x() - 10);
        break;
      case 40:
        console.log('Down key pressed');
        break;
    }
  };
});
