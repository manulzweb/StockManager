import { obtenerProductosAPI, crearProductoAPI, actualizarProductoAPI, eliminarProductoAPI } from './api/productAPI';
import { dibujarTablaUI, dibujarEstadisticasUI, dibujarPaginacionUI, prepararFormularioEdicionUI, restaurarFormularioACrearUI } from './ui/inventoryUI';
import { showToast, showConfirm } from "../shared/components/Toast";
import i18next from 'i18next';

// 1. Estado de nuestra aplicación
let productos = []; 
let productosFiltrados = []; 
let paginaActual = 1;
const itemsPorPagina = 5;

// Variables para saber si estamos creando o editando un producto
let modoFormulario = 'crear'; 
let idProductoEditando = null; 

let cuerpoTabla, formulario, contenedorPaginacion;

export const initInventory = async () => {
    cuerpoTabla = document.querySelector('#inventory-list');
    formulario = document.querySelector('#product-form');
    contenedorPaginacion = document.querySelector('#pagination');

    configurarEventosFormulario();
    configurarBuscador();

    // 2. Cargamos los datos desde el servidor
    try {
        productos = await obtenerProductosAPI();
        productosFiltrados = [...productos];
    } catch (error) {
        console.log(error);
        showToast(i18next.t('toast.warning'), "Error cargando la base de datos", "error");
    }

    dibujarTodo();
};

export const dibujarTodo = () => {
    // 3. Calculamos qué productos mostrar según la página
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const productosDeEstaPagina = productosFiltrados.slice(inicio, fin);

    // 4. Llamamos a la UI para que pinte el HTML
    dibujarTablaUI(productosDeEstaPagina, cuerpoTabla);
    dibujarEstadisticasUI(productos, document.querySelector('#stats'));
    dibujarPaginacionUI(paginaActual, productosFiltrados.length, itemsPorPagina, contenedorPaginacion);

    asignarEventosPaginacion();
    asignarEventosBotonesTabla();
};

const asignarEventosPaginacion = () => {
    if (!contenedorPaginacion) return;
    const btnAnterior = contenedorPaginacion.querySelector('#btn-prev');
    const btnSiguiente = contenedorPaginacion.querySelector('#btn-next');

    if (btnAnterior && !btnAnterior.disabled) {
        btnAnterior.addEventListener('click', () => {
            paginaActual--;
            dibujarTodo();
        });
    }

    if (btnSiguiente && !btnSiguiente.disabled) {
        btnSiguiente.addEventListener('click', () => {
            paginaActual++;
            dibujarTodo();
        });
    }
};

const configurarEventosFormulario = () => {
    if (!formulario) return;
    
    const btnGuardar = formulario.querySelector('#btn-submit');
    const btnCancelar = formulario.querySelector('#btn-cancel');

    btnCancelar.addEventListener('click', (event) => {
        event.preventDefault(); 
        formulario.reset();
        
        // Volvemos al estado inicial
        modoFormulario = 'crear';
        idProductoEditando = null;
        restaurarFormularioACrearUI(formulario);
    });

    btnGuardar.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const datos = validarFormulario();
        if (!datos) return;

        try {
            if (modoFormulario === 'editar') {
                // 5. Actualizamos el producto existente
                await actualizarProductoAPI(idProductoEditando, datos);
                
                const indice = productos.findIndex(p => String(p.id) === String(idProductoEditando));
                if (indice !== -1) productos[indice] = { ...productos[indice], ...datos };
                productosFiltrados = [...productos];
                
                showToast(i18next.t('toast.notification'), i18next.t('toast.success_update'), "success");
                
                // Reiniciamos al modo crear
                modoFormulario = 'crear';
                idProductoEditando = null;
                restaurarFormularioACrearUI(formulario);
            } else {
                // 6. Creamos un producto nuevo
                const nuevoProducto = await crearProductoAPI(datos);
                productos.push(nuevoProducto);
                productosFiltrados = [...productos];
                
                paginaActual = Math.ceil(productosFiltrados.length / itemsPorPagina) || 1;
                showToast(i18next.t('toast.notification'), i18next.t('toast.success_create'), "success");
            }

            formulario.reset();
            dibujarTodo();

        } catch (error) {
            console.error("Error al guardar:", error);
        }
    });
};

const validarFormulario = () => {
    const nombre = formulario.querySelector('#nombre').value.trim();
    const precio = Number(formulario.querySelector('#precio').value);
    const stockInputText = formulario.querySelector('#stock').value;
    const stock = Number(stockInputText);
    let descripcion = formulario.querySelector('#descripcion').value.trim();

    if (!nombre) {
        showToast(i18next.t('toast.warning'), i18next.t('toast.error_name'), 'warning');
        return null;
    }
    if (!precio || precio <= 0) {
        showToast(i18next.t('toast.warning'), i18next.t('toast.error_price'), 'warning');
        return null;
    }
    if (stockInputText === '' || stock < 0) {
        showToast(i18next.t('toast.warning'), i18next.t('toast.error_stock'), 'warning');
        return null;
    }

    if (!descripcion) descripcion = 'Sin descripción';
    return { nombre, precio, stock, descripcion };
};

const configurarBuscador = () => {
    const buscador = document.querySelector('#search-bar');
    if (!buscador) return;

    buscador.addEventListener('input', (e) => {
        const textoBuscar = e.target.value.toLowerCase().trim();
        paginaActual = 1;

        if (!textoBuscar) {
            productosFiltrados = [...productos];
        } else {
            productosFiltrados = productos.filter(p => 
                p.nombre.toLowerCase().includes(textoBuscar) || 
                p.descripcion.toLowerCase().includes(textoBuscar)
            );
        }
        dibujarTodo();
    });
};

const asignarEventosBotonesTabla = () => {
    const botonesEditar = cuerpoTabla.querySelectorAll('.edit-btn');
    const botonesEliminar = cuerpoTabla.querySelectorAll('.delete-btn');

    botonesEditar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const producto = productos.find(p => String(p.id) === String(id));
            if (producto) {
                // 7. Entramos en modo edición
                modoFormulario = 'editar';
                idProductoEditando = producto.id;
                prepararFormularioEdicionUI(producto, formulario);
            }
        });
    });

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            const producto = productos.find(p => String(p.id) === String(id));
            if (!producto) return;

            const confirmado = await showConfirm(
                i18next.t('toast.confirm_delete_title'),
                producto,
                null,
                { title: i18next.t('toast.cancel_title'), text: i18next.t('toast.cancel_text') }
            );

            if (confirmado) {
                try {
                    // 8. Borramos en la base de datos
                    await eliminarProductoAPI(producto.id);
                    
                    // Borramos en nuestra lista local
                    productos = productos.filter(p => String(p.id) !== String(producto.id));
                    productosFiltrados = [...productos];
                    
                    const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
                    if (paginaActual > totalPaginas && totalPaginas > 0) paginaActual = totalPaginas;
                    
                    showToast(i18next.t('toast.notification'), i18next.t('toast.success_delete'), 'success');
                    dibujarTodo();
                } catch (error) {
                    console.error("Error al eliminar:", error);
                }
            }
        });
    });
};

export { dibujarTablaUI, dibujarEstadisticasUI };
