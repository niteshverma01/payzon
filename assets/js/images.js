// Function to fix image paths
document.addEventListener('DOMContentLoaded', function() {
    // Get all images
    const images = document.querySelectorAll('img');
    
    // Fix paths for each image
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (!src) return;

        // Only modify paths that need fixing
        let newSrc = src;
        
        // Handle paths that start with ./
        if (src.startsWith('./')) {
            newSrc = src.substring(2); // Remove the ./ from the beginning
        }
        // Handle paths that start with ../
        else if (src.startsWith('../')) {
            newSrc = src.substring(3);
        }
        // Handle paths that start with /
        else if (src.startsWith('/')) {
            newSrc = src.substring(1);
        }
        // Don't modify paths that are already correct
        else if (src.startsWith('assets/') || src.startsWith('data:') || src.startsWith('http')) {
            return;
        }

        // Update the src attribute only if the path was modified
        if (newSrc !== src) {
            img.setAttribute('src', newSrc);
            console.log('Updated image path from:', src, 'to:', newSrc);
        }

        // Add error handler to debug loading issues
        img.onerror = function() {
            console.error('Failed to load image:', this.src);
            console.log('Original path:', src);
            console.log('Attempted path:', newSrc);
        };
    });
}); 