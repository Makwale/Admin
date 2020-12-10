import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { DeliveryService } from '../services/delivery.service';

declare var mapboxgl: any;
declare var MapboxDirections; 

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
	map;
	lat:number;
	lon:number;
 	direction;
 	coords;
 	zoom = 17;
	bearing = -12;
	pitch = 60;
	geolocate;

  constructor(private deliveryService: DeliveryService, private dbs: DatabaseService) { }

  ngOnInit() {

 
  }

  ionViewDidEnter(){
  	this.showMap(12, 0, 0)

  }

  locate(){
   // console.log(this.deliveryService.order.data.coordsOr)
   	

    this.direction.setOrigin([this.lon, this.lat]);
    this.direction.setDestination(this.deliveryService.order.data.coordsOr);
    this.dbs.updateDirection([this.lon, this.lat]);
    //this.map.setBearing(180);
  //  this.map.setPitch(60);
   // this.map.setZoom(17);

   
  }

  showMap(zoom, bearing, pitch){
  	mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsbWFrd2FsZSIsImEiOiJja2hsc3lmYWUyZzRnMnRsNnY2NWIyeGR6In0.1MGnfpXj_dV2QBO3SchfqA';
  	
  	navigator.geolocation.getCurrentPosition( pos =>{
 		this.lat = pos.coords.latitude;
 		this.lon = pos.coords.longitude;
      this.coords = pos.coords;
 		this.map = new mapboxgl.Map({
	        container: 'map',
	        countries: 'za',
	        style: 'mapbox://styles/mapbox/dark-v10',
	        center: [this.lon, this.lat],
	        zoom: zoom,
	        bearing: bearing,
	        pitch: pitch
			});

			
		

   	 	this.map.addControl(new mapboxgl.NavigationControl());
   	 	
   	 	this.direction =  new MapboxDirections({
		      accessToken: mapboxgl.accessToken,
		      profile: "mapbox/driving",
		      alternatives: true,
		      congestion: true,
		      unit: "metric",
		      controls: {instructions: false}
		  })

		this.map.addControl(this.direction,'bottom-left');
      
  
		this.map.addControl(new mapboxgl.FullscreenControl());

		this.geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true,
			showUserLocation: true,
			showAccuracyCircle: true
		})
	
		this.map.addControl(this.geolocate);
		this.geolocate.on('geolocate', () =>{
			
	
			navigator.geolocation.getCurrentPosition( pos =>{
			
				this.lat = pos.coords.latitude;
				this.lon = pos.coords.longitude;
		
				var marker = new mapboxgl.Marker();
 
				let animateMarker = (timestamp) =>{
					var radius = 20;
			
			// Update the data to a new position based on the animation timestamp. The
			// divisor in the expression `timestamp / 1000` controls the animation speed.
					marker.setLngLat([
						pos.coords.longitude, pos.coords.latitude
					]);
			
				// Ensure it's added to the map. This is safe to call if it's already added.
						marker.addTo(this.map);
				
			// Request the next frame of the animation.
					requestAnimationFrame(animateMarker);
					marker.remove();
			}
 
// Start the animation.
			requestAnimationFrame(animateMarker);
	
				this.dbs.updateDirection([pos.coords.longitude, pos.coords.latitude]);
				
			})
	
			
	
		});


		
		
	 })
	 
	 

  }

  updatePoint(lat, lon){
	 
	

  }

}
