import React, { useState, useEffect } from 'react';

interface StorageImageProps {
  bucket: string;
  path: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

const StorageImage: React.FC<StorageImageProps> = ({
  bucket,
  path,
  alt = '',
  className = '',
  fallback = '/placeholder.svg'
}) => {
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [loading, setLoading] = useState(false); // No loading needed if just fallback
  const [error, setError] = useState(false);

  useEffect(() => {
    // Since Supabase is removed, we can't fetch the image.
    // We'll just use the fallback or a placeholder.
    // If you have public URLs, you could hardcode the base URL here.
    // For now, we default to fallback.
    setImageUrl(fallback);
  }, [bucket, path, fallback]);

  const handleImageError = () => {
    setError(true);
    setImageUrl(fallback);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'
          } ${error ? 'filter grayscale' : ''}`}
        onLoad={() => setLoading(false)}
        onError={handleImageError}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <p className="text-muted-foreground text-sm">Afbeelding niet beschikbaar</p>
        </div>
      )}
    </div>
  );
};

export default StorageImage;
