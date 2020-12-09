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

  constructor(private deliveryService: DeliveryService, private dbs: DatabaseService) { }

  ngOnInit() {

   
  }

  ionViewDidEnter(){
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
	        zoom: 12,
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

		let geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true,
			showUserLocation: true,
			showAccuracyCircle: true
		})
	
		this.map.addControl(geolocate);
		
		geolocate.on('geolocate', function() {
			
			navigator.geolocation.getCurrentPosition( pos =>{
				this.lat = pos.coords.latitude;
				this.lon = pos.coords.longitude;
				console.log(pos.coords);
				alert(pos.coords.latitude + " " + pos.coords.longitude)
				// this.dbs.updateDirection([this.lon, this.lat]);
			})

		});

 	})

  }

  locate(){
   // console.log(this.deliveryService.order.data.coordsOr)
    this.direction.setOrigin([this.lon, this.lat]);
    this.direction.setDestination(this.deliveryService.order.data.coordsOr);
    this.dbs.updateDirection([this.lon, this.lat]);
     
   
  }



}
