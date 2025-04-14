document.addEventListener('DOMContentLoaded', function() {
    // Initialize syntax highlighting for code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

    // Textarea auto-resize
    const codeTextarea = document.getElementById('code');
    if (codeTextarea) {
        codeTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Auto-scroll to results
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        // Scroll smoothly to results
        setTimeout(() => {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
    
    // Form submission - add scroll indicator
    const form = document.querySelector('form');
    if (form) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        form.addEventListener('submit', function() {
            if (submitButton) {
                // Change button text to show it's processing
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Analyzing...';
                submitButton.disabled = true;
                
                // Re-enable after a timeout (in case response takes too long)
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 10000);
            }
        });
    }
    
    // Copy to clipboard functionality
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = 'Copy';
        copyButton.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = 'Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
        
        // Add button to parent (pre) element
        const pre = block.parentNode;
        pre.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '10px';
        copyButton.style.padding = '4px 8px';
        copyButton.style.backgroundColor = '#6c63ff';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '12px';
        pre.appendChild(copyButton);
    });
}); 