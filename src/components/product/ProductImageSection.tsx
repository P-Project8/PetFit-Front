interface ProductImageSectionProps {
  imageUrl?: string | null;
  productName: string;
  productUrl?: string;
}

export default function ProductImageSection({
  imageUrl,
  productName,
  productUrl,
}: ProductImageSectionProps) {
  return (
    <div className="aspect-square bg-gray-200">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => window.open(productUrl, '_blank')}
        />
      )}
    </div>
  );
}
