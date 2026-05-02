class JarzPWA {
    constructor() {
        this.initTheme();
        this.initPWA();
        this.initStatus();
        this.initInstall();
    }

    initTheme() {
        const toggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    async initPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('SW registered: ', registration);
                this.updateSWStatus('Active ✅');
            } catch (error) {
                console.error('SW registration failed: ', error);
                this.updateSWStatus('Error ❌');
            }
        }
    }

    initStatus() {
        // Online status
        window.addEventListener('online', () => {
            document.getElementById('onlineStatus').textContent = 'Online ✅';
            document.getElementById('onlineStatus').style.color = '#10b981';
        });
        
        window.addEventListener('offline', () => {
            document.getElementById('onlineStatus').textContent = 'Offline 📴';
            document.getElementById('onlineStatus').style.color = '#f59e0b';
        });

        // Initial check
        setTimeout(() => {
            const isOnline = navigator.onLine ? 'Online ✅' : 'Offline 📴';
            document.getElementById('onlineStatus').textContent = isOnline;
            document.getElementById('onlineStatus').style.color = navigator.onLine ? '#10b981' : '#f59e0b';
        }, 100);
    }

    initInstall() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67+ from showing mini-infobar
            e.preventDefault();
            
            // Save the event to trigger later
            deferredPrompt = e;
            
            // Show install button
            this.showInstallPrompt();
        });

        // Install button click
        document.getElementById('installBtn')?.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for user choice
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    deferredPrompt = null;
                    this.hideInstallPrompt();
                }
            }
        });

        // Close install prompt
        document.getElementById('closeInstall')?.addEventListener('click', () => {
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'block';
        }
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
    }

    updateSWStatus(status) {
        const swStatus = document.getElementById('swStatus');
        if (swStatus) {
            swStatus.textContent = status;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JarzPWA();
});

// Fade in animation on load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});