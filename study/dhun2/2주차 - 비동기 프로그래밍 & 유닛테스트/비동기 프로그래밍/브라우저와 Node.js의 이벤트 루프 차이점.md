# 🌐 브라우저와 Node.js의 이벤트 루프 차이점

이벤트 루프(Event Loop)는 자바스크립트의 비동기 처리를 관리하는 핵심 메커니즘입니다. 브라우저와 Node.js는 서로 다른 환경에서 실행되기 때문에 이벤트 루프의 동작 방식에도 차이가 있습니다.

## 📌 공통점

- 싱글 스레드 기반으로 동작하며, 비동기 작업을 효율적으로 처리함
- 콜 스택(Call Stack), 태스크 큐(Task Queue), 마이크로태스크 큐(Microtask Queue) 구조를 기반으로 동작
- 이벤트 루프는 콜 스택이 비어있을 때 큐에 쌓인 작업을 순차적으로 실행

---

## 🖥️ 브라우저의 이벤트 루프

### ✅ 동작 방식

1. 콜 스택(Call Stack) 확인 → 비어 있으면 다음 단계 진행
2. 마이크로태스크 큐(Microtask Queue) 처리
   - Promise.then(), catch(), finally()
   - MutationObserver
3. 태스크 큐(Task Queue) 처리
   - setTimeout(), setInterval()
   - 사용자 이벤트(클릭, 키보드 입력 등)
4. 렌더링(Rendering)
   - 브라우저는 주기적으로 UI를 렌더링

### ✅ 우선순위

콜 스택 → 마이크로태스크 큐 → 렌더링 → 태스크 큐

### ✅ 예시

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```

**출력 결과:**

```
1
4
3
2
```

---

## 🟢 Node.js의 이벤트 루프

### ✅ Node.js 이벤트 루프 단계

Node.js는 libuv 기반으로 동작하며, 이벤트 루프가 6단계로 구성되어 있습니다.

1. **Timers**: setTimeout(), setInterval() 처리
2. **Pending Callbacks**: 시스템 관련 콜백 처리
3. **Idle, Prepare**: 내부 최적화 단계
4. **Poll**: I/O 작업 처리 및 대기
5. **Check**: setImmediate() 처리
6. **Close Callbacks**: 소켓 종료 이벤트 등 처리

### ✅ 태스크 큐(Task Queue)와 매크로태스크(Macro Task)

Node.js에서 **태스크 큐(Task Queue)**는 각 단계(Timers, Poll, Check)에 맞게 분리되어 있음.

- **setTimeout(), setInterval()** → Timers 단계에서 처리
- **setImmediate()** → Check 단계에서 처리

### ✅ 마이크로태스크 처리

- 각 단계가 끝날 때마다 마이크로태스크 큐(Promise.then(), process.nextTick())가 실행됨
- **process.nextTick()**은 Promise보다 우선순위가 높음

---

### ✅ Node.js와 브라우저 실행 결과 비교

```javascript
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
```

**Node.js 출력 결과:**

```
immediate
timeout
```

🔎 **설명:**
Node.js에서는 I/O 작업 후 **setImmediate()**가 **setTimeout()**보다 우선적으로 실행됨.  
이는 Node.js의 이벤트 루프가 Poll 단계에서 I/O 작업을 마친 후 Check 단계를 먼저 실행하기 때문.

---

### ✅ Node.js의 복잡한 실행 순서 예시

```javascript
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
```

**Node.js 출력 결과:**

```
immediate
timeout
```

또는

```
timeout
immediate
```

🔎 **설명:**
Node.js에서는 **setTimeout**과 **setImmediate**의 실행 순서가 상황에 따라 다를 수 있습니다.  
이벤트 루프가 Timers 단계를 먼저 처리할 수도 있고, Check 단계를 먼저 처리할 수도 있기 때문입니다.  
특히 I/O 작업이 없는 경우에는 **setTimeout()**이 먼저 실행될 가능성이 높습니다.

---

## 🔎 브라우저와 Node.js의 이벤트 루프 비교

| 구분                    | 브라우저                            | Node.js                                           |
| ----------------------- | ----------------------------------- | ------------------------------------------------- |
| **I/O 처리**            | Web API가 담당                      | libuv가 담당                                      |
| **마이크로태스크**      | Promise.then(), MutationObserver    | Promise.then(), process.nextTick()                |
| **태스크/매크로태스크** | Task Queue로 관리                   | Timers, Poll, Check 단계로 세분화                 |
| **우선순위**            | 마이크로태스크 → 태스크 큐 → 렌더링 | process.nextTick() → 마이크로태스크 → 단계별 처리 |
| **특수 단계**           | 렌더링(Rendering) 단계 존재         | Check, Poll, Close 단계 존재                      |

---

## ✅ 결론

- 브라우저는 렌더링 최적화에 중점을 두고, **마이크로태스크 → 렌더링 → 태스크 큐** 순으로 실행합니다.
- Node.js는 서버 사이드 환경에 맞게 다양한 단계로 구성되어 있으며, **process.nextTick()**이 특별히 높은 우선순위를 가집니다.
- Node.js의 libuv는 **태스크(Task)**와 **매크로태스크(Macro Task)**를 단계별로 세분화하여 효율적인 I/O 처리를 지원합니다.

이러한 차이를 이해하고 적절히 활용하면, 비동기 작업을 더 효율적으로 설계할 수 있습니다. 🚀
