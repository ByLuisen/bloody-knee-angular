import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.css'],
})
export class ProfileOrdersComponent implements OnInit {
  loading: boolean = false;
  orders!: Order[];
  openModal: boolean = false;
  role!: string;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getRole().subscribe((response) => {
      this.role = response
    });
    this.loading = true;
    this.http.getOrders().subscribe((orders) => {
      this.loading = false;
      this.orders = orders;
    });
  }

  cancelOrder(order: Order): void {
    this.http.cancelOrder(order).subscribe((response) => {
      if (response) {
        // Search the index of the order parametre
        const orderIndex = this.orders.findIndex((o) => o.id === order.id);
        if (orderIndex !== -1) {
          // Change the status order to canceled
          this.orders[orderIndex].status = 'Cancelado';
        }
        this.openModal = true;
      }
    });
  }
}
