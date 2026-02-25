#!/usr/bin/env node

/**
 * genz++ Programming Language
 * The future of code. No cap.
 * 
 * Keywords:
 *   yeet x = 5      → variable declaration
 *   spill x         → print
 *   sus x > 5 tho   → if
 *   nah sus         → else if  
 *   nah             → else
 *   bet             → end block
 *   vibe check      → while loop
 *   bruh name tho   → function definition
 *   its giving x    → return
 *   👀              → input
 *   💀 comment      → comment
 *   ✨string✨       → string literal
 *   no cap / 💯     → true
 *   cap / 🧢        → false
 *   ghosted         → null
 *   be              → equals (==)
 *   aint            → not equals (!=)
 *   and             → logical and
 *   or              → logical or
 *   not             → logical not
 *   plug in X       → import stdlib module
 */

const fs = require('fs');
const readline = require('readline');

// ============================================================================
// LEXER
// ============================================================================

const TokenType = {
  // Keywords
  YEET: 'YEET',
  SPILL: 'SPILL',
  SUS: 'SUS',
  NAH: 'NAH',
  THO: 'THO',
  BET: 'BET',
  VIBE_CHECK: 'VIBE_CHECK',
  BRUH: 'BRUH',
  ITS_GIVING: 'ITS_GIVING',
  PLUG_IN: 'PLUG_IN',
  
  // Literals
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  GHOSTED: 'GHOSTED',
  
  // Operators
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  STAR: 'STAR',
  SLASH: 'SLASH',
  PERCENT: 'PERCENT',
  BE: 'BE',
  AINT: 'AINT',
  LESS: 'LESS',
  GREATER: 'GREATER',
  LESS_EQ: 'LESS_EQ',
  GREATER_EQ: 'GREATER_EQ',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  
  // Misc
  EQUALS: 'EQUALS',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  COMMA: 'COMMA',
  DOT: 'DOT',
  INPUT: 'INPUT',
  IDENTIFIER: 'IDENTIFIER',
  NEWLINE: 'NEWLINE',
  EOF: 'EOF',
};

class Token {
  constructor(type, value, line) {
    this.type = type;
    this.value = value;
    this.line = line;
  }
}

class Lexer {
  constructor(source) {
    // Convert to array of Unicode code points to handle emojis properly
    this.source = [...source];
    this.pos = 0;
    this.line = 1;
    this.tokens = [];
  }

  peek(offset = 0) {
    return this.source[this.pos + offset] || '\0';
  }

  advance() {
    const char = this.source[this.pos++];
    if (char === '\n') this.line++;
    return char;
  }

  skipWhitespace() {
    while (this.peek() === ' ' || this.peek() === '\t' || this.peek() === '\r') {
      this.advance();
    }
  }

  skipComment() {
    // 💀 is a comment - skip to end of line
    while (this.peek() !== '\n' && this.peek() !== '\0') {
      this.advance();
    }
  }

  readNumber() {
    let num = '';
    while (/[0-9.]/.test(this.peek())) {
      num += this.advance();
    }
    return parseFloat(num);
  }

  readString() {
    // Strings are wrapped in ✨sparkles✨
    let str = '';
    while (true) {
      const char = this.peek();
      if (char === '\0' || char === '\n') {
        throw new Error(`Unterminated string on line ${this.line}. You forgot the closing ✨ bestie`);
      }
      // Check for closing ✨
      if (char === '✨') {
        this.advance();
        break;
      }
      str += this.advance();
    }
    return str;
  }

  readIdentifier() {
    let id = '';
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      id += this.advance();
    }
    return id;
  }

  matchKeyword(keyword) {
    const keywordChars = [...keyword];
    const slice = this.source.slice(this.pos, this.pos + keywordChars.length);
    if (slice.join('') === keyword) {
      // Make sure it's not part of a larger word
      const nextChar = this.source[this.pos + keywordChars.length] || ' ';
      if (!/[a-zA-Z0-9_]/.test(nextChar)) {
        this.pos += keywordChars.length;
        return true;
      }
    }
    return false;
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();
      
      const char = this.peek();
      
      if (char === '\0') break;
      
      // Newline
      if (char === '\n') {
        this.tokens.push(new Token(TokenType.NEWLINE, '\\n', this.line));
        this.advance();
        continue;
      }

      // Comment 💀
      if (char === '💀') {
        this.advance();
        this.skipComment();
        continue;
      }

      // Input 👀
      if (char === '👀') {
        this.advance();
        this.tokens.push(new Token(TokenType.INPUT, '👀', this.line));
        continue;
      }

      // String ✨
      if (char === '✨') {
        this.advance();
        const str = this.readString();
        this.tokens.push(new Token(TokenType.STRING, str, this.line));
        continue;
      }

      // True 💯
      if (char === '💯') {
        this.advance();
        this.tokens.push(new Token(TokenType.TRUE, true, this.line));
        continue;
      }

      // False 🧢
      if (char === '🧢') {
        this.advance();
        this.tokens.push(new Token(TokenType.FALSE, false, this.line));
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        const num = this.readNumber();
        this.tokens.push(new Token(TokenType.NUMBER, num, this.line));
        continue;
      }

      // Operators and punctuation
      if (char === '+') { this.advance(); this.tokens.push(new Token(TokenType.PLUS, '+', this.line)); continue; }
      if (char === '-') { this.advance(); this.tokens.push(new Token(TokenType.MINUS, '-', this.line)); continue; }
      if (char === '*') { this.advance(); this.tokens.push(new Token(TokenType.STAR, '*', this.line)); continue; }
      if (char === '/') { this.advance(); this.tokens.push(new Token(TokenType.SLASH, '/', this.line)); continue; }
      if (char === '%') { this.advance(); this.tokens.push(new Token(TokenType.PERCENT, '%', this.line)); continue; }
      if (char === '(') { this.advance(); this.tokens.push(new Token(TokenType.LPAREN, '(', this.line)); continue; }
      if (char === ')') { this.advance(); this.tokens.push(new Token(TokenType.RPAREN, ')', this.line)); continue; }
      if (char === ',') { this.advance(); this.tokens.push(new Token(TokenType.COMMA, ',', this.line)); continue; }
      if (char === '.') { this.advance(); this.tokens.push(new Token(TokenType.DOT, '.', this.line)); continue; }
      if (char === '=') { this.advance(); this.tokens.push(new Token(TokenType.EQUALS, '=', this.line)); continue; }
      if (char === '<') {
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          this.tokens.push(new Token(TokenType.LESS_EQ, '<=', this.line));
        } else {
          this.tokens.push(new Token(TokenType.LESS, '<', this.line));
        }
        continue;
      }
      if (char === '>') {
        this.advance();
        if (this.peek() === '=') {
          this.advance();
          this.tokens.push(new Token(TokenType.GREATER_EQ, '>=', this.line));
        } else {
          this.tokens.push(new Token(TokenType.GREATER, '>', this.line));
        }
        continue;
      }

      // Keywords and identifiers
      if (/[a-zA-Z_]/.test(char)) {
        // Multi-word keywords first
        if (this.matchKeyword('vibe check')) {
          this.tokens.push(new Token(TokenType.VIBE_CHECK, 'vibe check', this.line));
          continue;
        }
        if (this.matchKeyword('its giving')) {
          this.tokens.push(new Token(TokenType.ITS_GIVING, 'its giving', this.line));
          continue;
        }
        if (this.matchKeyword('nah sus')) {
          this.tokens.push(new Token(TokenType.NAH, 'nah', this.line));
          this.tokens.push(new Token(TokenType.SUS, 'sus', this.line));
          continue;
        }
        if (this.matchKeyword('plug in')) {
          this.tokens.push(new Token(TokenType.PLUG_IN, 'plug in', this.line));
          continue;
        }
        if (this.matchKeyword('no cap')) {
          this.tokens.push(new Token(TokenType.TRUE, true, this.line));
          continue;
        }

        // Single word keywords
        const id = this.readIdentifier();
        
        switch (id) {
          case 'yeet': this.tokens.push(new Token(TokenType.YEET, 'yeet', this.line)); break;
          case 'spill': this.tokens.push(new Token(TokenType.SPILL, 'spill', this.line)); break;
          case 'sus': this.tokens.push(new Token(TokenType.SUS, 'sus', this.line)); break;
          case 'nah': this.tokens.push(new Token(TokenType.NAH, 'nah', this.line)); break;
          case 'tho': this.tokens.push(new Token(TokenType.THO, 'tho', this.line)); break;
          case 'bet': this.tokens.push(new Token(TokenType.BET, 'bet', this.line)); break;
          case 'bruh': this.tokens.push(new Token(TokenType.BRUH, 'bruh', this.line)); break;
          case 'ghosted': this.tokens.push(new Token(TokenType.GHOSTED, null, this.line)); break;
          case 'be': this.tokens.push(new Token(TokenType.BE, 'be', this.line)); break;
          case 'aint': this.tokens.push(new Token(TokenType.AINT, 'aint', this.line)); break;
          case 'and': this.tokens.push(new Token(TokenType.AND, 'and', this.line)); break;
          case 'or': this.tokens.push(new Token(TokenType.OR, 'or', this.line)); break;
          case 'not': this.tokens.push(new Token(TokenType.NOT, 'not', this.line)); break;
          case 'cap': this.tokens.push(new Token(TokenType.FALSE, false, this.line)); break;
          default: this.tokens.push(new Token(TokenType.IDENTIFIER, id, this.line));
        }
        continue;
      }

      throw new Error(`Unexpected character '${char}' on line ${this.line}. That's not valid bestie 💀`);
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line));
    return this.tokens;
  }
}

// ============================================================================
// AST NODES
// ============================================================================

class ASTNode {}

class Program extends ASTNode {
  constructor(statements) {
    super();
    this.statements = statements;
  }
}

class NumberLiteral extends ASTNode {
  constructor(value) { super(); this.value = value; }
}

class StringLiteral extends ASTNode {
  constructor(value) { super(); this.value = value; }
}

class BooleanLiteral extends ASTNode {
  constructor(value) { super(); this.value = value; }
}

class NullLiteral extends ASTNode {
  constructor() { super(); this.value = null; }
}

class Identifier extends ASTNode {
  constructor(name) { super(); this.name = name; }
}

class BinaryOp extends ASTNode {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

class UnaryOp extends ASTNode {
  constructor(op, operand) {
    super();
    this.op = op;
    this.operand = operand;
  }
}

class VarDeclaration extends ASTNode {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
}

class Assignment extends ASTNode {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
}

class PrintStatement extends ASTNode {
  constructor(expression) {
    super();
    this.expression = expression;
  }
}

class InputExpression extends ASTNode {
  constructor(prompt) {
    super();
    this.prompt = prompt;
  }
}

class IfStatement extends ASTNode {
  constructor(condition, thenBranch, elseIfBranches, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseIfBranches = elseIfBranches; // Array of {condition, body}
    this.elseBranch = elseBranch;
  }
}

class WhileStatement extends ASTNode {
  constructor(condition, body) {
    super();
    this.condition = condition;
    this.body = body;
  }
}

class FunctionDeclaration extends ASTNode {
  constructor(name, params, body) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }
}

class FunctionCall extends ASTNode {
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }
}

class MethodCall extends ASTNode {
  constructor(object, method, args) {
    super();
    this.object = object;
    this.method = method;
    this.args = args;
  }
}

class ReturnStatement extends ASTNode {
  constructor(value) {
    super();
    this.value = value;
  }
}

class PlugStatement extends ASTNode {
  constructor(moduleName) {
    super();
    this.moduleName = moduleName;
  }
}

// ============================================================================
// PARSER
// ============================================================================

class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE); // Ignore newlines for now
    this.pos = 0;
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset] || new Token(TokenType.EOF, null, -1);
  }

  advance() {
    return this.tokens[this.pos++];
  }

  check(type) {
    return this.peek().type === type;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        return this.advance();
      }
    }
    return null;
  }

  expect(type, message) {
    if (this.check(type)) {
      return this.advance();
    }
    throw new Error(`${message} on line ${this.peek().line}. Got '${this.peek().value}' instead. L + ratio`);
  }

  parse() {
    const statements = [];
    while (!this.check(TokenType.EOF)) {
      statements.push(this.parseStatement());
    }
    return new Program(statements);
  }

  parseStatement() {
    // Plug in (import)
    if (this.match(TokenType.PLUG_IN)) {
      const moduleName = this.expect(TokenType.IDENTIFIER, 'Expected module name after plug in').value;
      return new PlugStatement(moduleName);
    }

    // Variable declaration: yeet x = 5
    if (this.match(TokenType.YEET)) {
      const name = this.expect(TokenType.IDENTIFIER, 'Expected variable name after yeet').value;
      this.expect(TokenType.EQUALS, 'Expected = after variable name');
      const value = this.parseExpression();
      return new VarDeclaration(name, value);
    }

    // Print: spill x
    if (this.match(TokenType.SPILL)) {
      const expr = this.parseExpression();
      return new PrintStatement(expr);
    }

    // If statement: sus condition tho ... bet
    if (this.match(TokenType.SUS)) {
      return this.parseIfStatement();
    }

    // While loop: vibe check condition tho ... bet
    if (this.match(TokenType.VIBE_CHECK)) {
      const condition = this.parseExpression();
      this.expect(TokenType.THO, 'Expected tho after vibe check condition');
      const body = this.parseBlock();
      return new WhileStatement(condition, body);
    }

    // Function declaration: bruh name(params) tho ... bet
    if (this.match(TokenType.BRUH)) {
      const name = this.expect(TokenType.IDENTIFIER, 'Expected function name after bruh').value;
      const params = [];
      if (this.match(TokenType.LPAREN)) {
        if (!this.check(TokenType.RPAREN)) {
          do {
            params.push(this.expect(TokenType.IDENTIFIER, 'Expected parameter name').value);
          } while (this.match(TokenType.COMMA));
        }
        this.expect(TokenType.RPAREN, 'Expected ) after parameters');
      }
      this.expect(TokenType.THO, 'Expected tho after function declaration');
      const body = this.parseBlock();
      return new FunctionDeclaration(name, params, body);
    }

    // Return: its giving value
    if (this.match(TokenType.ITS_GIVING)) {
      const value = this.parseExpression();
      return new ReturnStatement(value);
    }

    // Assignment or expression statement
    if (this.check(TokenType.IDENTIFIER)) {
      const name = this.advance().value;
      if (this.match(TokenType.EQUALS)) {
        const value = this.parseExpression();
        return new Assignment(name, value);
      }
      // Put back and parse as expression
      this.pos--;
    }

    // Expression statement (e.g., function call)
    const expr = this.parseExpression();
    return expr;
  }

  parseIfStatement() {
    const condition = this.parseExpression();
    this.expect(TokenType.THO, 'Expected tho after sus condition');
    const thenBranch = this.parseBlock();
    
    const elseIfBranches = [];
    let elseBranch = null;

    // Check for nah sus (else if) or nah (else)
    while (this.check(TokenType.NAH)) {
      this.advance(); // consume nah
      
      if (this.match(TokenType.SUS)) {
        // else if
        const elseIfCondition = this.parseExpression();
        this.expect(TokenType.THO, 'Expected tho after nah sus condition');
        const elseIfBody = this.parseBlock();
        elseIfBranches.push({ condition: elseIfCondition, body: elseIfBody });
      } else {
        // else
        elseBranch = this.parseBlock();
        break;
      }
    }

    return new IfStatement(condition, thenBranch, elseIfBranches, elseBranch);
  }

  parseBlock() {
    const statements = [];
    while (!this.check(TokenType.BET) && !this.check(TokenType.NAH) && !this.check(TokenType.EOF)) {
      statements.push(this.parseStatement());
    }
    if (this.check(TokenType.BET)) {
      this.advance(); // consume bet
    }
    return statements;
  }

  parseExpression() {
    return this.parseOr();
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.match(TokenType.OR)) {
      const right = this.parseAnd();
      left = new BinaryOp(left, 'or', right);
    }
    return left;
  }

  parseAnd() {
    let left = this.parseEquality();
    while (this.match(TokenType.AND)) {
      const right = this.parseEquality();
      left = new BinaryOp(left, 'and', right);
    }
    return left;
  }

  parseEquality() {
    let left = this.parseComparison();
    while (true) {
      if (this.match(TokenType.BE)) {
        const right = this.parseComparison();
        left = new BinaryOp(left, 'be', right);
      } else if (this.match(TokenType.AINT)) {
        const right = this.parseComparison();
        left = new BinaryOp(left, 'aint', right);
      } else {
        break;
      }
    }
    return left;
  }

  parseComparison() {
    let left = this.parseTerm();
    while (true) {
      if (this.match(TokenType.LESS)) {
        left = new BinaryOp(left, '<', this.parseTerm());
      } else if (this.match(TokenType.GREATER)) {
        left = new BinaryOp(left, '>', this.parseTerm());
      } else if (this.match(TokenType.LESS_EQ)) {
        left = new BinaryOp(left, '<=', this.parseTerm());
      } else if (this.match(TokenType.GREATER_EQ)) {
        left = new BinaryOp(left, '>=', this.parseTerm());
      } else {
        break;
      }
    }
    return left;
  }

  parseTerm() {
    let left = this.parseFactor();
    while (true) {
      if (this.match(TokenType.PLUS)) {
        left = new BinaryOp(left, '+', this.parseFactor());
      } else if (this.match(TokenType.MINUS)) {
        left = new BinaryOp(left, '-', this.parseFactor());
      } else {
        break;
      }
    }
    return left;
  }

  parseFactor() {
    let left = this.parseUnary();
    while (true) {
      if (this.match(TokenType.STAR)) {
        left = new BinaryOp(left, '*', this.parseUnary());
      } else if (this.match(TokenType.SLASH)) {
        left = new BinaryOp(left, '/', this.parseUnary());
      } else if (this.match(TokenType.PERCENT)) {
        left = new BinaryOp(left, '%', this.parseUnary());
      } else {
        break;
      }
    }
    return left;
  }

  parseUnary() {
    if (this.match(TokenType.MINUS)) {
      return new UnaryOp('-', this.parseUnary());
    }
    if (this.match(TokenType.NOT)) {
      return new UnaryOp('not', this.parseUnary());
    }
    return this.parseCall();
  }

  parseCall() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        // Function call
        const args = [];
        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.parseExpression());
          } while (this.match(TokenType.COMMA));
        }
        this.expect(TokenType.RPAREN, 'Expected ) after arguments');
        
        if (expr instanceof Identifier) {
          expr = new FunctionCall(expr.name, args);
        } else if (expr instanceof MethodCall) {
          // Chained call - shouldn't happen in our simple case
          throw new Error('Chained calls not supported yet fr fr');
        }
      } else if (this.match(TokenType.DOT)) {
        // Method call: obj.method(args)
        const method = this.expect(TokenType.IDENTIFIER, 'Expected method name after dot').value;
        let args = [];
        if (this.match(TokenType.LPAREN)) {
          if (!this.check(TokenType.RPAREN)) {
            do {
              args.push(this.parseExpression());
            } while (this.match(TokenType.COMMA));
          }
          this.expect(TokenType.RPAREN, 'Expected ) after arguments');
        }
        
        if (expr instanceof Identifier) {
          expr = new MethodCall(expr.name, method, args);
        } else {
          throw new Error('Can only call methods on identifiers rn');
        }
      } else {
        break;
      }
    }

    return expr;
  }

  parsePrimary() {
    // Input
    if (this.match(TokenType.INPUT)) {
      let prompt = null;
      if (this.check(TokenType.STRING)) {
        prompt = this.advance().value;
      }
      return new InputExpression(prompt);
    }

    // Literals
    if (this.match(TokenType.NUMBER)) {
      return new NumberLiteral(this.tokens[this.pos - 1].value);
    }
    if (this.match(TokenType.STRING)) {
      return new StringLiteral(this.tokens[this.pos - 1].value);
    }
    if (this.match(TokenType.TRUE)) {
      return new BooleanLiteral(true);
    }
    if (this.match(TokenType.FALSE)) {
      return new BooleanLiteral(false);
    }
    if (this.match(TokenType.GHOSTED)) {
      return new NullLiteral();
    }

    // Identifier
    if (this.match(TokenType.IDENTIFIER)) {
      return new Identifier(this.tokens[this.pos - 1].value);
    }

    // Parenthesized expression
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, 'Expected ) bestie');
      return expr;
    }

    throw new Error(`Unexpected token '${this.peek().value}' on line ${this.peek().line}. Skill issue fr`);
  }
}

// ============================================================================
// STANDARD LIBRARY (the plug) 💅
// ============================================================================

const stdlib = {
  // ─────────────────────────────────────────────────────────────────────────
  // MATH - numbers be mathing
  // ─────────────────────────────────────────────────────────────────────────
  math: {
    ate: (x) => Math.abs(x),                    // absolute value (it ate, it devoured)
    glow_up: (x) => Math.ceil(x),               // ceiling (going up)
    humbled: (x) => Math.floor(x),              // floor (brought down, humbled)
    snatched: (x) => Math.round(x),             // round (looking snatched/clean)
    main_character: (...nums) => Math.max(...nums), // max (main character energy)
    npc: (...nums) => Math.min(...nums),        // min (npc behavior, background)
    glow: (x) => Math.sqrt(x),                  // sqrt (inner glow)
    periodt: () => Math.PI,                     // π (period. periodt.)
    era: () => Math.E,                          // e (it's giving euler era)
    power_move: (base, exp) => Math.pow(base, exp), // exponentiation (power move)
    lowkey: (x) => Math.log(x),                 // natural log (lowkey)
    highkey: (x) => Math.log10(x),              // log base 10 (highkey)
    vibes: (x) => Math.sin(x),                  // sin (wavy vibes)
    waves: (x) => Math.cos(x),                  // cos (making waves)
    ratio: (a, b) => a / b,                     // division (ratio'd)
    valid: (x) => !isNaN(x) && isFinite(x),    // check if number is valid
    sign_check: (x) => Math.sign(x),            // -1, 0, or 1 (checking the vibes)
    clamp: (x, min, max) => Math.min(Math.max(x, min), max), // keep it in range
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // TEA - string utilities (spill the tea) 🍵
  // ─────────────────────────────────────────────────────────────────────────
  tea: {
    upper: (s) => String(s).toUpperCase(),      // YELLING
    lower: (s) => String(s).toLowerCase(),      // mumbling
    spill_length: (s) => String(s).length,      // length (spill how long the tea is)
    sip: (s, start, end) => String(s).slice(start, end), // substring (take a sip)
    has_tea: (s, sub) => String(s).includes(sub), // contains (got that tea?)
    split: (s, delim = '') => String(s).split(delim), // split the tea
    trim: (s) => String(s).trim(),              // clean it up
    reverse: (s) => [...String(s)].reverse().join(''), // reverse (plot twist)
    starts_with: (s, prefix) => String(s).startsWith(prefix),
    ends_with: (s, suffix) => String(s).endsWith(suffix),
    replace: (s, old, replacement) => String(s).replace(old, replacement),
    replace_all: (s, old, replacement) => String(s).replaceAll(old, replacement),
    repeat: (s, n) => String(s).repeat(n),      // say it again bestie
    pad_left: (s, len, char = ' ') => String(s).padStart(len, char),
    pad_right: (s, len, char = ' ') => String(s).padEnd(len, char),
    char_at: (s, i) => String(s).charAt(i),     // get that character
    find: (s, sub) => String(s).indexOf(sub),   // where's the tea at? (-1 if not found)
    find_last: (s, sub) => String(s).lastIndexOf(sub),
    concat: (...strs) => strs.join(''),         // bring it all together
    join: (arr, sep = '') => arr.join(sep),     // join the group chat
    to_num: (s) => {                            // convert to number
      const n = parseFloat(s);
      return isNaN(n) ? null : n;
    },
    from_code: (n) => String.fromCharCode(n),   // char from code
    to_code: (s) => String(s).charCodeAt(0),    // code from char
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // RANDOM - chaos mode 🎲
  // ─────────────────────────────────────────────────────────────────────────
  random: {
    pick: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min, // random int in range
    vibe: () => Math.random(),                  // random 0-1 (checking the vibe)
    flip: () => Math.random() < 0.5,            // coin flip (50/50 no cap)
    chance: (percent) => Math.random() * 100 < percent, // percent chance
    pick_one: (arr) => arr[Math.floor(Math.random() * arr.length)], // random element
    shuffle: (arr) => {                         // shuffle array (mix it up)
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    uuid: () => {                               // generate unique id
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // LIST - array operations (the squad) 📋
  // ─────────────────────────────────────────────────────────────────────────
  list: {
    new: (...items) => [...items],              // create new list
    push: (arr, ...items) => { arr.push(...items); return arr; }, // add to end
    pop: (arr) => arr.pop(),                    // remove from end
    shift: (arr) => arr.shift(),                // remove from start
    unshift: (arr, ...items) => { arr.unshift(...items); return arr; }, // add to start
    yoink: (arr, index) => arr.splice(index, 1)[0], // remove at index
    insert: (arr, index, item) => { arr.splice(index, 0, item); return arr; },
    length: (arr) => arr.length,                // how long is the list
    at: (arr, index) => arr.at(index),          // get element (supports negative)
    first: (arr) => arr[0],                     // first element
    last: (arr) => arr[arr.length - 1],         // last element
    slice: (arr, start, end) => arr.slice(start, end), // get a portion
    concat: (...arrs) => [].concat(...arrs),    // combine lists
    includes: (arr, item) => arr.includes(item), // is it in there?
    find_index: (arr, item) => arr.indexOf(item), // where is it?
    reverse: (arr) => [...arr].reverse(),       // flip it (doesn't mutate)
    sort_nums: (arr) => [...arr].sort((a, b) => a - b), // sort numbers
    sort_words: (arr) => [...arr].sort(),       // sort strings
    unique: (arr) => [...new Set(arr)],         // remove duplicates (main characters only)
    flatten: (arr) => arr.flat(Infinity),       // flatten nested lists
    fill: (length, value) => Array(length).fill(value), // create filled list
    range: (start, end, step = 1) => {          // create range of numbers
      const result = [];
      for (let i = start; step > 0 ? i < end : i > end; i += step) {
        result.push(i);
      }
      return result;
    },
    sum: (arr) => arr.reduce((a, b) => a + b, 0), // add them all up
    average: (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
    count: (arr, item) => arr.filter(x => x === item).length, // count occurrences
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // TIME - async/sleep (take a nap) ⏰
  // ─────────────────────────────────────────────────────────────────────────
  time: {
    nap: async (ms) => new Promise(resolve => setTimeout(resolve, ms)), // sleep
    now: () => Date.now(),                      // current timestamp (ms)
    vibes: () => new Date().toLocaleTimeString(), // current time string
    today: () => new Date().toLocaleDateString(), // current date string
    year: () => new Date().getFullYear(),
    month: () => new Date().getMonth() + 1,     // 1-12
    day: () => new Date().getDate(),            // day of month
    weekday: () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
    hour: () => new Date().getHours(),
    minute: () => new Date().getMinutes(),
    second: () => new Date().getSeconds(),
    timestamp: () => Math.floor(Date.now() / 1000), // unix timestamp (seconds)
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // CONVERT - type conversions (glow up your types) 🔄
  // ─────────────────────────────────────────────────────────────────────────
  convert: {
    to_num: (x) => {
      const n = Number(x);
      return isNaN(n) ? null : n;
    },
    to_int: (x) => {
      const n = parseInt(x, 10);
      return isNaN(n) ? null : n;
    },
    to_str: (x) => String(x),
    to_bool: (x) => Boolean(x),
    to_list: (x) => Array.isArray(x) ? x : [...String(x)], // string to char array
    from_json: (s) => {
      try { return JSON.parse(s); }
      catch { return null; }
    },
    to_json: (x) => JSON.stringify(x),
    to_json_pretty: (x) => JSON.stringify(x, null, 2),
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // DEBUG - debugging tools (what's the tea?) 🔍
  // ─────────────────────────────────────────────────────────────────────────
  debug: {
    type_check: (x) => {
      if (x === null) return 'ghosted';
      if (Array.isArray(x)) return 'list';
      return typeof x;
    },
    is_valid: (x) => x !== null && x !== undefined,
    is_num: (x) => typeof x === 'number' && !isNaN(x),
    is_str: (x) => typeof x === 'string',
    is_bool: (x) => typeof x === 'boolean',
    is_list: (x) => Array.isArray(x),
    is_ghosted: (x) => x === null,
    inspect: (x) => {
      console.log('🔍 inspect:', x, `(${Array.isArray(x) ? 'list' : typeof x})`);
      return x;
    },
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // CANVAS - graphics era 🎨
  // ─────────────────────────────────────────────────────────────────────────
  canvas: {
    new: function(width, height, name = 'canvas') {
      return {
        name,
        width,
        height,
        commands: [],
        bg: '#1a1a2e',
        
        // Background color (vibe)
        vibe: function(color) {
          this.bg = color;
          return this;
        },
        
        // Fill color for shapes
        fill: function(color) {
          this.commands.push({ type: 'fill', color });
          return this;
        },
        
        // Stroke/outline color
        stroke: function(color) {
          this.commands.push({ type: 'stroke', color });
          return this;
        },
        
        // Line width
        thicc: function(width) {
          this.commands.push({ type: 'lineWidth', width });
          return this;
        },
        
        // Rectangle (slay a box)
        box: function(x, y, w, h) {
          this.commands.push({ type: 'rect', x, y, w, h });
          return this;
        },
        
        // Filled rectangle
        fill_box: function(x, y, w, h) {
          this.commands.push({ type: 'fillRect', x, y, w, h });
          return this;
        },
        
        // Circle (main character shape)
        circle: function(x, y, r) {
          this.commands.push({ type: 'circle', x, y, r, fill: false });
          return this;
        },
        
        // Filled circle
        fill_circle: function(x, y, r) {
          this.commands.push({ type: 'circle', x, y, r, fill: true });
          return this;
        },
        
        // Line (connect the dots bestie)
        line: function(x1, y1, x2, y2) {
          this.commands.push({ type: 'line', x1, y1, x2, y2 });
          return this;
        },
        
        // Text (spill on canvas)
        text: function(str, x, y, size = 16) {
          this.commands.push({ type: 'text', str, x, y, size });
          return this;
        },
        
        // Triangle (delta energy)
        triangle: function(x1, y1, x2, y2, x3, y3) {
          this.commands.push({ type: 'triangle', points: [[x1,y1], [x2,y2], [x3,y3]], fill: false });
          return this;
        },
        
        fill_triangle: function(x1, y1, x2, y2, x3, y3) {
          this.commands.push({ type: 'triangle', points: [[x1,y1], [x2,y2], [x3,y3]], fill: true });
          return this;
        },
        
        // Clear canvas
        clear: function() {
          this.commands.push({ type: 'clear' });
          return this;
        },
        
        // Save/restore state
        save: function() {
          this.commands.push({ type: 'save' });
          return this;
        },
        
        restore: function() {
          this.commands.push({ type: 'restore' });
          return this;
        },
        
        // Rotate (spin era)
        rotate: function(angle) {
          this.commands.push({ type: 'rotate', angle });
          return this;
        },
        
        // Translate (move the vibe)
        translate: function(x, y) {
          this.commands.push({ type: 'translate', x, y });
          return this;
        },
        
        // Scale (glow up/down)
        scale: function(x, y) {
          this.commands.push({ type: 'scale', x, y: y ?? x });
          return this;
        },
        
        // Render to HTML file
        serve: function(filename = 'output.html') {
          const html = generateCanvasHTML(this);
          fs.writeFileSync(filename, html);
          console.log(`🎨 Canvas saved to ${filename} - open it in your browser bestie`);
          return this;
        }
      };
    }
  }
};

// Generate HTML with canvas commands
function generateCanvasHTML(screen) {
  const cmdJS = screen.commands.map(cmd => {
    switch(cmd.type) {
      case 'fill': return `ctx.fillStyle = '${cmd.color}';`;
      case 'stroke': return `ctx.strokeStyle = '${cmd.color}';`;
      case 'lineWidth': return `ctx.lineWidth = ${cmd.width};`;
      case 'rect': return `ctx.strokeRect(${cmd.x}, ${cmd.y}, ${cmd.w}, ${cmd.h});`;
      case 'fillRect': return `ctx.fillRect(${cmd.x}, ${cmd.y}, ${cmd.w}, ${cmd.h});`;
      case 'circle': return `ctx.beginPath(); ctx.arc(${cmd.x}, ${cmd.y}, ${cmd.r}, 0, Math.PI * 2); ctx.${cmd.fill ? 'fill' : 'stroke'}();`;
      case 'line': return `ctx.beginPath(); ctx.moveTo(${cmd.x1}, ${cmd.y1}); ctx.lineTo(${cmd.x2}, ${cmd.y2}); ctx.stroke();`;
      case 'text': return `ctx.font = '${cmd.size}px "Comic Sans MS", cursive, sans-serif'; ctx.fillText('${cmd.str}', ${cmd.x}, ${cmd.y});`;
      case 'triangle': 
      case 'polygon': {
        const pts = cmd.points;
        let js = `ctx.beginPath(); ctx.moveTo(${pts[0][0]}, ${pts[0][1]});`;
        for (let i = 1; i < pts.length; i++) {
          js += ` ctx.lineTo(${pts[i][0]}, ${pts[i][1]});`;
        }
        js += ` ctx.closePath(); ctx.${cmd.fill ? 'fill' : 'stroke'}();`;
        return js;
      }
      case 'clear': return `ctx.clearRect(0, 0, canvas.width, canvas.height);`;
      case 'gradient': return `const grad = ctx.createLinearGradient(${cmd.x1}, ${cmd.y1}, ${cmd.x2}, ${cmd.y2}); grad.addColorStop(0, '${cmd.color1}'); grad.addColorStop(1, '${cmd.color2}'); ctx.fillStyle = grad;`;
      case 'save': return `ctx.save();`;
      case 'restore': return `ctx.restore();`;
      case 'rotate': return `ctx.rotate(${cmd.angle});`;
      case 'translate': return `ctx.translate(${cmd.x}, ${cmd.y});`;
      case 'scale': return `ctx.scale(${cmd.x}, ${cmd.y});`;
      default: return '';
    }
  }).join('\n    ');

  return `<!DOCTYPE html>
<html>
<head>
  <title>${screen.name} - genz++ canvas</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0f0f1a;
      font-family: 'Segoe UI', sans-serif;
    }
    .container {
      text-align: center;
    }
    h1 {
      color: #ff6b9d;
      margin-bottom: 20px;
      font-size: 1.5em;
    }
    canvas {
      border: 3px solid #ff6b9d;
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(255, 107, 157, 0.3);
    }
    .footer {
      color: #666;
      margin-top: 15px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ ${screen.name} ✨</h1>
    <canvas id="canvas" width="${screen.width}" height="${screen.height}"></canvas>
    <p class="footer">made with genz++ 💅</p>
  </div>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Background vibe
    ctx.fillStyle = '${screen.bg}';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw commands
    ${cmdJS}
  </script>
</body>
</html>`;
}

// ============================================================================
// INTERPRETER
// ============================================================================

class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}

class Interpreter {
  constructor() {
    this.globals = new Map();
    this.environment = this.globals;
    this.modules = new Map();
    this.inputBuffer = [];
    this.inputResolver = null;
  }

  async run(ast) {
    for (const stmt of ast.statements) {
      await this.execute(stmt);
    }
  }

  async execute(node) {
    if (node instanceof Program) {
      for (const stmt of node.statements) {
        const result = await this.execute(stmt);
        if (result instanceof ReturnValue) return result;
      }
      return null;
    }

    if (node instanceof PlugStatement) {
      if (stdlib[node.moduleName]) {
        this.modules.set(node.moduleName, stdlib[node.moduleName]);
      } else {
        throw new Error(`Module '${node.moduleName}' not found. That's not a thing bestie 💀`);
      }
      return null;
    }

    if (node instanceof VarDeclaration) {
      const value = await this.evaluate(node.value);
      this.environment.set(node.name, value);
      return null;
    }

    if (node instanceof Assignment) {
      if (!this.environment.has(node.name)) {
        throw new Error(`Variable '${node.name}' doesn't exist. You gotta yeet it first 💀`);
      }
      const value = await this.evaluate(node.value);
      this.environment.set(node.name, value);
      return null;
    }

    if (node instanceof PrintStatement) {
      const value = await this.evaluate(node.expression);
      console.log(this.stringify(value));
      return null;
    }

    if (node instanceof IfStatement) {
      const condition = await this.evaluate(node.condition);
      if (this.isTruthy(condition)) {
        return await this.executeBlock(node.thenBranch);
      }
      
      for (const elseIf of node.elseIfBranches) {
        const elseIfCondition = await this.evaluate(elseIf.condition);
        if (this.isTruthy(elseIfCondition)) {
          return await this.executeBlock(elseIf.body);
        }
      }
      
      if (node.elseBranch) {
        return await this.executeBlock(node.elseBranch);
      }
      return null;
    }

    if (node instanceof WhileStatement) {
      while (this.isTruthy(await this.evaluate(node.condition))) {
        const result = await this.executeBlock(node.body);
        if (result instanceof ReturnValue) return result;
      }
      return null;
    }

    if (node instanceof FunctionDeclaration) {
      this.environment.set(node.name, {
        type: 'function',
        params: node.params,
        body: node.body,
        closure: this.environment,
      });
      return null;
    }

    if (node instanceof ReturnStatement) {
      const value = await this.evaluate(node.value);
      return new ReturnValue(value);
    }

    // Expression statement
    return await this.evaluate(node);
  }

  async executeBlock(statements) {
    const previous = this.environment;
    this.environment = new Map(previous);
    
    try {
      for (const stmt of statements) {
        const result = await this.execute(stmt);
        if (result instanceof ReturnValue) return result;
      }
    } finally {
      this.environment = previous;
    }
    return null;
  }

  async evaluate(node) {
    if (node instanceof NumberLiteral) return node.value;
    if (node instanceof StringLiteral) return node.value;
    if (node instanceof BooleanLiteral) return node.value;
    if (node instanceof NullLiteral) return null;

    if (node instanceof Identifier) {
      if (this.environment.has(node.name)) {
        return this.environment.get(node.name);
      }
      if (this.modules.has(node.name)) {
        return this.modules.get(node.name);
      }
      throw new Error(`Variable '${node.name}' is ghosting you. It doesn't exist 💀`);
    }

    if (node instanceof InputExpression) {
      if (node.prompt) {
        process.stdout.write(node.prompt + ' ');
      }
      const input = await this.readInput();
      // Try to convert to number
      const num = parseFloat(input);
      return isNaN(num) ? input : num;
    }

    if (node instanceof UnaryOp) {
      const operand = await this.evaluate(node.operand);
      switch (node.op) {
        case '-': return -operand;
        case 'not': return !this.isTruthy(operand);
      }
    }

    if (node instanceof BinaryOp) {
      const left = await this.evaluate(node.left);
      const right = await this.evaluate(node.right);
      
      switch (node.op) {
        case '+': 
          if (typeof left === 'string' || typeof right === 'string') {
            return String(left) + String(right);
          }
          return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': 
          if (right === 0) throw new Error("Can't divide by zero bestie. That's illegal 💀");
          return left / right;
        case '%': return left % right;
        case '<': return left < right;
        case '>': return left > right;
        case '<=': return left <= right;
        case '>=': return left >= right;
        case 'be': return left === right;
        case 'aint': return left !== right;
        case 'and': return this.isTruthy(left) && this.isTruthy(right);
        case 'or': return this.isTruthy(left) || this.isTruthy(right);
      }
    }

    if (node instanceof FunctionCall) {
      const func = this.environment.get(node.name);
      if (!func) {
        throw new Error(`Function '${node.name}' doesn't exist. Who is she? 💀`);
      }
      
      if (func.type !== 'function') {
        throw new Error(`'${node.name}' is not callable. It's giving... not a function 💀`);
      }

      const args = [];
      for (const arg of node.args) {
        args.push(await this.evaluate(arg));
      }

      // Create new environment for function
      const previous = this.environment;
      this.environment = new Map(func.closure);
      
      // Bind parameters
      for (let i = 0; i < func.params.length; i++) {
        this.environment.set(func.params[i], args[i] ?? null);
      }

      try {
        const result = await this.executeBlock(func.body);
        if (result instanceof ReturnValue) {
          return result.value;
        }
        return null;
      } finally {
        this.environment = previous;
      }
    }

    if (node instanceof MethodCall) {
      const obj = this.modules.get(node.object) || this.environment.get(node.object);
      if (!obj) {
        throw new Error(`'${node.object}' doesn't exist. It ghosted you 💀`);
      }

      // Replace underscores in method names (math.glow_up -> glow_up)
      const methodName = node.method;
      const method = obj[methodName];
      
      if (!method) {
        throw new Error(`Method '${methodName}' doesn't exist on '${node.object}'. Not valid bestie 💀`);
      }

      const args = [];
      for (const arg of node.args) {
        args.push(await this.evaluate(arg));
      }

      // Bind this properly and call
      const result = method.call(obj, ...args);
      // Handle promises (for time.nap)
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }

    throw new Error(`Unknown node type. This is giving... error 💀`);
  }

  isTruthy(value) {
    if (value === null) return false;
    if (value === false) return false;
    if (value === 0) return false;
    if (value === '') return false;
    return true;
  }

  stringify(value) {
    if (value === null) return 'ghosted';
    if (value === true) return 'no cap';
    if (value === false) return 'cap';
    if (Array.isArray(value)) return '[' + value.map(v => this.stringify(v)).join(', ') + ']';
    return String(value);
  }

  async readInput() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.on('line', (line) => {
        rl.close();
        resolve(line.trim());
      });
    });
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('genz++ interpreter v1.0');
    console.log('Usage: node genz.js <filename.genz>');
    console.log('');
    console.log('No cap, this is the future of programming 💯');
    process.exit(0);
  }

  const filename = args[0];
  
  if (!fs.existsSync(filename)) {
    console.error(`File '${filename}' not found. It ghosted you 💀`);
    process.exit(1);
  }

  const source = fs.readFileSync(filename, 'utf-8');

  try {
    // Lexer
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    // Parser
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Interpreter
    const interpreter = new Interpreter();
    await interpreter.run(ast);

  } catch (error) {
    console.error(`💀 ERROR: ${error.message}`);
    process.exit(1);
  }
}

main();