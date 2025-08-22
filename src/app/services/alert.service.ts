import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // Mensaje simple
  async alertMessage(title: string, text: string, icon: SweetAlertIcon = 'success') {
    await Swal.fire({
      icon: icon,
      title: title,
      text: text,
      customClass: {
        popup: 'border-radius-2'
      }
    });
  }

  // Confirmación con aceptar/cancelar
  async alertConfirm(title: string, text: string, icon: SweetAlertIcon = 'warning'): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'border-radius-2'
      }
    });
    return result.isConfirmed;
  }

  // Toast posicionado
  async alertPositioned(title: string, text: string, position: 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start' = 'top-end', icon: SweetAlertIcon = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    await Toast.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
