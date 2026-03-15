import 'dotenv/config';
import { faker } from '@faker-js/faker';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL ?? '';
const client = postgres(connectionString);

const LANGUAGES = [
  'javascript',
  'typescript',
  'tsx',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'sql',
  'bash',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
] as const;

const ROAST_MODES = ['roast', 'brutal'] as const;

const CODE_TEMPLATES: Record<string, string[]> = {
  javascript: [
    'var x = 1;\nvar y = 2;\nvar result = x + y;',
    'function add(a, b) {\n  return a + b;\n}\nvar result = add(1, 2);',
    'const arr = [1,2,3];\nfor(var i=0; i<arr.length; i++) {\n  console.log(arr[i]);\n}',
    'eval(document.cookie)',
    'function process() {\n  // TODO: implement\n  return null;\n}',
  ],
  typescript: [
    "let x: any = 'hello';\nconsole.log(x.toUpperCase());",
    'interface User {\n  name: string;\n}\nconst user = {} as User;\nconsole.log(user.name);',
    "async function fetch() {\n  return fetch('/api/data');\n}",
    "type Any = any;\nconst data: Any = JSON.parse('{}');",
  ],
  python: [
    'def add(a,b):\n    return a+b\nresult = add(1,2)',
    'import pickle\ndata = pickle.loads(request.data)\nexec(data)',
    'def process():\n    pass  # TODO',
    'if x == True:\n    return True\nelif x == False:\n    return False\nelse:\n    return not False',
  ],
  rust: [
    'let mut x = 1;\nlet y = &mut x;\n*y = 2;',
    'fn main() {\n    let x: i32;\n    println!("{}", x);\n}',
    'unsafe {\n    // do scary things\n}',
  ],
  go: [
    'func add(a, b int) int {\n    return a + b\n}',
    'err := recover()\nif err != nil {\n    panic(err)\n}',
    'var x interface{}\nx = "hello"\nfmt.Println(x.(string))',
  ],
  sql: [
    'SELECT * FROM users',
    'SELECT * FROM users WHERE 1=1',
    'SELECT * FROM users WHERE id = 1; DROP TABLE users;--',
    'SELECT * FROM users ORDER BY RAND()',
  ],
  default: [
    '// TODO: implement this',
    "console.log('hello world')",
    'function test() {\n  return 42;\n}',
  ],
};

const SEVERITIES = ['error', 'warning', 'info', 'suggestion'] as const;
const CATEGORIES = [
  'security',
  'performance',
  'readability',
  'best-practice',
  'logic',
  'style',
  'bug',
] as const;

const FEEDBACK_TEMPLATES = {
  security: [
    'Using eval() is extremely dangerous and opens you up to code injection attacks.',
    'Never pass user input directly to exec/pickle/eval - this is a massive security hole.',
    'SQL injection vulnerability detected. Use parameterized queries instead.',
    'Storing passwords without hashing is a serious security issue.',
  ],
  performance: [
    'This loop could be optimized. Consider using a more efficient algorithm.',
    'Querying inside a loop is an N+1 problem. Fetch all data at once.',
    'Using var in a loop is unnecessary and could cause bugs.',
    'RAND() in ORDER BY prevents index usage on large tables.',
  ],
  readability: [
    'Variable names like "x" and "y" make this hard to understand.',
    'This code would benefit from more descriptive naming.',
    'The logic here is convoluted. Consider refactoring.',
    'Magic numbers should be extracted to named constants.',
  ],
  'best-practice': [
    'Use const/let instead of var for better scoping.',
    'Avoid "any" type in TypeScript - you lose all type safety.',
    'Always handle errors explicitly instead of using try/catch with empty blocks.',
    'Prefer async/await over raw promises for better readability.',
  ],
  logic: [
    'This condition will always evaluate the same way. Is this intentional?',
    'The else branch does the same thing as the if - this is redundant.',
    'This function has a TODO comment - it needs to be implemented.',
    'The logic here seems backwards. Double-check the conditions.',
  ],
  style: [
    'Inconsistent indentation makes this hard to read.',
    'Missing semicolons can lead to subtle bugs in JavaScript.',
    'This function is too long. Consider breaking it up.',
    'Consider adding type annotations for better code clarity.',
  ],
  bug: [
    'This will throw a null reference error at runtime.',
    'The variable is used before being assigned a value.',
    'This comparison will never be true due to type mismatch.',
    'Resource leak: database connection not closed.',
  ],
};

function getRandomCode(language: string): string {
  const templates = CODE_TEMPLATES[language] ?? CODE_TEMPLATES.default;
  return faker.helpers.arrayElement(templates);
}

async function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await client`TRUNCATE TABLE feedback_items, roasts, submissions RESTART IDENTITY CASCADE;`;

  console.log('📝 Inserting 100 submissions and roasts...');

  const submissionIds: string[] = [];
  const roastIds: string[] = [];

  // Insert submissions and roasts
  for (let i = 0; i < 100; i++) {
    const language = faker.helpers.arrayElement([...LANGUAGES]);
    const code = getRandomCode(language);
    const roastMode = faker.helpers.arrayElement([...ROAST_MODES]);
    const score = Math.round(Math.random() * 10 * 10) / 10; // 0.0 to 10.0

    const summaryTemplates = [
      "This code is an absolute disaster. I'm embarrassed for you.",
      'Wow. Just... wow. Where do I even start?',
      "I've seen better code in a fortune cookie.",
      "This is why we can't have nice things.",
      'Please, for the love of all that is holy, refactor this.',
      'Not terrible, but definitely not good either.',
      "Decent attempt, but there's room for improvement.",
      "Actually... this isn't half bad. Keep it up!",
      "Surprisingly solid. A few tweaks and it'd be great.",
      'Solid code. Clean, readable, and functional.',
    ];

    const summary =
      score < 3
        ? summaryTemplates[Math.floor(Math.random() * 5)]
        : score < 6
          ? summaryTemplates[Math.floor(Math.random() * 3) + 5]
          : summaryTemplates[Math.floor(Math.random() * 2) + 8];

    // Generate fake created dates within last 30 days
    const createdAt = faker.date.recent({ days: 30 }).toISOString();

    const result = await client`
      INSERT INTO submissions (code, language, roast_mode, created_at)
      VALUES (${code}, ${language}, ${roastMode}, ${createdAt})
      RETURNING id
    `;

    const submissionId = result[0].id as string;
    submissionIds.push(submissionId);

    // Create feedback array for JSONB
    const feedbackLines = code.split('\n').length;
    const feedbackArray: Array<{
      line: number;
      severity: string;
      message: string;
      category: string;
    }> = [];
    const itemCount = Math.floor(Math.random() * 6) + 1;

    for (let j = 0; j < itemCount; j++) {
      const category = faker.helpers.arrayElement([...CATEGORIES]);
      const templates = FEEDBACK_TEMPLATES[category];
      const message = faker.helpers.arrayElement(templates);
      const severity =
        score < 3
          ? 'error'
          : score < 5
            ? 'warning'
            : faker.helpers.arrayElement(['info', 'suggestion']);
      const line = Math.floor(Math.random() * feedbackLines) + 1;

      feedbackArray.push({ line, severity, message, category });
    }

    const roastResult = await client`
      INSERT INTO roasts (submission_id, score, feedback, summary, created_at)
      VALUES (${submissionId}, ${score}, ${JSON.stringify(feedbackArray)}, ${summary}, ${createdAt})
      RETURNING id
    `;

    const roastId = roastResult[0].id as string;
    roastIds.push(roastId);
  }

  console.log('📝 Inserting feedback items...');

  // Insert feedback items
  for (let i = 0; i < roastIds.length; i++) {
    const roastId = roastIds[i];
    const submissionId = submissionIds[i];

    // Get the code for this submission
    const subResult = await client`
      SELECT code FROM submissions WHERE id = ${submissionId}
    `;
    const code = subResult[0]?.code ?? '';
    const lines = code.split('\n').length;

    const itemCount = Math.floor(Math.random() * 6) + 1;

    for (let j = 0; j < itemCount; j++) {
      const category = faker.helpers.arrayElement([...CATEGORIES]);
      const templates = FEEDBACK_TEMPLATES[category];
      const message = faker.helpers.arrayElement(templates);
      const severity = faker.helpers.arrayElement([...SEVERITIES]);
      const line = Math.floor(Math.random() * lines) + 1;
      const column = Math.floor(Math.random() * 30) + 1;

      await client`
        INSERT INTO feedback_items (roast_id, line, "column", severity, message, category)
        VALUES (${roastId}, ${line}, ${column}, ${severity}, ${message}, ${category})
      `;
    }
  }

  console.log('✅ Seed completed!');
  console.log(`   - Created 100 submissions`);
  console.log(`   - Created 100 roasts`);
  console.log(
    `   - Created ~${roastIds.reduce((acc) => acc + Math.floor(Math.random() * 6) + 1, 0)} feedback items`,
  );

  await client.end();
}

seed().catch(console.error);
