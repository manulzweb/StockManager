export const statCard = ({title, value, borderStyle=null}) => {
    return `
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center${borderStyle? ' '+borderStyle : ''}">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">${title}</p>
        <p class="text-3xl font-black text-slate-900" id="stat-total">${value}</p>
    </div>
    `
}