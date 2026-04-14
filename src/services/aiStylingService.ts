import { generateAIStyling } from './api';

// data URL 또는 원격 URL을 순수 base64 문자열로 변환
async function toBase64(imageUrl: string): Promise<string> {
  // 이미 data URL인 경우: "data:image/jpeg;base64,/9j/..." 형태에서 base64 부분만 추출
  if (imageUrl.startsWith('data:')) {
    const match = imageUrl.match(/^data:.+;base64,(.+)$/);
    if (!match) throw new Error('Invalid data URL');
    return match[1];
  }

  // 원격 URL인 경우: fetch로 가져와서 base64로 변환
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
): Promise<string> {
  const petImageBase64 = await toBase64(petImage);
  const clothImageBase64 = await toBase64(clothingImage);

  const resultBase64 = await generateAIStyling(petImageBase64, clothImageBase64);

  // 백엔드가 순수 base64만 반환한다고 가정하고 data URL로 감싸서 반환
  return `data:image/png;base64,${resultBase64}`;
}
