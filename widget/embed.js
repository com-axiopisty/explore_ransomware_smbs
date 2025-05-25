/**
 * Ransomware Impact Widget Embed Script
 * This script allows easy embedding of the ransomware impact widget on any webpage.
 * 
 * Usage:
 * <script src="path/to/embed.js" data-container="widget-container-id"></script>
 */

(function() {
    // Get the script tag that loaded this script
    const scriptTag = document.currentScript;
    
    // Get the container ID from the data-container attribute, or create a default one
    const containerId = scriptTag.getAttribute('data-container') || 'ransomware-impact-widget';
    
    // Get the base URL for the widget resources
    const scriptSrc = scriptTag.src;
    const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
    
    // Create widget container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    }
    
    // Set container style
    container.style.width = '100%';
    container.style.maxWidth = '1200px';
    container.style.margin = '0 auto';
    container.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
    
    // Create iframe for the widget
    const iframe = document.createElement('iframe');
    iframe.src = baseUrl + 'index.html';
    iframe.style.width = '100%';
    iframe.style.height = '800px'; // Default height
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowtransparency', 'true');
    
    // Add iframe to container
    container.appendChild(iframe);
    
    // Handle responsive resizing
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'resize' && event.data.height) {
            iframe.style.height = event.data.height + 'px';
        }
    });
    
    // Add resize event listener to adjust iframe height on window resize
    window.addEventListener('resize', function() {
        iframe.contentWindow.postMessage({ type: 'checkSize' }, '*');
    });
    
    // Add message to iframe content to enable height reporting
    iframe.onload = function() {
        // Add script to iframe content to report its height
        const resizeScript = `
            window.addEventListener('load', reportHeight);
            window.addEventListener('resize', reportHeight);
            
            function reportHeight() {
                const height = document.body.scrollHeight;
                window.parent.postMessage({ type: 'resize', height: height }, '*');
            }
            
            window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'checkSize') {
                    reportHeight();
                }
            });
        `;
        
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const scriptElement = iframeDoc.createElement('script');
            scriptElement.textContent = resizeScript;
            iframeDoc.body.appendChild(scriptElement);
        } catch (e) {
            console.error('Could not inject resize script into iframe:', e);
        }
    };
})();