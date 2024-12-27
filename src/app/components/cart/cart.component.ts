import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CookieService } from 'ngx-cookie-service';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartOpen = false; // Flag to control cart visibility
  products: Product[] = []; // Array to hold cart products
  cart!: any[]; // Array to hold cart items
  loading: boolean = false; // Flag to indicate loading state
  updated: boolean = false;

  constructor(
    private auth: AuthService, // Instance of AuthService
    private http: HttpService, // Instance of HttpService
    private cookie: CookieService, // Instance of CookieService
    private router: Router, // Instance of Router
    @Inject(DOCUMENT) public document: Document
  ) {}

  // Function to toggle cart visibility
  async openCart(): Promise<void> {
    this.cartOpen = true;

    return new Promise<void>((resolve, reject) => {
      this.auth.isAuthenticated$.subscribe(async (isAuthenticated) => {
        try {
          if (isAuthenticated) {
            // Perform actions if user is authenticated
            await this.getProductsFromBBDD();
          } else {
            // Retrieve products from cookie if user is not authenticated
            await this.getProductsFromACookie();
          }

          resolve(); // Resolve the promise after toggling cart and getting products
        } catch (error) {
          console.error(error);
          reject(error); // Reject the promise if there's an error
        }
      });
    });
  }

  // Function to retrieve products from a cookie
  getProductsFromACookie(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.cookie.check('cart')) {
        this.loading = true; // Set loading flag to true

        // Parse the cart cookie value
        this.cart = JSON.parse(this.cookie.get('cart'));
        const ids = this.cart.map((product: any) => product.id);

        this.http
          .getProductsById(ids)
          .pipe(
            switchMap((products: Product[]) => {
              const updatedProducts = products
                .map((product) => {
                  const cartItem = this.cart.find(
                    (cart) => cart.id === product.id
                  );
                  if (cartItem) {
                    product.quantity = cartItem.quantity;
                    if (product.quantity > product.stock) {
                      cartItem.quantity = product.stock;
                      product.quantity = product.stock;
                      // Show updated successfully cart notification for 7 seconds
                      this.updated = true;
                      setTimeout(() => {
                        this.updated = false;
                      }, 10000);
                    }
                    product.added_date = cartItem.added_date;

                    if (product.stock === 0) {
                      const cartIndex = this.cart.findIndex(
                        (p) => p.id === product.id
                      );
                      if (cartIndex !== -1) {
                        this.cart.splice(cartIndex, 1);
                      }
                      return null;
                    }
                  }
                  return product;
                })
                .filter((product): product is Product => product !== null);

              this.products = updatedProducts.sort((a, b) => {
                return (
                  new Date(b.added_date).getTime() -
                  new Date(a.added_date).getTime()
                );
              });

              if (this.products.length === 0) {
                this.cookie.delete('cart', '/');
              } else {
                this.cookie.set('cart', JSON.stringify(this.cart), 365, '/');
              }

              return of(this.products);
            }),
            catchError((error) => {
              console.error('Error al obtener los productos:', error);
              return of([]);
            }),
            finalize(() => {
              this.loading = false;
              resolve(); // Resolve the promise after completion
            })
          )
          .subscribe();
      } else {
        resolve(); // Resolve immediately if no cart cookie
      }
    });
  }

  // Function to get products from the database
  getProductsFromBBDD(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loading = true;
      this.http
        .getCartFromDDBB()
        .pipe(
          switchMap((response: any) => {
            const { message, data: products } = response;
            this.products = products;
            if (
              message == 'Productos del carrito actualizados correctamente.'
            ) {
              // Show updated successfully cart notification for 7 seconds
              this.updated = true;
              setTimeout(() => {
                this.updated = false;
              }, 10000);
            }
            resolve(); // Resolve the promise after completion

            return of((this.loading = false));
          }),
          catchError((error) => {
            console.error('Error al obtener los productos:', error);
            reject(error); // Reject the promise if there's an error
            return of([]);
          })
        )
        .subscribe();
    });
  }

  /**
   * Function to delete a product from the cart
   * @param index
   */
  deleteProduct(productId: number): void {
    this.auth.isAuthenticated$.subscribe((logged) => {
      const productIndex = this.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        if (logged) {
          this.http
            .deleteProductCart(this.products[productIndex].id)
            .subscribe(() => {
              // Eliminar el producto del array products
              this.products.splice(productIndex, 1);
            });
        } else {
          // Eliminar el producto del array products
          this.products.splice(productIndex, 1);
          // Eliminar el producto del array cart
          const cartIndex = this.cart.findIndex(
            (cartItem) => cartItem.id === productId
          );

          if (cartIndex !== -1) {
            this.cart.splice(cartIndex, 1);
          }

          // Verificar si todavía hay productos en el carrito
          if (this.cart.length === 0) {
            // Si no hay productos en el carrito, eliminar la cookie
            this.cookie.delete('cart', '/');
          } else {
            // Si todavía hay productos en el carrito, actualizar la cookie
            this.cookie.set('cart', JSON.stringify(this.cart), 365, '/');
          }
        }
      }
    });
  }
  /**
   * Function to calculate the total number of products in the cart
   * @returns
   */
  calculateTotalProducts(): number {
    let total: number = 0;
    // Usamos el método reduce para sumar todas las cantidades de los productos en el carrito
    total = this.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
    return total;
  }

  /**
   * Function to calculate the total amount of the cart
   * @returns
   */
  calculateTotalAmount(): number {
    let total: number = 0;
    // Si el usuario está autenticado, calcular el precio total utilizando this.products
    total = this.products
      .map((product) => product.price * product.quantity)
      .reduce((total, current) => total + current, 0);
    // Redondea el total a dos decimales
    return parseFloat(total.toFixed(2));
  }

  /**
   * Function to close the cart
   */
  closeCart() {
    this.cartOpen = false;
    this.updated = false;
  }

  /**
   * Function to view product details
   * @param productId
   */
  verDetallesProducto(productId: number) {
    // Navegar a la vista de detalles del producto con el ID del producto como parámetro
    window.location.href = window.location.origin + '/product/' + productId;
  }
  /**
   * Function to handle login or address form submission
   */
  async loginOrAdressForm(): Promise<void> {
    // Update the cart to validate the product stock
    await this.openCart();
    if (!this.updated) {
      // Check if user is authenticated
      this.auth.isAuthenticated$
        .pipe(
          switchMap((logged) => {
            if (!logged) {
              return this.auth.loginWithPopup(); // Redirect to login if not authenticated
            }
            return of(logged); // Emit null if already authenticated
          }),
          switchMap((logged) => {
            if (logged) {
              this.loading = true;
              this.router.navigate(['/address-form']); // Navigate to address form
            }
            return of(null); // Emit null
          })
        )
        .subscribe(
          () => {}, // Do nothing on success
          (error) => {
            console.error(error);
            // Handle error in your application
          }
        );
    }
  }
}
