window.addEventListener("load", async function() {
  // BEGIN DEV HACK TO WORK WITH IMG TAG
  var img;
  var background = document;
  if (img = document.querySelector('img[inline]')) {
    let resp = await fetch(img.src);
    let data = await resp.text();
    let svg = document.createElement('svg');
    svg.innerHTML = data;
    img.replaceWith(svg);
  }

  let zoomClamp = 0.45;

  var zoomLevel = zoomClamp;

  let yUpperClamp = 1750;
  let yLowerClamp = -450;

  let moveClamp = 200;

  let cycleLength = 60000;

  var musicAudio = {};
  var zoomInAudio;
  var zoomOutAudio;
  var cameraClickAudio;
  var guiBleepAudio;

  var mouseCameraLocked = true;

  var cameraState = {
    afterIntro: {
      zoom: 0,
      zoomClamp: 0,
      x: 0,
      y: 0
    }
  };

  var maxPhotoCount = 20;

  var moveDistance = {
    x: 0,
    y: 0
  };

  function moveCamera(x, y) {
    nestedScene1Parent.x(nestedScene1Parent.x() + x);
    nestedScene2Parent.x(nestedScene2Parent.x() + x);

    sunGroup1.x(sunGroup1.x() + x);
    sunGroup2.x(sunGroup2.x() + x);

    nestedScene1Parent.y(nestedScene1Parent.y() + y);
    nestedScene2Parent.y(nestedScene2Parent.y() + y);

    sunGroup1.y(sunGroup1.y() + y);
    sunGroup2.y(sunGroup2.y() + y);
  }

  var parent = document.querySelector('#svg8');
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

  //Camera

  var cameraGraphic = background.getElementById('cameraGroup');
  cameraGraphic = SVG.adopt(cameraGraphic);

  cameraGraphic.front();

  var camera = background.getElementById('cameraReticle');
  camera = SVG.adopt(camera);

  //Sea
  var seaUpper = SVG.adopt(background.getElementById('seaUpper'));
  var seaUpperWaves1 = SVG.adopt(background.getElementById('seaUpper.waves.1'));
  seaUpperWaves1.hide();

  function startWaves() {
  }

  var seaShoreWaves = SVG.adopt(background.getElementById('seaShoreWaves'));
  var seaShoreWaves1 = SVG.adopt(background.getElementById('seaShore.waves.1'));
  var calmShore = seaShoreWaves.array();

  seaShoreWaves1.hide();

  function startShoreWaves() {
    seaShoreWaves
        .animate(2500, '-', 5000)
        .plot(seaShoreWaves1.array())
        .animate(5000, '<').plot(calmShore)
        .after(function () {
          startShoreWaves();
        })
    ;
  }

  startShoreWaves();
  startWaves();

  // Animals

  var animalPathDessertGroup = SVG.adopt(background.getElementById('animalPath.dessert.group'));

  var animalPathDessert = SVG.adopt(background.getElementById('animalPath.dessert'));
  animalPathDessert.hide();

  var animalPathSeaGroup = SVG.adopt(background.getElementById('animalPath.sea.group'));
  var animalPathSea = SVG.adopt(background.getElementById('animalPath.sea'));
  animalPathSea.hide();
  var animalPathSeaLength = animalPathSea.length();

  var animalPathCliffGroup = SVG.adopt(background.getElementById('animalPath.cliff.group'));
  var animalPathCliff = SVG.adopt(background.getElementById('animalPath.cliff'));
  animalPathCliff.hide();
  var animalPathCliffLength = animalPathCliff.length();

  var animalPathSkyGroup = SVG.adopt(background.getElementById('animalPath.sky.group'));
  var animalPathSky = SVG.adopt(background.getElementById('animalPath.sky'));
  animalPathSky.hide();
  var animalPathSkyLength = animalPathSky.length();

  var animalPathOasisGroup = SVG.adopt(background.getElementById('animalPath.oasis.group'));
  var animalPathOasis = SVG.adopt(background.getElementById('animalPath.oasis'));
  animalPathOasis.hide();
  var animalPathOasisLength = animalPathOasis.length();

  // Fire Fly
  var fireFlyAnimationLength = 5000;
  var fireFly = SVG.adopt(background.getElementById('fireFly'));
  fireFly.hide();

  fireFly.toParent(animalPathOasisGroup);

  function startFireFly() {
    function singleFireFly(fireFlyInstance) {
      var previousOasisPoint;
      var fireFlyShapeClone;

      fireFlyInstance.show();

      fireFlyShapeClone = fireFlyInstance.select('.fire-fly-shape').first();

      var rotationClamp = 0;

      fireFlyInstance
          .animate(fireFlyAnimationLength, '-')
          .during(function (pos, morph, eased, situation) {
            var p = animalPathOasis.pointAt((eased) * animalPathOasisLength);
            var rotation = 0;

            if (previousOasisPoint) {
              var p1 = p;
              var p2 = previousOasisPoint;

              var angle = Math.atan2((p2.y - p1.y),
                  (p2.x - p1.x));

              rotation = angle * (180 / Math.PI);
            }

            if (rotationClamp > 10) {
              fireFlyShapeClone.rotate(rotation);
              rotationClamp = 0;
            } else {
              rotationClamp +=1;
            }

            fireFlyInstance.translate(
                p.x - ((fireFlyInstance.node.getBBox().x + (fireFlyInstance.node.getBBox().width / 2)) * fireFlyInstance.transform().scaleX),
                p.y - ((fireFlyInstance.node.getBBox().y + (fireFlyInstance.node.getBBox().height / 2)) * fireFlyInstance.transform().scaleY)
            );

            previousOasisPoint = p;
          }).loop()
      ;
    }

    function spawnFireFly(delay) {
      fireFly
          .delay(delay)
          .after(function () {
            singleFireFly(fireFly.clone());
          })
      ;
    }

    spawnFireFly(0);
    spawnFireFly(500);
    spawnFireFly(1000);
    spawnFireFly(1500);
    spawnFireFly(3000);
    spawnFireFly(4000);
    spawnFireFly(4500);
  }

  // Eagle
  var eagleAnimationLength = 50000;
  var eagle = SVG.adopt(background.getElementById('eagle'));
  eagle.hide();

  eagle.toParent(animalPathSkyGroup);

  function startEagle() {
    function singleEagle(eagleInstance) {
      var previousSkyPoint;
      var eagleShapeClone;

      eagleInstance.show();

      eagleShapeClone = eagleInstance.select('.eagle-shape').first();

      eagleInstance
          .animate(eagleAnimationLength, '-')
          .during(function (pos, morph, eased, situation) {
            var p = animalPathSky.pointAt((1 - eased) * animalPathSkyLength);
            var rotation = 0;

            if (previousSkyPoint) {
              var p1 = p;
              var p2 = previousSkyPoint;

              var angle = Math.atan2((p2.y - p1.y),
                  (p2.x - p1.x));

              rotation = angle * (180 / Math.PI);
            }

            eagleInstance.translate(
                p.x - ((eagleInstance.node.getBBox().x + (eagleInstance.node.getBBox().width / 2)) * eagleInstance.transform().scaleX),
                p.y - ((eagleInstance.node.getBBox().y + (eagleInstance.node.getBBox().height / 2)) * eagleInstance.transform().scaleY)
            );

            eagleShapeClone.rotate(rotation);

            previousSkyPoint = p;
          }).loop()
      ;
    }

    function spawnEagle(delay) {
      ant
          .delay(delay)
          .after(function () {
            singleEagle(eagle.clone());
          })
      ;
    }

    spawnEagle(0);
  }

  // Ant
  var antAnimationLength = 100000;
  var ant = SVG.adopt(background.getElementById('ant'));
  ant.hide();

  ant.toParent(animalPathCliffGroup);

  function startAnt() {
    function singleAnt(antInstance) {
      var previousCliffPoint;
      var antShapeClone;

      antInstance.show();

      antShapeClone = antInstance.select('.ant-shape').first();

      antInstance
          .animate(antAnimationLength, '-')
          .during(function (pos, morph, eased, situation) {
            var p = animalPathCliff.pointAt((eased) * animalPathCliffLength);
            var rotation = 0;

            if (previousCliffPoint) {
              var p1 = p;
              var p2 = previousCliffPoint;

              var angle = Math.atan2((p2.y - p1.y),
                  (p2.x - p1.x));

              rotation = angle * (180 / Math.PI);
            }

            antInstance.translate(
                p.x - ((antInstance.node.getBBox().x + (antInstance.node.getBBox().width / 2)) * antInstance.transform().scaleX),
                p.y - ((antInstance.node.getBBox().y + (antInstance.node.getBBox().height / 2)) * antInstance.transform().scaleY)
            );

            antShapeClone.rotate(rotation);

            previousCliffPoint = p;
          }).loop()
      ;
    }

    function spawnAnt(delay) {
      eagle
          .delay(delay)
          .after(function () {
            singleAnt(ant.clone());
          })
      ;
    }

    spawnAnt(500);
    spawnAnt(1000);
    spawnAnt(1200);
    spawnAnt(1400);
  }

  // Dolphin
  var dolphin = SVG.adopt(background.getElementById('dolphin'));
  var dolphinShape = SVG.adopt(background.getElementById('dolphinShape'));

  var dolphinAnimationLength = 10000;

  dolphin.toParent(animalPathSeaGroup);
  var previousSeaPoint;
  dolphin
      .animate(dolphinAnimationLength, '-')
      .during(function(pos, morph, eased, situation) {
        var p = animalPathSea.pointAt((eased) * animalPathSeaLength);
        var rotation = 0;

        if (previousSeaPoint) {
          var p1 = p;
          var p2 = previousSeaPoint;

          var angle = Math.atan2( (p2.y - p1.y),
              (p2.x - p1.x) );

          rotation = angle * (180 / Math.PI);
        }

        dolphin.translate(
            p.x - ((dolphin.node.getBBox().x + (dolphin.node.getBBox().width / 2)) * dolphin.transform().scaleX),
            p.y - ((dolphin.node.getBBox().y + (dolphin.node.getBBox().height / 2)) * dolphin.transform().scaleY)
        );

        dolphinShape.rotate(rotation);

        previousSeaPoint = p;
      }).loop()
  ;

  //Rhino
  var rhinoWrapper = SVG.adopt(background.getElementById('rhinoWrapper'));
  var rhino = SVG.adopt(background.getElementById('rhino'));
  var rhinoPath = rhino.array();
  var rhinoHeadUpPath = SVG.adopt(background.getElementById('rhino.head.up'));
  var rhinoWalk2 = SVG.adopt(background.getElementById('rhino.walk.2'));
  var rhinoWalk3 = SVG.adopt(background.getElementById('rhino.walk.3'));
  var rhinoWalk4 = SVG.adopt(background.getElementById('rhino.walk.4'));

  rhinoWrapper.toParent(animalPathDessertGroup);

  var animalPathDessertLength = animalPathDessert.length();

  var animations = [];
  animations.push(rhinoWalk2.array());
  animations.push(rhinoWalk3.array());
  animations.push(rhinoWalk4.array());
  animations.push(rhinoWalk3.array());

  var lastIndex = 0;

  var rhinoWalkAnimation = function(pos, seconds, animationDuration) {
    var animationIndex = Math.ceil(seconds / animationDuration);

    animationIndex -= animations.length * Math.floor(animationIndex / animations.length);

    if (animations[animationIndex]) {
      var animation = animations[animationIndex];

      // How many animations have played so far
      var animationCycleCounter = Math.floor(seconds / animationDuration);

      // Make indexed animations loop around each cycle
      var animationIndexOffset = animationCycleCounter * animationDuration;

      var currentAnimationCycleTime = (seconds - animationIndexOffset) / animationDuration;

      if (lastIndex !== animationIndex) {
        var currentAnimation = rhino.animate(animationDuration).plot(animation).pause();

        currentAnimation.play();
      }

      lastIndex = animationIndex;
    }
  };

  var rhinoWalk = function() {
    var animationLength = 15000;
    var preFlippedRhino = rhino.transform();
    rhino.flip('x');

    rhinoWrapper
        .animate(animationLength, '-')
        .during(function(pos, morph, eased, situation) {
          var p = animalPathDessert.pointAt((eased) * animalPathDessertLength);

          rhinoWrapper.translate(
              p.x - ((rhinoWrapper.node.getBBox().x + (rhinoWrapper.node.getBBox().width / 2)) * rhinoWrapper.transform().scaleX),
              p.y - ((rhinoWrapper.node.getBBox().y + (rhinoWrapper.node.getBBox().height / 2)) * rhinoWrapper.transform().scaleY)
          );

          rhinoWalkAnimation(pos, animationLength * eased, 200);
        }).after(function() {
      rhino.animate(1000).plot(rhinoPath)
          .delay(1000)
          .animate(1000).plot(rhinoHeadUpPath.array())
          .after(
              function () {
                rhino.transform(preFlippedRhino);

                rhinoWrapper.animate(animationLength, '-').during(function(pos, morph, eased, situation) {
                  var p = animalPathDessert.pointAt((1 - eased) * animalPathDessertLength);

                  rhinoWrapper.translate(
                      p.x - ((rhinoWrapper.node.getBBox().x + (rhinoWrapper.node.getBBox().width / 2)) * rhinoWrapper.transform().scaleX),
                      p.y - ((rhinoWrapper.node.getBBox().y + (rhinoWrapper.node.getBBox().height / 2)) * rhinoWrapper.transform().scaleY)
                  );

                  rhinoWalkAnimation(pos, animationLength * eased, 200);
                }).
                delay(1000).after(function () {
                  rhinoWalk();
                });
              }
          )
      ;
    })
    ;
  };

  rhinoWalk();

  // Game State
  var gameState = 0;
  var gameTimer = 0;

  // Sun and Moon 1
  var sunGroup1 = background.getElementById('sunGroup1');
  sunGroup1 = SVG.adopt(sunGroup1);

  sunGroup1.toParent(sceneParent);

  sunGroup1.back();

  var sunPath1 = background.getElementById('sunPath1');
  sunPath1 = SVG.adopt(sunPath1);
  sunPath1.hide();
  var sunPath1Length = sunPath1.length();

  var sun1 = background.getElementById('sun1');
  sun1 = SVG.adopt(sun1);

  var nightFilter1 = SVG.adopt(background.getElementById('nightFilter1'));
  var sky1Night = SVG.adopt(background.getElementById('sky1Night'));
  var clouds1 = SVG.adopt(background.getElementById('clouds1'));
  var clouds2 = SVG.adopt(background.getElementById('clouds2'));

  clouds1.x(0);
  clouds2.x(-100);

  var nightFilter2 = SVG.adopt(background.getElementById('nightFilter2'));
  var nightLights = SVG.adopt(background.getElementById('nightLights'));
  var sky2Night = SVG.adopt(background.getElementById('sky2Night'));

  var sunPosition = 0;

  var timerGroup = SVG.adopt(background.getElementById('timerGroup'));

  var sun1Animation = sun1.animate(cycleLength, '-').during(function(pos, morph, eased, situation) {
    var p = sunPath1.pointAt((eased) * sunPath1Length);

    sunPosition = pos;

    var opacity = 0;

    if (pos <= 0.5) {
      opacity = pos / 0.5;
    } else {
      opacity = (1 - pos) / pos;
    }

    nightFilter1.style('opacity', opacity);
    nightFilter2.style('opacity', opacity);
    nightLights.style('opacity', opacity);
    sky1Night.style('opacity', opacity);
    sky2Night.style('opacity', opacity);

    clouds1.x(400 * opacity);
    clouds2.x(200 * opacity);

    if (gameTimer < situation.loop) {
      gameTimer = situation.loop;
      //depleteBattery();
    }

    sun1.translate(
        p.x - ((sun1.node.getBBox().x + (sun1.node.getBBox().width / 2)) * sun1.transform().scaleX),
        p.y - ((sun1.node.getBBox().y + (sun1.node.getBBox().height / 2)) * sun1.transform().scaleY)
    );

    timerGroup.rotate(
        360 * eased,
        timerGroup.node.getBBox().x + timerGroup.node.getBBox().width / 2,
        timerGroup.node.getBBox().y + timerGroup.node.getBBox().height / 2
    );

  }).loop().pause();

  var moon1 = background.getElementById('moon1');
  moon1 = SVG.adopt(moon1);

  var moon1Animation = moon1.animate(cycleLength, '-').during(function(pos, morph, eased, situation){
    var p = sunPath1.pointAt((eased ) * sunPath1Length);

    moon1.translate(
        p.x - ((moon1.node.getBBox().x + (moon1.node.getBBox().width / 2)) * moon1.transform().scaleX),
        p.y - ((moon1.node.getBBox().y + (moon1.node.getBBox().height / 2)) * moon1.transform().scaleY)
    );
  }).loop().pause();

  //Sun Group 2
  var sunGroup2 = background.getElementById('sunGroup2');
  sunGroup2 = SVG.adopt(sunGroup2);

  sunGroup2.toParent(sceneParent);

  sunGroup2.back();

  var sunPath2 = background.getElementById('sunPath2');
  sunPath2 = SVG.adopt(sunPath2);
  sunPath2.hide();
  var sunPath2Length = sunPath2.length();

  var sun2 = background.getElementById('sun2');
  sun2 = SVG.adopt(sun2);

  var sun2Animation = sun2.animate(cycleLength, '-').during(function(pos, morph, eased, situation){
    var p = sunPath1.pointAt((eased) * sunPath2Length);

    sun2.translate(
        p.x - ((sun2.node.getBBox().x + (sun2.node.getBBox().width / 2)) * sun2.transform().scaleX),
        p.y - ((sun2.node.getBBox().y + (sun2.node.getBBox().height / 2)) * sun2.transform().scaleY)
    );
  }).loop().pause();

  var moon2 = background.getElementById('moon2');
  moon2 = SVG.adopt(moon2);

  var moon2Animation = moon2.animate(cycleLength, '-').during(function(pos, morph, eased, situation){
    var p = sunPath1.pointAt((eased ) * sunPath1Length);

    moon2.translate(
        p.x - ((moon2.node.getBBox().x + (moon2.node.getBBox().width / 2)) * moon2.transform().scaleX),
        p.y - ((moon2.node.getBBox().y + (moon2.node.getBBox().height / 2)) * moon2.transform().scaleY)
    );
  }).loop().pause();


  var galleryIconFull = SVG.adopt(background.getElementById('galleryIconFull'));
  var galleryIconPreview = SVG.adopt(background.getElementById('galleryIconPreview'));

  galleryIconPreview.click(function() {
    toggleGallery();
  });

  galleryIconFull.click(function() {
    toggleGallery();
  });

  galleryIconFull.hide();
  galleryIconPreview.hide();

  function startSun() {
    sun1Animation.play();
    sun2Animation.play();
    moon1Animation.play();
    moon2Animation.play();

    startAnt();
    startEagle();
    startFireFly();
  }

  // Intro

  gameState = 0;

  var introGroup = SVG.adopt(background.getElementById('introGroup'));

  introGroup.toParent(scene1Group);

  var fakeDarkness = SVG.adopt(background.getElementById('fakeDarkness'));
  var fakeLight = SVG.adopt(background.getElementById('fakeLight'));
  var tentFabric = SVG.adopt(background.getElementById('tentFabric'));
  var startButtonAlarm = SVG.adopt(background.getElementById('startButton'));

  var tentDoorLeft = SVG.adopt(background.getElementById('tentDoorLeft'));
  var tentDoorLeftOpen = SVG.adopt(background.getElementById('tentDoorLeft.open'));

  var tentDoorRight = SVG.adopt(background.getElementById('tentDoorRight'));
  var tentDoorRightOpen = SVG.adopt(background.getElementById('tentDoorRight.open'));

  var splashScreenGroup = SVG.adopt(background.getElementById('splashScreenGroup'));
  var flash = SVG.adopt(background.getElementById('flash'));
  var skipIntroButton = SVG.adopt(background.getElementById('skipIntroButton'));
  var splashStartButton = SVG.adopt(background.getElementById('splashStartButton'));
  var splashScreenLens = SVG.adopt(background.getElementById('splashScreenLens'));

  splashScreenGroup.hide();

  function splashScreen() {

    splashScreenGroup.show();
    splashScreenGroup.front();

    skipIntroButton.click(
        function() {
          introFinished = true;

          introGroup.remove();

          startSun();
          flash.front();

          loadAudio();

          splashScreenLens.rotate(0);

          var refreshId = setInterval(function () {
            splashScreenLens.rotate(Math.random() * 360);

            if (audioLoaded === audioTracks) {
              clearInterval(refreshId);

              splashScreenGroup
                  .delay(0)
                  .style({opacity: 1})
                  .animate(1500)
                  .transform({scale: 10, cx: 951, cy: 400})
                  .style({opacity: 0})
                  .after(
                      function() {
                        startGame();

                        splashScreenGroup.remove();
                      }
                  )
              ;
            }
          }, 0);

        }
    );

    splashStartButton.click(
        function() {
          flash.front();

          loadAudio();

          splashScreenLens.rotate(0);

          var refreshId = setInterval(function () {
            splashScreenLens.rotate(Math.random() * 360);

            if (audioLoaded === audioTracks) {
              clearInterval(refreshId);

              splashScreenGroup
                  .delay(0)
                  .after(function() {
                    flash.animate().style({opacity: 1});
                  })
                  .style({opacity: 1})
                  .animate(1500)
                  .transform({scale: 10, cx: 951, cy: 400})
                  // .style({opacity: 0})
                  .after(
                      function() {
                        intro();

                        splashScreenGroup.remove();
                      }
                  )
              ;
            }
          }, 0);
        }
    );
  }

  var introFinished = false;

  function intro() {

    introFinished = false;

    mouseCameraLocked = true;

    introGroup.show();

    gameState = 0;

    var sunPos = 0.75;

    sun1Animation.at(sunPos, true);
    sun2Animation.at(sunPos, true);
    moon1Animation.at(sunPos - 0.5, true);
    moon2Animation.at(sunPos - 0.5, true);

    zoomClamp = 0.55;
    zoomLevel = zoomClamp;
    cameraZoom(sceneParent, zoomLevel);

    moveCamera(-10, -390);

    cameraGraphic.style({opacity: 0});

    fakeDarkness
        .delay(1000)
        .delay(1000)
        .during(function () {
          moveCamera(150 / (60), 0);
        })
    ;
    startButtonAlarm.show();
    startButtonAlarm.style({opacity: 1});
    var startButtonAlarmAnimation = startButtonAlarm.animate(1000).style({opacity: 0}).loop();

    startButtonAlarm.click(function () {
          startButtonAlarmAnimation.finish();

          fakeDarkness
              .delay(1000)
              .delay(2000).during(function () {
                moveCamera(-100 / (60 * 2), 0);
              })
              .after(function () {
                afterStartButton();
              })
          ;
        }
    );

    function afterStartButton() {
      tentFabric.style({opacity: 1});
      fakeLight.delay(1000).animate(2000).style({opacity: 0});


      tentDoorLeft
          .delay(6000)
          .animate(3000)
          //.delay(2000)
          .plot(tentDoorLeftOpen.array())
          .delay(3000)
      ;

      tentDoorRight
          .delay(6000)
          .during(function (pos, moprhed, eased) {
            fakeDarkness.opacity(1 - (1 * eased));
          })
          .animate(3000)
          //.delay(2000)
          .plot(tentDoorRightOpen.array())
          .after(function() {
            startSun();
            musicAudio.play();
          })
          .delay(3000)
          .during(function (pos, morphed, eased) {
            moveCamera(-50 / (60 * 2), 600 / (60 * 2));
          })
          .delay(2000)
          .during(function (pos) {
            moveCamera(0, -450 / (60 * 2));

            tentDoorLeft.style({opacity: 1 - pos});
            tentDoorRight.style({opacity: 1 - pos});
          })
          .after(function () {
            tentFabric.animate(2000).style({opacity: 0})
                .after(function () {
                  introGroup.hide();
                  cameraGraphic.animate(500).style({opacity: 0.50})
                      .during(function (pos) {
                        zoomClamp = 0.43;
                        //30 steps
                        var zoom = zoomClamp - zoomLevel;
                        zoom = zoom / 30;

                        zoomLevel += zoom;

                        //zoomLevel = zoomClamp;
                        cameraZoom(sceneParent, zoomLevel);
                      })
                      .after(
                          function () {
                            cameraState.afterIntro = {
                              zoom: zoomLevel,
                              zoomClamp: zoomClamp,
                              x: nestedScene1Parent.x,
                              y: nestedScene1Parent.y
                            };

                            introGroup.hide();

                            introFinished = true;
                          }
                      );
                })
            ;
          })
      ;
    }
  }

  cameraState.afterIntro = {
    zoom: zoomLevel,
    zoomClamp: zoomClamp,
    x: nestedScene1Parent.x(),
    y: nestedScene1Parent.y()
  };

  // Game Start

  function startGame() {
    musicAudio.play();

    zoomClamp = 0.43;
    gameState = 1;

    var sunPos = 0.75;

    sun1Animation.at(sunPos, true);
    sun2Animation.at(sunPos, true);
    moon1Animation.at(sunPos - 0.5, true);
    moon2Animation.at(sunPos - 0.5, true);

    toggleCameraLock(true);
  }

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

        sunGroup2.x(sunGroup2.x() + scene1Width + scene2Width - fixSeam);
      }

      if (camera.cx() < centerParent2 && centerParent2 < centerParent1) {
        nestedScene1Parent.x(nestedScene1Parent.x() - scene1Width - scene2Width + fixSeam);

        sunGroup1.x(sunGroup1.x() - scene1Width - scene2Width + fixSeam);
      }

      if (camera.cx() < centerParent1 && centerParent1 < centerParent2) {
        nestedScene2Parent.x(nestedScene2Parent.x() - scene1Width - scene2Width + fixSeam);

        sunGroup2.x(sunGroup2.x() - scene1Width - scene2Width + fixSeam);
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

  var cameraDeadZone = background.getElementById('cameraDeadZone');
  cameraDeadZone = SVG.adopt(cameraDeadZone);

  // Camera Move with Mouse

  var pointerHandler = (event) => {
    if (mouseCameraLocked) {
      return;
    }

    event.preventDefault();

    var deadZone = cameraDeadZone.width() / 2;
    var mouseVector = {x: event.x, y: event.y};
    var cameraCenterVector = {x: camera.cx(), y: camera.cy()};
    var tempV = {x: mouseVector.x - cameraCenterVector.x, y: mouseVector.y - cameraCenterVector.y};
    var distanceVector = Math.sqrt(tempV.x * tempV.x + tempV.y * tempV.y);

    if (distanceVector > deadZone) {
      moveDistance.x = camera.cx() - event.x;
      moveDistance.y = camera.cy() - event.y;
    } else {
      moveDistance.x = 0;
      moveDistance.y = 0;
    }

    var adjustedMoveClamp = moveClamp * (zoomLevel * 2);

    let absMoveX = Math.abs(moveDistance.x) / (zoomLevel * 1.5);
    let absMoveXY= Math.abs(moveDistance.y) / (zoomLevel * 1.5);

    absMoveX = absMoveX < adjustedMoveClamp ? absMoveX : adjustedMoveClamp;
    absMoveXY = absMoveXY < adjustedMoveClamp ? absMoveXY : adjustedMoveClamp;

    moveDistance.x *= (absMoveX / 500000) * absMoveX;
    moveDistance.y *= (absMoveXY / 500000) * absMoveXY;

    return false;
  };

  background.addEventListener('pointermove', pointerHandler);

  var zoomTotal = 0;

  var mouseWheelHandler = (event) => {
    if (mouseCameraLocked) {
      return;
    }

    let zoomDelta = (event.deltaY / 50) * (zoomLevel / 2);

    zoomLevel = zoomLevel - zoomDelta < zoomClamp ? zoomClamp : zoomLevel - zoomDelta;

    cameraZoom(sceneParent, zoomLevel);

    zoomTotal += zoomDelta;

    if (zoomTotal > 0.1) {
      if (zoomInAudio.currentTime > 0.2) {
        zoomInAudio.currentTime = 0;
      }

      zoomInAudio.play();

      zoomTotal = 0;
    } else if (zoomTotal < -0.1) {
      if (zoomOutAudio.currentTime > 0.2) {
        zoomOutAudio.currentTime = 0;
      }

      zoomOutAudio.play();

      zoomTotal = 0;
    }

    return false;
  };

  background.addEventListener('mousewheel', mouseWheelHandler);

  background.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    return false;
  });

  var galleryIcon = SVG.adopt(background.getElementById('galleryIcon'));
  var galleryBackground = SVG.adopt(background.getElementById('galleryBackground'));

  galleryBackground.hide();

  galleryIcon.mouseover(function() {
    galleryIcon.style({opacity: 1});
  });

  galleryIcon.mouseout(function() {
    galleryIcon.style({opacity: 0.50});
  });

  function menuBleep() {
    if (guiBleepAudio.currentTime > 0.1) {
      guiBleepAudio.currentTime = 0;
    }
    guiBleepAudio.play();
  }

  function toggleGallery() {
    menuBleep();

    album.hidden = !album.hidden;

    if (album.hidden) {
      galleryBackground.hide();
      cameraInnerGroup.show();
    } else {
      galleryBackground.show();
      cameraInnerGroup.hide();
    }
  }
  galleryIcon.click(function(event) {
    event.preventDefault();

    toggleGallery();

    return false;
  });

  var albumSlotSizeMode = 8;

  var albumFocus = SVG('albumFocus').size(1920, 1080);
  albumFocus.hide();

  var album = document.getElementById('album');

  var photoFocused = false;

  album.addEventListener('click', function() {
    if (!photoFocused) {
      toggleGallery();
    }
  });

  album.hidden = true;

  function loadAudioTrack(sound, volume, callback) {
    var player = new CPlayer();
    player.init(sound);

    // Generate music...
    var done = false;
    setInterval(function () {
      if (done) {
        return;
      }

      done = player.generate() >= 1;

      if (done) {
        // Put the generated song in an Audio element.
        var wave = player.createWave();
        var audio = document.createElement("audio");
        audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
        audio.volume = volume;

        callback(audio);

        audioLoaded++;
      }
    }, 0);
  }

  var audioLoaded = 0;
  var audioTracks = 5;

  function loadAudio() {
    loadAudioTrack(song, 0.5, function(audio) { musicAudio = audio; musicAudio.loop = true; });
    loadAudioTrack(cameraClickSound, 1, function(audio) { cameraClickAudio = audio; });
    loadAudioTrack(zoomIn, 1, function(audio) { zoomInAudio = audio; });
    loadAudioTrack(zoomOut, 0.5, function(audio) { zoomOutAudio = audio; });
    loadAudioTrack(guiBleep, 0.5, function(audio) { guiBleepAudio = audio; });

    return true;
  }

  function playAudio(audio) {
    if (audio.currentTime > 0.1) {
      audio.currentTime = 0;
    }
    audio.play();
  }

  function cameraClick() {
    if (!introFinished) {
      return;
    }

    if (Object.keys(photos).length >= maxPhotoCount) {
      playAudio(guiBleepAudio);

      return;
    }

    captureImage();

    if (cameraClickAudio.currentTime > 0.5) {
      cameraClickAudio.currentTime = 0;
    }

    cameraClickAudio.play();

    if (Object.keys(photos).length >= maxPhotoCount) {
      playAudio(guiBleepAudio);

      galleryIconFull.show();
      galleryIconPreview.show();
    }
  }

  sceneParent.click(function(event) {
    // if (!mouseCameraLocked) {
    cameraClick();
    // }

    return event;
  });

  var tagList = {};

  var levelCount = 1;
  var levels = {};

  var mark = false;

  function buildObjectiveList() {
    for (var l=1 ; l <= levelCount; l++) {
      var objectives = {};
      var levelObjectives = SVG.adopt(background.getElementById('level' + l));

      levelObjectives.select('.objective').members.forEach(function(objective) {
        objectives[objective.id()] = {
          objective: objective,
          found: false,
          boxDone: objective.parent().select('.objective-box').members[0]
        };
      });

      levels[l] = levels[l] || {
        level: levelObjectives,
        objectives: objectives
      };

      levelObjectives.hide();
    }
  }

  function buildTagList() {
    parent.select('.photo-subject').members.forEach(function(subject) {
      subject.classes().forEach(function(cssClass) {
        if (cssClass.match(/tag\-/)) {
          var tag = cssClass.substring(4);

          tagList[tag] = tagList[tag] || [];

          tagList[tag].push(subject);
        }
      });
    });
  }

  var currentLevel = 1;

  function buildLevelObjectives() {
    if (!levels[currentLevel]) {
      return false;
    }

    levels[currentLevel].level.show();
  }

  buildTagList();
  buildObjectiveList();
  buildLevelObjectives();

  //Scoring

  var highScoreLikes = 0;
  var photos = {};


  function scorePhoto(focusedPhoto) {
    if (!introFinished) {
      return;
    }

    var total = 0;
    var subjectCount = 0;

    focusedPhoto.select('.photo-subject').members.forEach(function (subject) {
      var rbox = subject.rbox();

      //Check if any part of the bounding box is in view
      let width = 1920;
      let height = 1080;

      var xContains = rbox.x2 - 100 > 0 && rbox.x + 100 < width;
      var yContains = rbox.y - 100 > 0 && rbox.y2 + 100 < height;

      if (!xContains || !yContains) {
        return;
      }

      /*      var rect = focusedPhoto.rect(rbox.width, rbox.height);
            rect.x(rbox.x);
            rect.y(rbox.y);
            rect.stroke({ color: '#f06', opacity: 0.6, width: 5 });
            rect.fill({ color: '#f06', opacity: 0 });*/

      let perfectScaleRatio = 0.75;
      let perfectCenter = 0.50;

      var scoring = {
        scaleX:  (rbox.width / (width * perfectScaleRatio)),
        scaleY: (rbox.height / (height * perfectScaleRatio)),
        centerX: 1 - Math.abs(perfectCenter - (rbox.cx / width)),
        centerY: 1 - Math.abs(perfectCenter - (rbox.cy / height)),
      };

      var subTtotal = (scoring.scaleX + scoring.scaleY + scoring.centerX + scoring.centerY) / 4;

      subjectCount += 1;
      total += subTtotal;

      subject.classes().forEach(function (tagClass) {
        if (levels[currentLevel]['objectives'][tagClass]) {
          levels[currentLevel]['objectives'][tagClass].found = true;
          levels[currentLevel]['objectives'][tagClass].boxDone.animate(1000).style({opacity: 0.5});
        }
      });
    });

    var levelDone = true;

    /*levels[currentLevel]['objectives'].forEach(function(objective) {
      levelDone = levelDone && objective.found;
    });

    console.log('levelDone', levelDone);*/

    /*    let finalScore = Math.ceil(5 * (total / subjectCount));

        var like = starsGroupScore.clone(focusedPhoto);
        like.front();

        for (var s=1; s <= finalScore; s++) {
          var scoreLike = like.select('#starsGroupScore' + s).first();

          scoreLike.style({ fill: '#FFF', opacity: 1 });
          scoreLike.style('fill-opacity', 1);
        }

        highScoreLikes += finalScore;

        updateHighScore();*/
  }

  /*  shareButton.click(function() {
      menuBleep();

      photos.forEach(function(focusedPhoto) {
        //scorePhoto(focusedPhoto);
      });
    });

    shareButton.mouseover(function() {
      shareButton.style({opacity: 1});
    });

    shareButton.mouseout(function() {
      shareButton.style({opacity: 0.50});
    });*/

  //Score Algorithme

  //Show Score on Thumbnail

  //Mark photo as scored

  var cameraInnerGroup = SVG.adopt(background.getElementById('cameraInnerGroup'));
  var deleteButton = SVG.adopt(background.getElementById('deleteButton'));

  var slot = document.createElement("div");
  album.appendChild(slot);
  slot.id = 'bookSlot';

  function focusThumbPhoto(thumbPhoto) {
    photoFocused = true;

    albumFocus.clear();
    var focusedPhoto = thumbPhoto.clone(albumFocus);

    focusedPhoto.width(1920);
    focusedPhoto.height(1080);

    albumFocus.show();

    scorePhoto(focusedPhoto);

    var deleteButtonCloned = focusedPhoto.select('.deleteButtonCloned' + thumbPhoto.id()).first();

    deleteButtonCloned.hide();

    focusedPhoto.node.addEventListener('click', function (event) {
      event.preventDefault();

      albumFocus.hide();
      photoFocused = false;

      return false;
    });
  }

  function captureImage() {
    if (!introFinished) {
      return;
    }

    var slot1 = SVG(slot.id).size(1920 / albumSlotSizeMode, 1080/ albumSlotSizeMode);

    var clonedBackground = parent.clone(slot1);

    var clonedCameraGraphic = clonedBackground.select('.camera-group').first();

    clonedCameraGraphic.hide();

    clonedBackground.width(clonedBackground.width() / albumSlotSizeMode);
    clonedBackground.height(clonedBackground.height() / albumSlotSizeMode);

    photos[slot1.id()] = clonedBackground;

    var previewPhoto;

    cameraGraphic.delay(0)
        .after(function() {
          previewPhoto = clonedBackground.clone(parent);

          previewPhoto.width(1920);
          previewPhoto.height(1080);

          scorePhoto(previewPhoto);
        })
        .delay(350)
        .after(function() {
          previewPhoto.remove();

          galleryIconPreview.show();

          var clonedDeleteButton = deleteButton.clone(clonedBackground);

          clonedDeleteButton.id('deleteButtonCloned' + clonedBackground.id());
          clonedDeleteButton.addClass('deleteButtonCloned' + clonedBackground.id());

          clonedDeleteButton.style({opacity: 0.25});

          clonedDeleteButton.mouseout(function() {
            clonedDeleteButton.style({opacity: 0.25});
          });

          clonedDeleteButton.mouseover(function() {
            clonedDeleteButton.style({opacity: 1});
          });

          clonedDeleteButton.click(function(event) {
            event.stopPropagation();
            event.preventDefault();

            slot1.remove();

            delete photos[slot1.id()];

            galleryIconFull.hide();

            return false;
          });
        })
    ;

    clonedBackground.click(
        function(event) {
          event.preventDefault();

          focusThumbPhoto(clonedBackground);

          return false;
        }
    );
  }

  var cameraLockGroup = SVG.adopt(background.getElementById('cameraLockGroup'));

  function toggleCameraLock(lock) {
    mouseCameraLocked = lock || !mouseCameraLocked;

    var locked = mouseCameraLocked ? 1 : 0.1;
    cameraLockGroup.style({opacity: locked});
  }

  background.addEventListener('mouseup', function(event) {
    switch (event.button) {
      case 0:
        break;
      case 2:
        moveDistance.x = 0;
        moveDistance.y = 0;

        toggleCameraLock();

        break;
    }

    return false;
  });

  //Basic Loop and Positioning

  function update(progress) {
    // Update the state of the world for the elapsed time since last render
    if (moveDistance.x) {
      nestedScene1Parent.x(nestedScene1Parent.x() + moveDistance.x);
      nestedScene2Parent.x(nestedScene2Parent.x() + moveDistance.x);

      sunGroup1.x(sunGroup1.x() + moveDistance.x);
      sunGroup2.x(sunGroup2.x() + moveDistance.x);
    }

    if (moveDistance.y) {
      if (nestedScene1Parent.y() + moveDistance.y > yUpperClamp) {
        moveDistance.y = yUpperClamp - nestedScene1Parent.y();
      }


      if (nestedScene1Parent.y() + moveDistance.y < yLowerClamp) {
        moveDistance.y = 0;

        moveDistance.y = yLowerClamp - nestedScene1Parent.y();
      }

      nestedScene1Parent.y(nestedScene1Parent.y() + moveDistance.y);
      nestedScene2Parent.y(nestedScene2Parent.y() + moveDistance.y);

      sunGroup1.y(sunGroup1.y() + moveDistance.y);
      sunGroup2.y(sunGroup2.y() + moveDistance.y);
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

  splashScreen();
});
