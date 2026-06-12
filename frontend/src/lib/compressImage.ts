export async function compressImage(
  file: File,
  maxWidth = 1400,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas не поддерживается'));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const usePng = file.type === 'image/png' && file.size < 500 * 1024;
          const dataUrl = canvas.toDataURL(usePng ? 'image/png' : 'image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Ошибка обработки'));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
