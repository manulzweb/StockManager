export const statCard = ({title, value, borderStyle=null}) => {
    return `
    <div class="bg-(--bg-card) p-6 rounded-3xl border border-(--border-100) shadow-sm flex flex-col justify-center transition-colors duration-300${borderStyle? ' '+borderStyle : ''}">
        <p class="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-1">${title}</p>
        <p class="text-3xl font-black text-(--text-primary)" id="stat-total">${value}</p>
    </div>
    `
}