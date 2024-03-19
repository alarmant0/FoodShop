import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private serverUrl = 'http://localhost:3000/orders';
  orders: any[] = [];
  deleteOrderId: number = 0; 
  newOrderContent: string = '';
  newOrderPrice: number = 0; 

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.printOrders();
  }

  deleteOrder(orderId: number) {
    return this.http.get(`${this.serverUrl}?action=delete&id=${orderId}`).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

  printOrders() {
    return this.http.get(`${this.serverUrl}?action=print`).subscribe(
      (response: any) => this.orders = response,
      error => console.error(error)
    );
  }

  addOrder() {
    if (!this.newOrderContent.trim() || this.newOrderPrice === null) {
      console.error('Content and price cannot be empty');
      return;
    }
    const items = this.newOrderContent.split(',').map(item => item.trim());
    const body = { content: items, price: this.newOrderPrice };
    return this.http.post(`${this.serverUrl}?action=add`, body).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

}