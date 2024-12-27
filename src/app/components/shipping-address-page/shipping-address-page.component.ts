import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { User } from 'src/app/models/User';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-shipping-address-page',
  templateUrl: './shipping-address-page.component.html',
  styleUrls: ['./shipping-address-page.component.css'],
})
export class ShippingAddressPageComponent implements OnInit {
  shippingAddress!: FormGroup;
  loading: boolean = false;
  updated: boolean = false;
  products: Product[] = []; // Array to hold cart products
  constructor(private router: Router, private http: HttpService) {}

  ngOnInit(): void {
    this.getProductsFromBBDD();
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

  // Function to get products from the database
  getProductsFromBBDD(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loading = true;
      this.http
        .getCartFromDDBB()
        .pipe(
          switchMap((response: any) => {
            const { message, data: products } = response;
            if (products.length == 0) {
              this.router.navigate(['/merchandising']);
            }
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
      await this.getProductsFromBBDD();
      if (!this.updated) {
        this.loading = true;
        this.http
          .checkout(this.products)
          .pipe(
            switchMap((response) => {
              if (response) {
                window.location.href = response.data.checkout_url;
              }
              return of();
            }),
            finalize(() => (this.loading = false))
          )
          .subscribe();
      }
    } else {
      // Marcar todos los controles del formulario como tocados para mostrar los errores
      Object.values(this.shippingAddress.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }

  goBack(): void {
    window.history.back(); // Navega hacia atrás en el historial
  }
}
