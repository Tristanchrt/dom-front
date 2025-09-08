import { useEffect, useState } from 'react';
import { productsUseCases } from '@/data/container';
import { Product } from '@/domain/models/Product';

export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!productId) return;
    setIsLoading(true);
    productsUseCases
      .getById(productId)
      .then((p) => {
        if (mounted) setProduct(p);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [productId]);

  return { product, isLoading };
}
