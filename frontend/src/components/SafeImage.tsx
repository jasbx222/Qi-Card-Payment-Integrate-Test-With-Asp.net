import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { IMG, productImage, categoryImage } from '../lib/images';

type Variant = 'product' | 'category' | 'banner' | 'raw';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: Variant;
  sku?: string;
  slug?: string;
  fallback?: string;
}

export default function SafeImage({
  src,
  alt = '',
  variant = 'raw',
  sku,
  slug,
  fallback = IMG.placeholder,
  ...props
}: Props) {
  const resolve = () => {
    if (variant === 'product') return productImage(sku || '', src);
    if (variant === 'category') return categoryImage(slug || '', src);
    return src || fallback;
  };

  const [current, setCurrent] = useState(resolve);

  useEffect(() => {
    setCurrent(resolve());
  }, [src, sku, slug, variant]);

  return (
    <img
      {...props}
      src={current}
      alt={alt}
      loading={props.loading ?? 'lazy'}
      decoding="async"
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
