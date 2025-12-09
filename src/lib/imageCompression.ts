/**
 * Compresses an image to approximately 70-80KB
 * @param file - The image file to compress
 * @param targetSizeKB - Target size in KB (default: 75)
 * @returns Promise with compressed base64 string
 */
export async function compressImage(
  file: File,
  targetSizeKB: number = 75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Check if image is square, if not, warn the user
        const isSquare = img.width === img.height;
        if (!isSquare) {
          console.warn('Image is not square. Recommended: Use a square image for best results.');
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set canvas size to square (crop to center if not square)
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        // Calculate crop position (center crop if not square)
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;

        // Draw image (cropped to square if needed)
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

        // Function to compress with specific quality
        const compressWithQuality = (quality: number): string => {
          return canvas.toDataURL('image/jpeg', quality);
        };

        // Binary search for optimal quality
        let minQuality = 0.1;
        let maxQuality = 0.95;
        let bestQuality = 0.8;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          const testQuality = (minQuality + maxQuality) / 2;
          const testResult = compressWithQuality(testQuality);
          const sizeKB = (testResult.length * 3) / 4 / 1024; // Approximate size in KB

          if (Math.abs(sizeKB - targetSizeKB) < 5) {
            // Within 5KB of target
            bestQuality = testQuality;
            break;
          }

          if (sizeKB > targetSizeKB) {
            maxQuality = testQuality;
          } else {
            minQuality = testQuality;
          }

          bestQuality = testQuality;
          attempts++;
        }

        const finalImage = compressWithQuality(bestQuality);
        const finalSizeKB = (finalImage.length * 3) / 4 / 1024;

        console.log(`Image compressed to ${finalSizeKB.toFixed(2)}KB with quality ${bestQuality.toFixed(2)}`);
        resolve(finalImage);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if an image is approximately square (within 10% tolerance)
 */
export function isImageSquare(width: number, height: number): boolean {
  const ratio = Math.min(width, height) / Math.max(width, height);
  return ratio >= 0.9; // 90% or more is considered "square enough"
}
