// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
require("component-leaflet-map");

var zoom = document.getElementById("interactive").offsetWidth > 500 ? 8 : 7;

const mainCD = require("./districts/CD_slim_matched.geo.json");
const prop1 = require("./districts/NewWACongressionalDistricts.geo.json");
// const prop1 = require("./districts/Sims_CD.json");
// const prop2 = require("./districts/Walkinshaw_CD_SHP.json");
// const prop3 = require("./districts/Fain_CD.json");
// const prop4 = require("./districts/Graves_CD.json");


var element = document.querySelector("#map leaflet-map");
var L = element.leaflet;
var map = element.map;

map.options.minZoom = 7;
map.options.maxZoom = 12;

// var elementTwo = document.querySelector("#map2 leaflet-map");
// var Leaf = elementTwo.leaflet;
// var mapTwo = elementTwo.map;


var ich = require("icanhaz");
var templateFile = require("./_popup.html");
var templateFileProp = require("./_popupPro.html");
ich.addTemplate("popup", templateFile);
ich.addTemplate("popupProp", templateFileProp);
var focused = false;

// const colorBlocks = document.querySelectorAll('.color');
// var allSpans = document.querySelector('#legendCon').getElementsByTagName('span');


mainCD.features.forEach(function(f) {
  ["data_Pop_Difference"].forEach(function(prop) {
    f.properties["Diff_string"] = f.properties[prop];
    f.properties[prop] = Number(f.properties[prop].replace(/,/, ""));
    // console.log(parseInt(f.properties[prop]));

  });
});


var arrayLegend = {
  hispanic_per_pop_array: [10,20,30,40,50],
  data_Pop_Difference_array: [-30000,-20000,-10000,0,10000,20000],
  his_pop: "hispanic_per_pop",
  main: "data_Pop_Difference",
  prop1: "#699EBD",
  prop2: "#2167ac",
  prop3: "#dc6b50",
  prop4: "#b2182b",
  main_light: "none"
};

var getColor = function(d, array) {
  var value = d;
  // console.log(value);
  var thisArray = arrayLegend[array];
  let chosenColorArray = orangeArray;

  // for (let h = 0; h < colorBlocks.length; h++) {
  //   colorBlocks[h].style.backgroundColor = chosenColorArray[h];
  // }


  if (typeof value == "string") {
    value = Number(value.replace(/,/, ""));

  }
  if (typeof value != "undefined") {
    return value >= thisArray[5] ? chosenColorArray[6] :
           value >= thisArray[4] ? chosenColorArray[5] :
           value >= thisArray[3] ? chosenColorArray[4] :
           value >= thisArray[2] ? chosenColorArray[3] :
           value >= thisArray[1] ? chosenColorArray[2] :
           value >= thisArray[0]  ? chosenColorArray[1] :
           chosenColorArray[0] ;
  } else {
    return "gray"
  }
};

const commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

// const orangeArray = ['#3A1E00','#703a00', '#bd934c', '#e8d8a8', '#CFECE7', "#51a8a0", "#03524b"];

const orangeArray = ['#bd934c','#bd934c', '#bd934c', '#bd934c', '#bd934c', "#bd934c", "#bd934c"];

const numbers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

function restyleLayer(propertyName) {
  geojson.eachLayer(function(featureInstanceLayer) {
      var propertyValue = featureInstanceLayer.feature.properties[propertyName];
      var colorArray = propertyName + "_array";

      // Your function that determines a fill color for a particular
      // property name and value.
      // console.log(featureInstanceLayer.feature.properties);
      var fillEight = featureInstanceLayer.feature.properties.OBJECTID === 8 ? 0.8 : 0.3;

      var myFillColor = getColor(propertyValue, colorArray);
      featureInstanceLayer.setStyle({
          fillColor: myFillColor,
          opacity: 1,
          color: '#000',
          fillOpacity: fillEight,
          weight: 3
      });
  });
}

function restyleLayerProp(map, propertyName) {
  map.eachLayer(function(featureInstanceLayer) {
      // Your function that determines a fill color for a particular
      // property name and value.
      var fill = featureInstanceLayer.feature.properties.DISTRICTN === 8 ? 0.8 : 0.3;

      featureInstanceLayer.setStyle({
          fillColor: propertyName,
          opacity: 1,
          color: "#3a6a86",
          fillOpacity: fill,
          weight: 3
      });
  });
}


function restyleLayerMainOutline(propertyName) {
  geojson_outline.eachLayer(function(featureInstanceLayer) {
      // Your function that determines a fill color for a particular
      // property name and value.
      featureInstanceLayer.setStyle({
          fillColor: propertyName,
          opacity: 0.8,
          color: '#000',
          fillOpacity: 0.8,
          weight: 3
      });
  });
}


var onEachFeature = function(feature, layer) {
  // layer.bindPopup(ich.popup(feature.properties))
  layer.bindTooltip(`${numbers[feature.properties.OBJECTID - 1]}`, {permanent: true, className: "my-label", direction: "center"});
  layer.on({
    mouseover: function(e) {
      var fillOp8XX = feature.properties.OBJECTID === 8 ? 0.8 : 0.7;
      layer.setStyle({ fillOpacity: fillOp8XX });
    },
    mouseout: function(e) {
      if (focused && focused == layer) { return }
      var fillOp8 = feature.properties.OBJECTID === 8 ? 0.8 : 0.3;
      layer.setStyle({ fillOpacity: fillOp8 });
    }
  });
};

// var onEachFeatureOutline = function(feature, layer) {
//   // layer.bindPopup(ich.popup(feature.properties))
//   layer.on({
//     mouseover: function(e) {
//       layer.setStyle({ fillOpacity: 0.9 });
//     },
//     mouseout: function(e) {
//       if (focused && focused == layer) { return }
//       layer.setStyle({ fillOpacity: 0.7 });
//     }
//   });
// };

var onEachFeatureProp = function(feature, layer) {
  var offsetFour = feature.properties.DISTRICT === "4" ? 35 : 0;
  layer.bindTooltip(`${numbers[feature.properties.DISTRICTN - 1]}`, {permanent: true, className: "my-label", direction: "center", offset: [offsetFour, 0]});
  // layer.bindPopup(ich.popupProp(feature.properties))


  layer.on({
    mouseover: function(e) {
      var fillOpXX = feature.properties.DISTRICTN === 8 ? 0.8 : 0.7;
      layer.setStyle({ weight: 3, fillOpacity: fillOpXX });
    },
    mouseout: function(e) {
      var fillOp = feature.properties.DISTRICTN === 8 ? 0.8 : 0.3;
      if (focused && focused == layer) { return }
      layer.setStyle({ weight: 2, fillOpacity: fillOp });
    }
  });
};


var geojson = L.geoJson(mainCD, {
  onEachFeature: onEachFeature
}).addTo(map);

var geojson_outline = L.geoJson(mainCD, {
  // onEachFeature: onEachFeatureOutline
});

var geojsonPro1 = L.geoJson(prop1, {
  onEachFeature: onEachFeatureProp
});

// var geojsonPro2 = L.geoJson(prop2, {
//   onEachFeature: onEachFeatureProp
// });
//
// var geojsonPro3 = L.geoJson(prop3, {
//   onEachFeature: onEachFeatureProp
// });
//
// var geojsonPro4 = L.geoJson(prop4, {
//   onEachFeature: onEachFeatureProp
// });


var prop_groups = L.layerGroup([geojsonPro1]);

// var newArea = L.tooltip({
//   permanent: true,
//   direction: 'center',
//   className: 'text-new-area'
// })
//   .setContent("ADDED AREA")
//   .setLatLng([47.98987514374749, -121.55]);

document.querySelectorAll(".buttonCon .button").forEach(el => el.addEventListener('click', () => {
  document.querySelectorAll(".buttonCon .button").forEach(el => el.classList.remove("active"));
  el.classList.add("active");

  map.removeLayer(geojson);
  map.removeLayer(geojson_outline);
  map.removeLayer(geojsonPro1);
  // map.removeLayer(geojsonPro2);
  // map.removeLayer(geojsonPro3);
  // map.removeLayer(geojsonPro4);

  if(el.id === "main"){
    // document.querySelector("#legendCon").style.visibility = "visible";
    map.addLayer(geojson);
    restyleLayer(arrayLegend[el.id]);
    // map.removeLayer(newArea);
  } else {
    // document.querySelector("#legendCon").style.visibility = "hidden";
    // restyleLayerMainOutline(arrayLegend["main_light"]);
    map.addLayer(geojson_outline);
    restyleLayerMainOutline(arrayLegend["main_light"]);

    if (el.id === "prop1") {
      map.addLayer(geojsonPro1);
      restyleLayerProp(geojsonPro1, arrayLegend["prop1"]);
      // map.addLayer(newArea);



    } else if (el.id === "prop2") {
      map.addLayer(geojsonPro2);
      restyleLayerProp(geojsonPro2, arrayLegend["prop2"]);
    } else if (el.id === "prop3") {
      map.addLayer(geojsonPro3);
      restyleLayerProp(geojsonPro3, arrayLegend["prop3"]);
    } else if (el.id === "prop4") {
      map.addLayer(geojsonPro4);
      restyleLayerProp(geojsonPro4, arrayLegend["prop4"]);
    } else {};
  }

  // filterMarkers(el.id);
}));


map.setView(new L.LatLng(47.6, -120.997), zoom);

//kick things off//
// filterMarkers("his_vaxx");
restyleLayer(arrayLegend["main"]);
