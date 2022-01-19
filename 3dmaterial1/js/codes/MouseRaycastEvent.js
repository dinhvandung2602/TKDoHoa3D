THREE.MouseRaycastEvent = function (camera) {
    const _camera = camera;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    var mouseDown = new THREE.Vector2();
    var intersects = [];
    var raycastObjects = [];

    function addRaycastObject(obj) {
        raycastObjects.push(obj);
    }

    function OnMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        update();

        if(intersects.length > 0) {
            var objIntersect = intersects[0].object;
            
        } 
    } 

    function OnMouseDown(e) {
        mouseDown.x = e.clientX;
        mouseDown.y = e.clientY;
    }

    function abc(url) {
        $.post(url,
            { 
              "param1": "value1"
            },
            function (data, status) {
              if (status == "success") {
                if(data.code == 200) {
                  
                } else {
                  alert(data);
                }
              }
            });
    }

    /*function GetObjectInfo(object_code, obj) {
  
        console.log(obj);
      
        var reqData = {};
        reqData.object_code= object_code;
        reqData.session_id=session_id;
        
        //reqData.session_id="session_id here";
        $.post("http://localhost:8080/test3DAPIs/common/getobjectinfo",
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
      */
    

    function OnMouseUp(e) {
        if(mouseDown.distanceTo( new THREE.Vector2(e.clientX, e.clientY) ) < 0.01) {
            if(intersects.length > 0) {
                var objIntersect = intersects[0].object;
                var pointClick = intersects[0].point;

                //camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.2, pointClick.z + 0.0);
                //controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                const flag=1;
                GetObjectInfo1(objIntersect.name,objIntersect, flag);


                /*if(objIntersect.name.includes("alpha_blend_matte")) {
                    
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là alpha_blend_matte");
                }
      
                if(objIntersect.name.includes("alpha_clip_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là alpha_clip_matte");
                }
      
                if(objIntersect.name.includes("color_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là color_matte");
                }

                if(objIntersect.name.includes("displacement_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là displacement_matte");
                }
      
                if(objIntersect.name.includes("emission_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là emission_matte");
                }
      
                if(objIntersect.name.includes("metallic_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là metallic_matte");
                }

                if(objIntersect.name.includes("normal_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là normal_matte");
                }
      
                if(objIntersect.name.includes("roughness_matte")) {
                    camera.userData.newPos = new THREE.Vector3(pointClick.x, pointClick.y + 0.5, pointClick.z + 1);
                    controls.target = new THREE.Vector3(pointClick.x, pointClick.y, pointClick.z);
                    alert("Đây là roughness_matte");
                }*/
            }
        }
    }

    function update() {
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, _camera);

        // calculate objects intersecting the picking ray
        intersects = raycaster.intersectObjects(raycastObjects);
    }

    return {
        update: update,
        OnMouseMove: OnMouseMove,
        OnMouseDown : OnMouseDown,
        OnMouseUp : OnMouseUp,
        addRaycastObject : addRaycastObject
    }
}