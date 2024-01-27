// Import your classes
import * as Components from './Components.js';

if (typeof module !== 'undefined' && module.exports) {
    // Export for CommonJS
    module.exports = Components;
} else {
    // Export for ES6
    export * from './Components.js';
}