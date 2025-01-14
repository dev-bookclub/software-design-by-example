# Git diff --cached 내부 동작

## 1. 내부적인 비교 흐름

### HEAD 커밋의 Tree 객체 로드
- `HEAD`는 마지막 커밋을 가리키며, 해당 커밋의 Tree 객체는 프로젝트 상태(파일과 디렉토리 구조)를 나타냅니다.
- Tree 객체에서 파일과 Blob 객체(내용)를 참조합니다.

### 스테이징 영역의 Tree 객체 생성
- `git add`를 통해 스테이징된 파일은 새로운 Blob 객체로 저장됩니다.
- 스테이징 영역의 상태는 Tree 객체로 표현됩니다.

### Blob 객체 비교
- Git은 `HEAD`에 저장된 Blob 객체와 스테이징된 Blob 객체의 SHA-1 해시를 비교하여 파일의 변경 여부를 판단합니다.
- 변경된 파일은 diff 알고리즘을 통해 줄 단위로 비교합니다.

---

## 2. git diff 내부 동작

### A. Blob 객체로 파일 내용을 관리
Git은 파일의 내용을 Blob 객체로 저장하고, SHA-1 해시를 기반으로 비교합니다.

#### 예제

1. **기존 Blob 객체**:
   - `HEAD` 커밋 기준으로 `file.txt`의 Blob 객체를 가져옵니다.
   - Blob 해시: `fc3ff98e8c6a0d3087d515c0473f8677`

2. **스테이징된 Blob 객체**:
   - `git add` 이후 새롭게 생성된 Blob 객체.
   - 변경된 파일 내용에 따라 새로운 Blob 해시 생성: `a1d2f38b764ec7e8b6f0ab6b45dc9c1e`

3. **해시 비교**:
   - `fc3ff98e...` (HEAD) ≠ `a1d2f38b...` (스테이징) → 파일 변경 감지.

### B. Diff 알고리즘으로 변경 내용 확인
Git은 Blob 객체의 실제 내용을 읽고, diff 알고리즘을 적용하여 줄 단위로 변경 사항을 비교합니다.

#### Diff 알고리즘:
- **Longest Common Subsequence (LCS)** 알고리즘을 사용하여 두 파일에서 공통된 줄을 찾습니다.
- 공통되지 않는 줄을 기준으로 추가(`+`)/삭제(`-`) 구문을 생성.

#### 예제

**HEAD 파일 내용:**
```plaintext
Hello, World!
```

**스테이징된 파일 내용:**
```plaintext
Hello, World!
Modified Line
```

**Diff 결과:**
```diff
@@ -1 +1,2 @@
 Hello, World!
+Modified Line
```
- `+`는 새로 추가된 줄.
- `-`는 삭제된 줄.

---

## 3. 주요 Git 데이터 구조 활용

### A. Tree 객체
Tree 객체는 디렉토리 구조와 각 파일의 Blob 해시를 참조합니다.

```plaintext
Tree Object (HEAD)
├── file.txt -> Blob(fc3ff98e8c6a0d3087d515c0473f8677)

Tree Object (Staging)
├── file.txt -> Blob(a1d2f38b764ec7e8b6f0ab6b45dc9c1e)
```

Git은 Tree 객체에서 동일한 파일 이름을 찾아 Blob 해시를 비교합니다.

### B. Blob 객체
Blob 객체는 파일 내용을 저장합니다.

**Blob 데이터 (HEAD):**
```plaintext
Hello, World!
```

**Blob 데이터 (스테이징):**
```plaintext
Hello, World!
Modified Line
```

Git은 Blob 데이터를 읽고 diff 알고리즘을 실행하여 변경 내용을 계산합니다.

---

## 4. 내부 구현 코드 (의사 코드)

아래는 Git이 내부적으로 Blob 객체를 비교하고 diff를 계산하는 방식을 자바스크립트로 간단히 표현한 의사 코드입니다.

```javascript
const crypto = require('crypto');

// SHA-1 해시 생성
function generateHash(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

// Diff 계산 (Longest Common Subsequence)
function calculateDiff(oldContent, newContent) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const diff = [];

  newLines.forEach((line, index) => {
    if (line !== oldLines[index]) {
      diff.push({ type: oldLines[index] ? 'modified' : 'added', line: index + 1, content: line });
    }
  });

  return diff;
}

// 파일 비교
function compareFiles(headFile, stagedFile) {
  const headHash = generateHash(headFile);
  const stagedHash = generateHash(stagedFile);

  if (headHash !== stagedHash) {
    console.log('Changes detected!');
    const diff = calculateDiff(headFile, stagedFile);
    diff.forEach(change => {
      console.log(`${change.type === 'added' ? '+' : '-'} Line ${change.line}: ${change.content}`);
    });
  } else {
    console.log('No changes detected.');
  }
}

// Example usage
const headContent = 'Hello, World!\n';
const stagedContent = 'Hello, World!\nModified Line\n';

compareFiles(headContent, stagedContent);
```

---

## 5. 요약

- Git은 파일의 내용을 Blob 객체로 저장하고, SHA-1 해시를 통해 파일 변경 여부를 판단합니다.
- **Blob 해시가 다르면, 파일 내용을 읽어 Diff 알고리즘(LCS)**을 사용해 줄 단위 변경을 계산합니다.
- 결과는 `+`와 `-`로 표현되어 커밋 전 검토가 가능해집니다.
