import { GoogleGenerativeAI } from '@google/generative-ai';

interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export async function generateStylingImage(
  petImage: string,
  clothingImage: string
): Promise<string> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error(
      'Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env'
    );
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
  });

  const urlToGenerativePart = async (url: string): Promise<GenerativePart> => {
    if (url.startsWith('data:')) {
      const match = url.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error('Invalid data URL');
      return {
        inlineData: {
          data: match[2],
          mimeType: match[1],
        },
      };
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<GenerativePart>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const match = base64data.match(/^data:(.+);base64,(.+)$/);
          if (!match) reject(new Error('Failed to convert blob to base64'));
          else {
            resolve({
              inlineData: {
                data: match[2],
                mimeType: match[1],
              },
            });
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to fetch image from URL: ${url}`);
    }
  };

  const petPart = await urlToGenerativePart(petImage);
  const clothingPart = await urlToGenerativePart(clothingImage);

  // Prompt Engineering for Validation (Relaxed)
  const prompt = `
  Analyze the two images provided.
  The goal is to visualize the clothing (2nd image) on the pet (1st image).

  Condition for refusal:
  - Only if the first image is clearly NOT a living animal (e.g. it's a building, landscape, text only).
  - OR if the second image is clearly NOT a fashion item.

  If these specific refusal conditions are met, return: {"error": "INVALID_INPUT"}

  Otherwise, PLEASE PROCEED with the styling generation even if you are unsure.
  "Put the clothing from the second image onto the pet in the first image naturally. Maintain the clothing's pattern and color. Show a full-body shot of the pet wearing the clothes."
  `;

  const result = await model.generateContent([
    prompt,
    petPart,
    clothingPart,
  ]);
  const response = await result.response;
  const text = response.text();

  console.log('Gemini Response Text:', text);

  // Check for validation error
  if (text.includes('INVALID_INPUT') || text.includes('error')) {
    try {
      // Try to parse just in case it's valid JSON
      const json = JSON.parse(text.replace(/```json|```/g, '').trim());
      if (json.error === 'INVALID_INPUT') {
        throw new Error('강아지나 옷 사진이 아닌 것 같습니다. 다시 확인해주세요.');
      }
    } catch (e) {
        // If parsing fails but text has INVALID_INPUT, it's still an error
        if (text.includes('INVALID_INPUT')) {
             throw new Error('강아지나 옷 사진이 아닌 것 같습니다. 다시 확인해주세요.');
        }
    }
  }

  // Handle Image Response
  const imageMatch =
    text.match(/!\[.*?\]\((.*?)\)/) || text.match(/(https?:\/\/[^\s]+)/);

  interface ResponsePart {
    inlineData?: {
      data: string;
      mimeType: string;
    };
    executableCode?: {
      language: string;
    };
  }

  const parts = (response.candidates?.[0].content?.parts ||
    []) as ResponsePart[];
  const imagePart = parts.find(
    (part) =>
      part.inlineData ||
      (part.executableCode && part.executableCode.language === 'png')
  );

  if (imagePart && imagePart.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  } else if (imageMatch) {
    return imageMatch[1];
  } else {
    throw new Error('이미지를 생성하지 못했습니다. 다시 시도해주세요.');
  }
}
