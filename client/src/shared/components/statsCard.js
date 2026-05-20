export const tarjetaEstadistica = ({ titulo, valor, estiloBorde = null }) => {
    return `
    <div class="bg-(--bg-card) p-6 rounded-3xl border border-(--border-100) shadow-sm flex flex-col justify-center transition-colors duration-300${estiloBorde ? ' ' + estiloBorde : ''}">
        <p class="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-1">${titulo}</p>
        <p class="text-3xl font-black text-(--text-primary)" id="stat-total">${valor}</p>
    </div>
    `
}