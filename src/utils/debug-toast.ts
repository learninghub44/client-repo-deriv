// TEMPORARY diagnostic helper — remove once the trade-profit/trade-loss sound issue is confirmed fixed.
// Shows a small on-screen toast stack (top of viewport) so issues are visible on a phone with no DevTools.

let container: HTMLDivElement | null = null;

const getContainer = (): HTMLDivElement => {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.id = 'debug-toast-container';
    container.style.cssText = [
        'position:fixed',
        'top:calc(env(safe-area-inset-top, 0px) + 8px)',
        'left:8px',
        'right:8px',
        'z-index:2147483647',
        'display:flex',
        'flex-direction:column',
        'gap:4px',
        'pointer-events:none',
        'font-family:monospace',
    ].join(';');
    document.body.appendChild(container);
    return container;
};

export const showDebugToast = (message: string) => {
    try {
        const el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = [
            'background:rgba(0,0,0,0.88)',
            'color:#0f0',
            'font-size:11px',
            'line-height:1.4',
            'padding:6px 10px',
            'border-radius:6px',
            'word-break:break-all',
            'box-shadow:0 2px 8px rgba(0,0,0,0.4)',
        ].join(';');
        getContainer().appendChild(el);
        setTimeout(() => el.remove(), 8000);
    } catch {
        // no-op — diagnostic helper must never throw
    }
};
