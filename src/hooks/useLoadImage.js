import { useEffect, useState } from 'react';
const useLoadImage = (lowQualitySrc, highQualitySrc) => {
  const [src, setSrc] = useState(lowQualitySrc);
  useEffect(() => {
    setSrc(lowQualitySrc);
    const img = new Image();
    if (highQualitySrc) {
      console.log(highQualitySrc);
      img.src = highQualitySrc.image;
      img.onload = () => {
        setSrc(highQualitySrc.image);
      };
    }
  }, [lowQualitySrc, highQualitySrc]);
  return [src, { blur: src === lowQualitySrc }];
};
export default useLoadImage;
