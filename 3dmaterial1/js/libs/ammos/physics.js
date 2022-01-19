Ammo.Physics = function () {
    var loaded = false, debug = false;
    var tmpTrans, tmpPos, tmpQuat, ammoTmpPos, ammoTmpQuat;
    var physicsWorld, rigidBodies = [];

    Ammo().then(start)
    function start() {
        tmpTrans = new Ammo.btTransform();
        tmpPos = new THREE.Vector3();
        tmpQuat = new THREE.Quaternion();
        ammoTmpPos = new Ammo.btVector3();
        ammoTmpQuat = new Ammo.btQuaternion();

        setupPhysicsWorld();
    }
    function setupPhysicsWorld() {
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
            overlappingPairCache = new Ammo.btDbvtBroadphase(),
            solver = new Ammo.btSequentialImpulseConstraintSolver();

        physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

        console.log("Physic world init");
        loaded = true;
    }
//=============================================================================//
    function update(deltaTime) {
        // Step world
        physicsWorld.stepSimulation(deltaTime, 10);
        // Update rigid bodies
        for (let i = 0; i < rigidBodies.length; i++) {
            let objThree = rigidBodies[i];
            let objAmmo = objThree.userData.physicsBody;
            let ms = objAmmo.getMotionState();
            if (ms) {
                ms.getWorldTransform(tmpTrans);
                let p = tmpTrans.getOrigin();
                //let q = tmpTrans.getRotation();
                objThree.position.set(p.x(), p.y() - objThree.userData.colliderOffset, p.z());
                //objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
//=============================================================================//
    function createRigidbody(object, shape, mass, params){
        let colShape, margin = 0.05, friction = 4, rollFriction = 5;
        //=============================================================//
        if (debug)               { createHelper(object, shape, params); }
        if (params.friction)     { friction = params.friction; }
        if (params.rollFriction) { rollFriction = params.rollFriction; }
        if (shape == "Sphere")   { colShape = new Ammo.btSphereShape(params.radius); }
        else                     { colShape = new Ammo.btBoxShape(new Ammo.btVector3(params.width * 0.5, params.height * 0.5, params.depth * 0.5)); }
        //=============================================================//
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setRotation(new Ammo.btQuaternion(params.quaternion.x, params.quaternion.y, params.quaternion.z, params.quaternion.w));
        transform.setOrigin(new Ammo.btVector3(params.position.x, params.position.y, params.position.z));
        let motionState = new Ammo.btDefaultMotionState(transform);
        colShape.setMargin(margin);
        let localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);
        //=============================================================//
        body.setFriction(friction);
        body.setRollingFriction(rollFriction);
        if(mass > 0){
            body.setActivationState(STATE.DISABLE_DEACTIVATION);
            object.userData.physicsBody = body;
            rigidBodies.push(object);
            console.log(body);
        }
        else if (params.isKinematic){
            body.setActivationState(STATE.DISABLE_DEACTIVATION);
            body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
            object.userData.physicsBody = body;
        }
        //=============================================================//
        physicsWorld.addRigidBody(body);
    }
    function createHelper(object, shape, params) {
        let colShape = new THREE.Object3D();
        if (shape == "Sphere")  { colShape = new THREE.Mesh(new THREE.SphereGeometry(params.radius, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })); }
        else                    { colShape = new THREE.Mesh(new THREE.BoxGeometry(params.width, params.height, params.depth), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })); }

        if (object) {
            colShape.position.set(0, object.userData.colliderOffset * 1 / object.scale.y, 0);
            colShape.scale.set(1 / object.scale.x, 1 / object.scale.y, 1 / object.scale.z);
            object.add(colShape);
        }
        else {
            colShape.position.set(params.position.x, params.position.y, params.position.z);
            colShape.quaternion.set(params.quaternion.x, params.quaternion.y, params.quaternion.z, params.quaternion.w);
            scene.add(colShape);
        }
    }
//=============================================================================//
    function moveInDirection(object, direction, speed) {
        let resultantImpulse = new Ammo.btVector3(direction.x, direction.y, direction.z);
        resultantImpulse.op_mul(speed);

        let physicsBody = object.userData.physicsBody;
        if(physicsBody.getCollisionFlags() == 2) { physics.setType(object, "Dynamic"); }
        physicsBody.setLinearVelocity(resultantImpulse);
    }
    function applyForceInDirection(object, direction, speed){
        let force = new Ammo.btVector3(direction.x, direction.y, direction.z);
        force.op_mul(speed);

        let physicsBody = object.userData.physicsBody;
        if(physicsBody.getCollisionFlags() == 2) { physics.setType(object, "Dynamic"); }
        physicsBody.applyForce(force, object.position.clone());
    }
    function setKPosition(object, pos) {
        let physicsBody = object.userData.physicsBody;
        if(physicsBody.getCollisionFlags() == 0) { physics.setType(object, "Kinematic"); }
        
        object.position.set(pos.x, pos.y, pos.z);
        object.getWorldPosition(tmpPos);
        object.getWorldQuaternion(tmpQuat);

        let ms = physicsBody.getMotionState();
        if (ms) {
            ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
            ammoTmpQuat.setValue(tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

            tmpTrans.setIdentity();
            tmpTrans.setOrigin(ammoTmpPos);
            tmpTrans.setRotation(ammoTmpQuat);
            ms.setWorldTransform(tmpTrans);
        }
    }
//=============================================================================//
    function setDebug(bool) { debug = bool; }
    function setType(object, name) {
        if(name == "Kinematic") { object.userData.physicsBody.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT); }
        if(name == "Dynamic")   { object.userData.physicsBody.setCollisionFlags(FLAGS.CF_DYNAMIC_OBJECT); }
    }
    return {
        setDebug: setDebug,
        update: update,
        createRigidbody: createRigidbody,
        setLinearVelocity: moveInDirection,
        setPosition: setKPosition,
        setType: setType,
        applyForce: applyForceInDirection,
        loaded: loaded
    }
}
