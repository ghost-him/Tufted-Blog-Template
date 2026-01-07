/**
 * 主题切换功能
 * 
 * 支持三种状态：
 * 1. 用户未设置偏好 - 跟随系统
 * 2. 用户手动选择深色模式
 * 3. 用户手动选择浅色模式
 */
(function() {
    const STORAGE_KEY = 'theme-preference';
    
    // 获取用户保存的主题偏好
    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }
    
    // 保存用户主题偏好
    function setStoredTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // localStorage not available
        }
    }
    
    // 获取系统偏好的主题
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // 获取当前应该应用的主题
    function getCurrentTheme() {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return getSystemTheme();
    }
    
    // 应用主题到文档
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleButton(theme);
    }
    
    // 更新切换按钮的图标
    function updateToggleButton(theme) {
        const button = document.getElementById('theme-toggle');
        if (!button) return;
        
        const sunIcon = button.querySelector('.sun-icon');
        const moonIcon = button.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
            button.setAttribute('aria-label', '切换到浅色模式');
        } else {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
            button.setAttribute('aria-label', '切换到深色模式');
        }
    }
    
    // 切换主题
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setStoredTheme(newTheme);
        applyTheme(newTheme);
    }
    
    // 创建切换按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.className = 'theme-toggle-btn';
        button.type = 'button';
        button.setAttribute('aria-label', '切换主题');
        
        // 太阳图标 (用于深色模式下显示，点击切换到浅色)
        button.innerHTML = `
            <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        
        button.addEventListener('click', toggleTheme);
        
        return button;
    }
    
    // 初始化
    function init() {
        // 在 DOM 加载完成前先应用主题以防止闪烁
        const theme = getCurrentTheme();
        document.documentElement.setAttribute('data-theme', theme);
        
        // DOM 加载完成后添加按钮
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }
    
    function onDOMReady() {
        const button = createToggleButton();
        
        // 查找 header nav 元素，将按钮添加到导航栏中
        const nav = document.querySelector('header nav');
        if (nav) {
            nav.appendChild(button);
        } else {
            // 如果没有 nav，则添加到 body
            document.body.appendChild(button);
        }
        
        // 更新按钮状态
        updateToggleButton(getCurrentTheme());
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            // 只有在用户没有手动设置偏好时才跟随系统
            if (!getStoredTheme()) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // 立即执行初始化
    init();
})();
