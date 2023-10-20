export function imageExists(imageUrl?: string): Promise<void> {
  if (!imageUrl) {
    return Promise.reject();
  }

  return new Promise(function (resolve, reject) {
    const img = new Image();
    img.onerror = img.onabort = function () {
      reject();
    };
    img.onload = function () {
      resolve();
    };
    img.src = imageUrl;
  });
}
