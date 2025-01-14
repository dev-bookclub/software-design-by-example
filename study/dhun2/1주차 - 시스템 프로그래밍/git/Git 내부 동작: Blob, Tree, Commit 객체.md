# Git 내부 동작: Blob, Tree, Commit 객체

## 1. 기본 개념

Git은 세 가지 주요 객체를 기반으로 데이터를 관리합니다:

1. **Blob 객체 (파일 내용)**

   - 파일의 **내용**만 저장하는 객체입니다.
   - 파일 이름이나 경로는 저장되지 않습니다.
   - 내용이 동일하면 같은 해시 값을 가지며, 중복 저장을 방지합니다.

2. **Tree 객체 (디렉토리 구조)**

   - 디렉토리 구조를 표현하는 객체입니다.
   - 디렉토리 내부의 파일과 하위 디렉토리를 Blob 또는 Tree 객체로 참조합니다.

3. **Commit 객체**
   - 특정 시점의 프로젝트 상태(Snapshot)를 표현하는 객체입니다.
   - Tree 객체를 참조하며, 부모 커밋, 작성자 정보, 커밋 메시지를 포함합니다.

---

## 2. 객체 간 관계

Git의 데이터 모델은 객체 간 참조를 통해 작동합니다. 예를 들어:

```
Commit Object
  └── Tree Object (루트 디렉토리)
      ├── Blob Object (file1.txt 내용)
      └── Tree Object (subdir 디렉토리)
          └── Blob Object (file2.txt 내용)
```

---

## 3. Blob 객체 (파일 내용)

### 역할:

- Blob은 **파일의 내용**만 저장합니다.
- 동일한 내용의 파일은 동일한 SHA-1 해시를 가지므로 중복 저장을 방지합니다.

### 특징:

- 파일 이름, 경로 정보는 저장되지 않음.
- Git은 파일의 내용을 Zlib으로 압축하여 저장.

### 예제:

```bash
# 파일 생성
echo "Hello, World!" > hello.txt

# 파일을 Git에 추가
git add hello.txt

# Blob 해시 확인
git hash-object hello.txt
# 결과: fc3ff98e8c6a0d3087d515c0473f8677
```

---

## 4. Tree 객체 (디렉토리 구조)

### 역할:

- Tree 객체는 디렉토리 구조와 Blob/Tree 객체를 참조합니다.
- 파일과 디렉토리를 계층적으로 관리합니다.

### 특징:

- Blob 객체와 다른 Tree 객체를 참조합니다.
- 파일의 이름, 권한, 타입(Blob/Tree)을 저장.

### 예제:

```bash
# 파일 및 디렉토리 생성
echo "File 1" > file1.txt
mkdir subdir
echo "File 2" > subdir/file2.txt

# Git에 추가
git add .

# Tree 객체 확인
git ls-tree HEAD
# 결과:
# 100644 blob <file1_hash> file1.txt
# 040000 tree <subdir_hash> subdir
```

---

## 5. Commit 객체

### 역할:

- Commit 객체는 특정 시점의 프로젝트 상태를 나타냅니다.
- Tree 객체를 참조하며, 부모 커밋, 작성자, 메시지 등의 메타데이터를 포함합니다.

### 특징:

- 부모 커밋 정보를 통해 커밋 히스토리를 연결.
- 작성자, 시간, 메시지 등의 정보를 포함.

### 예제:

```bash
# 커밋 생성
git commit -m "Initial commit"

# Commit 객체 확인
git cat-file -p HEAD
# 결과:
# tree <tree_hash>
# author Your Name <you@example.com> 1736335454 +0900
# committer Your Name <you@example.com> 1736335454 +0900
#
# Initial commit
```

---

## 6. 플로우: 객체 간 데이터 흐름

1. **파일 추가 (`git add`)**:

   - Git은 파일의 내용을 읽고, Blob 객체를 생성.
   - Blob 객체는 `.git/objects/` 디렉토리에 저장.

2. **디렉토리 구조 생성**:

   - Blob 객체를 참조하는 Tree 객체를 생성.
   - 디렉토리 내부 파일과 하위 디렉토리를 Tree로 재귀적으로 연결.

3. **커밋 (`git commit`)**:
   - Tree 객체를 참조하여 Commit 객체를 생성.
   - Commit 객체는 부모 커밋과 Tree 객체를 참조.

### 시각화:

```
Initial Commit:
Commit Object (커밋)
  └── Tree Object (디렉토리 구조)
      ├── Blob Object (file1.txt)
      └── Blob Object (file2.txt)
```

---

## 7. 변경 사항 감지 및 저장

1. Git은 Blob 객체의 해시를 비교하여 파일 변경 여부를 판단.
2. 변경된 내용만 새로운 Blob 객체로 저장.
3. Tree 객체는 변경된 Blob만 업데이트하여 효율적으로 관리.

### 예제:

```bash
# 파일 변경
echo "Modified content" >> file1.txt

git add file1.txt

# Blob 객체와 Tree 객체 비교
git diff --cached
```

---

## 8. 요약

- **Blob 객체**: 파일 내용만 저장 (중복 방지).
- **Tree 객체**: 디렉토리 구조와 파일 참조 관리.
- **Commit 객체**: 특정 시점의 프로젝트 상태를 기록.

Git은 이 세 가지 객체를 통해 효율적이고 신뢰성 높은 버전 관리를 제공합니다.
