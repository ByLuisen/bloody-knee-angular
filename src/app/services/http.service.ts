import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { Quote } from '../models/Quote';
import { Video } from '../models/Video';
import { Diet } from '../models/Diet';
import { AuthService, User } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/Product';
import { Comment } from '../models/Comment';

import { CookieService } from 'ngx-cookie-service';
import { Order } from '../models/Order';
import { Brand } from '../models/Brand';
import { Category } from '../models/Category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private jwtHelper: JwtHelperService = new JwtHelperService(); // Servicio para manejar JWT
  url: string = environment.bloodyKneeApiUrl;

  constructor(
    private _http: HttpClient,
    private auth: AuthService,
    private cookie: CookieService,
  ) {}

  initUser(): void {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.addNewUserAndRole(user).subscribe();
        if (this.cookie.check('cart')) {
          this.storeCartInDDBB(user).subscribe((response) => {
            this.cookie.delete('cart', '/');
          });
        }
      }
    });
  }

  getRole(): Observable<string> {
    const url = `${this.url}/get-role`;
    return this.auth.idTokenClaims$.pipe(
      switchMap((user) => {
        if (user) {
          // Construye el cuerpo de la solicitud con el correo electrónico y la conexión
          const body = {
            email: user.email, // Obtén el correo electrónico del usuario actual
            connection: user['sub'].split('|')[0], // Obtén la conexión del usuario actual
          };

          // Realiza la solicitud POST al servidor con el cuerpo construido
          return this._http.post<any>(url, body).pipe(
            map((response) => response.data), // Extrae solo el nombre del rol desde la respuesta
            catchError((error) => {
              console.error('Error al obtener el rol:', error);
              // En caso de error, devolver un rol básico
              return of('Basic');
            }),
          );
        } else {
          // Si el usuario no está autenticado, devolver un rol básico
          return of('Basic');
        }
      }),
    );
  }

  updateRole(role: string, sub_id: string = ''): Observable<any> {
    const url = `${this.url}/update-role`;
    return this.auth.idTokenClaims$.pipe(
      switchMap((user) => {
        // Construye el cuerpo de la solicitud con el correo electrónico y la conexión
        const body = {
          role: role,
          sub_id: sub_id,
          email: user ? user.email : '', // Obtén el correo electrónico del usuario actual
          connection: user ? user['sub'].split('|')[0] : '', // Obtén la conexión del usuario actual
        };

        // Realiza la solicitud PUT al servidor con el cuerpo construido
        return this._http.put(url, body);
      }),
    );
  }

  /**
   *Function that add new user and role Basic if ti's doesn't exist
   * @param user Data of the user logged provided by auth0 classes
   */
  addNewUserAndRole(user: User): Observable<any> {
    const url = `${this.url}/new-user`;
    return this._http.post(url, user);
  }

  /**
   *Store the products
   * @param user
   * @returns
   */
  storeCartInDDBB(user: User): Observable<any> {
    const url = `${this.url}/store-cart`;
    const body = {
      user: user,
      cart: JSON.parse(this.cookie.get('cart')),
    };
    return this._http.post(url, body);
  }

  getCartFromDDBB(): Observable<any> {
    const url = `${this.url}/get-cart`;
    return this.auth.user$.pipe(
      switchMap((user) => {
        const body = {
          email: user ? user.email : '', // Obtén el correo electrónico del usuario actual
          connection: user ? user.sub?.split('|')[0] : '', // Obtén la conexión del usuario actual
        };
        // Realiza la solicitud PUT al servidor con el cuerpo construido
        return this._http.post(url, body).pipe(map((response) => response));
      }),
    );
  }

  addProductToCart(product: Product): Observable<any> {
    const url = `${this.url}/add-product-to-cart`;
    return this.auth.isAuthenticated$.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return this.auth.user$.pipe(
            take(1),
            switchMap((user) => {
              if (user && user.sub) {
                const email = user.email;
                const connection = user.sub.split('|')[0];
                const body = { product, email, connection };
                return this._http.post(url, body);
              }
              return of(null); // No hay usuario autenticado o no hay sub
            }),
          );
        } else {
          return of(null); // No está autenticado
        }
      }),
    );
  }

  deleteProductCart(productId: number): Observable<Product[]> {
    const url = `${this.url}/delete-product-cart`;
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user && user.sub) {
          const email = user.email;
          const connection = user.sub.split('|')[0]; // Obtiene la conexión del usuario actual
          const body = { productId, email, connection };

          // Realiza la solicitud DELETE al servidor con el cuerpo construido
          return this._http
            .delete<{ data: Product[] }>(url, { body })
            .pipe(map((response) => response.data));
        } else {
          // Si el usuario no está autenticado o no tiene sub, devuelve un Observable vacío
          return of([]);
        }
      }),
    );
  }

  storeUserAddress(shippingAddress: any): Observable<any> {
    const url = `${this.url}/store-address`;
    return this.auth.user$.pipe(
      switchMap((user) => {
        const body = {
          shippingAddress: shippingAddress,
          email: user ? user.email : '', // Obtén el correo electrónico del usuario actual
          connection: user ? user.sub?.split('|')[0] : '', // Obtén la conexión del usuario actual
        };
        // Realiza la solicitud PUT al servidor con el cuerpo construido
        return this._http.post(url, body).pipe(map((response) => response));
      }),
    );
  }

  /**
   * Retrieves an access token for authorization.
   * @returns An observable that emits the access token after the request is completed.
   */
  getAccessToken(): Observable<any> {
    const url = 'https://dev-yyzuj3kafug18e38.eu.auth0.com/oauth/token';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      client_id: 'CpniTzVOuifOIXQwMfoZ5MpN86tSUEv7',
      client_secret:
        '8xk0AOKxyaRP2vf9WSy36VYJRYq2Xg-MkJZUF2xPVNsNm1UIDK85W258VmHYbVP-',
      audience: 'https://dev-yyzuj3kafug18e38.eu.auth0.com/api/v2/',
      grant_type: 'client_credentials',
    };

    return this._http.post<any>(url, body, { headers: headers });
  }

  /**
   * Retrieves all quotes.
   * @returns An observable that emits an array of quotes after the request is completed.
   */
  getQuotes(): Observable<Quote[]> {
    return this._http
      .get<any>(`${this.url}/quotes`)
      .pipe(map((response) => response.data as Quote[]));
  }

  /**
   * Retrieves videos based on modality and type.
   * @param modality_id The ID of the modality.
   * @param type_id The ID of the type.
   * @returns An observable that emits an array of videos after the request is completed.
   */
  getVideosModality(modality_id: number, type_id: number): Observable<Video[]> {
    return this._http
      .get<{
        data: Video[];
      }>(`${this.url}/modalityvideo/${modality_id}/${type_id}`)
      .pipe(map((response) => response.data));
  }

  getVideoById(id: number): Observable<Video> {
    return new Observable<Video>((observer) => {
      this._http
        .get<{ data: Video }>(`${this.url}/getvideobyid/${id}`)
        .subscribe(
          (response) => {
            observer.next(response.data);
            observer.complete();
            // Actualizar las visitas del video
            this.updateVideoVisits(id).subscribe(
              () => {},
              (error) => {
                console.error('Error al actualizar las visitas', error);
              },
            );
          },
          (error) => {
            observer.error(error);
          },
        );
    });
  }

  /**
   * Retrieves videos based on modality and type.
   * @param modality_id The ID of the modality.
   * @param type_id The ID of the type.
   * @returns An observable that emits an array of videos after the request is completed.
   */
  getVideos(): Observable<Video[]> {
    return this._http
      .get<any>(`${this.url}/videos`)
      .pipe(map((response) => response.data as Video[]));
  }

  getCommentById(id: number): Observable<Comment[]> {
    return new Observable<Comment[]>((observer) => {
      this._http
        .get<{ data: Comment[] }>(`${this.url}/getcommentbyid/${id}`)
        .subscribe(
          (response) => {
            observer.next(response.data);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          },
        );
    });
  }

  countAndUpdateComments(videoId: number): Observable<any> {
    const url = `${this.url}/videos/${videoId}/update-comments`;
    return this._http.post(url, {}).pipe(
      catchError((error) => {
        console.error('Error al contar y actualizar comentarios:', error);
        return of(null);
      }),
    );
  }

  /**
   * Updates the number of likes for a video.
   * @param videoId The ID of the video.
   * @returns An observable that emits the updated information after the request is completed.
   */
  updateLikes(videoId: number): Observable<any> {
    const url = `${this.url}/updateLikes/${videoId}`;
    return this.auth.idTokenClaims$.pipe(
      switchMap((user) => {
        // Construye el cuerpo de la solicitud con el correo electrónico y la conexión
        const body = {
          email: user ? user.email : '', // Obtén el correo electrónico del usuario actual
          connection: user ? user['sub'].split('|')[0] : '', // Obtén la conexión del usuario actual
        };

        // Realiza la solicitud PUT al servidor con el cuerpo construido
        return this._http.put(url, body);
      }),
    );
  }

  /**
   * Updates the number of dislikes for a video.
   * @param videoId The ID of the video.
   * @returns An observable that emits the updated information after the request is completed.
   */
  updateDislikes(videoId: number): Observable<any> {
    const url = `${this.url}/updateDislikes/${videoId}`;
    return this.auth.idTokenClaims$.pipe(
      switchMap((user) => {
        // Construye el cuerpo de la solicitud con el correo electrónico y la conexión
        const body = {
          email: user ? user.email : '', // Obtén el correo electrónico del usuario actual
          connection: user ? user['sub'].split('|')[0] : '', // Obtén la conexión del usuario actual
        };

        // Realiza la solicitud PUT al servidor con el cuerpo construido
        return this._http.put(url, body);
      }),
    );
  }

  /**
   * Updates the number of visits for a video.
   * @param videoId The ID of the video.
   * @returns An observable that emits the updated information after the request is completed.
   */
  updateVideoVisits(videoId: number): Observable<any> {
    const url = `${this.url}/videos/${videoId}/visit`;
    // Utiliza switchMap para combinar el resultado del observable user$ con la solicitud HTTP put
    return this.auth.user$.pipe(
      switchMap((user) => {
        const body = { email: user ? user.email : '' };
        // Realiza una solicitud PUT al servidor con el cuerpo que incluye el usuario
        return this._http.put(url, body);
      }),
    );
  }

  /**
   * Retrieves all products.
   * @returns An observable that emits an array of products after the request is completed.
   */
  getProducts(): Observable<Product[]> {
    return this._http
      .get<any>(`${this.url}/products`)
      .pipe(map((response) => response.data as Product[]));
  }

  /**
   *
   * @param id
   * @returns
   */
  getProductsById(id: number[]): Observable<Product[]> {
    // Construye la URL con los IDs como parámetros de consulta
    const params = new HttpParams().set('id', id.join(',')); // Unir los IDs en una cadena separada por comas
    return this._http
      .get<{ data: Product[] }>(`${this.url}/getproductbyid/${id}`, { params })
      .pipe(map((response) => response.data));
  }

  // Obtener todos los videos
  getDiets(): Observable<Diet[]> {
    return this._http
      .get<any>(`${this.url}/diets`)
      .pipe(map((response) => response.data as Diet[]));
  }

  /**
   * Creates a new diet on the server.
   * @param diet The Diet object containing the information of the new diet.
   * @returns An observable that emits the created diet after the request is completed.
   */
  createDiet(diet: Diet): Observable<Diet> {
    return this._http.post<Diet>(`${this.url}/diets`, diet);
  }
  /**
   *
   * @param dietId
   * @param updatedDiet
   * @returns
   */
  updateDiet(dietId: number, updatedDiet: Diet): Observable<Diet> {
    const url = `${this.url}/diets/${dietId}`;
    return this._http.put<Diet>(url, updatedDiet);
  }

  /**
   * Deletes a diet from the server.
   * @param dietId The ID of the diet to be deleted.
   * @returns An observable that emits void after the deletion request is completed.
   */
  deleteDiet(dietId: number): Observable<void> {
    const url = `${this.url}/diets/${dietId}`;
    return this._http.delete<void>(url);
  }

  /**
   * Creates a new video on the server.
   * @param video The Video object containing the information of the new video.
   * @returns An observable that emits the created video after the request is completed.
   */
  createVideo(video: Video): Observable<Video> {
    return this._http.post<Video>(`${this.url}/videos`, video);
  }

  /**
   * Updates an existing video on the server.
   * @param id The ID of the video to update.
   * @param updatedVideo The updated Video object with the new information.
   * @returns An observable that emits the updated video after the request is completed.
   */
  updateVideo(id: number, updatedVideo: Video): Observable<Video> {
    const url = `${this.url}/videos/${id}`;
    return this._http.put<Video>(url, updatedVideo);
  }

  /**
   * Deletes a video from the server.
   * @param id The ID of the video to delete.
   * @returns An observable that emits void after the deletion request is completed.
   */
  destroyVideo(id: number): Observable<void> {
    const url = `${this.url}/videos/${id}`;
    return this._http.delete<void>(url);
  }
  /**
   * Retrieves all brands.
   * @returns An observable that emits an array of quotes after the request is completed.
   */
  getBrands(): Observable<Brand[]> {
    return this._http
      .get<any>(`${this.url}/brands`)
      .pipe(map((response) => response.data as Brand[]));
  }
  /**
   * Retrieves all categories.
   * @returns An observable that emits an array of quotes after the request is completed.
   */
  getCategories(): Observable<Category[]> {
    return this._http
      .get<any>(`${this.url}/categories`)
      .pipe(map((response) => response.data as Category[]));
  }

  /**
   * Get the brand of a product by ID
   * @param productId the ID of the product
   * @returns An observable than emits
   */
  getProductBrand(productId: number): Observable<any> {
    return this._http.get<any>(`${this.url}/products/${productId}/brand`);
  }

  subscribeQuote(quotePriceId: string): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Emite un valor nulo si el usuario no está autenticado
        }

        const url = `${this.url}/subscription`;
        const body = {
          price_id: quotePriceId,
          user_email: user.email ?? '',
          href: window.location.href,
          origin: window.location.origin,
        };
        return this._http.post(url, body).pipe(
          catchError((error) => {
            // Manejar errores aquí
            console.error('Error en la solicitud HTTP:', error);
            return of(null); // Emite un valor nulo si hay un error
          }),
        );
      }),
    );
  }

  checkout(products: Product[]): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Emite un valor nulo si el usuario no está autenticado
        }

        const url = `${this.url}/payment`;
        const body = {
          user_email: user.email ?? '',
          products: products,
          href: window.location.href,
          origin: window.location.origin,
        };
        return this._http.post(url, body).pipe(
          catchError((error) => {
            // Manejar errores aquí
            console.error('Error en la solicitud HTTP:', error);
            return of(null); // Emite un valor nulo si hay un error
          }),
        );
      }),
    );
  }

  getCheckoutSession(id: string): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Emite un valor nulo si el usuario no está autenticado
        }

        const url = `${this.url}/retrieve-checkout`;
        const body = {
          checkout_session_id: id,
        };
        return this._http.post(url, body).pipe(
          catchError((error) => {
            // Manejar errores aquí
            console.error('Error en la solicitud HTTP:', error);
            return of(null); // Emite un valor nulo si hay un error
          }),
        );
      }),
    );
  }

  getLineItems(id: string): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(null); // Emite un valor nulo si el usuario no está autenticado
        }

        const url = `${this.url}/retrieve-line-items`;
        const body = {
          checkout_session_id: id,
        };
        return this._http.post(url, body).pipe(
          catchError((error) => {
            // Manejar errores aquí
            console.error('Error en la solicitud HTTP:', error);
            return of(null); // Emite un valor nulo si hay un error
          }),
        );
      }),
    );
  }

  addComment(videoId: number, comment: string): Observable<any> {
    const url = `${this.url}/comments`;
    return this.auth.idTokenClaims$.pipe(
      switchMap((user) => {
        // Construye el cuerpo de la solicitud con el correo electrónico y la conexión
        const body = {
          email: user ? user.email : '', // Obtén el correo electrónico del usuario actual
          connection: user ? user['sub'].split('|')[0] : '', // Obtén la conexión del usuario actual
          video_id: videoId,
          comment: comment,
        };
        return this._http.post(url, body).pipe(
          catchError((error) => {
            // Manejar errores aquí
            console.error('Error en la solicitud HTTP:', error);
            return of(null); // Emite un valor nulo si hay un error
          }),
        );
      }),
    );
  }

  /**
   * Add a new product
   *
   * @param product
   * @returns
   */
  addProduct(product: Product): Observable<Product> {
    const url = `${this.url}/products/`;
    return this._http.post<Product>(url, product);
  }

  /**
   * Update an existing product
   *
   * @param id
   * @param product
   * @returns
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    const url = `${this.url}/products/${id}`;
    return this._http.put<Product>(url, product);
  }

  /**
   * Delete a product
   *
   * @param id
   * @returns
   */
  deleteProduct(id: number): Observable<any> {
    const url = `${this.url}/products/${id}`;
    return this._http.delete(url);
  }

  editComment(commentId: number, comment: string): Observable<any> {
    const url = `${this.url}/comments/${commentId}`;
    return this._http.put(url, { comment }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return of(null);
      }),
    );
  }

  makeOrder(checkout_session: any, line_items: any): Observable<Order> {
    const url = `${this.url}/make-order`;
    return this.auth.user$.pipe(
      switchMap((user) => {
        const body = {
          checkout_session: checkout_session,
          line_items: line_items,
          email: user ? user.email : '',
          connection: user ? user.sub?.split('|')[0] : '',
        };
        return this._http
          .post<{ data: Order }>(url, body)
          .pipe(map((response) => response.data));
      }),
    );
  }

  deleteComment(commentId: number): Observable<any> {
    const url = `${this.url}/comments/${commentId}`;
    return this._http.delete(url).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return of(null);
      }),
    );
  }

  getOrders(): Observable<Order[]> {
    const url = `${this.url}/get-orders`;
    return this.auth.user$.pipe(
      switchMap((user) => {
        const body = {
          email: user ? user.email : '',
          connection: user ? user.sub?.split('|')[0] : '',
        };
        return this._http
          .post<{ data: Order[] }>(url, body)
          .pipe(map((response) => response.data));
      }),
    );
  }

  cancelOrder(order: Order): Observable<any> {
    const url = `${this.url}/cancel-order`;
    const body = {
      order: order,
    };
    return this._http.put(url, body).pipe(
      catchError((error) => {
        console.error('Error al cancelar el pedido:', error);
        return of(null);
      }),
    );
  }

  saveAsFavorite(videoId: number): Observable<Response> {
    const url = `${this.url}/save-as-favorite/${videoId}`;
    return this.auth.idTokenClaims$.pipe(
      switchMap((user) => {
        // Get the email from the user object
        const email = user ? user.email : '';

        // Create the request body
        const body = { email };

        // Make the POST request
        return this._http.post<Response>(url, body);
      }),
    );
  }

  getFavoriteVideos(): Observable<Video[]> {
    const url = `${this.url}/favorite-videos`;

    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) {
          return throwError('Usuario no autenticado');
        }

        const body = {
          email: user.email,
          connection: user.sub?.split('|')[0],
        };

        return this._http
          .post<{ data: Video[] }>(url, body)
          .pipe(map((response) => response.data));
      }),
      catchError((error) => {
        console.error('Error al obtener los vídeos favoritos:', error);
        return throwError('Error al obtener los vídeos favoritos');
      }),
    );
  }
}
