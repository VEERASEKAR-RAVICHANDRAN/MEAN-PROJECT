import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
})
export class ManageProductsComponent implements OnInit {
  products: any[] = [];
  productData = { name: '', category: '', price: 0, description: '' };
  showAddProductForm = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get('http://localhost:3000/api/products').subscribe((response: any) => {
      this.products = response.products;
    });
  }

  addProduct() {
    this.http.post('http://localhost:3000/api/admin/products', this.productData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).subscribe(() => {
      this.loadProducts();
      this.showAddProductForm = false;
    });
  }

  editProduct(product: any) {
    // Edit logic
  }

  deleteProduct(productId: string) {
    this.http.delete(`http://localhost:3000/api/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).subscribe(() => {
      this.loadProducts();
    });
  }
}