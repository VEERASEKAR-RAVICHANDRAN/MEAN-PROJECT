import { Component } from '@angular/core';
import { ApiService } from '../app.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  cart: any[] = [];
  userId: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId;
    }
  }

  ngOnInit() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    } else {
      console.warn('Cart is empty');
    }
  }

  incrementQuantity(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.cart[index].quantity += 1;
    }
    this.saveCart();
  }

  decrementQuantity(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity -= 1;
      } else {
        this.cart.splice(index, 1); // Remove the item if quantity is 1
      }
    }
    this.saveCart();
  }

  calculateTotalAmount(): number {
    return this.cart.reduce(
      (total, item) => total + item.quantity * (item.productPrice || 0),
      0
    );
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  async placeOrder() {
    if (!this.userId) {
      alert('You need to log in first!');
      this.router.navigate(['/login']);
      return;
    }

    const totalAmount = this.calculateTotalAmount();
    if (totalAmount <= 0) {
      alert('Total amount must be greater than zero.');
      return;
    }

    const order = {
      userId: this.userId,
      products: this.cart,
      paymentMethod: 'Cash on Delivery',
      totalAmount,
    };

    try {
      const response = await this.apiService.placeOrder(order);
      alert('Order placed successfully!');
      this.cart = [];
      localStorage.removeItem('cart');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Error placing order:', error.response?.data || error.message);
      console.log(order)
      alert(`Failed to place order: ${error.response?.data?.message || 'Please try again.'}`);
    }
    
  }

  removeFromCart(productId: string) {
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.cart.splice(index, 1);
      this.saveCart();
    }
  }
}
