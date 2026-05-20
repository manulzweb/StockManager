import i18next from 'i18next';

export const pagination = ({ start, end, total, hasPrev, hasNext }) => {
    const disabledClass = 'text-(--text-muted) cursor-not-allowed border-(--border-100) opacity-50'
    const activeClass = 'text-(--brand) hover:bg-(--bg-hover) border-(--border-200) bg-(--bg-card) shadow-sm'

    const prevClass = hasPrev ? activeClass : disabledClass
    const nextClass = hasNext ? activeClass : disabledClass
    
    const infoText = total === 0 ? i18next.t('pagination.empty') : i18next.t('pagination.info', { start, end, total })

    return `
        <span id="pagination-info" class="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">${infoText}</span>
        <div class="flex gap-4">
            <button id="btn-prev" class="px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${prevClass}" ${!hasPrev ? 'disabled' : ''}>${i18next.t('pagination.prev')}</button>
            <button id="btn-next" class="px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${nextClass}" ${!hasNext ? 'disabled' : ''}>${i18next.t('pagination.next')}</button>
        </div>`
}