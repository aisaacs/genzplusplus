/**
 * genz++ Browser Runtime
 * The future of code. In your browser. No cap.
 *
 * Single file, zero build step, zero dependencies.
 * Drop this into a page and run genz++ programs.
 */

(function(globalThis) {
'use strict';

// ============================================================================
// LEXER
// ============================================================================

const TokenType = {
  YEET: 'YEET', SPILL: 'SPILL', SUS: 'SUS', NAH: 'NAH', THO: 'THO',
  BET: 'BET', VIBE_CHECK: 'VIBE_CHECK', BRUH: 'BRUH',
  ITS_GIVING: 'ITS_GIVING', PLUG_IN: 'PLUG_IN', DIP: 'DIP',
  NUMBER: 'NUMBER', STRING: 'STRING', TRUE: 'TRUE', FALSE: 'FALSE',
  GHOSTED: 'GHOSTED',
  PLUS: 'PLUS', MINUS: 'MINUS', STAR: 'STAR', SLASH: 'SLASH',
  PERCENT: 'PERCENT', BE: 'BE', AINT: 'AINT', LESS: 'LESS',
  GREATER: 'GREATER', LESS_EQ: 'LESS_EQ', GREATER_EQ: 'GREATER_EQ',
  AND: 'AND', OR: 'OR', NOT: 'NOT',
  LBRACKET: 'LBRACKET', RBRACKET: 'RBRACKET',
  EQUALS: 'EQUALS', LPAREN: 'LPAREN', RPAREN: 'RPAREN',
  COMMA: 'COMMA', DOT: 'DOT', INPUT: 'INPUT',
  IDENTIFIER: 'IDENTIFIER', NEWLINE: 'NEWLINE', EOF: 'EOF',
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
    let str = '';
    while (true) {
      const char = this.peek();
      if (char === '\0') {
        throw new Error(`Unterminated string on line ${this.line}. You forgot the closing \u2728 bestie`);
      }
      if (char === '\n') {
        this.line++;
      }
      if (char === '\u2728') {
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

      if (char === '\n') {
        this.tokens.push(new Token(TokenType.NEWLINE, '\\n', this.line));
        this.advance();
        continue;
      }

      if (char === '\u{1F480}') { // 💀
        this.advance();
        this.skipComment();
        continue;
      }

      if (char === '\u{1F440}') { // 👀
        this.advance();
        this.tokens.push(new Token(TokenType.INPUT, '\u{1F440}', this.line));
        continue;
      }

      if (char === '\u2728') { // ✨
        this.advance();
        const str = this.readString();
        this.tokens.push(new Token(TokenType.STRING, str, this.line));
        continue;
      }

      if (char === '\u{1F4AF}') { // 💯
        this.advance();
        this.tokens.push(new Token(TokenType.TRUE, true, this.line));
        continue;
      }

      if (char === '\u{1F9E2}') { // 🧢
        this.advance();
        this.tokens.push(new Token(TokenType.FALSE, false, this.line));
        continue;
      }

      if (/[0-9]/.test(char)) {
        const num = this.readNumber();
        this.tokens.push(new Token(TokenType.NUMBER, num, this.line));
        continue;
      }

      if (char === '+') { this.advance(); this.tokens.push(new Token(TokenType.PLUS, '+', this.line)); continue; }
      if (char === '-') { this.advance(); this.tokens.push(new Token(TokenType.MINUS, '-', this.line)); continue; }
      if (char === '*') { this.advance(); this.tokens.push(new Token(TokenType.STAR, '*', this.line)); continue; }
      if (char === '/') { this.advance(); this.tokens.push(new Token(TokenType.SLASH, '/', this.line)); continue; }
      if (char === '%') { this.advance(); this.tokens.push(new Token(TokenType.PERCENT, '%', this.line)); continue; }
      if (char === '(') { this.advance(); this.tokens.push(new Token(TokenType.LPAREN, '(', this.line)); continue; }
      if (char === ')') { this.advance(); this.tokens.push(new Token(TokenType.RPAREN, ')', this.line)); continue; }
      if (char === ',') { this.advance(); this.tokens.push(new Token(TokenType.COMMA, ',', this.line)); continue; }
      if (char === '.') { this.advance(); this.tokens.push(new Token(TokenType.DOT, '.', this.line)); continue; }
      if (char === '[') { this.advance(); this.tokens.push(new Token(TokenType.LBRACKET, '[', this.line)); continue; }
      if (char === ']') { this.advance(); this.tokens.push(new Token(TokenType.RBRACKET, ']', this.line)); continue; }
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

      if (/[a-zA-Z_]/.test(char)) {
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
          case 'dip': this.tokens.push(new Token(TokenType.DIP, 'dip', this.line)); break;
          default: this.tokens.push(new Token(TokenType.IDENTIFIER, id, this.line));
        }
        continue;
      }

      throw new Error(`Unexpected character '${char}' on line ${this.line}. That's not valid bestie \u{1F480}`);
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
  constructor(statements) { super(); this.statements = statements; }
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
    super(); this.left = left; this.op = op; this.right = right;
  }
}

class UnaryOp extends ASTNode {
  constructor(op, operand) { super(); this.op = op; this.operand = operand; }
}

class VarDeclaration extends ASTNode {
  constructor(name, value) { super(); this.name = name; this.value = value; }
}

class Assignment extends ASTNode {
  constructor(name, value) { super(); this.name = name; this.value = value; }
}

class PrintStatement extends ASTNode {
  constructor(expression) { super(); this.expression = expression; }
}

class InputExpression extends ASTNode {
  constructor(prompt) { super(); this.prompt = prompt; }
}

class IfStatement extends ASTNode {
  constructor(condition, thenBranch, elseIfBranches, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseIfBranches = elseIfBranches;
    this.elseBranch = elseBranch;
  }
}

class WhileStatement extends ASTNode {
  constructor(condition, body) { super(); this.condition = condition; this.body = body; }
}

class FunctionDeclaration extends ASTNode {
  constructor(name, params, body) {
    super(); this.name = name; this.params = params; this.body = body;
  }
}

class FunctionCall extends ASTNode {
  constructor(name, args) { super(); this.name = name; this.args = args; }
}

class MethodCall extends ASTNode {
  constructor(object, method, args) {
    super(); this.object = object; this.method = method; this.args = args;
  }
}

class ReturnStatement extends ASTNode {
  constructor(value) { super(); this.value = value; }
}

class BreakStatement extends ASTNode {
  constructor() { super(); }
}

class IndexAccess extends ASTNode {
  constructor(object, index) { super(); this.object = object; this.index = index; }
}

class IndexAssignment extends ASTNode {
  constructor(object, index, value) {
    super(); this.object = object; this.index = index; this.value = value;
  }
}

class ArrayLiteral extends ASTNode {
  constructor(elements) { super(); this.elements = elements; }
}

class PropertyAccess extends ASTNode {
  constructor(object, property) { super(); this.object = object; this.property = property; }
}

class PlugStatement extends ASTNode {
  constructor(moduleName) { super(); this.moduleName = moduleName; }
}

// ============================================================================
// PARSER
// ============================================================================

class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE);
    this.pos = 0;
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset] || new Token(TokenType.EOF, null, -1);
  }

  advance() { return this.tokens[this.pos++]; }
  check(type) { return this.peek().type === type; }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) return this.advance();
    }
    return null;
  }

  expect(type, message) {
    if (this.check(type)) return this.advance();
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
    if (this.match(TokenType.PLUG_IN)) {
      const moduleName = this.expect(TokenType.IDENTIFIER, 'Expected module name after plug in').value;
      return new PlugStatement(moduleName);
    }

    if (this.match(TokenType.DIP)) {
      return new BreakStatement();
    }

    if (this.match(TokenType.YEET)) {
      const name = this.expect(TokenType.IDENTIFIER, 'Expected variable name after yeet').value;
      this.expect(TokenType.EQUALS, 'Expected = after variable name');
      const value = this.parseExpression();
      return new VarDeclaration(name, value);
    }

    if (this.match(TokenType.SPILL)) {
      const expr = this.parseExpression();
      return new PrintStatement(expr);
    }

    if (this.match(TokenType.SUS)) {
      return this.parseIfStatement();
    }

    if (this.match(TokenType.VIBE_CHECK)) {
      const condition = this.parseExpression();
      this.expect(TokenType.THO, 'Expected tho after vibe check condition');
      const { statements: body } = this.parseBlock();
      return new WhileStatement(condition, body);
    }

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
      const { statements: body } = this.parseBlock();
      return new FunctionDeclaration(name, params, body);
    }

    if (this.match(TokenType.ITS_GIVING)) {
      const value = this.parseExpression();
      return new ReturnStatement(value);
    }

    if (this.check(TokenType.IDENTIFIER)) {
      const savedPos = this.pos;
      const name = this.advance().value;
      if (this.check(TokenType.LBRACKET)) {
        this.advance();
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, 'Expected ] bestie');
        if (this.match(TokenType.EQUALS)) {
          const value = this.parseExpression();
          return new IndexAssignment(new Identifier(name), index, value);
        }
        this.pos = savedPos;
      } else if (this.match(TokenType.EQUALS)) {
        const value = this.parseExpression();
        return new Assignment(name, value);
      } else {
        this.pos = savedPos;
      }
    }

    const expr = this.parseExpression();
    return expr;
  }

  parseIfStatement() {
    const condition = this.parseExpression();
    this.expect(TokenType.THO, 'Expected tho after sus condition');
    const { statements: thenBranch, closedByBet } = this.parseBlock();

    const elseIfBranches = [];
    let elseBranch = null;

    if (!closedByBet) {
      while (this.check(TokenType.NAH)) {
        const nahLine = this.peek().line;
        this.advance();

        if (this.check(TokenType.SUS) && this.peek().line === nahLine) {
          this.advance();
          const elseIfCondition = this.parseExpression();
          this.expect(TokenType.THO, 'Expected tho after nah sus condition');
          const { statements: elseIfBody, closedByBet: elseIfClosed } = this.parseBlock();
          elseIfBranches.push({ condition: elseIfCondition, body: elseIfBody });
          if (elseIfClosed) break;
        } else {
          elseBranch = this.parseBlock().statements;
          break;
        }
      }
    }

    return new IfStatement(condition, thenBranch, elseIfBranches, elseBranch);
  }

  parseBlock() {
    const statements = [];
    while (!this.check(TokenType.BET) && !this.check(TokenType.NAH) && !this.check(TokenType.EOF)) {
      statements.push(this.parseStatement());
    }
    let closedByBet = false;
    if (this.check(TokenType.BET)) {
      this.advance();
      closedByBet = true;
    }
    return { statements, closedByBet };
  }

  parseExpression() { return this.parseOr(); }

  parseOr() {
    let left = this.parseAnd();
    while (this.match(TokenType.OR)) {
      left = new BinaryOp(left, 'or', this.parseAnd());
    }
    return left;
  }

  parseAnd() {
    let left = this.parseEquality();
    while (this.match(TokenType.AND)) {
      left = new BinaryOp(left, 'and', this.parseEquality());
    }
    return left;
  }

  parseEquality() {
    let left = this.parseComparison();
    while (true) {
      if (this.match(TokenType.BE)) {
        left = new BinaryOp(left, 'be', this.parseComparison());
      } else if (this.match(TokenType.AINT)) {
        left = new BinaryOp(left, 'aint', this.parseComparison());
      } else break;
    }
    return left;
  }

  parseComparison() {
    let left = this.parseTerm();
    while (true) {
      if (this.match(TokenType.LESS)) left = new BinaryOp(left, '<', this.parseTerm());
      else if (this.match(TokenType.GREATER)) left = new BinaryOp(left, '>', this.parseTerm());
      else if (this.match(TokenType.LESS_EQ)) left = new BinaryOp(left, '<=', this.parseTerm());
      else if (this.match(TokenType.GREATER_EQ)) left = new BinaryOp(left, '>=', this.parseTerm());
      else break;
    }
    return left;
  }

  parseTerm() {
    let left = this.parseFactor();
    while (true) {
      if (this.match(TokenType.PLUS)) left = new BinaryOp(left, '+', this.parseFactor());
      else if (this.match(TokenType.MINUS)) left = new BinaryOp(left, '-', this.parseFactor());
      else break;
    }
    return left;
  }

  parseFactor() {
    let left = this.parseUnary();
    while (true) {
      if (this.match(TokenType.STAR)) left = new BinaryOp(left, '*', this.parseUnary());
      else if (this.match(TokenType.SLASH)) left = new BinaryOp(left, '/', this.parseUnary());
      else if (this.match(TokenType.PERCENT)) left = new BinaryOp(left, '%', this.parseUnary());
      else break;
    }
    return left;
  }

  parseUnary() {
    if (this.match(TokenType.MINUS)) return new UnaryOp('-', this.parseUnary());
    if (this.match(TokenType.NOT)) return new UnaryOp('not', this.parseUnary());
    return this.parseCall();
  }

  parseCall() {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.LBRACKET)) {
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, 'Expected ] bestie');
        expr = new IndexAccess(expr, index);
        continue;
      }
      if (this.match(TokenType.LPAREN)) {
        const args = [];
        if (!this.check(TokenType.RPAREN)) {
          do { args.push(this.parseExpression()); } while (this.match(TokenType.COMMA));
        }
        this.expect(TokenType.RPAREN, 'Expected ) after arguments');

        if (expr instanceof Identifier) {
          expr = new FunctionCall(expr.name, args);
        } else if (expr instanceof MethodCall) {
          throw new Error('Chained calls not supported yet fr fr');
        }
      } else if (this.match(TokenType.DOT)) {
        // Accept identifiers AND keywords as method names (e.g. dom.yeet, list.bet)
        const tok = this.tokens[this.pos];
        if (!tok || tok.type === TokenType.EOF) throw new Error(`Expected method name after dot on line ${tok ? tok.line : '?'}. L + ratio`);
        let method;
        if (tok.type === TokenType.IDENTIFIER) {
          method = tok.value;
          this.pos++;
        } else if (typeof tok.value === 'string' && /^[a-zA-Z_]/.test(tok.value)) {
          // keyword token used as method name
          method = tok.value;
          this.pos++;
        } else {
          throw new Error(`Expected method name after dot on line ${tok.line}. Got '${tok.value}' instead. L + ratio`);
        }
        let args = [];
        let isCall = false;
        if (this.match(TokenType.LPAREN)) {
          isCall = true;
          if (!this.check(TokenType.RPAREN)) {
            do { args.push(this.parseExpression()); } while (this.match(TokenType.COMMA));
          }
          this.expect(TokenType.RPAREN, 'Expected ) after arguments');
        }

        if (expr instanceof Identifier) {
          expr = new MethodCall(expr.name, method, args);
          expr._isPropertyAccess = !isCall;
        } else {
          if (!isCall && args.length === 0) {
            expr = new PropertyAccess(expr, method);
          } else {
            throw new Error('Can only call methods on identifiers rn');
          }
        }
      } else {
        break;
      }
    }

    return expr;
  }

  parsePrimary() {
    if (this.match(TokenType.INPUT)) {
      let prompt = null;
      if (this.check(TokenType.STRING)) prompt = this.advance().value;
      return new InputExpression(prompt);
    }

    if (this.match(TokenType.NUMBER)) return new NumberLiteral(this.tokens[this.pos - 1].value);
    if (this.match(TokenType.STRING)) return new StringLiteral(this.tokens[this.pos - 1].value);
    if (this.match(TokenType.TRUE)) return new BooleanLiteral(true);
    if (this.match(TokenType.FALSE)) return new BooleanLiteral(false);
    if (this.match(TokenType.GHOSTED)) return new NullLiteral();
    if (this.match(TokenType.IDENTIFIER)) return new Identifier(this.tokens[this.pos - 1].value);

    if (this.match(TokenType.LBRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RBRACKET)) {
        do { elements.push(this.parseExpression()); } while (this.match(TokenType.COMMA));
      }
      this.expect(TokenType.RBRACKET, 'Expected ] to close array bestie');
      return new ArrayLiteral(elements);
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, 'Expected ) bestie');
      return expr;
    }

    throw new Error(`Unexpected token '${this.peek().value}' on line ${this.peek().line}. Skill issue fr`);
  }
}

// ============================================================================
// STANDARD LIBRARY (the plug)
// ============================================================================

const stdlib = {
  math: {
    ate: (x) => Math.abs(x),
    glow_up: (x) => Math.ceil(x),
    humbled: (x) => Math.floor(x),
    snatched: (x) => Math.round(x),
    main_character: (...nums) => Math.max(...nums),
    npc: (...nums) => Math.min(...nums),
    glow: (x) => Math.sqrt(x),
    periodt: () => Math.PI,
    era: () => Math.E,
    power_move: (base, exp) => Math.pow(base, exp),
    lowkey: (x) => Math.log(x),
    highkey: (x) => Math.log10(x),
    vibes: (x) => Math.sin(x),
    waves: (x) => Math.cos(x),
    ratio: (a, b) => a / b,
    valid: (x) => !isNaN(x) && isFinite(x),
    sign_check: (x) => Math.sign(x),
    clamp: (x, min, max) => Math.min(Math.max(x, min), max),
  },

  tea: {
    yell: (s) => String(s).toUpperCase(),
    whisper: (s) => String(s).toLowerCase(),
    spill_length: (s) => String(s).length,
    sip: (s, start, end) => String(s).slice(start, end),
    has_tea: (s, sub) => String(s).includes(sub),
    shatter: (s, delim = '') => String(s).split(delim),
    detox: (s) => String(s).trim(),
    plot_twist: (s) => [...String(s)].reverse().join(''),
    opens_with: (s, prefix) => String(s).startsWith(prefix),
    closes_with: (s, suffix) => String(s).endsWith(suffix),
    swap: (s, old, replacement) => String(s).replace(old, replacement),
    swap_all: (s, old, replacement) => String(s).replaceAll(old, replacement),
    spam: (s, n) => String(s).repeat(n),
    fluff_left: (s, len, char = ' ') => String(s).padStart(len, char),
    fluff_right: (s, len, char = ' ') => String(s).padEnd(len, char),
    peek: (s, i) => String(s).charAt(i),
    stalk: (s, sub) => String(s).indexOf(sub),
    stalk_last: (s, sub) => String(s).lastIndexOf(sub),
    link_up: (...strs) => strs.join(''),
    squad_up: (arr, sep = '') => arr.join(sep),
    cook_num: (s) => { const n = parseFloat(s); return isNaN(n) ? null : n; },
    summon: (n) => String.fromCharCode(n),
    expose: (s) => String(s).charCodeAt(0),
  },

  random: {
    pick: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    vibe: () => Math.random(),
    flip: () => Math.random() < 0.5,
    chance: (percent) => Math.random() * 100 < percent,
    pick_one: (arr) => arr[Math.floor(Math.random() * arr.length)],
    shuffle: (arr) => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    uuid: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },
  },

  list: {
    spawn: (...items) => [...items],
    yeet_in: (arr, ...items) => { arr.push(...items); return arr; },
    yeet_out: (arr) => arr.pop(),
    boot: (arr) => arr.shift(),
    cut_in: (arr, ...items) => { arr.unshift(...items); return arr; },
    yoink: (arr, index) => arr.splice(index, 1)[0],
    sneak_in: (arr, index, item) => { arr.splice(index, 0, item); return arr; },
    body_count: (arr) => arr.length,
    peep: (arr, index) => arr.at(index),
    alpha: (arr) => arr[0],
    omega: (arr) => arr[arr.length - 1],
    snag: (arr, start, end) => arr.slice(start, end),
    collab: (...arrs) => [].concat(...arrs),
    claims: (arr, item) => arr.includes(item),
    where_at: (arr, item) => arr.indexOf(item),
    plot_twist: (arr) => [...arr].reverse(),
    rank: (arr) => [...arr].sort((a, b) => a - b),
    abc: (arr) => [...arr].sort(),
    no_dupes: (arr) => [...new Set(arr)],
    unbox: (arr) => arr.flat(Infinity),
    mint: (length, value) => Array(length).fill(value),
    range: (start, end, step = 1) => {
      const result = [];
      for (let i = start; step > 0 ? i < end : i > end; i += step) result.push(i);
      return result;
    },
    total: (arr) => arr.reduce((a, b) => a + b, 0),
    mid: (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
    tally: (arr, item) => arr.filter(x => x === item).length,
  },

  time: {
    nap: async (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    wait: async (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    rn: () => Date.now(),
    vibes: () => new Date().toLocaleTimeString(),
    today: () => new Date().toLocaleDateString(),
    year: () => new Date().getFullYear(),
    month: () => new Date().getMonth() + 1,
    day: () => new Date().getDate(),
    weekday: () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
    hour: () => new Date().getHours(),
    minute: () => new Date().getMinutes(),
    second: () => new Date().getSeconds(),
    receipts: () => Math.floor(Date.now() / 1000),
  },

  convert: {
    cook_num: (x) => { const n = Number(x); return isNaN(n) ? null : n; },
    cook_int: (x) => { const n = parseInt(x, 10); return isNaN(n) ? null : n; },
    cook_str: (x) => String(x),
    cook_bool: (x) => Boolean(x),
    cook_list: (x) => Array.isArray(x) ? x : [...String(x)],
    unjson: (s) => { try { return JSON.parse(s); } catch { return null; } },
    jsonify: (x) => JSON.stringify(x),
    jsonify_pretty: (x) => JSON.stringify(x, null, 2),
  },

  net: {
    yoink: async (url) => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return { error: true, message: e.message }; }
    },
    yoink_text: async (url) => {
      try { const res = await fetch(url); return await res.text(); }
      catch (e) { return { error: true, message: e.message }; }
    },
    yoink_json: async (url) => {
      try { const res = await fetch(url); return await res.json(); }
      catch (e) { return { error: true, message: e.message }; }
    },
    shoot: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return { error: true, message: e.message }; }
    },
    shoot_text: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'text/plain' },
          body: String(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return { error: true, message: e.message }; }
    },
    glow_up: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return { error: true, message: e.message }; }
    },
    ghost: async (url) => {
      try {
        const res = await fetch(url, { method: 'DELETE' });
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return { error: true, message: e.message }; }
    },
    tweak: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return { error: true, message: e.message }; }
    },
    full_send: async (url, method, headers, body) => {
      try {
        const opts = { method: method || 'GET' };
        if (headers) opts.headers = headers;
        if (body) opts.body = typeof body === 'string' ? body : JSON.stringify(body);
        const res = await fetch(url, opts);
        const text = await res.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = text; }
        return { status: res.status, ok: res.ok, body: parsed };
      } catch (e) { return { error: true, message: e.message }; }
    },
    vibe_check: async (url) => {
      try { const res = await fetch(url, { method: 'HEAD' }); return res.status; }
      catch { return 0; }
    },
    link_up: (base, params) => {
      if (!params) return base;
      const qs = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      return `${base}?${qs}`;
    },
  },

  obj: {
    spawn: () => ({}),
    cook: (...pairs) => {
      const o = {};
      for (let i = 0; i < pairs.length - 1; i += 2) o[pairs[i]] = pairs[i + 1];
      return o;
    },
    slap: (o, key, val) => { o[key] = val; return o; },
    peep: (o, key) => o[key] !== undefined ? o[key] : null,
    keys: (o) => Object.keys(o),
    goods: (o) => Object.values(o),
    got: (o, key) => key in o,
    yeet: (o, key) => { delete o[key]; return o; },
    mashup: (a, b) => ({ ...a, ...b }),
    dupe: (o) => ({ ...o }),
    rundown: (o) => Object.entries(o),
  },

  env: {
    peep: () => null,
    got: () => false,
  },

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
      console.log('inspect:', x, `(${Array.isArray(x) ? 'list' : typeof x})`);
      return x;
    },
  },

  drip: {
    red: (s) => s, green: (s) => s, yellow: (s) => s, blue: (s) => s,
    magenta: (s) => s, cyan: (s) => s, white: (s) => s, gray: (s) => s,
    orange: (s) => s, pink: (s) => s, purple: (s) => s, lime: (s) => s,
    teal: (s) => s, coral: (s) => s, gold: (s) => s, lavender: (s) => s,
    mint: (s) => s, rose: (s) => s, sky: (s) => s, peach: (s) => s,
    bg_red: (s) => s, bg_green: (s) => s, bg_yellow: (s) => s,
    bg_blue: (s) => s, bg_magenta: (s) => s, bg_cyan: (s) => s, bg_white: (s) => s,
    bold: (s) => s, dim: (s) => s, italic: (s) => s, underline: (s) => s,
    strike: (s) => s, inverse: (s) => s,
    color: (s) => s, bg_color: (s) => s,
    rgb: (s) => s, bg_rgb: (s) => s,
    raw: () => '', reset: () => '',
    cleanse: (s) => String(s).replace(/\x1b\[[0-9;]*m/g, ''),
    rainbow: (s) => s,
  },

  loading: {
    spin_up: () => {},
    wind_down: () => {},
    styles: () => ['dots', 'braille', 'vibes', 'moon', 'clock', 'bars'],
  },
};

// ============================================================================
// 3x5 PIXEL FONT
// ============================================================================

const _miniFont = [
  [0,0,0,0,0],[2,2,2,0,2],[5,5,0,0,0],[5,7,5,7,5],[3,6,3,6,3],
  [5,1,2,4,5],[2,5,2,5,3],[2,2,0,0,0],[1,2,2,2,1],[4,2,2,2,4],
  [5,2,5,0,0],[0,2,7,2,0],[0,0,0,2,4],[0,0,7,0,0],[0,0,0,0,2],
  [1,1,2,4,4],[7,5,5,5,7],[2,6,2,2,7],[7,1,7,4,7],[7,1,7,1,7],
  [5,5,7,1,1],[7,4,7,1,7],[7,4,7,5,7],[7,1,2,2,2],[7,5,7,5,7],
  [7,5,7,1,7],[0,2,0,2,0],[0,2,0,2,4],[1,2,4,2,1],[0,7,0,7,0],
  [4,2,1,2,4],[7,1,3,0,2],[7,5,7,4,7],[7,5,7,5,5],[6,5,6,5,6],
  [7,4,4,4,7],[6,5,5,5,6],[7,4,7,4,7],[7,4,7,4,4],[7,4,5,5,7],
  [5,5,7,5,5],[7,2,2,2,7],[1,1,1,5,7],[5,5,6,5,5],[4,4,4,4,7],
  [5,7,7,5,5],[5,7,7,7,5],[7,5,5,5,7],[7,5,7,4,4],[7,5,5,7,3],
  [7,5,7,6,5],[7,4,7,1,7],[7,2,2,2,2],[5,5,5,5,7],[5,5,5,5,2],
  [5,5,7,7,5],[5,5,2,5,5],[5,5,2,2,2],[7,1,2,4,7],[3,2,2,2,3],
  [4,4,2,1,1],[6,2,2,2,6],[2,5,0,0,0],[0,0,0,0,7],[4,2,0,0,0],
  [0,3,5,5,3],[4,6,5,5,6],[0,3,4,4,3],[1,3,5,5,3],[0,7,5,6,3],
  [1,2,7,2,2],[0,3,5,3,6],[4,6,5,5,5],[2,0,2,2,2],[1,0,1,5,2],
  [4,5,6,5,5],[2,2,2,2,1],[0,7,7,5,5],[0,6,5,5,5],[0,7,5,5,7],
  [0,6,5,6,4],[0,3,5,3,1],[0,3,4,4,4],[0,3,6,1,6],[2,7,2,2,1],
  [0,5,5,5,3],[0,5,5,5,2],[0,5,5,7,5],[0,5,2,2,5],[0,5,5,3,6],
  [0,7,2,4,7],[1,2,6,2,1],[2,2,2,2,2],[4,2,3,2,4],[0,5,2,0,0],
];

// ============================================================================
// GPU MODULE (Canvas/ImageData)
// ============================================================================

const _gpu = (() => {
  return {
    spawn: function(w, h, title) {
      w = (w || 800) | 0;
      h = (h || 600) | 0;
      title = title || 'genz++ gpu';

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.style.cssText = 'border:3px solid #ff6b9d;border-radius:12px;box-shadow:0 0 30px rgba(255,107,157,0.3);display:block;margin:8px auto;image-rendering:pixelated;max-width:100%;height:auto;';

      // Title label
      const label = document.createElement('div');
      label.textContent = title;
      label.style.cssText = 'color:#ff6b9d;font-family:monospace;font-size:14px;text-align:center;margin:4px 0;';

      const container = document.getElementById('genz-gpu') || document.getElementById('genz-output') || document.body;
      container.appendChild(label);
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(w, h);
      const buf = imageData.data; // Uint8ClampedArray RGBA
      let alive = true;

      // Keyboard state
      const keys = new Set();
      const keyMap = {
        'Escape': 'esc', 'Enter': 'enter', 'Tab': 'tab', 'Backspace': 'backspace',
        ' ': 'space', 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left',
        'ArrowRight': 'right',
      };
      function mapKey(e) {
        if (keyMap[e.key]) return keyMap[e.key];
        if (e.key.length === 1) return e.key.toLowerCase();
        return e.key.toLowerCase();
      }
      function onKeyDown(e) {
        if (!alive) return;
        keys.add(mapKey(e));
        e.preventDefault();
      }
      function onKeyUp(e) {
        if (!alive) return;
        keys.delete(mapKey(e));
      }
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);

      // Touch gamepad for mobile
      let gamepad = null;
      const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      if (hasTouch) {
        gamepad = document.createElement('div');
        gamepad.className = 'genz-gamepad';
        gamepad.innerHTML =
          '<div class="genz-dpad">' +
            '<div class="genz-dpad-btn empty"></div>' +
            '<div class="genz-dpad-btn" data-key="up">\u25B2</div>' +
            '<div class="genz-dpad-btn empty"></div>' +
            '<div class="genz-dpad-btn" data-key="left">\u25C0</div>' +
            '<div class="genz-dpad-btn" data-key="down">\u25BC</div>' +
            '<div class="genz-dpad-btn" data-key="right">\u25B6</div>' +
          '</div>' +
          '<div class="genz-meta-btns">' +
            '<div class="genz-meta-btn" data-key="enter">START</div>' +
            '<div class="genz-meta-btn" data-key="esc">ESC</div>' +
          '</div>' +
          '<div class="genz-action-btns">' +
            '<div class="genz-action-btn" data-key="space">FIRE</div>' +
            '<div class="genz-action-btn" data-key="up" style="border-color:#4ade80;color:#4ade80;background:rgba(74,222,128,0.15);width:56px;height:56px;font-size:10px;">THRUST</div>' +
          '</div>';
        container.appendChild(gamepad);

        // Wire touch events — each button sets/clears the key in the same Set
        const btns = gamepad.querySelectorAll('[data-key]');
        btns.forEach(function(btn) {
          var k = btn.getAttribute('data-key');
          btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (alive) keys.add(k);
            btn.classList.add('active');
          }, {passive: false});
          btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            keys.delete(k);
            btn.classList.remove('active');
          }, {passive: false});
          btn.addEventListener('touchcancel', function(e) {
            keys.delete(k);
            btn.classList.remove('active');
          });
        });
      }

      const obj = {
        _type: 'gpu_window',
        width: w,
        height: h,

        serve: function() {
          if (!alive) return Promise.resolve(false);
          return new Promise(resolve => {
            requestAnimationFrame(() => resolve(alive));
          });
        },

        pressed: function(name) {
          return keys.has(name);
        },

        ink: function(x, y, r, g, b) {
          x = x | 0; y = y | 0;
          if (x < 0 || x >= w || y < 0 || y >= h) return this;
          const i = (y * w + x) * 4;
          buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = 255;
          return this;
        },

        cleanse: function(r, g, b) {
          r = r || 0; g = g || 0; b = b || 0;
          for (let p = 0; p < w * h; p++) {
            const i = p * 4;
            buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = 255;
          }
          return this;
        },

        strut: function(x0, y0, x1, y1, r, g, b) {
          x0=x0|0; y0=y0|0; x1=x1|0; y1=y1|0;
          const dx = Math.abs(x1-x0), sx = x0<x1?1:-1;
          const dy = -Math.abs(y1-y0), sy = y0<y1?1:-1;
          let err = dx+dy;
          while(true) {
            this.ink(x0,y0,r,g,b);
            if(x0===x1 && y0===y1) break;
            const e2 = 2*err;
            if(e2>=dy) { err+=dy; x0+=sx; }
            if(e2<=dx) { err+=dx; y0+=sy; }
          }
          return this;
        },

        fit: function(x, y, bw, bh, r, g, b) {
          this.strut(x,y,x+bw-1,y,r,g,b);
          this.strut(x+bw-1,y,x+bw-1,y+bh-1,r,g,b);
          this.strut(x+bw-1,y+bh-1,x,y+bh-1,r,g,b);
          this.strut(x,y+bh-1,x,y,r,g,b);
          return this;
        },

        drip: function(x, y, bw, bh, r, g, b) {
          x=x|0; y=y|0;
          for(let py=y; py<y+bh; py++)
            for(let px=x; px<x+bw; px++)
              this.ink(px,py,r,g,b);
          return this;
        },

        halo: function(cx, cy, radius, r, g, b) {
          cx=cx|0; cy=cy|0; radius=radius|0;
          let x=radius, y=0, err=1-radius;
          while(x>=y) {
            this.ink(cx+x,cy+y,r,g,b); this.ink(cx-x,cy+y,r,g,b);
            this.ink(cx+x,cy-y,r,g,b); this.ink(cx-x,cy-y,r,g,b);
            this.ink(cx+y,cy+x,r,g,b); this.ink(cx-y,cy+x,r,g,b);
            this.ink(cx+y,cy-x,r,g,b); this.ink(cx-y,cy-x,r,g,b);
            y++;
            if(err<0) { err+=2*y+1; } else { x--; err+=2*(y-x)+1; }
          }
          return this;
        },

        aura: function(cx, cy, radius, r, g, b) {
          cx=cx|0; cy=cy|0; radius=radius|0;
          for(let py=-radius; py<=radius; py++)
            for(let px=-radius; px<=radius; px++)
              if(px*px+py*py<=radius*radius)
                this.ink(cx+px,cy+py,r,g,b);
          return this;
        },

        stan: function(str, x, y, r, g, b, scale) {
          const font = _miniFont;
          str = String(str);
          scale = (scale || 2) | 0;
          for (let ci = 0; ci < str.length; ci++) {
            const ch = str.charCodeAt(ci) - 32;
            const glyph = font[ch] || font[0];
            for (let gy = 0; gy < 5; gy++)
              for (let gx = 0; gx < 3; gx++)
                if ((glyph[gy] >> (2-gx)) & 1)
                  for (let sy = 0; sy < scale; sy++)
                    for (let sx = 0; sx < scale; sx++)
                      this.ink(
                        x + ci*(3+1)*scale + gx*scale + sx,
                        y + gy*scale + sy, r, g, b);
          }
          return this;
        },

        flaunt: function() {
          ctx.putImageData(imageData, 0, 0);
          return this;
        },

        chill: function(ms) {
          // No-op in browser (requestAnimationFrame handles timing)
          return this;
        },

        unalive: function() {
          if (!alive) return this;
          alive = false;
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('keyup', onKeyUp);
          if (gamepad) { gamepad.remove(); gamepad = null; }
          return this;
        }
      };
      return obj;
    }
  };
})();

stdlib.gpu = _gpu;

// ============================================================================
// SOUND MODULE (Web Audio API)
// ============================================================================

const _sound = (() => {
  const SAMPLE_RATE = 44100;
  const TWO_PI = 6.283185307179586;

  return {
    spawn: function() {
      let audioCtx = null;
      let masterGain = null;
      let alive = true;

      // Pre-generate white noise buffer
      let noiseBuffer = null;

      function ensureAudio() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          masterGain = audioCtx.createGain();
          masterGain.connect(audioCtx.destination);
          masterGain.gain.value = 0.8;

          // Pre-generate 2 seconds of white noise
          noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
          const data = noiseBuffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
          }
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }

      function waveType(wave) {
        const map = { 'saw': 'sawtooth', 'tri': 'triangle' };
        return map[wave] || wave;
      }

      const obj = {
        _type: 'sound_context',

        bop: function(wave, freq, dur, vol) {
          ensureAudio();
          wave = String(wave || 'sine');
          freq = +freq || 440;
          dur = +dur || 200;
          vol = (vol != null ? +vol : 80) / 100;
          vol = Math.max(0, Math.min(1, vol));

          const now = audioCtx.currentTime;
          const durSec = dur / 1000;
          const attackSec = Math.min(0.005, durSec / 3);
          const decaySec = Math.min(0.01, durSec / 3);

          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = waveType(wave);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(vol, now + attackSec);
          gain.gain.setValueAtTime(vol, now + durSec - decaySec);
          gain.gain.linearRampToValueAtTime(0, now + durSec);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + durSec + 0.01);
          osc.onended = () => { gain.disconnect(); osc.disconnect(); };
        },

        slide: function(wave, freqStart, freqEnd, dur, vol) {
          ensureAudio();
          wave = String(wave || 'sine');
          freqStart = +freqStart || 440;
          freqEnd = +freqEnd || 220;
          dur = +dur || 200;
          vol = (vol != null ? +vol : 80) / 100;
          vol = Math.max(0, Math.min(1, vol));

          const now = audioCtx.currentTime;
          const durSec = dur / 1000;
          const attackSec = Math.min(0.005, durSec / 3);
          const decaySec = Math.min(0.01, durSec / 3);

          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = waveType(wave);
          osc.frequency.setValueAtTime(freqStart, now);
          osc.frequency.linearRampToValueAtTime(freqEnd, now + durSec);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(vol, now + attackSec);
          gain.gain.setValueAtTime(vol, now + durSec - decaySec);
          gain.gain.linearRampToValueAtTime(0, now + durSec);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + durSec + 0.01);
          osc.onended = () => { gain.disconnect(); osc.disconnect(); };
        },

        noise: function(dur, vol) {
          ensureAudio();
          dur = +dur || 100;
          vol = (vol != null ? +vol : 60) / 100;
          vol = Math.max(0, Math.min(1, vol));

          const now = audioCtx.currentTime;
          const durSec = dur / 1000;
          const attackSec = Math.min(0.005, durSec / 3);
          const decaySec = Math.min(0.01, durSec / 3);

          const src = audioCtx.createBufferSource();
          src.buffer = noiseBuffer;
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(vol, now + attackSec);
          gain.gain.setValueAtTime(vol, now + durSec - decaySec);
          gain.gain.linearRampToValueAtTime(0, now + durSec);

          src.connect(gain);
          gain.connect(masterGain);
          src.start(now);
          src.stop(now + durSec + 0.01);
          src.onended = () => { gain.disconnect(); src.disconnect(); };
        },

        hush: function() {
          if (!audioCtx) return;
          masterGain.disconnect();
          masterGain = audioCtx.createGain();
          masterGain.connect(audioCtx.destination);
          masterGain.gain.value = 0.8;
        },

        vibe: function() {
          return 0; // Web Audio self-manages voices
        },

        volume: function(v) {
          ensureAudio();
          masterGain.gain.value = Math.max(0, Math.min(1, (+v || 0) / 100));
        },

        serve: function() {
          // No-op — Web Audio self-schedules
        },

        unalive: function() {
          if (!alive) return;
          alive = false;
          if (audioCtx) {
            audioCtx.close().catch(() => {});
            audioCtx = null;
          }
        },
      };
      return obj;
    },
  };
})();

stdlib.sound = _sound;

// ============================================================================
// KEYS MODULE (Browser keyboard input)
// ============================================================================

stdlib.keys = (() => {
  const _pressed = new Set();
  let _active = false;

  const keyMap = {
    'Escape': 'esc', 'Enter': 'enter', 'Tab': 'tab', 'Backspace': 'backspace',
    ' ': 'space', 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left',
    'ArrowRight': 'right',
  };

  function mapKey(e) {
    if (keyMap[e.key]) return keyMap[e.key];
    if (e.key.length === 1) return e.key.toLowerCase();
    return e.key.toLowerCase();
  }

  function onDown(e) { _pressed.add(mapKey(e)); }
  function onUp(e) { _pressed.delete(mapKey(e)); }

  return {
    tune_in: function() {
      if (_active) return;
      _active = true;
      document.addEventListener('keydown', onDown);
      document.addEventListener('keyup', onUp);
    },
    tune_out: function() {
      if (!_active) return;
      _active = false;
      document.removeEventListener('keydown', onDown);
      document.removeEventListener('keyup', onUp);
    },
    pressed: function(name) { return _pressed.has(name); },
    forget: function() { _pressed.clear(); },
    latest: function() {
      const arr = [..._pressed];
      return arr.length > 0 ? arr[arr.length - 1] : '';
    },
    vibing: function() { return _pressed.size > 0; },
  };
})();

// ============================================================================
// CANVAS MODULE (static drawing → output)
// ============================================================================

stdlib.canvas = {
  new: function(width, height, name) {
    return {
      _type: 'canvas',
      name: name || 'canvas',
      width: width || 800,
      height: height || 600,
      commands: [],
      bg: '#1a1a2e',
      vibe: function(color) { this.bg = color; return this; },
      sauce: function(color) { this.commands.push({ type: 'fill', color }); return this; },
      edge: function(color) { this.commands.push({ type: 'stroke', color }); return this; },
      thicc: function(width) { this.commands.push({ type: 'lineWidth', width }); return this; },
      fit: function(x, y, w, h) { this.commands.push({ type: 'rect', x, y, w, h }); return this; },
      drip: function(x, y, w, h) { this.commands.push({ type: 'fillRect', x, y, w, h }); return this; },
      halo: function(x, y, r) { this.commands.push({ type: 'circle', x, y, r, fill: false }); return this; },
      aura: function(x, y, r) { this.commands.push({ type: 'circle', x, y, r, fill: true }); return this; },
      strut: function(x1, y1, x2, y2) { this.commands.push({ type: 'line', x1, y1, x2, y2 }); return this; },
      caption: function(str, x, y, size) { this.commands.push({ type: 'text', str, x, y, size: size || 16 }); return this; },
      triangle: function(x1, y1, x2, y2, x3, y3) {
        this.commands.push({ type: 'triangle', points: [[x1,y1],[x2,y2],[x3,y3]], fill: false }); return this;
      },
      slay_triangle: function(x1, y1, x2, y2, x3, y3) {
        this.commands.push({ type: 'triangle', points: [[x1,y1],[x2,y2],[x3,y3]], fill: true }); return this;
      },
      polygon: function(points) { this.commands.push({ type: 'triangle', points, fill: false }); return this; },
      slay_polygon: function(points) { this.commands.push({ type: 'triangle', points, fill: true }); return this; },
      ombre: function(x1, y1, x2, y2, color1, color2) {
        this.commands.push({ type: 'gradient', x1, y1, x2, y2, color1, color2 }); return this;
      },
      arc: function(x, y, r, sa, ea) { this.commands.push({ type: 'arc', x, y, r, startAngle: sa, endAngle: ea, fill: false }); return this; },
      slay_arc: function(x, y, r, sa, ea) { this.commands.push({ type: 'arc', x, y, r, startAngle: sa, endAngle: ea, fill: true }); return this; },
      pill: function(x, y, w, h, radius) { this.commands.push({ type: 'roundRect', x, y, w, h, radius: radius || 10 }); return this; },
      slay_pill: function(x, y, w, h, radius) { this.commands.push({ type: 'fillRoundRect', x, y, w, h, radius: radius || 10 }); return this; },
      cleanse: function() { this.commands.push({ type: 'clear' }); return this; },
      checkpoint: function() { this.commands.push({ type: 'save' }); return this; },
      respawn: function() { this.commands.push({ type: 'restore' }); return this; },
      spin: function(angle) { this.commands.push({ type: 'rotate', angle }); return this; },
      slide: function(x, y) { this.commands.push({ type: 'translate', x, y }); return this; },
      zoom: function(sx, sy) { this.commands.push({ type: 'scale', x: sx, y: sy !== undefined ? sy : sx }); return this; },
      ghostly: function(a) { this.commands.push({ type: 'alpha', a }); return this; },
      serve: function() {
        // Render to a canvas in the DOM
        const el = document.createElement('canvas');
        el.width = this.width;
        el.height = this.height;
        el.style.cssText = 'border:3px solid #ff6b9d;border-radius:12px;box-shadow:0 0 30px rgba(255,107,157,0.3);display:block;margin:8px auto;';
        const ctx = el.getContext('2d');
        ctx.fillStyle = this.bg;
        ctx.fillRect(0, 0, this.width, this.height);
        for (const cmd of this.commands) {
          switch(cmd.type) {
            case 'fill': ctx.fillStyle = cmd.color; break;
            case 'stroke': ctx.strokeStyle = cmd.color; break;
            case 'lineWidth': ctx.lineWidth = cmd.width; break;
            case 'rect': ctx.strokeRect(cmd.x, cmd.y, cmd.w, cmd.h); break;
            case 'fillRect': ctx.fillRect(cmd.x, cmd.y, cmd.w, cmd.h); break;
            case 'circle': ctx.beginPath(); ctx.arc(cmd.x, cmd.y, cmd.r, 0, Math.PI*2); cmd.fill ? ctx.fill() : ctx.stroke(); break;
            case 'arc': ctx.beginPath(); ctx.arc(cmd.x, cmd.y, cmd.r, cmd.startAngle, cmd.endAngle); cmd.fill ? ctx.fill() : ctx.stroke(); break;
            case 'line': ctx.beginPath(); ctx.moveTo(cmd.x1, cmd.y1); ctx.lineTo(cmd.x2, cmd.y2); ctx.stroke(); break;
            case 'text': ctx.font = `${cmd.size}px monospace`; ctx.fillText(cmd.str, cmd.x, cmd.y); break;
            case 'triangle': {
              const pts = cmd.points;
              ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
              for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
              ctx.closePath(); cmd.fill ? ctx.fill() : ctx.stroke();
              break;
            }
            case 'roundRect': ctx.beginPath(); ctx.roundRect(cmd.x, cmd.y, cmd.w, cmd.h, cmd.radius); ctx.stroke(); break;
            case 'fillRoundRect': ctx.beginPath(); ctx.roundRect(cmd.x, cmd.y, cmd.w, cmd.h, cmd.radius); ctx.fill(); break;
            case 'gradient': {
              const g = ctx.createLinearGradient(cmd.x1, cmd.y1, cmd.x2, cmd.y2);
              g.addColorStop(0, cmd.color1); g.addColorStop(1, cmd.color2);
              ctx.fillStyle = g; break;
            }
            case 'clear': ctx.clearRect(0, 0, this.width, this.height); break;
            case 'save': ctx.save(); break;
            case 'restore': ctx.restore(); break;
            case 'rotate': ctx.rotate(cmd.angle); break;
            case 'translate': ctx.translate(cmd.x, cmd.y); break;
            case 'scale': ctx.scale(cmd.x, cmd.y); break;
            case 'alpha': ctx.globalAlpha = cmd.a; break;
          }
        }
        const container = document.getElementById('genz-output') || document.body;
        container.appendChild(el);
        return this;
      }
    };
  }
};

// ============================================================================
// SCREEN MODULE (stub — not useful in browser, but don't crash)
// ============================================================================

stdlib.screen = {
  cols: function() { return 80; },
  rows: function() { return 24; },
  spawn: function(w, h, title) {
    // Delegate to gpu.spawn for browser
    return _gpu.spawn(w, h, title);
  }
};

// ============================================================================
// DOM MODULE (NEW — website building in genz++)
// ============================================================================

function createDomModule(interpreter) {
  return {
    cook: function(tag) {
      return document.createElement(tag);
    },

    caption: function(el, text) {
      el.textContent = text;
    },

    inner: function(el, html) {
      el.innerHTML = html;
    },

    drip: function(el, prop, val) {
      el.style[prop] = val;
    },

    glow_up: function(el, cls) {
      el.classList.add(cls);
    },

    humble: function(el, cls) {
      el.classList.remove(cls);
    },

    slap: function(el, attr, val) {
      el.setAttribute(attr, val);
    },

    peep: function(el, attr) {
      return el.getAttribute(attr);
    },

    yeet: function(el) {
      const target = document.getElementById('genz-dom') || document.body;
      target.appendChild(el);
    },

    yeet_in: function(parent, child) {
      parent.appendChild(child);
    },

    ghost: function(el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    },

    snag: function(selector) {
      return document.querySelector(selector);
    },

    snag_all: function(selector) {
      return [...document.querySelectorAll(selector)];
    },

    tune_in: function(el, event, func) {
      el.addEventListener(event, async (e) => {
        const eventObj = {
          type: e.type,
          key: e.key || null,
          x: e.clientX !== undefined ? e.clientX : null,
          y: e.clientY !== undefined ? e.clientY : null,
          target_id: e.target.id || null,
          target_tag: e.target.tagName.toLowerCase(),
        };
        try {
          await interpreter.callFunction(func, [eventObj]);
        } catch(err) {
          console.error('genz++ event handler error:', err.message);
        }
      });
    },

    value: function(el) {
      return el.value;
    },

    set_value: function(el, val) {
      el.value = val;
    },

    vibes: function(css) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    },

    serve: function() {
      return new Promise(resolve => {
        requestAnimationFrame(() => resolve(true));
      });
    },
  };
}

// ============================================================================
// INTERPRETER
// ============================================================================

class ReturnValue {
  constructor(value) { this.value = value; }
}

class BreakSignal {
  constructor() {}
}

class Interpreter {
  constructor(outputEl) {
    this.globals = new Map();
    this.environment = this.globals;
    this.modules = new Map();
    this.outputEl = outputEl || document.getElementById('genz-output') || null;
    this._stopped = false;
  }

  stop() {
    this._stopped = true;
  }

  _findScope(name) {
    let scope = this.environment;
    while (scope) {
      if (scope.has(name)) return scope;
      scope = scope._parent || null;
    }
    return null;
  }

  async run(ast) {
    for (const stmt of ast.statements) {
      if (this._stopped) return;
      await this.execute(stmt);
    }
  }

  async callFunction(func, args) {
    const previous = this.environment;
    const funcEnv = new Map();
    funcEnv._parent = func.closure;
    this.environment = funcEnv;
    for (let i = 0; i < func.params.length; i++) {
      this.environment.set(func.params[i], args[i] ?? null);
    }
    try {
      const result = await this.executeBlock(func.body);
      return result instanceof ReturnValue ? result.value : null;
    } finally {
      this.environment = previous;
    }
  }

  _output(text) {
    console.log(text);
    if (this.outputEl) {
      const line = document.createElement('div');
      line.textContent = text;
      line.className = 'genz-line';
      this.outputEl.appendChild(line);
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }
  }

  async execute(node) {
    if (this._stopped) return null;

    if (node instanceof Program) {
      for (const stmt of node.statements) {
        if (this._stopped) return null;
        const result = await this.execute(stmt);
        if (result instanceof ReturnValue) return result;
        if (result instanceof BreakSignal) return result;
      }
      return null;
    }

    if (node instanceof PlugStatement) {
      if (node.moduleName === 'dom') {
        this.modules.set('dom', createDomModule(this));
      } else if (stdlib[node.moduleName]) {
        this.modules.set(node.moduleName, stdlib[node.moduleName]);
      } else {
        throw new Error(`Module '${node.moduleName}' not found. That's not a thing bestie \u{1F480}`);
      }
      return null;
    }

    if (node instanceof BreakStatement) {
      return new BreakSignal();
    }

    if (node instanceof VarDeclaration) {
      const value = await this.evaluate(node.value);
      const existingScope = this._findScope(node.name);
      if (existingScope) {
        existingScope.set(node.name, value);
      } else {
        this.environment.set(node.name, value);
      }
      return null;
    }

    if (node instanceof Assignment) {
      const scope = this._findScope(node.name);
      if (!scope) {
        throw new Error(`Variable '${node.name}' doesn't exist. You gotta yeet it first \u{1F480}`);
      }
      const value = await this.evaluate(node.value);
      scope.set(node.name, value);
      return null;
    }

    if (node instanceof IndexAssignment) {
      const obj = await this.evaluate(node.object);
      const index = await this.evaluate(node.index);
      const value = await this.evaluate(node.value);
      if (Array.isArray(obj)) {
        obj[index] = value;
      } else {
        throw new Error(`Can't set index on ${typeof obj}. That's not a list bestie \u{1F480}`);
      }
      return null;
    }

    if (node instanceof PrintStatement) {
      const value = await this.evaluate(node.expression);
      this._output(this.stringify(value));
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
        if (this._stopped) return null;
        const result = await this.executeBlock(node.body);
        if (result instanceof ReturnValue) return result;
        if (result instanceof BreakSignal) break;
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

    return await this.evaluate(node);
  }

  async executeBlock(statements) {
    const previous = this.environment;
    const child = new Map();
    child._parent = previous;
    this.environment = child;

    try {
      for (const stmt of statements) {
        if (this._stopped) return null;
        const result = await this.execute(stmt);
        if (result instanceof ReturnValue) return result;
        if (result instanceof BreakSignal) return result;
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
      const scope = this._findScope(node.name);
      if (scope) return scope.get(node.name);
      if (this.modules.has(node.name)) return this.modules.get(node.name);
      throw new Error(`Variable '${node.name}' is ghosting you. It doesn't exist \u{1F480}`);
    }

    if (node instanceof InputExpression) {
      const result = window.prompt(node.prompt || 'input:');
      if (result === null) return '';
      const num = parseFloat(result);
      return isNaN(num) ? result : num;
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
          if (Array.isArray(left) && Array.isArray(right)) return [...left, ...right];
          if (Array.isArray(left)) return [...left, right];
          if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
          return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/':
          if (right === 0) throw new Error("Can't divide by zero bestie. That's illegal \u{1F480}");
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
      const scope = this._findScope(node.name);
      const func = scope ? scope.get(node.name) : null;
      if (!func) throw new Error(`Function '${node.name}' doesn't exist. Who is she? \u{1F480}`);
      if (func.type !== 'function') throw new Error(`'${node.name}' is not callable. It's giving... not a function \u{1F480}`);

      const args = [];
      for (const arg of node.args) args.push(await this.evaluate(arg));

      const previous = this.environment;
      const funcEnv = new Map();
      funcEnv._parent = func.closure;
      this.environment = funcEnv;

      for (let i = 0; i < func.params.length; i++) {
        this.environment.set(func.params[i], args[i] ?? null);
      }

      try {
        const result = await this.executeBlock(func.body);
        if (result instanceof ReturnValue) return result.value;
        return null;
      } finally {
        this.environment = previous;
      }
    }

    if (node instanceof MethodCall) {
      const scope = this._findScope(node.object);
      const obj = this.modules.get(node.object) || (scope ? scope.get(node.object) : null);
      if (!obj) throw new Error(`'${node.object}' doesn't exist. It ghosted you \u{1F480}`);

      const methodName = node.method;

      if (node._isPropertyAccess && node.args.length === 0) {
        const val = obj[methodName];
        if (val !== undefined) return val;
        return null;
      }

      const method = obj[methodName];

      if (typeof method === 'function') {
        const args = [];
        for (const arg of node.args) args.push(await this.evaluate(arg));
        const result = method.call(obj, ...args);
        if (result instanceof Promise) return await result;
        return result;
      }

      if (method !== undefined) return method;

      throw new Error(`Method '${methodName}' doesn't exist on '${node.object}'. Not valid bestie \u{1F480}`);
    }

    if (node instanceof PropertyAccess) {
      const obj = await this.evaluate(node.object);
      if (obj === null || obj === undefined) {
        throw new Error(`Can't access property '${node.property}' on ghosted. It's giving null \u{1F480}`);
      }
      const val = obj[node.property];
      return val !== undefined ? val : null;
    }

    if (node instanceof ArrayLiteral) {
      const elements = [];
      for (const el of node.elements) elements.push(await this.evaluate(el));
      return elements;
    }

    if (node instanceof IndexAccess) {
      const obj = await this.evaluate(node.object);
      const index = await this.evaluate(node.index);
      if (Array.isArray(obj)) return obj[index] ?? null;
      if (typeof obj === 'string') return obj[index] ?? null;
      throw new Error(`Can't index into ${typeof obj}. That's not a list or string bestie \u{1F480}`);
    }

    throw new Error(`Unknown node type. This is giving... error \u{1F480}`);
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
}

// ============================================================================
// WEB RUNTIME
// ============================================================================

const GenzPP = {
  /**
   * Run genz++ source code.
   * @param {string} source - genz++ source code
   * @param {object} [opts] - options
   * @param {HTMLElement} [opts.output] - output element for spill
   * @returns {Promise<Interpreter>} - the interpreter instance
   */
  run: async function(source, opts) {
    opts = opts || {};
    const outputEl = opts.output || document.getElementById('genz-output') || null;

    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter(outputEl);

    await interpreter.run(ast);
    return interpreter;
  },

  /**
   * Fetch a .genz file and run it.
   * @param {string} url - URL to fetch
   * @param {object} [opts] - options
   * @returns {Promise<Interpreter>}
   */
  runURL: async function(url, opts) {
    const res = await fetch(url);
    const source = await res.text();
    return GenzPP.run(source, opts);
  },

  /**
   * Auto-execute all <script type="text/genz"> tags on the page.
   */
  runScriptTags: async function() {
    const scripts = document.querySelectorAll('script[type="text/genz"]:not([id])');
    for (const script of scripts) {
      let source;
      if (script.src) {
        const res = await fetch(script.src);
        source = await res.text();
      } else {
        source = script.textContent;
      }
      try {
        await GenzPP.run(source);
      } catch (e) {
        console.error('genz++ error:', e.message);
      }
    }
  },

  // Expose internals for advanced use
  Lexer,
  Parser,
  Interpreter,
  stdlib,
};

// Export to global scope
globalThis.GenzPP = GenzPP;

// Auto-run script tags on DOMContentLoaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GenzPP.runScriptTags());
  } else {
    // DOM already loaded
    GenzPP.runScriptTags();
  }
}

})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
