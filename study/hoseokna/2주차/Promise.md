# Promise

## 정의

- 지연되거나 비동기적인 계산의 최종 결과를 나타내는 객체.
  - A Promise is an object that is used as a placeholder for the eventual results of a deferred (and possibly asynchronous) computation [ECMA 262](https://tc39.es/ecma262/#sec-promise-objects)
  - Promise 객체는 비동기 작업의 **현재 상태**와 **최종 결과**를 나타냄.
  - 작업이 완료되지 않았더라도, Promise는 이후의 결과를 처리하기 위한 메서드(`then`, `catch`, `finally`)를 제공.

## 3가지 상태

Promise 객체는 항상 세 가지 상태 중 하나.

1. **Pending (대기 중)**

- 초기 상태로, 작업이 아직 완료되지 않음.
- 결과(resolve) 또는 실패(reject) 중 어느 것도 발생하지 않은 상태.

2. **Fulfilled (이행됨)**

- 작업이 성공적으로 완료된 상태.
- resolve(value)를 통해 결과 값(value)이 제공됨.

3. **Rejected (거부됨)**

- 작업이 실패한 상태.
- reject(reason)을 통해 실패 이유(reason)가 제공됨.

## 특징

### Deferred (지연된 계산)

- Promise는 생성 시점에 작업이 바로 완료되지 않을 수 있으며, 비동기적으로 실행될 작업의 완료 여부에 따라 상태가 변경됨.
  - ex) 네트워크 요청, 파일 읽기 등은 시간이 걸리는 작업이며, Promise는 이러한 작업이 끝날 때까지 상태를 추적.

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('작업 완료'); // 2초 후 Fulfilled
  }, 2000);
});

console.log('Promise 상태:', promise); // Pending 상태
promise.then((result) => console.log('결과:', result)); // Fulfilled 후 결과 출력
```

### Possibly Asynchronous (비동기적일 가능성)

- Promise는 항상 비동기 작업에만 사용되는 것은 아니지만, `동기적 작업`과 `비동기적 작업` 모두에서 사용할 수 있음.
  - 동기 작업: 이미 결과가 있는 경우 즉시 Fulfilled 상태로 전환.
  - 비동기 작업: 결과가 없는 경우 Pending 상태로 유지하다가 나중에 전환.

```js
// 동기 Promise
const syncPromise = Promise.resolve('동기 완료');
console.log(syncPromise); // Fulfilled 상태

// 비동기 Promise
const asyncPromise = new Promise((resolve) => {
  setTimeout(() => resolve('비동기 완료'), 1000);
});
console.log(asyncPromise); // Pending 상태
```

## 인터페이스

1. **then(onFulfilled, onRejected)**

- Promise가 Fulfilled 상태가 되면 onFulfilled 실행.
- Promise가 Rejected 상태가 되면 onRejected 실행.
  - 두 번째 인자인 onRejected를 사용할 수 있지만, 일반적으로 catch를 사용하는 것이 권장.
    - 이유: catch는 체이닝 중 발생한 모든 에러를 한 곳에서 처리할 수 있어 가독성과 유지보수성이 향상됨.
- 항상 새로운 Promise를 반환.

2. **catch(onRejected)**

- Promise가 Rejected 상태가 되었을 때 실행.

3. **finally(onFinally)**

- 상태와 관계없이 작업이 완료되면 실행

## 병렬 처리 메서드

| **메서드**             | **설명**                                     | **성공 조건**                   | **실패 조건**                       |
| ---------------------- | -------------------------------------------- | ------------------------------- | ----------------------------------- |
| **Promise.all**        | 모든 Promise가 성공하면 결과 배열 반환       | 모든 Promise가 Fulfilled        | 하나라도 Rejected                   |
| **Promise.race**       | 가장 먼저 완료된 Promise의 결과 반환         | 첫 번째 Fulfilled 또는 Rejected | 첫 번째 Rejected                    |
| **Promise.any**        | 첫 번째 Fulfilled된 결과 반환                | 하나라도 Fulfilled              | 모두 Rejected (AggregateError 반환) |
| **Promise.allSettled** | 모든 Promise가 완료된 후 각 상태와 결과 반환 | 항상 성공 (모든 상태 반환)      | 실패 없음                           |
