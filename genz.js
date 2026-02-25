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
  
  // Array
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',

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
      if (char === '\0') {
        throw new Error(`Unterminated string on line ${this.line}. You forgot the closing ✨ bestie`);
      }
      if (char === '\n') {
        this.line++;
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

class IndexAccess extends ASTNode {
  constructor(object, index) {
    super();
    this.object = object;
    this.index = index;
  }
}

class IndexAssignment extends ASTNode {
  constructor(object, index, value) {
    super();
    this.object = object;
    this.index = index;
    this.value = value;
  }
}

class ArrayLiteral extends ASTNode {
  constructor(elements) {
    super();
    this.elements = elements;
  }
}

class PropertyAccess extends ASTNode {
  constructor(object, property) {
    super();
    this.object = object;
    this.property = property;
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
      const { statements: body } = this.parseBlock();
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
      const { statements: body } = this.parseBlock();
      return new FunctionDeclaration(name, params, body);
    }

    // Return: its giving value
    if (this.match(TokenType.ITS_GIVING)) {
      const value = this.parseExpression();
      return new ReturnStatement(value);
    }

    // Assignment or expression statement
    if (this.check(TokenType.IDENTIFIER)) {
      const savedPos = this.pos;
      const name = this.advance().value;
      // Array index assignment: arr[i] = val
      if (this.check(TokenType.LBRACKET)) {
        this.advance(); // consume [
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, 'Expected ] bestie');
        if (this.match(TokenType.EQUALS)) {
          const value = this.parseExpression();
          return new IndexAssignment(new Identifier(name), index, value);
        }
        // Not an assignment, rewind and parse as expression
        this.pos = savedPos;
      } else if (this.match(TokenType.EQUALS)) {
        const value = this.parseExpression();
        return new Assignment(name, value);
      } else {
        // Put back and parse as expression
        this.pos = savedPos;
      }
    }

    // Expression statement (e.g., function call)
    const expr = this.parseExpression();
    return expr;
  }

  parseIfStatement() {
    const condition = this.parseExpression();
    this.expect(TokenType.THO, 'Expected tho after sus condition');
    const { statements: thenBranch, closedByBet } = this.parseBlock();

    const elseIfBranches = [];
    let elseBranch = null;

    // Only look for nah/nah sus if the block stopped at NAH (not BET)
    // If the block was closed by bet, the if statement is complete
    if (!closedByBet) {
      while (this.check(TokenType.NAH)) {
        const nahLine = this.peek().line;
        this.advance(); // consume nah

        if (this.check(TokenType.SUS) && this.peek().line === nahLine) {
          // else if (nah sus on same line)
          this.advance(); // consume sus
          const elseIfCondition = this.parseExpression();
          this.expect(TokenType.THO, 'Expected tho after nah sus condition');
          const { statements: elseIfBody, closedByBet: elseIfClosed } = this.parseBlock();
          elseIfBranches.push({ condition: elseIfCondition, body: elseIfBody });
          if (elseIfClosed) break; // bet closes the entire if chain
        } else {
          // else
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
      this.advance(); // consume bet
      closedByBet = true;
    }
    return { statements, closedByBet };
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
      // Array index access: arr[i]
      if (this.match(TokenType.LBRACKET)) {
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET, 'Expected ] bestie');
        expr = new IndexAccess(expr, index);
        continue;
      }
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
        // Property/Method access: obj.prop or obj.method(args)
        const method = this.expect(TokenType.IDENTIFIER, 'Expected method name after dot').value;
        let args = [];
        let isCall = false;
        if (this.match(TokenType.LPAREN)) {
          isCall = true;
          if (!this.check(TokenType.RPAREN)) {
            do {
              args.push(this.parseExpression());
            } while (this.match(TokenType.COMMA));
          }
          this.expect(TokenType.RPAREN, 'Expected ) after arguments');
        }

        if (expr instanceof Identifier) {
          // Module/variable method call or property access
          expr = new MethodCall(expr.name, method, args);
          expr._isPropertyAccess = !isCall;
        } else {
          // Chained property access on any expression (e.g., resp.body.name)
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

    // Array literal: [1, 2, 3]
    if (this.match(TokenType.LBRACKET)) {
      const elements = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
      }
      this.expect(TokenType.RBRACKET, 'Expected ] to close array bestie');
      return new ArrayLiteral(elements);
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
    wait: async (ms) => new Promise(resolve => setTimeout(resolve, ms)), // alias for nap
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
  // NET - http requests (sliding into DMs) 🌐
  // ─────────────────────────────────────────────────────────────────────────
  net: {
    // GET request - just grab the vibes
    get: async (url) => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        // try to parse as JSON, fall back to text
        try { return JSON.parse(text); }
        catch { return text; }
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // GET but always return raw text (no JSON parsing)
    get_text: async (url) => {
      try {
        const res = await fetch(url);
        return await res.text();
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // GET but always return parsed JSON
    get_json: async (url) => {
      try {
        const res = await fetch(url);
        return await res.json();
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // POST with JSON body - sending the vibes
    post: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); }
        catch { return text; }
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // POST with raw text body
    post_text: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: String(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); }
        catch { return text; }
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // PUT with JSON body - updating the vibes
    put: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); }
        catch { return text; }
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // DELETE - ghosting the resource
    ghost: async (url) => {
      try {
        const res = await fetch(url, { method: 'DELETE' });
        const text = await res.text();
        try { return JSON.parse(text); }
        catch { return text; }
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // PATCH - small tweaks
    patch: async (url, body) => {
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        try { return JSON.parse(text); }
        catch { return text; }
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // Full request with all the options - for when you need control
    fetch: async (url, method, headers, body) => {
      try {
        const opts = { method: method || 'GET' };
        if (headers) opts.headers = headers;
        if (body) {
          opts.body = typeof body === 'string' ? body : JSON.stringify(body);
        }
        const res = await fetch(url, opts);
        const text = await res.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = text; }
        return {
          status: res.status,
          ok: res.ok,
          body: parsed,
        };
      } catch (e) {
        return { error: true, message: e.message };
      }
    },

    // Just get the status code - vibe check the URL
    status: async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.status;
      } catch (e) {
        return 0;
      }
    },

    // Build a URL with query params
    url: (base, params) => {
      if (!params) return base;
      const qs = Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      return `${base}?${qs}`;
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OBJ - object/map utilities (the blueprint) 🏗️
  // ─────────────────────────────────────────────────────────────────────────
  obj: {
    new: () => ({}),                              // empty object
    from: (...pairs) => {                         // create from key-value pairs
      const o = {};                               // obj.from(k1, v1, k2, v2, ...)
      for (let i = 0; i < pairs.length - 1; i += 2) {
        o[pairs[i]] = pairs[i + 1];
      }
      return o;
    },
    set: (o, key, val) => { o[key] = val; return o; }, // set a key
    get: (o, key) => o[key] !== undefined ? o[key] : null, // get a key
    keys: (o) => Object.keys(o),                  // all keys
    values: (o) => Object.values(o),              // all values
    has: (o, key) => key in o,                    // check if key exists
    remove: (o, key) => { delete o[key]; return o; },
    merge: (a, b) => ({ ...a, ...b }),            // combine two objects
    clone: (o) => ({ ...o }),                     // shallow copy
    entries: (o) => Object.entries(o),            // [[key, val], ...]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ENV - environment variables (the backstage) 🎭
  // ─────────────────────────────────────────────────────────────────────────
  env: {
    get: (key) => process.env[key] || null,       // read env var
    has: (key) => key in process.env,             // check if env var exists
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DEBUG - debugging tools (what's the tea?) 🔍
  // ─────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────
  // DRIP - terminal colors & styles (the fit check for your text) 🎨
  // ─────────────────────────────────────────────────────────────────────────
  drip: {
    // ── colors (text) ──
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    blue: (s) => `\x1b[34m${s}\x1b[0m`,
    magenta: (s) => `\x1b[35m${s}\x1b[0m`,
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
    white: (s) => `\x1b[37m${s}\x1b[0m`,
    gray: (s) => `\x1b[90m${s}\x1b[0m`,
    orange: (s) => `\x1b[38;5;208m${s}\x1b[0m`,
    pink: (s) => `\x1b[38;5;205m${s}\x1b[0m`,
    purple: (s) => `\x1b[38;5;135m${s}\x1b[0m`,
    lime: (s) => `\x1b[38;5;118m${s}\x1b[0m`,
    teal: (s) => `\x1b[38;5;30m${s}\x1b[0m`,
    coral: (s) => `\x1b[38;5;209m${s}\x1b[0m`,
    gold: (s) => `\x1b[38;5;220m${s}\x1b[0m`,
    lavender: (s) => `\x1b[38;5;183m${s}\x1b[0m`,
    mint: (s) => `\x1b[38;5;121m${s}\x1b[0m`,
    rose: (s) => `\x1b[38;5;211m${s}\x1b[0m`,
    sky: (s) => `\x1b[38;5;117m${s}\x1b[0m`,
    peach: (s) => `\x1b[38;5;217m${s}\x1b[0m`,

    // ── background colors (bg_) ──
    bg_red: (s) => `\x1b[41m${s}\x1b[0m`,
    bg_green: (s) => `\x1b[42m${s}\x1b[0m`,
    bg_yellow: (s) => `\x1b[43m${s}\x1b[0m`,
    bg_blue: (s) => `\x1b[44m${s}\x1b[0m`,
    bg_magenta: (s) => `\x1b[45m${s}\x1b[0m`,
    bg_cyan: (s) => `\x1b[46m${s}\x1b[0m`,
    bg_white: (s) => `\x1b[47m${s}\x1b[0m`,

    // ── styles ──
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
    dim: (s) => `\x1b[2m${s}\x1b[0m`,
    italic: (s) => `\x1b[3m${s}\x1b[0m`,
    underline: (s) => `\x1b[4m${s}\x1b[0m`,
    strike: (s) => `\x1b[9m${s}\x1b[0m`,
    inverse: (s) => `\x1b[7m${s}\x1b[0m`,

    // ── 256-color & rgb ──
    color: (s, code) => `\x1b[38;5;${code}m${s}\x1b[0m`,         // 256-color (0-255)
    bg_color: (s, code) => `\x1b[48;5;${code}m${s}\x1b[0m`,      // 256-color bg
    rgb: (s, r, g, b) => `\x1b[38;2;${r};${g};${b}m${s}\x1b[0m`, // true color
    bg_rgb: (s, r, g, b) => `\x1b[48;2;${r};${g};${b}m${s}\x1b[0m`,

    // ── composable: returns raw codes for stacking ──
    raw: (code) => `\x1b[${code}m`,
    reset: () => '\x1b[0m',

    // ── utility ──
    strip: (s) => String(s).replace(/\x1b\[[0-9;]*m/g, ''),      // remove all ansi
    rainbow: (s) => {                                               // 🌈
      const colors = [31, 33, 32, 36, 34, 35];
      return String(s).split('').map((c, i) =>
        c === ' ' ? c : `\x1b[${colors[i % colors.length]}m${c}`
      ).join('') + '\x1b[0m';
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LOADING - spinner / progress vibes (we loading fr fr) ⏳
  // ─────────────────────────────────────────────────────────────────────────
  loading: (() => {
    let _interval = null;
    let _frame = 0;

    const spinners = {
      dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
      braille: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
      vibes: ['💀', '✨', '💅', '🔥', '👀', '💯', '🧠', '⚡'],
      moon: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
      clock: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'],
      bars: ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█', '▉', '▊', '▋', '▌', '▍', '▎'],
    };

    return {
      start: (msg, style) => {
        if (_interval) return;
        const frames = spinners[style] || spinners.dots;
        _frame = 0;
        _interval = setInterval(() => {
          const f = frames[_frame % frames.length];
          process.stdout.write(`\r\x1b[2K  ${f} ${msg || ''}`);
          _frame++;
        }, 100);
      },
      stop: (msg) => {
        if (_interval) {
          clearInterval(_interval);
          _interval = null;
        }
        process.stdout.write(`\r\x1b[2K`);
        if (msg) process.stdout.write(msg + '\n');
      },
      styles: () => Object.keys(spinners),
    };
  })(),

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
};

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

  // Walk the scope chain to find where a variable lives
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
      // If variable already exists in an outer scope, update it there
      // This makes `yeet i = i + 1` work inside loops
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
        throw new Error(`Variable '${node.name}' doesn't exist. You gotta yeet it first 💀`);
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
        throw new Error(`Can't set index on ${typeof obj}. That's not a list bestie 💀`);
      }
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
    const child = new Map();
    child._parent = previous;
    this.environment = child;
    
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
      const scope = this._findScope(node.name);
      if (scope) {
        return scope.get(node.name);
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
          if (Array.isArray(left) && Array.isArray(right)) {
            return [...left, ...right];
          }
          if (Array.isArray(left)) {
            return [...left, right];
          }
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
      const scope = this._findScope(node.name);
      const func = scope ? scope.get(node.name) : null;
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

      // Create new environment for function with scope chain
      const previous = this.environment;
      const funcEnv = new Map();
      funcEnv._parent = func.closure;
      this.environment = funcEnv;

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
      const scope = this._findScope(node.object);
      const obj = this.modules.get(node.object) || (scope ? scope.get(node.object) : null);
      if (!obj) {
        throw new Error(`'${node.object}' doesn't exist. It ghosted you 💀`);
      }

      const methodName = node.method;

      // Handle property access (e.g., obj.name, arr.length)
      if (node._isPropertyAccess && node.args.length === 0) {
        const val = obj[methodName];
        if (val !== undefined) return val;
        return null;
      }

      const method = obj[methodName];

      if (typeof method === 'function') {
        const args = [];
        for (const arg of node.args) {
          args.push(await this.evaluate(arg));
        }

        const result = method(...args);
        // Handle promises (for time.nap)
        if (result instanceof Promise) {
          return await result;
        }
        return result;
      }

      // Property access (non-function values like constants)
      if (method !== undefined) {
        return method;
      }

      throw new Error(`Method '${methodName}' doesn't exist on '${node.object}'. Not valid bestie 💀`);
    }

    if (node instanceof PropertyAccess) {
      const obj = await this.evaluate(node.object);
      if (obj === null || obj === undefined) {
        throw new Error(`Can't access property '${node.property}' on ghosted. It's giving null 💀`);
      }
      const val = obj[node.property];
      return val !== undefined ? val : null;
    }

    if (node instanceof ArrayLiteral) {
      const elements = [];
      for (const el of node.elements) {
        elements.push(await this.evaluate(el));
      }
      return elements;
    }

    if (node instanceof IndexAccess) {
      const obj = await this.evaluate(node.object);
      const index = await this.evaluate(node.index);
      if (Array.isArray(obj)) {
        return obj[index] ?? null;
      }
      if (typeof obj === 'string') {
        return obj[index] ?? null;
      }
      throw new Error(`Can't index into ${typeof obj}. That's not a list or string bestie 💀`);
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

async function runFile(filename) {
  if (!fs.existsSync(filename)) {
    console.error(`File '${filename}' not found. It ghosted you 💀`);
    process.exit(1);
  }

  const source = fs.readFileSync(filename, 'utf-8');

  try {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    await interpreter.run(ast);
  } catch (error) {
    console.error(`💀 ERROR: ${error.message}`);
    process.exit(1);
  }
}

async function repl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('genz++ v1.0 REPL 💅');
  console.log('type your code bestie. type "bet" on empty line to exit');
  console.log('');

  const interpreter = new Interpreter();
  let buffer = '';

  const prompt = () => {
    const prefix = buffer ? '...   ' : 'genz> ';
    rl.question(prefix, async (line) => {
      if (line === 'bet' && buffer === '') {
        console.log('gg no re 💀');
        rl.close();
        return;
      }

      buffer += line + '\n';

      // Try to parse - if it fails with unexpected EOF, accumulate more
      try {
        const lexer = new Lexer(buffer);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        await interpreter.run(ast);
        buffer = '';
      } catch (error) {
        // If it looks like an incomplete statement, keep buffering
        if (error.message.includes('EOF') || error.message.includes('Expected')) {
          // keep buffering
        } else {
          console.error(`💀 ${error.message}`);
          buffer = '';
        }
      }

      prompt();
    });
  };

  prompt();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Check if stdin is a pipe (non-interactive)
    if (!process.stdin.isTTY) {
      const source = fs.readFileSync('/dev/stdin', 'utf-8');
      try {
        const lexer = new Lexer(source);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();
        const interpreter = new Interpreter();
        await interpreter.run(ast);
      } catch (error) {
        console.error(`💀 ERROR: ${error.message}`);
        process.exit(1);
      }
    } else {
      await repl();
    }
    return;
  }

  if (args[0] === '--help' || args[0] === '-h') {
    console.log('genz++ interpreter v1.0');
    console.log('');
    console.log('Usage:');
    console.log('  node genz.js                  Start the REPL');
    console.log('  node genz.js <file.genz>      Run a file');
    console.log('  node genz.js <file.gz>        Run a file (.gz = genz, not gzip)');
    console.log('');
    console.log('No cap, this is the future of programming 💯');
    return;
  }

  await runFile(args[0]);
}

main();