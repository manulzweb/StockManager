import { filaTabla } from "../../shared/components/tableRow";
import { formatearPrecioTexto } from "../../shared/utils/formatters";
import { tarjetaEstadistica } from "../../shared/components/statsCard";
import { paginacion } from "../../shared/components/paginationFooter";
import i18next from 'i18next';

export const dibujarTablaUI = (productosDeEstaPagina, cuerpoTabla) => {
    if (!cuerpoTabla) return;

    if (productosDeEstaPagina.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5" class="py-10 text-center text-slate-500">${i18next.t('table.empty')}</td></tr>`;
        return;
    }

    let htmlFilas = '';
    productosDeEstaPagina.forEach(producto => {
        htmlFilas += filaTabla(producto);
    });

    cuerpoTabla.innerHTML = htmlFilas;
};

export const dibujarEstadisticasUI = (todosLosProductos, contenedorStats) => {
    if (!contenedorStats) return;

    let valorTotal = 0;
    let stockCritico = 0;

    todosLosProductos.forEach(prod => {
        valorTotal += (prod.stock * prod.precio);
        if (prod.stock <= 5) stockCritico++;
    });

    contenedorStats.innerHTML = `
        ${tarjetaEstadistica({ titulo: i18next.t('stats.total_sku'), valor: todosLosProductos.length })}
        ${tarjetaEstadistica({ titulo: i18next.t('stats.inventory_value'), valor: '$' + formatearPrecioTexto(valorTotal), estiloBorde: 'border-l-4 border-l-(--brand)' })}
        ${tarjetaEstadistica({ titulo: i18next.t('stats.critical_stock'), valor: stockCritico, estiloBorde: 'border-l-4 border-l-(--danger-border)', valueColor: 'text-(--danger-text)' })}
    `;
};

export const dibujarPaginacionUI = (paginaActual, totalFiltrados, itemsPorPagina, contenedorPaginacion) => {
    if (!contenedorPaginacion) return;

    const inicioNum = totalFiltrados === 0 ? 0 : ((paginaActual - 1) * itemsPorPagina) + 1;
    const finNum = Math.min(paginaActual * itemsPorPagina, totalFiltrados);

    const tieneAnterior = paginaActual > 1;
    const tieneSiguiente = paginaActual < Math.ceil(totalFiltrados / itemsPorPagina);

    contenedorPaginacion.innerHTML = paginacion({
        inicio: inicioNum,
        fin: finNum,
        total: totalFiltrados,
        tieneAnterior: tieneAnterior,
        tieneSiguiente: tieneSiguiente
    });
};

export const prepararFormularioEdicionUI = (producto, formulario) => {
    formulario.querySelector('#nombre').value = producto.nombre || '';
    formulario.querySelector('#precio').value = producto.precio || '';
    formulario.querySelector('#stock').value = producto.stock || 0;
    formulario.querySelector('#descripcion').value = producto.descripcion || '';

    const tituloFormulario = document.querySelector('#form-title');
    tituloFormulario.setAttribute('data-i18n', 'form.title_edit');
    tituloFormulario.textContent = i18next.t('form.title_edit');

    const btnGuardar = formulario.querySelector('#btn-submit');
    btnGuardar.setAttribute('data-i18n', 'form.btn_update');
    btnGuardar.textContent = i18next.t('form.btn_update');
};

export const restaurarFormularioACrearUI = (formulario) => {
    const tituloFormulario = document.querySelector('#form-title');
    tituloFormulario.setAttribute('data-i18n', 'form.title_create');
    tituloFormulario.textContent = i18next.t('form.title_create');

    const btnGuardar = formulario.querySelector('#btn-submit');
    btnGuardar.setAttribute('data-i18n', 'form.btn_save');
    btnGuardar.textContent = i18next.t('form.btn_save');
};
