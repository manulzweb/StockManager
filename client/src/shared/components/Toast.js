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

export const showConfirm = (title, product, confirmed, denied) => {
  const html = product ? `
    <div style="
      background: var(--bg-input);
      border: 1px solid var(--border-200);
      border-radius: 16px;
      padding: 16px;
      margin: 12px 0;
      text-align: left;
    ">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <div style="
          width:36px; height:36px;
          background: var(--danger-bg);
          border: 1px solid var(--danger-border);
          border-radius: 10px;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        ">
          <svg width="18" height="18" fill="none" stroke="var(--danger-text)" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div>
          <p style="margin:0; font-weight:800; font-size:15px; color:var(--text-primary);">${product.nombre}</p>
          <p style="margin:0; font-size:11px; color:var(--text-muted); margin-top:2px;">${product.descripcion}</p>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div style="
          background: var(--bg-card);
          border: 1px solid var(--border-100);
          border-radius: 10px;
          padding: 10px 12px;
        ">
          <p style="margin:0; font-size:9px; font-weight:900; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em;">Precio</p>
          <p style="margin:4px 0 0; font-size:16px; font-weight:800; color:var(--brand);">$${product.precio.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
        </div>
        <div style="
          background: var(--bg-card);
          border: 1px solid var(--border-100);
          border-radius: 10px;
          padding: 10px 12px;
        ">
          <p style="margin:0; font-size:9px; font-weight:900; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em;">Stock</p>
          <p style="margin:4px 0 0; font-size:16px; font-weight:800; color:${product.stock <= 5 ? 'var(--danger-text)' : product.stock <= 10 ? 'var(--warning-text)' : 'var(--success-text)'}">${product.stock} uds.</p>
        </div>
      </div>
    </div>
  ` : ''

  return Swal.fire({
    title: title,
    html: html,
    icon: 'warning',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: i18next.t('toast.yes') || 'Sí',
    denyButtonText: i18next.t('toast.no') || 'No',
    customClass: {
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      confirmButton: 'swal-btn-confirm',
      denyButton: 'swal-btn-deny',
      icon: 'swal-custom-icon'
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