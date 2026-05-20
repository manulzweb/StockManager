import { initTheme } from './services/themeService';
import { initI18n } from './services/i18nService';
import { initInventory, dibujarTodo } from './services/inventoryService';
import { showToast } from './shared/components/Toast';
import './styles/globals.css';

const init = async () => {
    try {
        initTheme();
        await initI18n();
        await initInventory();

        window.addEventListener('languageChanged', () => {
            dibujarTodo();
        });

    } catch (e) {
        showToast('Error', 'Hubo un problema al iniciar la aplicación', 'error');
        console.error(e);
    }
}

init();