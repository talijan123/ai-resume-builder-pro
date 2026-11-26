/* =========================================================
   Image Processing & Compression Utility (HTML5 Canvas)
========================================================= */

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates file type and size.
 * Throws human-readable Error if validation fails.
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error("No image file selected.");
  }

  const fileType = (file.type || "").toLowerCase();
  const isValidType =
    ALLOWED_IMAGE_TYPES.includes(fileType) ||
    file.name.match(/\.(jpe?g|png|webp)$/i);

  if (!isValidType) {
    throw new Error(
      "Unsupported file format. Please select a PNG, JPG, or WebP photo."
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Photo is too large (${sizeInMB}MB). Maximum allowed file size is 5MB.`
    );
  }

  return true;
}

/**
 * Resizes an image file to a square max dimension (400x400)
 * using client-side HTML5 Canvas and compresses it to 0.85 quality.
 *
 * @param {File} file - Raw file from <input type="file" />
 * @param {Object} [options]
 * @param {number} [options.maxDimension=400] - Square max width/height
 * @param {number} [options.quality=0.85] - Compression quality (0 to 1)
 * @returns {Promise<{ dataUrl: string, blob: Blob | null, width: number, height: number }>}
 */
export function processProfileImage(file, options = {}) {
  const { maxDimension = 400, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    try {
      validateImageFile(file);
    } catch (valErr) {
      reject(valErr);
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Unable to read image file from your device."));
    };

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onerror = () => {
        reject(
          new Error("Invalid or corrupted image file. Please try another image.")
        );
      };

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Unable to initialize canvas context."));
            return;
          }

          canvas.width = maxDimension;
          canvas.height = maxDimension;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Center-crop to 1:1 aspect ratio
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            maxDimension,
            maxDimension
          );

          // Use WebP if browser supports, fallback to JPEG
          let outputMime = "image/jpeg";
          try {
            const testUrl = canvas.toDataURL("image/webp");
            if (testUrl.startsWith("data:image/webp")) {
              outputMime = "image/webp";
            }
          } catch {
            outputMime = "image/jpeg";
          }

          const dataUrl = canvas.toDataURL(outputMime, quality);

          canvas.toBlob(
            (blob) => {
              resolve({
                dataUrl,
                blob,
                width: maxDimension,
                height: maxDimension,
              });
            },
            outputMime,
            quality
          );
        } catch (procErr) {
          reject(new Error("Failed to process image: " + procErr.message));
        }
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
}
