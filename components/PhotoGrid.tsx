import Image from "next/image";

const PhotoGrid: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-50">
      {images.map((src, index) => (
        <div key={index} className="relative w-full h-auto overflow-hidden rounded-lg">
          <Image src={src} alt={`Photo ${index + 1}`} layout="fill" objectFit="cover" />
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;