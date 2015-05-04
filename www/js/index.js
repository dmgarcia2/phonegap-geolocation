"use strict";

// Variables para la creación del mapa y el marcador
var map;
var markers;
var size = new OpenLayers.Size(21, 25);
var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);

// Identificador usado para registrar un listener de posición
var watchID = null;

var phonegap = {};

phonegap.app = {
	
    initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        StatusBar.hide();
		FastClick.attach(document.body);
        
        // Inicialización del mapa
        map = new OpenLayers.Map({
            div: "map",
            controls: [
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                })
            ],
            layers: [
                new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                    transitionEffect: "resize"
                })
            ],
            center: new OpenLayers.LonLat(0, 0),
            zoom: 5
        });
        markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
    },

    getPosicionActual: function() {
        navigator.geolocation.getCurrentPosition(phonegap.app.onSuccess, phonegap.app.onError, {
            enableHighAccuracy: true
        });
    },

    onSuccess: function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        markers.clearMarkers();
        var lonLat = (
            new OpenLayers.LonLat(long, lat)).transform(new OpenLayers.Projection("EPSG:4326"),
                                                        map.getProjectionObject());
        markers.addMarker(new OpenLayers.Marker(lonLat, icon.clone()));
        map.setCenter(lonLat);
    },

    onError: function(error) {
        alert(error.message);
    },

    registerPositionListener: function() {
        if (watchID == null) {
            watchID = navigator.geolocation.watchPosition(phonegap.app.onWatchSuccess, phonegap.app.onWatchError, {
                enableHighAccuracy: true
            });
        }
    },

    onWatchSuccess: function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        markers.clearMarkers();
        var lonLat = (new OpenLayers.LonLat(long, lat)).transform(new OpenLayers.Projection("EPSG:4326"),
                                                                  map.getProjectionObject());
        markers.addMarker(new OpenLayers.Marker(lonLat, icon.clone()));
        map.setCenter(lonLat);
    },

    onWatchError: function(error) {
        alert(error.message);
    },

    unregisterPositionListener: function() {
        if (watchID != null) {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
        }
    }
};
