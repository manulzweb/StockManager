export const obtenerColorPorStock = (stock) => {
    const COLORES_STOCK = [
        { limite: 5, estilos: 'bg-(--danger-bg) text-(--danger-text) border-(--danger-border)' },
        { limite: 10, estilos: 'bg-(--warning-bg) text-(--warning-text) border-(--warning-border)' }
    ]

    let primerValido = COLORES_STOCK.find(item => stock < item.limite)
    return primerValido?.estilos || 'bg-(--success-bg) text-(--success-text) border-(--success-border)'
}
