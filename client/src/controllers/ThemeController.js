export class ThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Update select value if exists
        const themeSelect = document.querySelector('#theme-selector');
        if (themeSelect) {
            themeSelect.value = theme;
        }
    }

    setTheme(theme) {
        this.applyTheme(theme);
    }
}
