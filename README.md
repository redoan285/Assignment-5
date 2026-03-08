# JavaScript Basic Concepts 

## 1. var, let, এবং const এর মধ্যে পার্থক্য

JavaScript এ `var`, `let`, এবং `const` ব্যবহার করা হয় ভেরিয়েবল ডিক্লেয়ার করার জন্য। তবে এদের scope, redeclaration এবং reassignment এর ক্ষেত্রে পার্থক্য রয়েছে।

### var
- `var` হলো **function scoped**।
- একই ভেরিয়েবল **পুনরায় declare করা যায়**।
- ভেরিয়েবল **update করা যায়**।
- `var` hoisting এর কারণে আগে থেকেই মেমোরিতে তৈরি হয় এবং এর মান প্রথমে `undefined` থাকে।

উদাহরণ:
```javascript
var name = "Rahim";
var name = "Karim"; // redeclare করা যায়
name = "Hasan";     // update করা যায়
```

### let
- `let` হলো **block scoped** (যেমন `{ }` এর ভিতরে সীমাবদ্ধ)।
- একই scope এর মধ্যে **পুনরায় declare করা যায় না**।
- কিন্তু **update করা যায়**।

উদাহরণ:
```javascript
let age = 20;
age = 25; // update করা যায়
// let age = 30; // একই scope এ আবার declare করা যাবে না
```

### const
- `const` ও **block scoped**।
- **পুনরায় declare করা যায় না**।
- **reassign বা update করা যায় না**।
- declare করার সময়ই মান দিতে হয়।

উদাহরণ:
```javascript
const country = "Bangladesh";
// country = "India"; // এটি করা যাবে না
```

সংক্ষিপ্ত তুলনা:

| Keyword | Scope | Redeclare | Reassign |
|--------|------|-----------|----------|
| var | Function Scope | করা যায় | করা যায় |
| let | Block Scope | করা যায় না | করা যায় |
| const | Block Scope | করা যায় না | করা যায় না |

---

## 2. Spread Operator (...) কী

Spread Operator (`...`) ব্যবহার করা হয় **array বা object এর ভেতরের element গুলোকে ছড়িয়ে দেওয়ার জন্য**।

এটি সাধারণত **array copy করা, object merge করা, অথবা নতুন element যোগ করার জন্য** ব্যবহার করা হয়।

Array এর উদাহরণ:
```javascript
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];
```

Object এর উদাহরণ:
```javascript
const user = { name: "Rahim", age: 25 };
const newUser = { ...user, country: "Bangladesh" };
```

---

## 3. map(), filter(), এবং forEach() এর মধ্যে পার্থক্য

এই তিনটি হলো JavaScript এর **array method**, যেগুলো array এর প্রতিটি element এর উপর কাজ করে।

### map()
- প্রতিটি element এর উপর কাজ করে **নতুন একটি array তৈরি করে**।
- সাধারণত data transform করার জন্য ব্যবহার করা হয়।

উদাহরণ:
```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
```

ফলাফল:
```
[2, 4, 6]
```

### filter()
- একটি **condition অনুযায়ী element বাছাই করে** নতুন array তৈরি করে।

উদাহরণ:
```javascript
const numbers = [1, 2, 3, 4];
const even = numbers.filter(num => num % 2 === 0);
```

ফলাফল:
```
[2, 4]
```

### forEach()
- array এর প্রতিটি element এর উপর একটি function চালায়।
- **নতুন array return করে না**।

উদাহরণ:
```javascript
const numbers = [1, 2, 3];
numbers.forEach(num => {
    console.log(num);
});
```

সংক্ষিপ্ত তুলনা:

| Method | নতুন Array তৈরি করে | ব্যবহার |
|------|--------------------|--------|
| map() | করে | element পরিবর্তন বা transform |
| filter() | করে | শর্ত অনুযায়ী element বাছাই |
| forEach() | করে না | প্রতিটি element এর উপর কাজ চালানো |

---

## 4. Arrow Function কী

Arrow Function হলো JavaScript এ **ছোট ও সংক্ষিপ্তভাবে function লেখার একটি পদ্ধতি**, যা ES6 এ যোগ করা হয়েছে।

সাধারণ Function:

```javascript
function add(a, b) {
    return a + b;
}
```

Arrow Function:

```javascript
const add = (a, b) => {
    return a + b;
};
```

আরও ছোটভাবে:

```javascript
const add = (a, b) => a + b;
```

Arrow function ব্যবহার করলে কোড **ছোট, পরিষ্কার এবং সহজে পড়া যায়**।

---

## 5. Template Literals কী

Template Literals ব্যবহার করে **string এর মধ্যে সহজে variable বা expression বসানো যায়**।

এটি লিখতে **backtick (` `)** ব্যবহার করা হয়।

উদাহরণ:
```javascript
const name = "Rahim";
const age = 25;

const message = `আমার নাম ${name} এবং আমার বয়স ${age} বছর।`;
```

ফলাফল:
```
আমার নাম Rahim এবং আমার বয়স 25 বছর।
```

সুবিধা:
- সহজে variable ব্যবহার করা যায়
- multi-line string লেখা যায়
- কোড আরও পরিষ্কার ও readable হয়