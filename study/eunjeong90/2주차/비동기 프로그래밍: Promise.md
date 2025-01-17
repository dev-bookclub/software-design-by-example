# 비동기 프로그래밍: Promise

## 1. 콜백 함수의 한계

### 콜백 지옥 (Callback Hell)

- 비동기 작업이 순차적으로 실행되어야 할 때 콜백 함수가 중첩되면서 코드의 가독성이 떨어집니다.
- 에러 처리가 복잡해지고 각 콜백 단계마다 에러 핸들링을 해야 합니다.

```javascript
// 콜백 지옥...
getData(function (a) {
  getMoreData(a, function (b) {
    getMoreData(b, function (c) {
      getMoreData(c, function (d) {
        getMoreData(d, function (e) {
          // 처리 로직
        });
      });
    });
  });
});
```

---

## 2. Promise

먼저 프로미스에 대해 간단하게 정의해보자면, 비동기 작업의 결과를 나타내는 객체입니다.
복잡한 비동기 작업을 좀 더 동기적으로 작성할 수 있도록 도와줍니다.

### 체이닝을 통한 가독성 향상

- `.then()`을 사용한 체이닝으로 비동기 작업을 순차적으로 처리할 수 있습니다.
- 에러 처리를 `.catch()`로 한 번에 처리할 수 있습니다.

### 상태 관리

- `pending`: 비동기 작업 진행 중
- `fulfilled`: 작업 성공
- `rejected`: 작업 실패

### 병렬 처리 용이

- `Promise.all()`: 여러 Promise를 동시에 실행하고 모든 결과를 기다립니다.
- `Promise.race()`: 여러 Promise 중 가장 먼저 완료되는 결과를 반환합니다.

### API 호출 예제

```javascript
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// fetch는 기본적으로 Promise를 반환하게 되어 있습니다.
function fetch(url, options) {
  return new Promise((resolve, reject) => {
    // 네트워크 요청 로직
    // 성공시 resolve(response)
    // 실패시 reject(error)
  });
}
```

## 3. Async/Await

Promise 또한 then method 체이닝이 많아질 수록 마찬가지로 가독성에 한계가 나타나므로 이를 해결하기 위해 나온 것이 Async/Await 입니다.

먼저 Promise를 사용하여 userData를 가져오고, 그 다음 useData의 id로 userPosts를 가져오고, 그 다음 postComments를 가져오는 예제를 보겠습니다.

```javascript
function fetchUserData() {
  return (
    fetchUser()
      .then((user) => {
        return fetchUserPosts(user.id);
      })
      .then((posts) => {
        return fetchPostComments(posts[0].id);
      })
      .then((comments) => {
        return fetchPostComments(comments[0].id);
      })
      //...어쩌면 더 필요할지도 모를 then 체이닝...
      .catch((error) => {
        console.error("Error:", error);
      })
  );
}
```

```javascript
async function fetchUserData() {
  try {
    // 비동기 작업을 변수에 할당하여 값을 파악하기 더 용이
    const user = await fetchUser();
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    const moreComments = await fetchPostComments(comments[0].id);
    return moreComments;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

### API Retry 패턴

```javascript
const fetchWithRetry = async (
  url,
  options = {},
  maxRetries = 3,
  delay = 1000
) => {
  const attempt = async (retryCount) => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < maxRetries) {
        console.log(
          `Request failed, retrying... (${retryCount + 1}/${maxRetries})`
        );
        console.log("Error:", error.message);

        // delay만큼 기다린 후 재시도
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attempt(retryCount + 1);
      }

      throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
    }
  };

  return attempt(0);
};

const fetchData = async () => {
  try {
    const data = await fetchWithRetry(
      "https://api.example.com/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "value" }),
      },
      3, // maxRetries
      5000 // delay (ms)
    );

    console.log("Success:", data);
  } catch (error) {
    // 최종 에러 처리
    console.error("Final error:", error.message);
  }
};

// Request failed, retrying... (1/3)
// Error: Network error
// Request failed, retrying... (2/3)
// Error: Network error
// Request failed, retrying... (3/3)
// Error: Network error
// Final error: Failed after 3 attempts: Network error
```

---

### 병렬 데이터 처리

```javascript
// 여러 데이터를 동시에 처리해야하는 경우 Promise.all을 사용
async function loadDashboard() {
  try {
    const [userData, statistics, notifications] = await Promise.all([
      fetchUserData(),
      fetchStatistics(),
      fetchNotifications(),
    ]);

    return {
      userData,
      statistics,
      notifications,
    };
  } catch (error) {
    console.error("Error:", error);
  }
}
```
