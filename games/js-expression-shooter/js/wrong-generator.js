// Wrong Answer Generator
// Generates plausible wrong answers based on question category and correct answer

const WrongAnswerGenerator = {
  // Generate 2 wrong answers for a question
  generate(question) {
    const correct = question.correct;
    const category = question.category;
    const expression = question.expression;

    let wrongAnswers = [];

    // Try category-specific generation first
    switch (category) {
      case 'type-coercion':
        wrongAnswers = this.generateTypeCoercionWrong(expression, correct);
        break;
      case 'truthy-falsy':
        wrongAnswers = this.generateTruthyFalsyWrong(correct);
        break;
      case 'equality':
        wrongAnswers = this.generateEqualityWrong(correct);
        break;
      case 'typeof':
        wrongAnswers = this.generateTypeofWrong(correct);
        break;
      case 'arrays':
        wrongAnswers = this.generateArrayWrong(expression, correct);
        break;
      case 'objects':
        wrongAnswers = this.generateObjectWrong(correct);
        break;
      default:
        wrongAnswers = this.generateGenericWrong(correct);
    }

    // Ensure we have exactly 2 unique wrong answers
    wrongAnswers = [...new Set(wrongAnswers)].filter(w => w !== correct);

    while (wrongAnswers.length < 2) {
      const fallback = this.getFallbackWrong(correct);
      if (!wrongAnswers.includes(fallback) && fallback !== correct) {
        wrongAnswers.push(fallback);
      }
    }

    return wrongAnswers.slice(0, 2);
  },

  // Type coercion: generate numeric vs string interpretations
  generateTypeCoercionWrong(expression, correct) {
    const wrongs = [];

    // Extract numbers from expression
    const numbers = expression.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const a = parseInt(numbers[0]);
      const b = parseInt(numbers[1]);

      // If correct is string, offer numeric result
      if (correct.startsWith('"')) {
        wrongs.push(String(a + b));
        wrongs.push(String(a * b));
      } else {
        // If correct is number, offer string result
        wrongs.push(`"${a}${b}"`);
        wrongs.push(String(a - b));
      }
    }

    // Add some common misconceptions
    if (correct === '42') wrongs.push('"42"');
    if (correct === '"42"') wrongs.push('42');

    return wrongs;
  },

  // Truthy/Falsy: always include the opposite
  generateTruthyFalsyWrong(correct) {
    const wrongs = [];

    if (correct === 'true') {
      wrongs.push('false');
      wrongs.push('undefined');
    } else if (correct === 'false') {
      wrongs.push('true');
      wrongs.push('null');
    }

    return wrongs;
  },

  // Equality: opposite boolean + type confusion
  generateEqualityWrong(correct) {
    const wrongs = [];

    if (correct === 'true') {
      wrongs.push('false');
      wrongs.push('TypeError');
    } else if (correct === 'false') {
      wrongs.push('true');
      wrongs.push('undefined');
    }

    return wrongs;
  },

  // typeof: common misconceptions
  generateTypeofWrong(correct) {
    const typeofOptions = [
      '"undefined"',
      '"object"',
      '"boolean"',
      '"number"',
      '"string"',
      '"function"',
      '"symbol"',
      '"null"', // doesn't exist but common misconception
      '"array"' // doesn't exist but common misconception
    ];

    // Add specific misconceptions
    if (correct === '"object"') {
      return ['"null"', '"array"'];
    }
    if (correct === '"number"') {
      return ['"NaN"', '"undefined"'];
    }
    if (correct === '"undefined"') {
      return ['"null"', '"object"'];
    }

    // Filter out correct answer and pick 2 random
    const wrongs = typeofOptions.filter(t => t !== correct);
    return this.shuffle(wrongs).slice(0, 2);
  },

  // Arrays: off-by-one errors and common mistakes
  generateArrayWrong(expression, correct) {
    const wrongs = [];
    const num = parseInt(correct);

    if (!isNaN(num)) {
      // Numeric answers: off-by-one and nearby values
      wrongs.push(String(num - 1));
      wrongs.push(String(num + 1));
      if (num > 1) wrongs.push(String(num * 2));
    } else if (correct === 'true') {
      wrongs.push('false');
      wrongs.push('undefined');
    } else if (correct === 'false') {
      wrongs.push('true');
      wrongs.push('null');
    } else if (correct.startsWith('"')) {
      // String results
      wrongs.push('undefined');
      wrongs.push('null');
    }

    return wrongs;
  },

  // Objects: type confusion and common mistakes
  generateObjectWrong(correct) {
    const wrongs = [];
    const num = parseInt(correct);

    if (!isNaN(num)) {
      wrongs.push(String(num + 1));
      wrongs.push('undefined');
    } else if (correct === 'true') {
      wrongs.push('false');
      wrongs.push('undefined');
    } else if (correct === 'false') {
      wrongs.push('true');
      wrongs.push('TypeError');
    } else {
      wrongs.push('undefined');
      wrongs.push('null');
    }

    return wrongs;
  },

  // Generic fallback
  generateGenericWrong(correct) {
    const genericWrongs = [
      'undefined',
      'null',
      'NaN',
      'true',
      'false',
      '0',
      '1',
      '""',
      'TypeError'
    ];

    return genericWrongs.filter(w => w !== correct).slice(0, 2);
  },

  // Final fallback for edge cases
  getFallbackWrong(correct) {
    const fallbacks = ['undefined', 'null', 'NaN', 'Error', '???', 'false', 'true', '0', '-1'];
    const filtered = fallbacks.filter(f => f !== correct);
    return filtered[Math.floor(Math.random() * filtered.length)];
  },

  // Fisher-Yates shuffle
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // Shuffle answers and return with indices
  prepareAnswers(question) {
    const wrongAnswers = this.generate(question);
    const allAnswers = [question.correct, ...wrongAnswers];
    const shuffled = this.shuffle(allAnswers);

    return {
      answers: shuffled,
      correctIndex: shuffled.indexOf(question.correct)
    };
  }
};
