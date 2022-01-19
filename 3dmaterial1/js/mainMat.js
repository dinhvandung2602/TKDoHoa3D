//setup scene
var scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const container = document.getElementById("canvasContainer");
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);
camera.position.x = 1;
camera.position.y = 0.8;
camera.position.z = 2;

//setup mouse controls
const mouseRaycastEvent = new THREE.MouseRaycastEvent(camera);

//setup controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3();
controls.enablePan = false;
controls.maxDistance = 6;
controls.minDistance = 1;
controls.zoomSpeed = 1;

//init object to scene
// Instantiate a loader
const gltfLoader = new THREE.GLTFLoader();

//init light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow=true;
directionalLight.position.set(5,20,5);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.near = 0.5;
// directionalLight.shadow.camera.far = 300;
// directionalLight.shadow.camera.top = 50;
// directionalLight.shadow.camera.bottom = -1;
// directionalLight.shadow.camera.left = -1;
// directionalLight.shadow.camera.right = 50;
directionalLight.shadow.bias=-0.001;
scene.add(directionalLight);
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.7);
scene.add(light);



var session_id="n/a";


//
function LoadModelEnvironment(index) {
    //remove model from scene
    if(model) {
        removeModelFromScene();
    }


  //load environment
  const cubeTextLoader = new THREE.CubeTextureLoader();
  cubeTextLoader.setPath(enviMap[index]);

  const textureCube = cubeTextLoader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
  ]);

  scene.background = textureCube;
  scene.environment = textureCube;

  

  //load models
  gltfLoader.load("models/" + models[index], function (gltf) {
    model = gltf.scene;
    console.log(model);
    model.scale.set(0.01, 0.01, 0.01);
    var center = new THREE.Vector3();
    new THREE.Box3().setFromObject(gltf.scene).getCenter(center);
    model.position.set(-center.x, -center.y, -center.z);

    model.traverse(function (child) {
      child.receiveShadow = true; 
      child.castShadow = true;

      if(child.isMesh) {
        mouseRaycastEvent.addRaycastObject(child);
       // GetObjectInfo1(child.name,child);
       
      }
    });

    InitData();

    //addmodel to scene
    scene.add(model);

    //animation setting
    mixer = new THREE.AnimationMixer(model);

    for (var i = 0; i < gltf.animations.length; i++) {
      var action = mixer.clipAction(gltf.animations[i]);
      action.play();
    }

  });
}
//
function GetObjectInfo1(object_code, obj,flag) {
  
  console.log(obj);

  var reqData = {};
  reqData.object_code= object_code;
  reqData.session_id=session_id;
  reqData.flag=flag;
  console.log(flag);

  
  //reqData.session_id="session_id here";
  $.post("http://eyecheck.vn/test3DAPIs/common/getobjectinfo",
      JSON.stringify(reqData),
      function (data, status) {
        if (status == "success") {
          console.log(data);
          if(data.code == 200) {
              
             // alert(obj.name);

              switch(obj.name) {
                  case "color_matte":
                      createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(-1.15,0.67,-1.1)); 
                     // 
                     
                      break; 
                  case "normal_matte":
                          createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(-0.45,0.67,-1.1)); 
                      break;
                  case "metallic_matte":
                          createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(0.45,0.67,-1.1)); 
                      break;
                  case "roughness_matte":
                      createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(1.15,0.67,-1.1)); 
                      break;


                  case "emission_matte":
                      createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(-1.15,0.2,0.2)); 
                      break;

                 case "displacement_matte": 
                     // alert("dđ");
                      createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(-0.45,0.2,0.2));  
                      break; 
                      
                    
                  case "alpha_clip_matte":
                      createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(0.45,0.2,0.2)); 
                      break;
                  case "alpha_blend_matte":
                      createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(1.15,0.2,0.2)); 
                      break;
                  default:
                      //createTextMaterial(data.click_count.toString(), obj, new THREE.Vector3(-0.45,0.2,0.2));  
                      break;

                    
              }
         
          } else {
            alert(data);
          }
        }
      });

}

function InitData() {
  if(model) {
    model.traverse(function (child) {
      
      if(child.isMesh) {
      
        GetObjectInfo1(child.name,child,0);
       
      }
    });
  }
}

const textCanvas = document.createElement( 'canvas' );
function createTextMaterial(text, obj, offset) {
  console.log("1111")
  if(obj.userData.sprite != null) {
    scene.remove(obj.userData.sprite);
    obj.userData.sprite = null;
    console.log("2222")
  } 
  console.log(text)
  console.log(offset);

  textCanvas.height = 20;
  const ctx = textCanvas.getContext( '2d' );
    const font = '20px grobold';

    ctx.font = font;
    textCanvas.width = Math.ceil( ctx.measureText( text ).width + 5 );

    // var width = 3*ctx.measureText(text).width;
    ctx.fillStyle = 'red';
    /// draw background rect assuming height of font
    ctx.fillRect(offset.x, offset.y, textCanvas.width, textCanvas.height);



    ctx.font = font;
    ctx.strokeStyle = 'red';
    
    ctx.lineWidth = 1;
    
    // ctx.lineJoin = 'miter';
    //ctx.miterLimit = 3;

    ctx.strokeText( text, 2, 14 );
    ctx.fillStyle = 'yellow';
    ctx.fillText( text, 2, 14 );

  /// get width of text


    const spriteMap = new THREE.Texture( ctx.getImageData( 0, 0, textCanvas.width, textCanvas.height ) );
    spriteMap.minFilter = THREE.LinearFilter;
    spriteMap.generateMipmaps = false;
    spriteMap.needsUpdate = true;

    const sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: spriteMap } ) );
    sprite.scale.set( 0.2 * textCanvas.width / textCanvas.height, 0.2, 0.5 );
    sprite.position.set(obj.position.x + offset.x, obj.position.y + offset.y, obj.position.z + offset.z) ;
   
    scene.add(sprite);

   // obj.userData.sprite = sprite;
   // sprite.name = "abc-"+text;
    
   // mouseRaycastEvent.addRaycastObject(sprite);
}
//animation
var mixer;
var clock = new THREE.Clock();
var model;
var models = {

    0: "mat_maps.glb",
    1: "mat_metal_rough.glb",
    4: "obj_aircraft.glb",
    5: "obj_plant.glb",
    6: "obj_trangphuc.glb",
    7: "obj_scan.glb",
    8: "envi_kobu.glb",
    9: "envi_farm.glb",
    10: "envi_woodcabin.glb",
    11: "creature_witch.glb",
    12: "creature_cat.glb",
    13: "creature_ocsen.glb",
    14: "char_thanhgiong.glb",
    15: "char_giaovien.glb",
    16: "char_warrior.glb",
  };
  
var enviMap = {

  0: "skybox/royal_esplanade/",
  1: "skybox/royal_esplanade/",
  4: "skybox/reinforced_concrete_02/",
  5: "skybox/solitude_night/",
  6: "skybox/spruit_sunrise/",
  7: "skybox/suburban_parking_area/",
  8: "skybox/sunflowers/",
  9: "skybox/sunny_vondelpark/",
  10: "skybox/reinforced_concrete_02/",
  11: "skybox/neurathen_rock_castle/",
  12: "skybox/christmas_photo_studio/",
  13: "skybox/sunflowers/",
  14: "skybox/colorful_studio/",
  15: "skybox/reinforced_concrete_02/",
  16: "skybox/solitude_night/",
};


LoadModelEnvironment(0);

function removeModelFromScene() {
    scene.remove(model);
    model.traverse(function(child) {
        if(child.isMesh) {
            child.geometry.dispose();
            
            //dispose texture
            if(child.material.map) {
                child.material.map.dispose();
            }

            if(child.material.metalnessMap) {
                child.material.metalnessMap.dispose();
            }

            if(child.material.normalMap) {
                child.material.normalMap.dispose();
            }

            if(child.material.roughnessMap) {
                child.material.roughnessMap.dispose();
            }

            if(child.material.emissiveMap) {
                child.material.emissiveMap.dispose();
            }
            if(child.material.displacementMap) {
              child.material.displacementMap.dispose();
          }

            if(child.material.alphaMap) {
                child.material.alphaMap.dispose();
            }      
        }
    }) 

};

function getParamValue()
{
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    console.log(url);
   
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) 
    {
        var pArr = qArray[i].split('='); //split key and value
        console.log(pArr[0]);
        if (pArr[0] == "session_id")
         {
            session_id= pArr[1]; //return value
            console.log("FOUNDDD session id:");
            console.log(session_id);


         }
    
    }
}
getParamValue();


function OnGetStatisticsClick() {
  
  console.log("111111111111111111111111111111111");

  var reqData = {};
 
  reqData.session_id=session_id;
  
  console.log(reqData);
  $.post("http://eyecheck.vn/test3DAPIs/common/getobjecthistory",
      JSON.stringify(reqData),
      function (data, status) {
        if (status == "success") {
          console.log(data);
          if(data.code == 200) {
             console.log("dddđ");
             var rss=''+data.distinct_click+"/"+data.total_object;
             document.getElementById("id_total_click").innerHTML = data.total_click;
             document.getElementById("id_ratio").innerHTML = rss;
             
             if(data.total_object==data.distinct_click){
                document.getElementById("id_completed").innerHTML = "HOÀN THÀNH 100%";
             }else{
                document.getElementById("id_completed").innerHTML = "";
             }
          } else {
            alert(data);
          }
        }
      });

}
function OnClearDataClick() {
  
  console.log("111111111111111111111111111111111");

  var reqData = {};
  
  reqData.session_id=session_id;
  
  console.log(reqData);

  $.post("http://eyecheck.vn/test3DAPIs/common/clearclickhistory",
      JSON.stringify(reqData),
      function (data, status) {
        if (status == "success") {
          console.log(data);
          if(data.code == 200) {
             
            
             
             alert("Thành công");
          } else {
            alert(data);
          }
        }
      });
  InitData();
}
setInterval(function() {
     //console.log(renderer.info);
     OnGetStatisticsClick();
 }, 4000)



const animate = function () {
  requestAnimationFrame(animate);
  controls.update();

  if (mixer) {
    mixer.update(clock.getDelta());
  }
  mouseRaycastEvent.update();
  renderer.render(scene, camera);
  
  if(camera.userData.newPos != null) {
    camera.position.lerp(camera.userData.newPos, 0.1);

    if(camera.userData.newPos.distanceTo(camera.position) < 0.001) {
      camera.userData.newPos = null;
    }
  }
  
};



container.addEventListener('mousedown', function(e) {
  mouseRaycastEvent.OnMouseDown(e);
}, false)

container.addEventListener('mousemove', function(e){
  mouseRaycastEvent.OnMouseMove(e);
}, false)

container.addEventListener('mouseup', function(e){
  mouseRaycastEvent.OnMouseUp(e);
},false)

animate();


