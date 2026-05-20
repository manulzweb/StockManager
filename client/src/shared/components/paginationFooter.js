import i18next from 'i18next';

export const paginacion = ({ inicio, fin, total, tieneAnterior, tieneSiguiente }) => {
    const claseDeshabilitada = 'text-(--text-muted) cursor-not-allowed border-(--border-100) opacity-50'
    const claseActiva = 'text-(--brand) hover:bg-(--bg-hover) border-(--border-200) bg-(--bg-card) shadow-sm hover:cursor-pointer'

    const claseAnterior = tieneAnterior ? claseActiva : claseDeshabilitada
    const claseSiguiente = tieneSiguiente ? claseActiva : claseDeshabilitada

    const textoInfo = total === 0 ? i18next.t('pagination.empty') : i18next.t('pagination.info', { start: inicio, end: fin, total })

    return `
        <span id="pagination-info" class="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">${textoInfo}</span>
        <div class="flex gap-4">
            <button id="btn-prev" class="px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${claseAnterior}" ${!tieneAnterior ? 'disabled' : ''}>${i18next.t('pagination.prev')}</button>
            <button id="btn-next" class="px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${claseSiguiente}" ${!tieneSiguiente ? 'disabled' : ''}>${i18next.t('pagination.next')}</button>
        </div>`
}