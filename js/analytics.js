/**
 * Vercel Web Analytics Initialization
 * 
 * This script initializes Vercel Web Analytics for tracking page views and events.
 * It uses the queue-based approach recommended for static HTML sites.
 */

(function() {
    'use strict';
    
    // Initialize the analytics queue
    window.va = window.va || function() {
        (window.vaq = window.vaq || []).push(arguments);
    };
    
    // Create and inject the Vercel Analytics script
    var script = document.createElement('script');
    script.defer = true;
    script.src = 'https://va.vercel-scripts.com/v1/script.js';
    
    // Fallback to debug version in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        script.src = 'https://va.vercel-scripts.com/v1/script.debug.js';
    }
    
    // Add script to document
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
    } else {
        document.head.appendChild(script);
    }
})();
