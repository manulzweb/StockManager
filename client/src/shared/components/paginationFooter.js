export const pagination = ({ start, end, total, hasPrev, hasNext }) => {
    const disabledClass = 'text-slate-300 cursor-not-allowed border-slate-100'
    const activeClass = 'text-indigo-600 hover:bg-slate-50 border-slate-200 bg-white shadow-sm'

    const prevClass = hasPrev ? activeClass : disabledClass
    const nextClass = hasNext ? activeClass : disabledClass
    
    const infoText = total === 0 ? 'No hay productos' : `Mostrando ${start} a ${end} de ${total} productos`

    return `
        <span id="pagination-info" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${infoText}</span>
        <div class="flex gap-4">
            <button id="btn-prev" class="px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${prevClass}" ${!hasPrev ? 'disabled' : ''}>Anterior</button>
            <button id="btn-next" class="px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${nextClass}" ${!hasNext ? 'disabled' : ''}>Siguiente</button>
        </div>`
}