import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MenuMovileComponent } from './components/menus/menu-movile/menu-movile.component';
import { DietsComponent } from './components/diets/diets.component';
import { MenuComponent } from './components/menus/menu/menu.component';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ThaivideosComponent } from './components/thaivideos/thaivideos.component';
import { PerfileMenuComponent } from './components/menus/profile-menu/profile-menu.component';
import { ProfileMenuService } from './services/profile-menu-service.service';
import { FavouriteVideosComponent } from './components/user-profile-views/favourite-videos/favourite-videos.component';
import { ProfileOrdersComponent } from './components/user-profile-views/profile-orders/profile-orders.component';
import { BoxingvideosComponent } from './components/boxingvideos/boxingvideos.component';
import { FitnessvideoComponent } from './components/fitnessvideo/fitnessvideo.component';
import { PlayerComponent } from './components/player/player.component';
import { MerchandisingComponent } from './components/merchandising/merchandising.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PricingComponent } from './components/pricing/pricing.component';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { environment } from 'src/environments/environment.development';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { CartComponent } from './components/cart/cart.component';
import { CookieService } from 'ngx-cookie-service';
import { ShippingAddressPageComponent } from './components/shipping-address-page/shipping-address-page.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { OutStockModalComponent } from './components/out-stock-modal/out-stock-modal.component';
import { MerchandisingBannerComponent } from './components/merchandising-banner/merchandising-banner.component';
import { CookiePopupComponent } from './components/cookie-popup/cookie-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    MenuMovileComponent,
    DietsComponent,
    MenuComponent,
    UserProfileComponent,
    ThaivideosComponent,
    BoxingvideosComponent,
    FitnessvideoComponent,
    PlayerComponent,
    MerchandisingComponent,
    PricingComponent,
    PerfileMenuComponent,
    FavouriteVideosComponent,
    ProfileOrdersComponent,
    SearchbarComponent,
    ProductDetailComponent,
    LoadingScreenComponent,
    CartComponent,
    ShippingAddressPageComponent,
    OrderSummaryComponent,
    OutStockModalComponent,
    MerchandisingBannerComponent,
    CookiePopupComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],

  providers: [
    provideAuth0({
      domain: environment.domain,
      clientId: environment.SPAClientID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        prompt: 'select_account'
      },
      cacheLocation: 'localstorage',
    }),
    ProfileMenuService,
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CookieService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
