// Question bank for JS Expression Shooter
// Each question has expression, correct answer, category, difficulty, and explanation

const QUESTIONS = {
  // Level 1: Type Coercion Basics
  'type-coercion': [
    {
      expression: '"5" + 3',
      correct: '"53"',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'When + has a string operand, JS converts the other value to a string and concatenates. "5" + 3 → "5" + "3" → "53"'
    },
    {
      expression: '5 + "3"',
      correct: '"53"',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'The + operator prefers string concatenation. If either side is a string, both become strings: 5 + "3" → "5" + "3" → "53"'
    },
    {
      expression: '"5" - 3',
      correct: '2',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Unlike +, the - operator only works with numbers. JS converts the string to a number first: "5" - 3 → 5 - 3 → 2'
    },
    {
      expression: '"5" * "2"',
      correct: '10',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Multiplication (*), division (/), and subtraction (-) all convert strings to numbers: "5" * "2" → 5 * 2 → 10'
    },
    {
      expression: '"10" / 2',
      correct: '5',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Division converts strings to numbers automatically: "10" / 2 → 10 / 2 → 5'
    },
    {
      expression: '"5" - "2"',
      correct: '3',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Both strings are converted to numbers for subtraction: "5" - "2" → 5 - 2 → 3'
    },
    {
      expression: '5 + 3 + "2"',
      correct: '"82"',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Operators evaluate left-to-right. First 5+3=8 (both numbers), then 8+"2"="82" (string concatenation kicks in)'
    },
    {
      expression: '"5" + 3 + 2',
      correct: '"532"',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Once a string appears, everything after concatenates: "5"+3="53", then "53"+2="532". The string "infects" the rest!'
    },
    {
      expression: '+"42"',
      correct: '42',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'The unary + operator converts its operand to a number. It\'s a quick way to convert strings: +"42" → 42'
    },
    {
      expression: '4 + 5 + "px"',
      correct: '"9px"',
      category: 'type-coercion',
      difficulty: 1,
      explanation: 'Common in CSS! Numbers add first (4+5=9), then string concatenation: 9+"px"="9px". Useful for building CSS values.'
    }
  ],

  // Level 2: Truthy/Falsy
  'truthy-falsy': [
    {
      expression: 'Boolean("")',
      correct: 'false',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'JS has 6 falsy values: false, 0, "", null, undefined, NaN. Empty string "" is one of them!'
    },
    {
      expression: 'Boolean(0)',
      correct: 'false',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'Zero is falsy! The only falsy number. All other numbers (including negative) are truthy.'
    },
    {
      expression: 'Boolean([])',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'Surprise! Empty arrays [] are truthy. ALL objects are truthy in JS, even empty ones. Arrays are objects.'
    },
    {
      expression: 'Boolean({})',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'Empty objects {} are truthy! This catches many developers off guard. Objects are always truthy.'
    },
    {
      expression: 'Boolean("false")',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'Gotcha! The STRING "false" is truthy because it\'s a non-empty string. Only "" is falsy.'
    },
    {
      expression: 'Boolean("0")',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'The STRING "0" is truthy! Don\'t confuse with the NUMBER 0 which is falsy. "0".length > 0, so it\'s truthy.'
    },
    {
      expression: '!!"hello"',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: '!! is the "double bang" - a common trick to convert any value to boolean. !!"hello" → !false → true'
    },
    {
      expression: '!!null',
      correct: 'false',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'null is falsy. !!null → !true → false. Use !! to quickly check if a value is truthy or falsy.'
    },
    {
      expression: '!!undefined',
      correct: 'false',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'undefined is falsy. Variables that haven\'t been assigned are undefined and thus falsy.'
    },
    {
      expression: 'Boolean(NaN)',
      correct: 'false',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'NaN (Not a Number) is falsy. It\'s the result of invalid math like 0/0 or parseInt("hello").'
    },
    {
      expression: 'Boolean(-1)',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'All non-zero numbers are truthy! -1, 0.001, Infinity - all truthy. Only 0 is falsy.'
    },
    {
      expression: 'Boolean(" ")',
      correct: 'true',
      category: 'truthy-falsy',
      difficulty: 2,
      explanation: 'A space is still a character! " " has length 1, so it\'s not empty and therefore truthy.'
    }
  ],

  // Level 3: Equality Quirks
  'equality': [
    {
      expression: 'null == undefined',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'Special rule: null and undefined are == to each other, but nothing else. This is actually useful for checking "no value".'
    },
    {
      expression: 'null === undefined',
      correct: 'false',
      category: 'equality',
      difficulty: 3,
      explanation: '=== checks type AND value. null is type "object", undefined is type "undefined". Different types = false.'
    },
    {
      expression: '[] == false',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'Wild coercion chain: [] → "" (toString) → 0 (toNumber). false → 0. So 0 == 0 is true!'
    },
    {
      expression: '[] == ![]',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'Famous JS quirk! ![] is false (arrays are truthy, negated = false). Then [] == false triggers coercion: both become 0.'
    },
    {
      expression: '"0" == 0',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'Loose == converts string to number when comparing with number. "0" → 0, then 0 == 0. Use === to avoid this!'
    },
    {
      expression: '"0" === 0',
      correct: 'false',
      category: 'equality',
      difficulty: 3,
      explanation: '=== (strict equality) never coerces types. String !== Number, so false. Always prefer === in real code!'
    },
    {
      expression: 'false == "0"',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'Both sides convert to numbers: false → 0, "0" → 0. Then 0 == 0 is true. This is why == is dangerous!'
    },
    {
      expression: 'false == ""',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'Empty string "" and false both convert to 0. This is why if("") works - "" is falsy!'
    },
    {
      expression: 'NaN == NaN',
      correct: 'false',
      category: 'equality',
      difficulty: 3,
      explanation: 'NaN is the only value in JS not equal to itself! Use Number.isNaN() or Object.is() to check for NaN.'
    },
    {
      expression: '"1" == true',
      correct: 'true',
      category: 'equality',
      difficulty: 3,
      explanation: 'true converts to 1, "1" converts to 1. 1 == 1 is true. But "true" == true is false! (NaN)'
    },
    {
      expression: '"2" == true',
      correct: 'false',
      category: 'equality',
      difficulty: 3,
      explanation: 'Gotcha! true becomes 1, "2" becomes 2. 2 != 1, so false. Only "1" == true works, not "2"!'
    }
  ],

  // Level 4: typeof Surprises
  'typeof': [
    {
      expression: 'typeof null',
      correct: '"object"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Historical bug from JS\'s first version! null was tagged as object internally. Too late to fix - would break the web.'
    },
    {
      expression: 'typeof []',
      correct: '"object"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Arrays ARE objects in JS! typeof can\'t distinguish them. Use Array.isArray([]) to properly check for arrays.'
    },
    {
      expression: 'typeof NaN',
      correct: '"number"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Ironic: "Not a Number" has type "number"! NaN represents failed numeric operations, but it\'s still in the number system.'
    },
    {
      expression: 'typeof undefined',
      correct: '"undefined"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'undefined is its own type. Variables declared but not assigned have this value and type.'
    },
    {
      expression: 'typeof function(){}',
      correct: '"function"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Functions get special treatment! Even though typeof {} is "object", functions return "function". Helpful for checking callbacks.'
    },
    {
      expression: 'typeof {}',
      correct: '"object"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Plain objects return "object". But so do arrays and null! typeof is limited for object type checking.'
    },
    {
      expression: 'typeof "hello"',
      correct: '"string"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'String primitives return "string". Note: typeof new String("hi") returns "object" (wrapper object)!'
    },
    {
      expression: 'typeof 42',
      correct: '"number"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'All numbers (integers, floats, Infinity, NaN) return "number". JS has only one number type.'
    },
    {
      expression: 'typeof true',
      correct: '"boolean"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Boolean primitives return "boolean". Only two values: true and false.'
    },
    {
      expression: 'typeof Symbol()',
      correct: '"symbol"',
      category: 'typeof',
      difficulty: 4,
      explanation: 'Symbols (ES6+) are unique identifiers. Used for object keys that won\'t collide with other properties.'
    }
  ],

  // Level 5: Array Methods
  'arrays': [
    {
      expression: '[1,2,3].length',
      correct: '3',
      category: 'arrays',
      difficulty: 5,
      explanation: 'The length property returns the count of elements. It\'s always 1 more than the highest index!'
    },
    {
      expression: '[1,2,3][1]',
      correct: '2',
      category: 'arrays',
      difficulty: 5,
      explanation: 'Arrays are zero-indexed! Index 0 is first element (1), index 1 is second element (2). Off-by-one errors are super common.'
    },
    {
      expression: '[1,2,3].pop()',
      correct: '3',
      category: 'arrays',
      difficulty: 5,
      explanation: 'pop() removes AND returns the last element. It mutates the original array! After this, the array is [1,2].'
    },
    {
      expression: '[1,2,3].shift()',
      correct: '1',
      category: 'arrays',
      difficulty: 5,
      explanation: 'shift() removes AND returns the first element. Opposite of pop(). After this, array is [2,3]. Also mutates!'
    },
    {
      expression: '[1,2,3].indexOf(2)',
      correct: '1',
      category: 'arrays',
      difficulty: 5,
      explanation: 'indexOf finds the first occurrence and returns its index. Returns -1 if not found. Great for checking existence!'
    },
    {
      expression: '[1,2,3].includes(2)',
      correct: 'true',
      category: 'arrays',
      difficulty: 5,
      explanation: 'includes() returns a boolean - cleaner than indexOf !== -1. Added in ES6, prefer this for existence checks.'
    },
    {
      expression: '[1,2,3].join("-")',
      correct: '"1-2-3"',
      category: 'arrays',
      difficulty: 5,
      explanation: 'join() converts array to string with separator between elements. Default separator is comma. Great for building paths or CSV!'
    },
    {
      expression: '[1,2,3].reverse()[0]',
      correct: '3',
      category: 'arrays',
      difficulty: 5,
      explanation: 'reverse() reverses IN PLACE (mutates!) and returns the array. Original array is now [3,2,1]. Use [...arr].reverse() to avoid mutation.'
    },
    {
      expression: '[1,2,3].slice(1).length',
      correct: '2',
      category: 'arrays',
      difficulty: 5,
      explanation: 'slice(1) returns a NEW array from index 1 onwards: [2,3]. slice() does NOT mutate - it\'s safe! Great for copying arrays.'
    },
    {
      expression: '[...[1,2], 3].length',
      correct: '3',
      category: 'arrays',
      difficulty: 5,
      explanation: 'The spread operator (...) "unpacks" array elements. [1,2] becomes 1,2 so result is [1,2,3]. Modern way to concat arrays!'
    },
    {
      expression: '[1,2,3].map(x=>x*2)[1]',
      correct: '4',
      category: 'arrays',
      difficulty: 5,
      explanation: 'map() transforms each element with a function, returning NEW array. [1,2,3] → [2,4,6]. Index 1 = 4. Does not mutate original!'
    },
    {
      expression: '[1,2,3,4].filter(x=>x>2).length',
      correct: '2',
      category: 'arrays',
      difficulty: 5,
      explanation: 'filter() keeps elements where callback returns true. x>2 keeps [3,4]. Returns NEW array without mutating. Length = 2.'
    },
    {
      expression: '[1,2,3].reduce((a,b)=>a+b,0)',
      correct: '6',
      category: 'arrays',
      difficulty: 5,
      explanation: 'reduce() accumulates values: starts at 0, then 0+1=1, 1+2=3, 3+3=6. Second arg is initial value. Most powerful array method!'
    }
  ],

  // Level 6: Objects & Destructuring
  'objects': [
    {
      expression: '{a:1,b:2}.a',
      correct: '1',
      category: 'objects',
      difficulty: 6,
      explanation: 'Dot notation accesses properties directly. obj.prop is cleaner than obj["prop"] but only works for valid identifier names.'
    },
    {
      expression: 'Object.keys({a:1,b:2}).length',
      correct: '2',
      category: 'objects',
      difficulty: 6,
      explanation: 'Object.keys() returns an array of property NAMES (strings). Great for iterating: Object.keys(obj).forEach(key => ...)'
    },
    {
      expression: 'Object.values({a:1,b:2})[0]',
      correct: '1',
      category: 'objects',
      difficulty: 6,
      explanation: 'Object.values() returns an array of VALUES. Paired with Object.keys() and Object.entries() for different iteration needs.'
    },
    {
      expression: '"a" in {a:1,b:2}',
      correct: 'true',
      category: 'objects',
      difficulty: 6,
      explanation: 'The "in" operator checks if property exists (including inherited). Use hasOwnProperty() to check only own properties.'
    },
    {
      expression: '{...{a:1},{b:2}}.b',
      correct: '2',
      category: 'objects',
      difficulty: 6,
      explanation: 'Object spread (...) copies properties into new object. Modern way to merge objects! Replaces Object.assign().'
    },
    {
      expression: '({a:1,b:2}).hasOwnProperty("a")',
      correct: 'true',
      category: 'objects',
      difficulty: 6,
      explanation: 'hasOwnProperty() checks if property exists directly on object, not inherited from prototype. Returns boolean.'
    },
    {
      expression: 'Object.entries({a:1})[0][1]',
      correct: '1',
      category: 'objects',
      difficulty: 6,
      explanation: 'Object.entries() returns array of [key, value] pairs: [["a",1]]. [0] is first pair, [1] is the value. Great for Object→Map conversion!'
    },
    {
      expression: '({...{a:1,b:2},b:3}).b',
      correct: '3',
      category: 'objects',
      difficulty: 6,
      explanation: 'When spreading, later properties override earlier ones! Order matters. This is how you do "merge with overrides" in JS.'
    },
    {
      expression: 'Object.freeze({a:1}).a = 2',
      correct: '2',
      category: 'objects',
      difficulty: 6,
      explanation: 'Tricky! Assignment EXPRESSION returns 2, but the object is frozen so the assignment silently fails. Use "use strict" to get an error!'
    },
    {
      expression: 'delete {a:1,b:2}.a',
      correct: 'true',
      category: 'objects',
      difficulty: 6,
      explanation: 'delete removes a property and returns true on success. Returns true even if property didn\'t exist! Only returns false for non-configurable props.'
    }
  ]
};

// Category order for progression
const CATEGORY_ORDER = [
  'type-coercion',
  'truthy-falsy',
  'equality',
  'typeof',
  'arrays',
  'objects'
];

// Category display names
const CATEGORY_NAMES = {
  'type-coercion': 'Type Coercion',
  'truthy-falsy': 'Truthy/Falsy',
  'equality': 'Equality Quirks',
  'typeof': 'typeof Surprises',
  'arrays': 'Array Methods',
  'objects': 'Objects',
  'unlimited': 'UNLIMITED!'
};

// Get a random question from the current level's category
function getRandomQuestion(category) {
  // UNLIMITED mode: pick from all categories
  if (category === 'unlimited') {
    const randomCategory = CATEGORY_ORDER[Math.floor(Math.random() * CATEGORY_ORDER.length)];
    const questions = QUESTIONS[randomCategory];
    const question = questions[Math.floor(Math.random() * questions.length)];
    return { ...question };
  }

  const questions = QUESTIONS[category];
  const question = questions[Math.floor(Math.random() * questions.length)];
  return { ...question };
}

// Get the current category (level) based on questions answered
function getCurrentCategory(questionsAnswered) {
  const unlockThresholds = [0, 5, 10, 15, 20, 25, 30]; // Questions needed for each level

  // After 30 questions (5 in objects), enter UNLIMITED mode
  if (questionsAnswered >= 30) {
    return 'unlimited';
  }

  let currentLevel = 0;
  for (let i = 1; i < unlockThresholds.length - 1; i++) {
    if (questionsAnswered >= unlockThresholds[i]) {
      currentLevel = i;
    }
  }

  return CATEGORY_ORDER[currentLevel];
}

// Check if player has won (completed all 6 levels)
function hasWonGame(questionsAnswered) {
  return questionsAnswered === 30;
}

// Get all unlocked categories (for display purposes)
function getUnlockedCategories(questionsAnswered) {
  const unlockThresholds = [0, 5, 10, 15, 20, 25];
  let unlockedCount = 1;

  for (let i = 1; i < unlockThresholds.length; i++) {
    if (questionsAnswered >= unlockThresholds[i]) {
      unlockedCount = i + 1;
    }
  }

  return CATEGORY_ORDER.slice(0, unlockedCount);
}
