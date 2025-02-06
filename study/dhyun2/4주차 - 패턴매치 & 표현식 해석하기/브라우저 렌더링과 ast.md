# 🔮 브라우저 렌더링 과정 (AST 기본)

> 브라우저가 HTML, CSS, JavaScript를 읽고 화면에 표시하는 과정을 **"파시킹 → 렌더 트리 생성 → 레이아움 → 페인트에서 표시"** 순서로 설명합니다.

---

## 1️⃣ HTML 파시킹 → DOM 트리 생성

브라우저가 HTML을 읽고 **DOM(Document Object Model) 트리**를 만듭니다.

### 해당 HTML 예제

```html
<!DOCTYPE html>
<html>
  <head>
    <title>AST Example</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>This is a test</p>
  </body>
</html>
```

### 해당 DOM 트리

```json
{
  "type": "Element",
  "tag": "html",
  "children": [
    {
      "type": "Element",
      "tag": "head",
      "children": [
        {
          "type": "Element",
          "tag": "title",
          "children": [{ "type": "Text", "value": "AST Example" }]
        }
      ]
    },
    {
      "type": "Element",
      "tag": "body",
      "children": [
        {
          "type": "Element",
          "tag": "h1",
          "children": [{ "type": "Text", "value": "Hello" }]
        },
        {
          "type": "Element",
          "tag": "p",
          "children": [{ "type": "Text", "value": "This is a test" }]
        }
      ]
    }
  ]
}
```

---

## 2️⃣ CSS 파시킹 → CSSOM 트리 생성

브라우저가 CSS를 파시하여 **CSSOM (CSS Object Model) 트리**를 만듭니다.

### 해당 CSS 예제

```css
h1 {
  color: red;
  font-size: 20px;
}
p {
  color: blue;
}
```

### 해당 CSSOM 트리

```json
{
  "type": "Stylesheet",
  "rules": [
    {
      "selector": "h1",
      "declarations": [
        { "property": "color", "value": "red" },
        { "property": "font-size", "value": "20px" }
      ]
    },
    {
      "selector": "p",
      "declarations": [{ "property": "color", "value": "blue" }]
    }
  ]
}
```

---

## 3️⃣ JavaScript 실행 → DOM 수정

### 해당 JavaScript 예제

```js
document.querySelector('h1').textContent = 'Changed!';
```

### JavaScript 실행 후 DOM 변경

```json
{
  "type": "Element",
  "tag": "h1",
  "children": [{ "type": "Text", "value": "Changed!" }]
}
```

---

## 4️⃣ DOM + CSSOM 결합 → 렌더 트리 생성

```json
{
  "type": "RenderTree",
  "nodes": [
    {
      "type": "RenderNode",
      "tag": "h1",
      "styles": { "color": "red", "font-size": "20px" },
      "content": "Changed!"
    },
    {
      "type": "RenderNode",
      "tag": "p",
      "styles": { "color": "blue" },
      "content": "This is a test"
    }
  ]
}
```

---

## 5️⃣ 레이아웃(Layout) → 페인트(Painting)

1. 레이아움(Layout) – 각 요소의 형태 계산
2. 페인트(Painting) – 텍스트가 화면에 반영
