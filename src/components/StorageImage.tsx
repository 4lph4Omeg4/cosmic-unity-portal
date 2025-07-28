import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getImageUrl = async () => {
      try {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        
        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getImageUrl();
  }, [bucket, path]);

  const handleImageError = () => {
    setError(true);
    setImageUrl(fallback);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-cosmic-gradient animate-pulse rounded-lg"></div>
      )}
      <img
        src={error ? fallback : imageUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
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
