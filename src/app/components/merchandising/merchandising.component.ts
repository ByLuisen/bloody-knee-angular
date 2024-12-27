import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { HttpService } from 'src/app/services/http.service';
import { AuthService } from '@auth0/auth0-angular';
import { Brand } from 'src/app/models/Brand';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-merchandising',
  templateUrl: './merchandising.component.html',
  styleUrls: ['./merchandising.component.css'],
})
export class MerchandisingComponent implements OnInit {
  productos: Product[] = [];
  mostrarEnStock: boolean = false;
  mostrarFueraDeStock: boolean = false;
  precioMaximo: number = 150;
  loading: boolean = false;
  role!: string;
  editAdminMode: boolean = false;
  deleteAdminMode: boolean = false;
  editModal: boolean = false;
  deleteModal: boolean = false;
  createModal: boolean = false;
  editedProduct: Product = new Product;
  newProduct: Product = new Product;
  infoAdmin: string = "";
  selectedProduct: Product | null = null;
  brands: Brand[] = [];
  categories: Category[] = [];
  creationForm!: FormGroup;
  archivos: any = [];

  /**
   * Constructor to inject services.
   *
   * @param http HttpService for making HTTP requests.
   * @param router Router for navigation.
   * @param auth AuthService for authentication.
   */
  constructor(private http: HttpService, private router: Router, private auth: AuthService) { }

  // ViewChild to reference the price range input element.
  @ViewChild('priceRangeInput') priceRangeInput!: ElementRef;

  ngOnInit(): void {
    this.getProductos();
    this.creationForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\s]*$/)
      ]),
      brandId: new FormControl('', [
        Validators.required,
      ]),
      categoryId: new FormControl('', [
        Validators.required,
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9\s]*$/)
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?:[5-9]|[1-9][0-9]|1[0-9]{2}|200)$/)
      ]),
      url1: new FormControl('', [
        Validators.required,
      ]),
      url2: new FormControl('', [
        Validators.required,
      ]),
      url3: new FormControl('', [
        Validators.required,
      ]),
      stock: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9\s]*$/)
      ])
    })
    this.http.getRole().subscribe((response) => {
      this.role = response
    });
    this.getProductos();
  }


  /**
   * Fetches the list of products from the server.
   */
  getProductos(): void {
    this.loading = true;
    this.http
      .getProducts()
      .pipe(
        switchMap((products) => {
          this.productos = products;

          const precios = this.productos.map((producto) => producto.price);
          const precioMinimo = Math.min(...precios);
          const precioMaximo = Math.max(...precios);

          this.priceRangeInput.nativeElement.min = precioMinimo;
          this.priceRangeInput.nativeElement.max = precioMaximo;

          this.precioMaximo = precioMaximo;
          return of(products);
        }),
        finalize(() => (this.loading = false)),
        catchError((error) => {
          console.error('Error al obtener los productos:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
    * Updates the maximum price filter when the price range input changes.
    */
  onPriceChange() {
    this.precioMaximo = parseInt(this.priceRangeInput.nativeElement.value);
  }

  /**
   * Counts the number of in-stock products.
   *
   * @returns Number of in-stock products.
   */
  contarProductosEnStock(): number {
    return this.productos.filter((producto) => producto.stock > 0).length;
  }

  /**
  * Counts the number of out-of-stock products.
  *
  * @returns Number of out-of-stock products.
  */
  contarProductosFueraDeStock(): number {
    return this.productos.filter((producto) => producto.stock === 0).length;
  }

  /**
   * Filters the products based on the selected filters.
   *
   * @returns Array of filtered products.
   */
  productosFiltrados(): Product[] {
    let productosFiltrados: Product[] = [];

    // Si ninguna opción está seleccionada, mostrar todos los productos
    if (!this.mostrarEnStock && !this.mostrarFueraDeStock) {
      productosFiltrados = this.productos;
    } else {
      if (this.mostrarEnStock && this.mostrarFueraDeStock) {
        productosFiltrados = this.productos;
      } else if (this.mostrarEnStock) {
        productosFiltrados = this.productos.filter(
          (producto) => producto.stock > 0
        );
      } else if (this.mostrarFueraDeStock) {
        productosFiltrados = this.productos.filter(
          (producto) => producto.stock === 0
        );
      }
    }
    // Filtrar por rango de precio
    productosFiltrados = productosFiltrados.filter(
      (producto) => producto.price <= this.precioMaximo
    );

    return productosFiltrados;
  }
  /**
   * Navigates to the product details or opens modals for editing or deleting.
   *
   * @param product The product to view details of or edit/delete.
   */
  verDetallesProducto(product: Product) {
    if (this.editAdminMode) {
      this.openEditModal(product.id);
    } else if (this.deleteAdminMode) {
      this.openDeleteModal(product);
    } else {
      this.router.navigate(['/product', product.id]);
    }
  }


  /**
   * Toggles edit admin mode.
   */
  editProduct(): void {
    this.deleteAdminMode = false;
    if (!this.editAdminMode) {
      this.editAdminMode = true;
      this.infoAdmin = "SELECCIONA EL PRODUCTO A EDITAR";
    } else {
      this.editAdminMode = false;
      this.infoAdmin = "";
    }
  }

  /**
   * Toggles edit admin mode.
   */
  deleteProduct(): void {
    this.editAdminMode = false;
    if (!this.deleteAdminMode) {
      this.deleteAdminMode = true;

      this.infoAdmin = "SELECCIONA EL PRODUCTO A ELIMINAR";
    } else {
      this.deleteAdminMode = false;
      this.infoAdmin = "";
    }
  }
  /**
   * Toggles create product modal.
   */
  addProduct(): void {
    if (!this.createModal) {
      this.createModal = true;
      this.deleteAdminMode = false;

    } else {
      this.createModal = false;
    }
  }



  /**
   * Opens the edit modal for the selected product.
   *
   * @param productId The ID of the product to edit.
   */
  openEditModal(productId: number) {
    const selectedProduct = this.productos.find(producto => producto.id === productId);
    if (selectedProduct) {
      this.editedProduct = { ...selectedProduct } as Product;
      this.editModal = true;
    }
  }

  /**
   * Opens the edit modal for the selected product.
   *
   * @param productId The ID of the product to edit.
   */
  getBrandNameById(brandId: number): string {
    const brand = this.brands.find(brand => brand.id === brandId);
    return brand ? brand.name : ''; // Devolver el nombre de la marca si se encuentra, de lo contrario, cadena vacía
  }

  /**
   * Closes the edit modal.
   */
  closeEditModal() {
    this.editedProduct = new Product();
    this.editModal = false;
  }

  /**
   * Submits the edit product form and updates the product.
   */
  submitEditProductForm() {
    this.http.updateProduct(this.editedProduct.id, this.editedProduct).subscribe(
      response => {
        this.closeEditModal();
      },
      error => {
        console.error('Error al actualizar el producto', error);
      }
    );
  }

  /**
   * Submits the edit product form and updates the product.
   */
  submitCreateProductForm() {
    this.newProduct.name = this.creationForm.value.name;
    this.newProduct.categoryId = this.creationForm.value.categoryId;
    this.newProduct.brandId = this.creationForm.value.brandId;
    this.newProduct.description = this.creationForm.value.description;
    this.newProduct.price = this.creationForm.value.price;
    this.newProduct.url_img1 = this.creationForm.value.url1;
    this.newProduct.url_img2 = this.creationForm.value.url2;
    this.newProduct.url_img3 = this.creationForm.value.url3;
    this.newProduct.quantity = this.creationForm.value.stock;
    this.newProduct.stock = this.creationForm.value.stock;

    this.http.addProduct(this.newProduct).subscribe(
      (response) => {
        this.productos.push(response);
        this.creationForm.reset();
      },
      (error) => {
        console.error('Error al crear el producto:', error);
      }
    );
  }

  /**
   * Opens the delete modal for the selected product.
   *
   * @param product The product to delete.
   */
  openDeleteModal(product: Product) {
    this.selectedProduct = product;
    this.deleteModal = true;
  }

  /**
   * Cancels the delete operation and closes the delete modal.
   */
  cancelDelete() {
    this.selectedProduct = null;
    this.deleteModal = false;
  }

  /**
   * Confirms the deletion of the selected product.
   */
  confirmDelete() {
    if (this.selectedProduct !== null) {
      this.http.deleteProduct(this.selectedProduct.id).subscribe(() => {
        this.productos = this.productos.filter(producto => producto.id !== this.selectedProduct!.id);
        this.selectedProduct = null;
        this.deleteModal = false;
      });
    }
  }

  /**
   * Closes the create modal.
   */
  closeCreateModal() {
    this.createModal = false;
  }

  /**
   * Handles the image upload for the first image URL.
   *
   * @param event The file input change event.
   */
  handleImageUpload1(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fileName = input.files[0].name;
      this.archivos.push(input.files[0])
      this.creationForm.patchValue({ url1: fileName });
    }
  }

  /**
   * Handles the image upload for the second image URL.
   *
   * @param event The file input change event.
   */
  handleImageUpload2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fileName = input.files[0].name;
      this.archivos.push(input.files[0])
      this.creationForm.patchValue({ url2: fileName });
    }
  }

  /**
   * Handles the image upload for the third image URL.
   *
   * @param event The file input change event.
   */
  handleImageUpload3(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fileName = input.files[0].name;
      this.archivos.push(input.files[0])
      this.creationForm.patchValue({ url3: fileName });
    }
  }
}
