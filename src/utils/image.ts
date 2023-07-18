export function imageExists(imageUrl: string): Promise<void> {
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
