import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

// Canvas
const canvas = document.querySelector(".webgl");

// essential variables
let poster_Plane;
let tv9_Plane;
let next_button;
let plane_1;
let plane_2;
let plane_3;
let plane_4;
let plane_5;
let back_Button = document.querySelector("#back_Button");

// Scene
const scene = new THREE.Scene();

// Camera parameters
const fov = 27;
const aspectRatio = window.innerWidth / window.innerHeight;
const near = 0.6;
const far = 10000;

// Camera
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
camera.position.set(-40, 20, 50);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//
// //------------ Loading Manager
//
const progressText = document.querySelector("label.progress-bar");
const progressContainer = document.querySelector("div.progress-bar-container");
const progressBar = document.querySelector("progress#progress-bar");
const wrapper = document.querySelector(".wrapper");
const background = document.querySelector(".background");

let loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  setTimeout(() => {
    progressText.innerText = "Loading Assets...";
  }, 1000);
};

loadingManager.onLoad = function () {
  progressText.innerText = "Constructing Experience...";
  setTimeout(() => {
    progressContainer.style.display = "none";
    background.style.display = "none";
    wrapper.style.display = "none"; // Hide the cube and text after loading
  }, 50);
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  let progressPercentage = Math.round((itemsLoaded / itemsTotal) * 100);
  progressBar.value = progressPercentage / 100;
};

loadingManager.onError = function (url) {
  console.log("There was an error loading " + url);
};

// font loader //
let font_Loader = new FontLoader(loadingManager);

// text for welcome //
font_Loader.load("Noto Serif_Italic.json", function (font) {
  let text_Geometry = new TextGeometry("Welcome !!! To ", {
    font: font,
    size: 0.7,
    height: 0.2,
    curveSegments: 16,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 1,
  });

  // Create a standard material with red color and 50% gloss
  const text_Material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ff0000"),
    roughness: 0.5,
  });

  // Geometries are attached to meshes so that they get rendered
  const textMesh = new THREE.Mesh(text_Geometry, text_Material);
  // Update positioning of the text
  textMesh.position.set(9.7, 7, 4.5);
  textMesh.rotation.y = -Math.PI / 2;

  // textMesh.layers.enable(BLOOM_SCENE);
  scene.add(textMesh);
});

// text for to thiloshna portifolio //
font_Loader.load("Noto Serif_Italic.json", function (font) {
  let text_Geometry2 = new TextGeometry("Thiloshna Portifolio", {
    font: font,
    size: 0.6,
    height: 0.2,
    curveSegments: 16,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 1,
  });

  // Create a standard material with red color and 50% gloss
  const text_Material2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ff0000"),
    roughness: 0.5,
  });

  // Geometries are attached to meshes so that they get rendered
  const textMesh_2 = new THREE.Mesh(text_Geometry2, text_Material2);
  // Update positioning of the text
  textMesh_2.position.set(9.7, 5, 5.5);
  textMesh_2.rotation.y = -Math.PI / 2;
  // textMesh.layers.enable(BLOOM_SCENE);
  scene.add(textMesh_2);
});

//model  Loader
const loader = new GLTFLoader(loadingManager);
let room;

loader.load(
  "models/gaming_room (1).glb",
  function (gltf) {
    room = gltf.scene;
    room.position.set(0, -9, 0);
    room.rotation.y = Math.PI / 2;

    console.log(room.children);

    scene.add(room);

    // Define dimensions for planes associated with specific children
    const planes = {};
    const planesData = [
      {
        name: "Object_25",
        width: 3.7,
        height: 4.8,
      },
      {
        name: "Object_22",
        width: 0.57,
        height: 0.35,
      },
      {
        name: "Object_91",
        width: 0.16,
        height: 0.25,
      },
      {
        name: "Object_287",
        width: 0.57,
        height: 0.35,
      },
      {
        name: "Object_290",
        width: 0.57,
        height: 0.35,
      },
    ];

    // Iterative function to traverse the hierarchy of children
    room.traverse((child) => {
      // Check if the child matches any of the specified names
      const planeData = planesData.find((data) => data.name === child.name);
      if (planeData) {
        // Create a plane with the specified dimensions
        const planeGeometry = new THREE.PlaneGeometry(
          planeData.width,
          planeData.height
        );
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // Set the position and rotation of the plane to match the child
        plane.position.copy(child.position);
        plane.rotation.copy(child.rotation);
        plane.position.y = -0.3;
        plane.position.z = 0.005;

        // Adjust position if needed (e.g., move it slightly above the child)
        plane.position.y += 0.3;

        // Add the plane as a child of the current child object
        child.add(plane);
        planes[child.name] = plane;
      }
    });

    poster_Plane = planes["Object_25"];
    poster_Plane.position.set(-0.3, -0.1, -0.3);
    poster_Plane.rotation.y = -Math.PI / 2;
    poster_Plane.rotateX(-Math.PI / 14);

    const book_Plane = planes["Object_91"];
    book_Plane.rotation.x = -Math.PI / 2;
    book_Plane.rotation.y = Math.PI;

    book_Plane.position.y = -0.01;

    tv9_Plane = planes["Object_22"];
    tv9_Plane.material.color.set(0x000000);

    // Find the object named "Object_7"
    let frame_1 = scene.getObjectByName("Object_7");

    if (frame_1) {
      frame_1.material.color.set(0x32012f);
    } else {
      console.error("Object_7 not found in the scene.");
    }

    // creating plane for icons //
    const plane1_Geo = new THREE.PlaneGeometry(0.3, 0.3);
    const plane1_Mrt = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });
    plane_1 = new THREE.Mesh(plane1_Geo, plane1_Mrt);
    plane_1.position.set(8.5, 0.8, 2.6);
    plane_1.rotation.y = -Math.PI / 2;
    scene.add(plane_1);

    const plane2_Geo = plane1_Geo.clone();
    const plane2_Mrt = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });

    plane_2 = new THREE.Mesh(plane2_Geo, plane2_Mrt);
    plane_2.rotation.y = -Math.PI / 2;
    plane_2.position.set(8.5, 0.2, 2.6);
    scene.add(plane_2);

    const plane3_Geo = plane1_Geo.clone();
    const plane3_Mrt = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });

    plane_3 = new THREE.Mesh(plane3_Geo, plane3_Mrt);
    plane_3.rotation.y = -Math.PI / 2;
    plane_3.position.set(8.5, -0.4, 2.6);
    scene.add(plane_3);

    const plane4_Geo = plane1_Geo.clone();
    const plane4_Mrt = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });

    plane_4 = new THREE.Mesh(plane4_Geo, plane4_Mrt);
    plane_4.rotation.y = -Math.PI / 2;
    plane_4.position.set(8.5, -0.9, 2.6);
    scene.add(plane_4);

    const plane5_Geo = plane1_Geo.clone();
    const plane5_Mrt = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    });

    plane_5 = new THREE.Mesh(plane5_Geo, plane5_Mrt);
    plane_5.rotation.y = -Math.PI / 2;
    plane_5.position.set(8.5, -1.5, 2.6);

    scene.add(plane_5);

    // loading texture for a moniter //

    // monitor 1 //
    const texture_loader = new THREE.TextureLoader(loadingManager);
    texture_loader.load("assets/desktop 2.jpg", function (texture) {
      const monitor_1 = planes["Object_287"];
      if (monitor_1) {
        // Update the material of the plane with the loaded texture
        monitor_1.material.map = texture;
        monitor_1.material.needsUpdate = true; // Ensure the material is updated
      }
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    // monitor 2 //

    texture_loader.load(
      "assets/Screenshot 2024-07-24 143705.png",
      function (texture_2) {
        const monitor_2 = planes["Object_290"];
        if (monitor_2) {
          // Update the material of the plane with the loaded texture
          monitor_2.material.map = texture_2;
          monitor_2.material.needsUpdate = true; // Ensure the material is updated
        }
        texture_2.colorSpace = THREE.SRGBColorSpace;
      }
    );

    // book texture //

    texture_loader.load("assets/poster.png", function (texture_3) {
      if (poster_Plane) {
        // Update the material of the plane with the loaded texture
        poster_Plane.material.map = texture_3;
        poster_Plane.material.needsUpdate = true; // Ensure the material is updated
      }
      texture_3.colorSpace = THREE.SRGBColorSpace;
    });

    // poster texture - about me //

    texture_loader.load("assets/bookcover.png", function (texture_4) {
      const bookCover = planes["Object_91"];
      if (bookCover) {
        // Update the material of the plane with the loaded texture
        bookCover.material.map = texture_4;
        bookCover.material.needsUpdate = true; // Ensure the material is updated
      }
      texture_4.colorSpace = THREE.SRGBColorSpace;
    });

    // textures for icons //

    // about me //

    texture_loader.load("icons/about.png", function (texture_5) {
      if (plane_1) {
        plane_1.material.map = texture_5;
        plane_1.material.needsUpdate = true;
      }
      texture_5.colorSpace = THREE.SRGBColorSpace;
    });

    // Skills //

    texture_loader.load("icons/skills.png", function (texture_5) {
      if (plane_2) {
        plane_2.material.map = texture_5;
        plane_2.material.needsUpdate = true;
      }
      texture_5.colorSpace = THREE.SRGBColorSpace;
    });

    // projects //

    texture_loader.load("icons/project.png", function (texture_6) {
      if (plane_3) {
        plane_3.material.map = texture_6;
        plane_3.material.needsUpdate = true;
      }
      texture_6.colorSpace = THREE.SRGBColorSpace;
    });

    // resume //

    texture_loader.load("icons/resume.png", function (texture_7) {
      if (plane_4) {
        plane_4.material.map = texture_7;
        plane_4.material.needsUpdate = true;
      }
      texture_7.colorSpace = THREE.SRGBColorSpace;
    });

    // Contact me //

    texture_loader.load("icons/contact.png", function (texture_8) {
      if (plane_5) {
        plane_5.material.map = texture_8;
        plane_5.material.needsUpdate = true;
      }
      texture_8.colorSpace = THREE.SRGBColorSpace;
    });
  },

  undefined,
  function (error) {
    console.error(error);
  }
);

//
// frame
//
let frame;
loader.load(
  "models/frame.glb",
  function (gltf) {
    frame = gltf.scene;
    console.log(frame);
    frame.position.set(-19.6, 7.6, -10.8);
    frame.scale.set(3, 3, 3);
    console.log(frame.children);
    scene.add(frame);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//
// headphones
//
let headphone;
loader.load(
  "models/headphones.glb",
  function (gltf) {
    headphone = gltf.scene;
    console.log(headphone);
    headphone.position.set(4, -2.5, 15);
    headphone.scale.set(0.5, 0.5, 0.5);
    headphone.rotation.x = -Math.PI / 2;
    console.log(headphone.children);
    scene.add(headphone);
  },

  undefined,
  function (error) {
    console.error(error);
  }
);

//
// vr headset
//
let vr_Headset;
loader.load(
  "models/vr headset.glb",
  function (gltf) {
    vr_Headset = gltf.scene;
    vr_Headset.position.set(8, -2.5, 14);
    vr_Headset.scale.set(2, 2, 2);
    // vr_Headset.rotation.x = -Math.PI / 2;
    console.log(vr_Headset.children);
    scene.add(vr_Headset);
  },

  undefined,
  function (error) {
    console.error(error);
  }
);

//
// bears
//
let Bears;
loader.load(
  "models/bears.glb",
  function (gltf) {
    Bears = gltf.scene;
    console.log(Bears.children);
    Bears.position.set(-12, -4, -6);
    Bears.scale.set(1.5, 1.5, 1.5);
    // Bears.rotation.x = -Math.PI / 2;
    console.log(Bears.children);
    scene.add(Bears);
  },

  undefined,
  function (error) {
    console.error(error);
  }
);

//
// next button
//
next_button;
loader.load(
  "models/direction_arrow.glb",
  function (gltf) {
    next_button = gltf.scene.children[0];
    next_button.position.set(9.5, 3.5, 12.5);
    console.log(next_button);
    next_button.scale.set(0.5, 0.5, 0.5);
    next_button.rotation.x = Math.PI;
    next_button.rotation.y = Math.PI / 2;

    // Function to recursively set the color of all materials
    const setColor = (object, color) => {
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => {
            if (mat.color) mat.color.set(color);
          });
        } else {
          if (object.material.color) object.material.color.set(color);
        }
      }
      if (object.children) {
        object.children.forEach((child) => setColor(child, color));
      }
    };

    setColor(next_button, new THREE.Color(0xff0000));

    // next_button.material.color.set(0xff0000);
    console.log(next_button.children);
    scene.add(next_button);
  },

  undefined,
  function (error) {
    console.error(error);
  }
);

// Define a raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle mouse click events
function onMouseClick(event) {
  // Calculate mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    console.log("Intersected object:", object);

    // Check if the clicked object has a specific name
    if (object.name === "Object_7001") {
      console.log("Clicked on LinkedIn link");
      window.open(
        "https://www.linkedin.com/in/thiloshna-peela-8339a424a/",
        "_blank"
      );
    } else if (object.name === "Object_5001" || object.name === "Object_7002") {
      console.log("Clicked on Github");
      window.open("https://github.com/THILOSHNA", "_blank");
    } else if (object.name === "Object_7") {
      console.log("Clicked on Gmail");
      window.open("mailto:peelathiloshna@gmail.com", "_blank");
    } else if (object.name === "Arrow_Material001_0") {
      console.log("Clicked on next button model");

      gsap.to(controls.target, {
        duration: 1,
        x: 36,
        y: -2,
        z: 15,
        onUpdate: function () {
          controls.update();
        },
      });

      gsap.to(camera.position, {
        x: -1,
        y: -0.43,
        z: 2,
        duration: 0.9,
      });

      // Display the back button
      console.log("Showing back button");
      back_Button.style.display = "block";

      back_Button.addEventListener("click", handleBackButtonClick);

      // back_Button.addEventListener("click", () => {
      //   console.log("ok");
      // });
    } else if (object === tv9_Plane) {
      console.log("clicked on tv plane");

      gsap.to(controls.target, {
        duration: 1,
        x: -2,
        y: 5.2,
        z: 5.6,
        onUpdate: function () {
          controls.update();
        },
      });
      gsap.to(camera.position, {
        x: -8,
        y: 5.2,
        z: 5.6,
        duration: 0.9,
      });
    } else if (object === plane_1) {
      console.log("clicked on about me");
      gsap.to(controls.target, {
        duration: 1,
        x: -14.5,
        y: 7.5,
        z: -5.8,
        onUpdate: function () {
          controls.update();
        },
      });
      gsap.to(camera.position, {
        x: -14,
        y: 9.7,
        z: 4.1,
        duration: 1,
      });

      back_Button.style.display = "block";

      back_Button.addEventListener("click", handleBackButtonClick_2);
    } else if (object === plane_2) {
      console.log("clicked on skills");
      gsap.to(controls.target, {
        duration: 1,
        x: 4.4,
        y: 8.8,
        z: 0.04,
        onUpdate: function () {
          controls.update();
        },
      });
      gsap.to(camera.position, {
        x: 3.4,
        y: 9.3,
        z: 1.3,
        duration: 1,
      });

      back_Button.style.display = "block";

      back_Button.addEventListener("click", handleBackButtonClick_2);
    } else if (object === plane_3) {
      console.log("clicked on projects");
      gsap.to(controls.target, {
        duration: 1,
        x: 3.5,
        y: 0.32,
        z: 8.66,
        onUpdate: function () {
          controls.update();
        },
      });
      gsap.to(camera.position, {
        x: 0.47,
        y: 0.9,
        z: 7.8,
        duration: 1,
      });

      back_Button.style.display = "block";

      back_Button.addEventListener("click", handleBackButtonClick_2);
    } else if (object === plane_5) {
      console.log("clicked on contact");
      gsap.to(controls.target, {
        duration: 1,
        x: -21,
        y: 13.1,
        z: -2.4,
        onUpdate: function () {
          controls.update();
        },
      });
      gsap.to(camera.position, {
        x: -20.6,
        y: 14.5,
        z: 4.5,
        duration: 1,
      });
      back_Button.style.display = "block";

      back_Button.addEventListener("click", handleBackButtonClick_2);
    } else if (object === plane_4) {
      console.log("clicked on document link");
      window.open("assets/resume.pdf", "_blank");
    } else if (object.name === "Object_157") {
      console.log("clicked on audio link");
      const audio = document.querySelector("#audio");
      if (audio) {
        audio.play();
      } else {
        console.error("Audio element not found");
      }
    }
  } else {
    console.log("No intersection with frame children");
  }
}

// Function to handle back button click event for monitor 1
function handleBackButtonClick() {
  console.log("Back button clicked");

  gsap.to(controls.target, {
    duration: 1,
    x: 0,
    y: 0,
    z: 0,
    onUpdate: function () {
      controls.update();
    },
  });

  gsap.to(camera.position, {
    x: -40,
    y: 20,
    z: 50,
    duration: 0.9,
  });

  console.log("Hiding back button");
  back_Button.style.display = "none";
}

// Function to handle back button click event for options in monitor 1

function handleBackButtonClick_2() {
  gsap.to(controls.target, {
    duration: 1,
    x: 36,
    y: -2,
    z: 15,
    onUpdate: function () {
      controls.update();
    },
  });

  gsap.to(camera.position, {
    x: -1,
    y: -0.43,
    z: 2,
    duration: 0.9,
  });

  console.log("Hiding back button");
}
// Ensure the back button is properly styled
back_Button.style.position = "absolute";
back_Button.style.bottom = "10px";
back_Button.style.left = "10px";
back_Button.style.padding = "10px 20px";
back_Button.style.color = "#ffffff";
back_Button.style.border = "none";
back_Button.style.cursor = "pointer";
back_Button.style.zIndex = "1000";

// Ensure the button is added to the DOM if not already present
if (!document.body.contains(back_Button)) {
  document.body.appendChild(back_Button);
}

// Event listener for mouse clicks
window.addEventListener("click", onMouseClick, false);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x3572ef, 1);
scene.add(ambientLight);

// Directional Light
const directionLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionLight);

// point Light
const point_light = new THREE.PointLight(0xffc0cb, 20, 10, Math.PI / 4);
point_light.position.set(-20, 11, -7);
scene.add(point_light);

// const pointLightHelper = new THREE.PointLightHelper(point_light);
// scene.add(pointLightHelper);

const point_light2 = new THREE.PointLight(0xff0000, 300, 9, Math.PI / 4);
point_light2.position.set(10, 5, 5);
scene.add(point_light2);

// const pointLightHelper_2 = new THREE.PointLightHelper(point_light2);
// scene.add(pointLightHelper_2);

const point_light3 = new THREE.PointLight(0x0000ff, 30, 10, Math.PI / 2);
point_light3.position.set(9, 3, 12);
scene.add(point_light3);

// const pointLightHelper_3 = new THREE.PointLightHelper(point_light3);
// scene.add(pointLightHelper_3);

// const point_light4 = new THREE.PointLight(0xaf47d2, 5, 5, Math.PI / 4);
// point_light4.position.set(7, -1, 6.5);
// scene.add(point_light4);

// const pointLightHelper_4 = new THREE.PointLightHelper(point_light4);
// scene.add(pointLightHelper_4);

//rectarea light

const rectarea_light = new THREE.RectAreaLight(0xd90166, 50, 40, 0.5);
scene.add(rectarea_light);

rectarea_light.position.set(-5, 15, -11);
rectarea_light.rotation.x = -Math.PI / 2;

// const rectareaLightHelper = new RectAreaLightHelper(rectarea_light);
// scene.add(rectareaLightHelper);

const rectarea_light2 = new THREE.RectAreaLight(0xd90166, 50, 25, 0.5);
scene.add(rectarea_light2);

rectarea_light2.position.set(-24, 4, -11);
rectarea_light2.rotation.z = -Math.PI / 2;
rectarea_light2.rotation.y = -Math.PI / 2;

// const rectareaLightHelper_2 = new RectAreaLightHelper(rectarea_light2);
// scene.add(rectareaLightHelper_2);

const rectarea_light3 = new THREE.RectAreaLight(0xd90166, 50, 40, 0.5);
scene.add(rectarea_light3);

rectarea_light3.position.set(-24, -8, 7);
rectarea_light3.rotation.y = -Math.PI / 2;

// const rectareaLightHelper_3 = new RectAreaLightHelper(rectarea_light3);
// scene.add(rectareaLightHelper_3);

const rectarea_light4 = new THREE.RectAreaLight(0xd90166, 50, 50, 0.2);
scene.add(rectarea_light4);

rectarea_light4.position.set(0, -8, 27);
rectarea_light4.rotation.x = -Math.PI / 4;

const rectarea_light5 = new THREE.RectAreaLight(0xd90166, 50, 26, 0.2);

scene.add(rectarea_light5);

rectarea_light5.position.set(23, 3, 27);
rectarea_light5.rotation.z = -Math.PI / 2;
rectarea_light5.rotation.y = Math.PI / 4;

// const rectareaLightHelper_5 = new RectAreaLightHelper(rectarea_light5);
// scene.add(rectareaLightHelper_5);

const rectarea_light6 = new THREE.RectAreaLight(0xd90166, 80, 15, 0.2);
scene.add(rectarea_light6);

rectarea_light6.position.set(22.5, 14.8, 20);
rectarea_light6.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
// rectarea_light6.rotation.z = -Math.PI / 2;

// const rectareaLightHelper_6 = new RectAreaLightHelper(rectarea_light6);
// scene.add(rectareaLightHelper_6);

const rectarea_light7 = new THREE.RectAreaLight(0xd90166, 50, 13, 0.2);
scene.add(rectarea_light7);

rectarea_light7.position.set(17.1, 14.8, 17);
rectarea_light7.rotation.x = -Math.PI / 2;
const rectarea_light8 = new THREE.RectAreaLight(0xd90188, 80, 30, 0.5);
scene.add(rectarea_light8);

rectarea_light8.position.set(11, 14.8, 2);
rectarea_light8.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);

// const rectareaLightHelper_8 = new RectAreaLightHelper(rectarea_light8);
// scene.add(rectareaLightHelper_8);
// Window resize handler
window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping
controls.dampingFactor = 0.05; // Adjust the damping factor (lower values = more damping)
controls.update(); // Ensure the controls are up to date
// controls.minDistance = 23;
// controls.maxDistance = 70;
// controls.minPolarAngle = Math.PI * 0.3;
// controls.maxPolarAngle = Math.PI * 0.46;

// Animation loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  // console.log(camera.position);
  requestAnimationFrame(animate);
}

animate();
