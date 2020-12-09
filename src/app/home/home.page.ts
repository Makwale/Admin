import { Route } from '@angular/compiler/src/core';
import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { DeliveryService } from '../services/delivery.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  orders = [];
  customer;
  constructor(private dbs: DatabaseService, private router: Router, private deviveyService: DeliveryService) {}
  ngOnInit(): void {
    this.orders = this.dbs.getOrders();
   
  }

  upadeStatus(id,status){
  	this.dbs.updateOrderStatus(id,status)
  }

  navigateToMap(order){
    this.deviveyService.setOrder(order);
    this.router.navigateByUrl("map");
  }



}
