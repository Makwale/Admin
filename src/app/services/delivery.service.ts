import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  
  order;
  constructor() { }

  setOrder(order) {
    this.order = order;
  }
}
