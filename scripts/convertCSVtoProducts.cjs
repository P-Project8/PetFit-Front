const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// 카테고리 매핑
const categoryMap = {
  outer: 'outer',
  top: 'top',
  onepiece: 'one-piece',
  muffler: 'muffler',
  acc: 'accessory',
  shoes: 'shoes',
  etc: 'etc',
};

// CSV 파일 경로
const datasetPath = '/Users/therich/Desktop/Coding/petfit-dataset';
const categories = ['outer', 'top', 'onepiece', 'muffler', 'acc', 'shoes', 'etc'];

// 가격 문자열을 숫자로 변환
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // "62,100원" -> 62100
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

// 랜덤 할인율 생성 (0, 10, 20, 30 중 하나)
function getRandomDiscount() {
  const discounts = [0, 0, 0, 10, 20, 30]; // 0이 더 많이 나오도록
  return discounts[Math.floor(Math.random() * discounts.length)];
}

// 랜덤 평점 생성 (4.0 ~ 5.0)
function getRandomRating() {
  return parseFloat((Math.random() * 1 + 4).toFixed(1));
}

// 랜덤 리뷰 수 생성 (0 ~ 200)
function getRandomReviewCount() {
  return Math.floor(Math.random() * 200);
}

// 이미지 경로 변환
function convertImagePath(imagePath, category) {
  if (!imagePath) return undefined;
  // "lepetitchiot_outer_images\001_상품명.png" -> "/images/products/outer_images/001_상품명.png"
  const parts = imagePath.split('\\');
  const filename = parts[parts.length - 1];
  // URL encode the filename to handle special characters and spaces
  const encodedFilename = encodeURIComponent(filename);
  return `/images/products/${category}_images/${encodedFilename}`;
}

// 사이즈 배열 생성
function getSizes() {
  return ['XS', 'S', 'M', 'L', 'XL'];
}

// 색상 배열 생성
function getColors() {
  const allColors = ['블랙', '화이트', '그레이', '베이지', '브라운', '네이비', '레드', '핑크'];
  const count = Math.floor(Math.random() * 3) + 1; // 1~3개
  const shuffled = [...allColors].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

let productId = 1;
const allProducts = [];

// 각 카테고리별 CSV 파일 처리
categories.forEach((category) => {
  const csvPath = path.join(datasetPath, `${category}.csv`);

  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️  ${category}.csv not found, skipping...`);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const parseResult = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log(`📦 Processing ${category}.csv - ${parseResult.data.length} products`);

  parseResult.data.forEach((row) => {
    if (!row.name || !row.price) return; // 필수 필드 없으면 스킵

    const product = {
      id: productId++,
      name: row.name.trim(),
      price: parsePrice(row.price),
      imageUrl: convertImagePath(row.image_path, category),
      description: row.description?.trim() || '',
      category: categoryMap[category],
      discountRate: getRandomDiscount(),
      rating: getRandomRating(),
      reviewCount: getRandomReviewCount(),
      color: getColors(),
      size: getSizes(),
      productUrl: row.product_url || '',
    };

    allProducts.push(product);
  });
});

console.log(`\n✅ Total products: ${allProducts.length}`);

// TypeScript 파일로 저장
const outputPath = path.join(__dirname, '../src/data/products.ts');

const tsContent = `// Auto-generated from CSV files
// Do not edit manually - run 'npm run convert-csv' to regenerate

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  category: string;
  discountRate: number;
  rating: number;
  reviewCount: number;
  color: string[];
  size: string[];
  productUrl?: string;
  // Optional flags for UI features
  isCarousel?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  isLike?: boolean;
}

export const products: Product[] = ${JSON.stringify(allProducts, null, 2)};

export default products;
`;

fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`\n✨ Products data saved to: ${outputPath}`);
console.log(`\n🎉 Done! ${allProducts.length} products converted successfully.`);
