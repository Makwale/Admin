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

  constructor(private afs: AngularFirestore, private deliveryService: DeliveryService) { 
 
  }
  

  private getOrdersFromDatabase(){
    this.afs.collection("Order").snapshotChanges().subscribe(datas =>{
      let index = 0;
        for(let data of datas){
        
          let order = {};

          order["data"] = data.payload.doc.data();
          order["id"] = data.payload.doc.id;

          this.afs.collection("Item", ref => ref.where("oRef" , "==" , `${data.payload.doc.id}`)).snapshotChanges().subscribe( itemsData =>{
            let items = []
            for(let itemData of itemsData){
              let item = {};

              let itemDat = itemData.payload.doc.data();
              let itemId = itemData.payload.doc.id;


              this.afs.collection("Prod").doc(itemDat["prodRef"]).valueChanges().subscribe( productData => {
                item["data"] = itemDat;
                item["id"] = itemId;
                item["product"] = productData;
                
                items.push(item);
    
                order["items"] = items;
              })
              

            }

             this.orders.push(order);
           
          })

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
