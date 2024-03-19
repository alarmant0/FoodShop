import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  
  private apiUrl = 'http://localhost:4000/products';

  products: any[] = [];
  selectedProduct = { customId: 0, name: '', size: '', price: 0, amount: 0 };
  


  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.getProducts();

  }

  addProduct(product: { name: string, size: string, price: number, amount: number }) {
    this.http.post(this.apiUrl, product).subscribe((newProduct: any) => {
      this.products.push(newProduct);
    });
  }

  getProducts() {
    this.http.get<any[]>(this.apiUrl).subscribe((products: any[]) => {
      this.products = products;
    });
  }

  updateProduct() {
    this.http.put(`${this.apiUrl}/${this.selectedProduct.customId}`, this.selectedProduct).subscribe((product: any) => {
      const index = this.products.findIndex((p: { customId: any }) => p.customId === this.selectedProduct.customId);
      this.products[index] = product;
    });
  }

  deleteProduct(customId: any) {
    this.http.delete(`${this.apiUrl}/${customId}`).subscribe(() => {
      this.products = this.products.filter((product: { customId: any }) => product.customId !== customId);
    });
  }

}