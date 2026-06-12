import { generateAIStyling } from './aiApi';
import type { AIStylingResult } from './aiApi';

export interface StylingResult {
  stylingId: number;
  resultImageUrl: string;
  resultImageBase64: string; // data URL 형태 "data:image/png;base64,..."
}

async function toBase64(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith('data:')) {
    const match = imageUrl.match(/^data:.+;base64,(.+)$/);
    if (!match) throw new Error('Invalid data URL');
    return match[1];
  }

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const match = result.match(/^data:.+;base64,(.+)$/);
      if (!match) reject(new Error('Failed to convert image to base64'));
      else resolve(match[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateStylingImage(
  petImage: string,
  clothingImage: string,
  productId?: number,
  petProfileId?: number,
): Promise<StylingResult> {
  const petImageBase64 = await toBase64(petImage);
  const clothImageBase64 = await toBase64(clothingImage);

  const result: AIStylingResult = await generateAIStyling(
    petImageBase64,
    clothImageBase64,
    productId,
    petProfileId,
  );

  return {
    stylingId: result.stylingId,
    resultImageUrl: result.resultImageUrl,
    resultImageBase64: result.resultImageBase64
      ? `data:image/png;base64,${result.resultImageBase64}`
      : '',
  };
}
