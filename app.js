//Get user location on the first load
window.onload = getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supporyed by this browser.");
  }
}

function showPosition(position) {
  createMap(position.coords.longitude, position.coords.latitude);
}

function showError(error) {
  if (error.PERMISSION_DENIED) {
    createMap(35.9106, 31.9539);
  }
}

//Loader
document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    setLoader();
  } else {
    removeLoader();
  }
};

const setLoader = () => {
  // document.querySelector("body").style.visibility = "hidden";
  document.querySelector("#loader").style.visibility = "visible";
};
const removeLoader = () => {
  document.querySelector("#loader").style.display = "none";
  // document.querySelector("body").style.visibility = "visible";
};
// Create the map
const createMap = (long, lat) => {
  //Created an account, and we got this accessToken
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaWJyYWhpbXNoYW1tYSIsImEiOiJjbGNlYzFndGw3NXRoM29rZTc5eGNnYmJ6In0.srLY4kPIW_1SDB00dJI1NQ";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: [long, lat], // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
  const storedLayer = localStorage.getItem("layer");
  if (storedLayer) {
    map.setStyle("mapbox://styles/mapbox/" + storedLayer);
  }
  // Create a Marker and add it to the map.
  new mapboxgl.Marker().setLngLat([long, lat]).addTo(map);

  //Map Style Toggle
  const layerList = document.getElementById("menu");
  const inputs = layerList.getElementsByTagName("input");

  for (const input of inputs) {
    storedLayer
      ? input.id === storedLayer
        ? (input.checked = true)
        : (input.checked = false)
      : null;
    input.onclick = (layer) => {
      const layerId = layer.target.id;
      localStorage.setItem("layer", layerId);
      map.setStyle("mapbox://styles/mapbox/" + layerId);
    };
  }
  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());
};

// Create a snackbar message to show up when the city is not found
function alertMessage() {
  var x = document.getElementById("snackbar");
  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
// Get the longitude and latitude for the named city in search bar
const getLongLat = (loc) => {
  return fetch(`https://api.api-ninjas.com/v1/geocoding?city=${loc}`, {
    method: "GET",
    headers: {
      "X-Api-Key": "gRiCsxqzy8vKiqRrDfdFdA==tjFt5aNQXdvkwZZX",
    },
  }).then((response) => response.json());
};

const handleQuery = () => {
  setLoader();
  const loc = document.getElementById("city").value;
  getLongLat(loc)
    .then((data) => {
      // Show snackbar
      if (!data.length) {
        alertMessage();
      } else {
        // Update Map with best location found
        const { longitude, latitude } = data[0];
        createMap(longitude, latitude);
        removeLoader();
      }
    })
    .catch((err) => {
      alertMessage();
    });
  return false;
};
