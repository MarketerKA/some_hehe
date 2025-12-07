import { ReactNode } from 'react';
import { usePreloadImages } from '../../hooks/usePreloadImages';
import './ImagePreloader.scss';

interface ImagePreloaderProps {
  images: (string | undefined)[];
  children: ReactNode;
}

const ImagePreloader = ({ images, children }: ImagePreloaderProps) => {
  const { loaded, progress } = usePreloadImages(images);

  if (!loaded) {
    return (
      <div className="image-preloader">
        <div className="preloader-content">
          <h2>Загружаем квест... 🔥</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ImagePreloader;
