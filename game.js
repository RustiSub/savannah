window.addEventListener("load", function() {

  var background = document.getElementById('looptest').contentDocument;

  var parent = background.getElementById('svg8');
  parent = SVG.adopt(parent);

  //Scene 1

  var scene1Group = background.getElementById('scene1Group');
  scene1Group = SVG.adopt(scene1Group);

  var nestedParent1 = parent.nested();

  var nestedScene1 = scene1Group.toParent(nestedParent1);
  var nestedScene1Parent = nestedScene1.parent();

  nestedScene1Parent.x(nestedScene1Parent.x());

  var scene1 = background.getElementById('scene1');
  scene1 = SVG.adopt(scene1);

  //Scene 2

  var scene2Group = background.getElementById('scene2Group');
  scene2Group = SVG.adopt(scene2Group);

  var nestedParent2 = parent.nested();

  var nestedScene2 = scene2Group.toParent(nestedParent2);
  var nestedScene2Parent = nestedScene2.parent();

  nestedScene2Parent.x(nestedScene2Parent.x());

  var scene2 = background.getElementById('scene2');
  scene2 = SVG.adopt(scene2);

  //Camera

  var camera = background.getElementById('camera');
  camera = SVG.adopt(camera);

  camera.front();

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

      if (camera.cx() > centerParent2 && centerParent2 > centerParent1) {
        nestedScene1Parent.x(nestedScene1Parent.x() + scene1Width + scene2Width);
      }

      if (camera.cx() > centerParent1 && centerParent1 > centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() + scene1Width + scene2Width);
      }

      if (camera.cx() < centerParent2 && centerParent2 < centerParent1) {
        nestedScene1Parent.x(nestedScene1Parent.x() - scene1Width - scene2Width);
      }

      if (camera.cx() < centerParent1 && centerParent1 < centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() - scene1Width - scene2Width);
      }
    });
  });
  scene1Observer.observe(nestedScene1Parent.node, mutationConfig);

/*  camera.cx(scene1.cx());
  camera.cy(scene1.cy());*/

  document.onkeydown = function(event) {
    switch (event.keyCode) {
      case 37:
        nestedScene1Parent.x(nestedScene1Parent.x() + 10);
        nestedScene2Parent.x(nestedScene2Parent.x() + 10);
        break;
      case 38:
        var viewbox = parent.viewbox();

        viewbox.width -= 1;
        viewbox.height -= 1;

        parent.viewbox(viewbox);
        break;
      case 39:
        nestedScene1Parent.x(nestedScene1Parent.x() - 10);
        nestedScene2Parent.x(nestedScene2Parent.x() - 10);
        break;
      case 40:
        var viewbox = parent.viewbox();

        viewbox.width += 1;
        viewbox.height += 1;

        parent.viewbox(viewbox);
        break;
    }
  };
});
