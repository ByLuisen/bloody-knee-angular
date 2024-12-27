import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Product } from 'src/app/models/Product';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, finalize, of, switchMap, take, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product!: Product;
  topProducts!: Product[];
  mainImageUrl!: string;
  brandName!: string;
  added: boolean = false;
  alertQuantity: boolean = false;
  outStockAlert: boolean = false;
  quantity!: number;
  loading: boolean = false;
  loadingProduct: boolean = false;
  openModal: boolean = false;
  shippingAddress!: FormGroup;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private cookie: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = +params['productId'];
      this.loadingProduct = true;
      this.getProducto();
    });
    this.getRandomProducts();
    this.shippingAddress = new FormGroup({
      country: new FormControl('España', [Validators.required]),
      first_name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúñçÁÉÍÓÚÑÇ'\s]*$/),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúñçÁÉÍÓÚÑÇ'\s]*$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\+)?[0-9]+$/),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9ñáéíóúÑÁÉÍÓÚªº'·\s\-\.\,]*$/),
      ]),
      province: new FormControl('', [
        Validators.pattern(/^[a-zA-ZáéíóúñçÁÉÍÓÚÑÇ'\s]*$/),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúñçÁÉÍÓÚÑÇ'\s]*$/),
      ]),
      zip: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4,5}$/),
      ]),
    });
  }

  async getProducto(): Promise<void> {
    try {
      const product = await this.http
        .getProductsById([this.productId])
        .toPromise();
      this.product = product![0];
      // Inicializar la imagen principal con la primera imagen del producto
      this.mainImageUrl = this.product ? this.product.url_img1 : '';
    } catch (error) {
      console.error('Error al obtener el producto:', error);
    }
  }

  setMainImage(url: string): void {
    this.mainImageUrl = url;
  }

  /**
   *
   */
  getRandomProducts(): void {
    this.http
      .getProducts()
      .pipe(
        switchMap((products) => {
          // Get 6 random products
          const randomProducts = this.getRandomItems(products, 6);

          this.topProducts = randomProducts.filter(
            (product) => product.id !== this.productId
          );

          return of(products);
        }),
        finalize(() => (this.loadingProduct = false)),
        catchError((error) => {
          console.error('Error al obtener productos:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  // Función para obtener elementos aleatorios de una matriz
  getRandomItems(array: any[], numItems: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  }

  /**
   * Redirecciona a los detalles del producto recomendado que seleccione el usuario.
   * @param productId
   */
  verDetallesProducto(productId: number) {
    window.location.href = window.location.origin + '/product/' + productId;
  }

  async add(): Promise<void> {
    await this.getProducto();

    if (this.product.stock <= 0) {
      this.outStockAlert = true;
    } else {
      this.auth.isAuthenticated$.pipe(take(1)).subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          const product = new Product();
          product.id = this.productId;
          product.quantity = this.getQuantity();
          this.http.addProductToCart(product).subscribe((response) => {
            const { message } = response;
            if (message == 'Producto agregado al carrito con éxito') {
              // Show added succesfully notification for 7 seconds
              this.added = false;
              this.added = true;
              setTimeout(() => {
                this.added = false;
              }, 7000);
            } else if (
              message == 'Has superado la cantidad de stock de este producto'
            ) {
              // Show quantity alert notification for 7 seconds
              this.alertQuantity = true;
              this.added = false;
              setTimeout(() => {
                this.alertQuantity = false;
              }, 7000);
            }
          });
        } else {
          this.saveProductInACookie();
        }
      });
    }
  }

  async loginOrModal(): Promise<void> {
    const quantity = this.getQuantity();
    // Update the product for the stock
    await this.getProducto();
    if (this.product.stock > 0) {
      this.auth.isAuthenticated$
        .pipe(
          switchMap((logged) => {
            if (!logged) {
              return this.auth.loginWithPopup();
            }
            return of(null); // Emite un valor nulo si ya está autenticado
          }),
          switchMap(() => {
            if (quantity > this.product.stock) {
              this.outStockAlert = true;
            } else {
              this.openModal = true;
            }
            return of(null);
          })
        )
        .subscribe(
          () => {},
          (error) => {
            console.error(error);
            // Manejar el error en tu aplicación
          }
        );
    } else {
      this.outStockAlert = true;
    }
  }

  /**
   * Function for add the product in a cookie validating whether it exists or not to
   * overwrite the quantity or eliminate it in case the product is out of stock
   */
  saveProductInACookie(): void {
    // Create the product object to add
    const productToAdd = {
      id: this.productId,
      quantity: this.getQuantity(), // Convertir a número si es necesario
      added_date: new Date().toISOString(),
    };

    // Verify if the cookie cart exists
    if (this.cookie.check('cart')) {
      // Get the cart cookie value parsing it
      const cart = JSON.parse(this.cookie.get('cart'));

      // Verificar si el producto ya está en el carrito
      const existingProductIndex = cart.findIndex(
        (p: any) => p.id === this.productId
      );

      if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, actualizar su cantidad
        cart[existingProductIndex].quantity += productToAdd.quantity;
        if (cart[existingProductIndex].quantity > this.product.stock) {
          cart[existingProductIndex].quantity = this.product.stock;
          // Show laert quantity notification
          if (this.product.stock > 0) {
            // Show quantity alert notification for 7 seconds
            this.alertQuantity = true;
            this.added = false;
            setTimeout(() => {
              this.alertQuantity = false;
            }, 7000);
          }
        } else {
          if (this.product.stock > 0) {
            // Show added succesfully notification for 7 seconds
            this.added = false;
            this.added = true;
            setTimeout(() => {
              this.added = false;
            }, 7000);
            // Update the added_date of the product
            cart[existingProductIndex].added_date = productToAdd.added_date;
          }
        }
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.push(productToAdd);
        if (this.product.stock > 0) {
          // Show added succesfully notification for 7 seconds
          this.added = false;
          this.added = true;
          setTimeout(() => {
            this.added = false;
          }, 7000);
        }
      }

      // Remove products with zero stock from the cart
      const updatedCart = cart.filter((product: any) => product.quantity > 0);

      // If the updated cart is empty, delete the cookie
      if (updatedCart.length === 0) {
        this.cookie.delete('cart', '/');
      } else {
        this.cookie.set('cart', JSON.stringify(updatedCart), 365, '/');
      }
    } else {
      if (this.product.stock > 0) {
        this.cookie.set('cart', JSON.stringify([productToAdd]), 365, '/'); // Convert the array to JSON and save it in the cookie
        // Show added succesfully notification for 7 seconds
        this.added = false;
        this.added = true;
        setTimeout(() => {
          this.added = false;
        }, 7000);
      }
    }
  }

  getQuantity(): number | any {
    if (this.product.stock > 0) {
      // Get the quantity product selector
      const selectElement = document.getElementById(
        'quantity'
      ) as HTMLSelectElement;
      // Parse to integer the quantity
      return parseInt(selectElement.value);
    }
  }

  async sendShippingAddress(): Promise<void> {
    if (this.shippingAddress.valid) {
      // Obtener todos los datos del formulario
      const shippingData = Object.values(this.shippingAddress.value).map(
        (value: any) => value.trim()
      );
      const shippingAddress = new User();
      shippingAddress.country = shippingData[0];
      shippingAddress.fullName = shippingData[1] + ' ' + shippingData[2];
      shippingAddress.phone = shippingData[3];
      shippingAddress.address = shippingData[4];
      shippingAddress.province = shippingData[5] ?? '';
      shippingAddress.city = shippingData[6];
      shippingAddress.zip = shippingData[7];

      this.http.storeUserAddress(shippingAddress).subscribe();

      const quantity = this.getQuantity();

      await this.getProducto();

      if (this.product.stock == 0) {
        this.outStockAlert = true;
        this.openModal = false;
      } else if (quantity > this.product.stock) {
        this.outStockAlert = true;
      } else {
        this.loading = true;
        this.product.quantity = this.getQuantity();
        this.http
          .checkout([this.product])
          .pipe(
            tap((response) => {
              if (response) {
                window.location.href = response.data.checkout_url;
              }
            }),
            finalize(() => (this.loading = false))
          )
          .subscribe(
            () => {},
            (error) => {
              console.error('Error al iniciar la sesión de pago:', error);
              // Manejar el error en tu aplicación
            }
          );
      }
    } else {
      // Marcar todos los controles del formulario como tocados para mostrar los errores
      Object.values(this.shippingAddress.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}
