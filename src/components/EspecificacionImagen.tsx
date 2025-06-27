'use client';

import { CldImage } from 'next-cloudinary';

interface Props {
  publicId: string;
  width?: number;
  height?: number;
  alt?: string;
}

export default function EspecificacionImagen({
  publicId,
  width = 400,
  height = 400,
  alt = 'Especificación',
}: Props) {
  return (
    <div className="flex justify-center items-center py-4">
      <CldImage
        src={publicId}
        width={width}
        height={height}
        alt={alt}
        crop={{ type: 'auto', source: true }}
        className="rounded shadow"
      />
    </div>
  );
}
