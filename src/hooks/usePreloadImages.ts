import { useEffect, useState } from 'react';

export const usePreloadImages = (imageUrls: (string | undefined)[]) => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const validUrls = imageUrls.filter((url): url is string => !!url);
    if (validUrls.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = validUrls.length;

    const promises = validUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.src = url;
      });
    });

    Promise.all(promises).then(() => {
      setLoaded(true);
    });
  }, [imageUrls]);

  return { loaded, progress };
};
