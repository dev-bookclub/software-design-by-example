# ArrayBuffer

## 정의

- 고정된 크기의 원시 바이너리 데이터를 나타내는 객체.

  - An `ArrayBuffer` is a fixed-length raw binary data buffer. It is an object used to represent a generic, fixed-length raw binary data buffer. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
  - `ArrayBuffer`는 **저수준 메모리 관리**를 위한 도구로, 데이터를 바이트 단위로 조작할 수 있도록 설계됨.
  - 고수준 데이터 표현(JSON, 객체 등)과는 달리, **메모리를 직접 제어**하며 효율적인 데이터 처리를 지원.
  - 이를 통해 네트워크 프로토콜, 파일 포맷, 그래픽 렌더링 등에서 바이너리 데이터를 처리할 수 있음.

  ### ArrayBuffer vs. 고수준 데이터 표현 (JSON)

- `ArrayBuffer`는 데이터를 이진 데이터로 저장하며, 메모리 크기와 처리 속도에서 최적화된 성능을 제공.
- JSON은 사람이 읽기 쉬운 고수준 데이터 표현 방식으로, 직렬화 및 역직렬화 과정에서 추가적인 메모리와 CPU 리소스를 소모.

| 특징                 | ArrayBuffer                   | JSON                         |
| -------------------- | ----------------------------- | ---------------------------- |
| **목적**             | 저수준 바이너리 데이터 처리   | 고수준 데이터 표현 및 직렬화 |
| **데이터 표현 방식** | 원시 바이너리 데이터          | 텍스트 기반                  |
| **메모리 효율성**    | 메모리 크기가 고정되어 효율적 | 직렬화 과정에서 크기 증가    |
| **처리 속도**        | 빠름 (직접 메모리 조작 가능)  | 느림 (파싱 및 직렬화 필요)   |

## 특징

### 고정 크기

- `ArrayBuffer`는 생성 시 고정된 크기를 지정하며, 이후 크기를 변경할 수 없음.
- 크기는 **바이트 단위**로 정의됨.

```js
const buffer = new ArrayBuffer(16); // 16 바이트 크기의 ArrayBuffer 생성
console.log(buffer.byteLength); // 16
```

### 데이터 직접 조작 불가

- `ArrayBuffer`는 데이터를 저장할 메모리만 할당하며, 데이터에 직접 접근하거나 조작할 수 없음.
- 데이터를 읽거나 쓰려면 `TypedArray` 또는 `DataView`를 사용해야 함.

```javascript
const buffer = new ArrayBuffer(8); // 8 바이트 버퍼 생성
const uint8 = new Uint8Array(buffer); // Uint8Array로 접근
uint8[0] = 255; // 첫 번째 바이트에 255 저장
console.log(uint8[0]); // 255
```

### 바이트 정렬과 구조

- `ArrayBuffer`는 특정 데이터 구조나 형식에 얽매이지 않고, 원시 바이너리 데이터만 저장.
- 데이터 해석 방식은 사용하는 뷰(`TypedArray`, `DataView`)에 따라 달라짐.

## 주요 메서드 및 프로퍼티

### 1. **`byteLength`**

- `ArrayBuffer`의 크기를 바이트 단위로 반환.
- 읽기 전용 프로퍼티.

```js
const buffer = new ArrayBuffer(10);
console.log(buffer.byteLength); // 10
```

### 2. **`slice(begin, end)`**

- 지정한 범위만큼의 데이터를 복사하여 새로운 `ArrayBuffer`를 생성.
- 원본은 변경되지 않고, 복사된 데이터는 **독립된 메모리 공간**에 저장.

```javascript
const buffer = new ArrayBuffer(8);
const uint8View = new Uint8Array(buffer);
uint8View.set([1, 2, 3, 4, 5, 6, 7, 8]); // 데이터 설정

const slicedBuffer = buffer.slice(2, 6); // 2~5 바이트 복사
const slicedView = new Uint8Array(slicedBuffer);

console.log(slicedView); // Uint8Array [3, 4, 5, 6]
```

## ArrayBuffer의 데이터 조작

### TypedArray

- 정수(`Int8Array`, `Uint8Array` 등), 부동소수점(`Float32Array`, `Float64Array`) 등 다양한 데이터 형식으로 데이터를 읽고 쓸 수 있음.
- 특정 크기와 데이터 형식에 따라 메모리를 구조화.

```js
const buffer = new ArrayBuffer(8); // 8 바이트 버퍼 생성
const int32View = new Int32Array(buffer); // 4 바이트씩 정수형 데이터로 접근
int32View[0] = 42; // 첫 번째 정수에 42 저장
console.log(int32View[0]); // 42
```

### DataView

- `TypedArray`보다 유연하게 데이터를 읽고 쓸 수 있음.
- 다양한 데이터 형식(정수, 부동소수점, Big-Endian/Little-Endian)으로 조작 가능.

```js
const buffer = new ArrayBuffer(16); // 16 바이트 버퍼 생성
const view = new DataView(buffer);

view.setInt16(0, 256); // 첫 번째 바이트에 256 저장 (2 바이트 정수)
console.log(view.getInt16(0)); // 256
```

- 추가 예제

```js
const buffer = new ArrayBuffer(10); // 10 바이트 버퍼 생성
const int32View = new Int32Array(buffer);

console.log(int32View.length); // 2 (10 바이트 중 8 바이트만 사용)
console.log(int32View.byteLength); // 8 (실제 사용되는 바이트)
console.log(buffer.byteLength); // 10 (원래 ArrayBuffer의 크기)
```

- `DataView`를 사용하면 남은 2 바이트도 확인할 수 있음

```js
const buffer = new ArrayBuffer(10);
const view = new DataView(buffer);

view.setUint8(8, 255); // 9번째 바이트에 값 저장
view.setUint8(9, 128); // 10번째 바이트에 값 저장

console.log(view.getUint8(8)); // 255
console.log(view.getUint8(9)); // 128
```

## 활용 사례

### 1. 파일 데이터 처리

- 브라우저에서 파일을 읽을 때 바이너리 데이터를 `ArrayBuffer`로 처리.

```js
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const arrayBuffer = reader.result; // ArrayBuffer 형태로 결과 제공
    console.log(arrayBuffer);
  };

  reader.readAsArrayBuffer(file);
});
```

### 2. 네트워크 요청

- `fetch` API를 사용하여 바이너리 데이터를 요청하고 처리.

```js
fetch('https://example.com/file')
  .then((response) => response.arrayBuffer())
  .then((buffer) => {
    console.log(buffer); // ArrayBuffer 데이터 출력
  });
```

## 3. WebSocket 통신

- WebSocket을 통해 바이너리 데이터를 송수신.

```js
const socket = new WebSocket('ws://example.com');
socket.binaryType = 'arraybuffer';

socket.onmessage = (event) => {
  const arrayBuffer = event.data;
  console.log(arrayBuffer); // 수신된 ArrayBuffer
};
```

## 메모리 효율성

- `ArrayBuffer`는 고정 크기의 메모리 블록을 사용하여 데이터를 효율적으로 관리.
- 필요한 메모리만큼 명시적으로 할당하여 메모리 낭비를 최소화.
- 대용량 데이터를 처리할 때 메모리를 직접적으로 제어할 수 있어 고성능 데이터 처리가 가능.

## 한계 및 주의사항

1. 크기 변경 불가

- ArrayBuffer는 생성 후 크기를 변경할 수 없습니다. 새로운 크기의 버퍼를 생성해야함.

2. 데이터 직접 접근 불가

- 데이터를 직접 조작하거나 읽을 수 없으며, 반드시 `TypedArray` 또는 `DataView`를 통해야 함.

3. Endianness

- `DataView`를 사용할 때 `Big-Endian`과 `Little-Endian`을 명시적으로 처리해야 함.
