// 이진 파일 직렬 프로세스와 JSON 직렬화를 비교하기 위한 예제
// Node.js 환경에서 실행 가능합니다.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 대용량 데이터를 생성하는 함수
function generateLargeData(size) {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      id: i,
      name: `Name_${i}`,
      value: Math.random(),
    });
  }
  return data;
}

// JSON 직렬화 및 파일 저장
function saveAsJSON(data, filePath) {
  const jsonData = JSON.stringify(data);
  fs.writeFileSync(filePath, jsonData);
}

// JSON 파일 읽기 및 역직렬화
function loadFromJSON(filePath) {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

// 이진 파일 직렬화 및 저장
function saveAsBinary(data, filePath) {
  const buffer = Buffer.from(JSON.stringify(data));
  fs.writeFileSync(filePath, buffer);
}

// 이진 파일 읽기 및 역직렬화
function loadFromBinary(filePath) {
  const buffer = fs.readFileSync(filePath);
  return JSON.parse(buffer.toString());
}

// 성능 테스트 함수
function measurePerformance(label, fn) {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  console.log(`${label}: ${(end - start) / 1000000n} ms`);
}

// 메인 함수
function main() {
  const dataSize = 1000000; // 100만 개의 데이터
  const data = generateLargeData(dataSize);

  const jsonFilePath = path.join(__dirname, 'data.json');
  const binaryFilePath = path.join(__dirname, 'data.bin');

  // JSON 저장 및 로드 테스트
  measurePerformance('JSON 저장', () => saveAsJSON(data, jsonFilePath));
  measurePerformance('JSON 로드', () => loadFromJSON(jsonFilePath));

  // 이진 파일 저장 및 로드 테스트
  measurePerformance('이진 파일 저장', () => saveAsBinary(data, binaryFilePath));
  measurePerformance('이진 파일 로드', () => loadFromBinary(binaryFilePath));

  // 파일 크기 비교
  const jsonSize = fs.statSync(jsonFilePath).size;
  const binarySize = fs.statSync(binaryFilePath).size;

  console.log(`\nJSON 파일 크기: ${jsonSize} bytes`);
  console.log(`이진 파일 크기: ${binarySize} bytes`);
}

main();