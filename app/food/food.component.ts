import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css'],
})
export class FoodComponent implements OnInit {
  products: any[] = [];
  isLoading: boolean = true;
  addProductMode: boolean = false;
  productForm: FormGroup;
  editingProduct: any = null;
  viewingProduct: any = null;  // New variable for viewing product
  searchQuery: string = '';
  selectAll: boolean = false;
// i: any;

  constructor(private productService: FoodService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: [''],
      stock: ['', [Validators.required, Validators.min(1)]],
      mealType: ['', Validators.required], // New dropdown for Breakfast/Lunch/Dinner
      foodType: ['', Validators.required], // New dropdown for Veg/Non-Veg
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (response) => {
        this.products = response.products.reverse() || [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    );
  }

  toggleAddProductMode(): void {
    this.addProductMode = !this.addProductMode;
    if (!this.addProductMode) {
      this.editingProduct = null;
      this.productForm.reset();
    }
  }

  // saveProduct(): void {
  //   if (this.productForm.invalid) {
  //     return;
  //   }

  //   const productData = this.productForm.value;

  //   if (this.editingProduct) {
  //     this.productService.updateProduct(this.editingProduct._id, productData).subscribe(
  //       (updatedProduct) => {
  //         const index = this.products.findIndex((p) => p._id === this.editingProduct._id);
  //         if (index !== -1) {
  //           this.products[index] = updatedProduct;
  //         }
  //         alert('Product updated successfully!');
  //         this.toggleAddProductMode();
  //       },
  //       (error) => {
  //         console.error('Error updating product:', error);
  //         alert('Failed to update product. Please try again.');
  //       }
  //     );
  //   } else {
  //     this.productService.addProduct(productData).subscribe(
  //       (newProduct) => {
  //         this.products.push(newProduct);
  //         alert('Product added successfully!');
  //         this.toggleAddProductMode();
  //       },
  //       (error) => {
  //         console.error('Error adding product:', error);
  //         alert('Failed to add product. Please try again.');
  //       }
  //     );
  //   }
  // }
  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }
  
    const productData = this.productForm.value;
  
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct._id, productData).subscribe(
        (updatedProduct) => {
          const index = this.products.findIndex((p) => p._id === this.editingProduct._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          alert('Product updated successfully!');
          this.toggleAddProductMode();
        },
        (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product. Please try again.');
        }
      );
    } else {
      this.productService.addProduct(productData).subscribe(
        (newProduct) => {
          this.products.push(newProduct);
          alert('Product added successfully!');
          this.toggleAddProductMode();
        },
        (error) => {
          console.error('Error adding product:', error);
          alert('Failed to add product. Please try again.');
        }
      );
    }
  }
  editProduct(product: any): void {
    this.editingProduct = product;
    this.productForm.patchValue(product);
    this.toggleAddProductMode();
  }

  deleteProduct(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(product._id).subscribe(
        () => {
          this.products = this.products.filter((p) => p._id !== product._id);
          alert('Product deleted successfully!');
        },
        (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      );
    }
  }
  deleteSelectedProducts(): void {
    const selectedProducts = this.products.filter((product) => product.selected);
    
    if (selectedProducts.length === 0) {
      alert('No products selected.');
      return;
    }
  
    if (confirm('Are you sure you want to delete the selected products?')) {
      const deleteRequests = selectedProducts.map((product) =>
        this.productService.deleteProduct(product._id)
      );
  
      // Execute all delete requests
      Promise.all(deleteRequests).then(
        () => {
          this.products = this.products.filter((product) => !product.selected);
          alert('Selected products deleted successfully!');
        },
        (error) => {
          console.error('Error deleting selected products:', error);
          alert('Failed to delete selected products. Please try again.');
        }
      );
    }
  }
  
  // View Product
  viewProduct(product: any): void {
    this.viewingProduct = product;
  }

  // Close the modal
  closeModal(): void {
    this.viewingProduct = null;
  }

  toggleSelectAll(): void {
    this.products.forEach((product) => (product.selected = this.selectAll));
  }
}