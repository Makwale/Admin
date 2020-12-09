import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, 
  AngularFirestoreCollection,
   AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { DeliveryService } from './delivery.service';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  

  orders = []
  order = {};
  items = [];
  item = {};

  constructor(private afs: AngularFirestore, private deliveryService: DeliveryService) { 
 
  }
  

  private getOrdersFromDatabase(){
    this.afs.collection("Order").snapshotChanges().subscribe(data =>{
      let index = 0;
        for(let order of data){
        

          let orderData = order.payload.doc.data();
          let orderId = order.payload.doc.id;

          this.order["data"] = orderData;
          this.order["id"] = orderId;

          this.afs.collection("Item", ref => ref.where("oRef" , "==" , `${orderId}`)).snapshotChanges().subscribe( data2 =>{
            for(let item of data2){

              let itemData = item.payload.doc.data();
              let itemId = item.payload.doc.id;


              this.afs.collection("Prod").doc(itemData["prodRef"]).valueChanges().subscribe( data => {
                this.item["data"] = itemData;
                this.item["id"] = itemId;
                this.item["product"] = data;
                
                this.items.push(this.item);
              
                this.order["items"] = this.items;
                this.item = {};
              })
              

            }
           
          })

          this.orders.push(this.order);
          this.items = [];
        }
    });

    return this.orders;
  }

  getOrders(){
    return this.getOrdersFromDatabase()
  }

  updateOrderStatus(id, status) {
    this.afs.collection("Order").doc(id).update({
      status : status
    })
   }

   updateDirection(coords) {
    this.afs.collection("Order").doc(this.deliveryService.order.id).update({
      coordsDe: coords
    })
  }
 
  

}
