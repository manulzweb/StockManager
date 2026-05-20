import { inicializarTema } from './services/themeService';
import { inicializarI18n } from './services/i18nService';
import { inicializarInventario, dibujarTodo } from './services/inventoryService';
import { mostrarToast } from './shared/components/Toast';
import './styles/globals.css';

const inicializar = async () => {
    try {
        inicializarTema();
        await inicializarI18n();
        await inicializarInventario();

        window.addEventListener('languageChanged', () => {
            dibujarTodo();
        });

    } catch (error) {
        mostrarToast('Error', 'Hubo un problema al iniciar la aplicación', 'error');
        console.error(error);
    }
}

inicializar();