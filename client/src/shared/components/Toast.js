import Swal from 'sweetalert2'
import i18next from 'i18next'

export const showToast = (title, text='', icon='success') => {
  Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  }).fire({
    icon: icon,
    title: title,
    text: text
  })
}

export const showConfirm = (title, text='', confirmed, denied) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: i18next.t('toast.yes') || 'Sí',
    denyButtonText: i18next.t('toast.no') || 'No',
    customClass: {
      popup: 'rounded-3xl shadow-xl bg-(--bg-card) text-(--text-primary)',
      confirmButton: 'order-0 rounded-xl px-6 py-2 bg-(--brand) text-(--text-inverse)',
      denyButton: 'order-1 rounded-xl px-6 py-2 bg-(--bg-hover) text-(--text-primary)'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      if (confirmed) showToast(confirmed.title, confirmed.text || '', 'success')
      return true
    } else if (result.isDenied) {
      if (denied) showToast(denied.title, denied.text || '', 'info')
      return false
    }
    return false
  })
}