{
  /**
   * @param {["" | "-", string]} head
   * @param {["" | "+" | "|", ["" | "-", string]][]} tail
   * @returns {import("../index.js").Query}
   */
  function createBooleanQuery(head, tail) {
    if (tail.length === 0) {
      return { bool: { must: [head[1]] } };
    }
    const bool = {};
    const defaultClause = options.defaultOperator === 'AND' ? 'must' : 'should';
    let clause = defaultClause;
    if (head[0] === '-') {
      clause = 'mustNot';
    } else if (tail[0][0] === '+') {
      clause = 'must';
    } else if (tail[0][0] === '|') {
      clause = 'should';
    }
    bool[clause] ||= [];
    bool[clause].push(head[1]);
    for (let i = 0; i < tail.length; i++) {
      let clause = defaultClause;
      if (tail[i][1][0] === '-') {
        clause = 'mustNot';
      } else if (tail[i][0] === '+') {
        clause = 'must';
      } else if (tail[i][0] === '|') {
        clause = 'should';
      }
      bool[clause] ||= [];
      bool[clause].push(tail[i][1][1]);
    }
    return { bool };
  }

  /**
   * @param {string} text
   * @param {number} slop
   * @returns {import("../index.js").Query}
   */
  function createMatchPhraseQuery(text, slop) {
    return {
      multiMatch: {
        query: text,
        type: 'phrase',
        fields: options.fields,
        slop: slop ?? 0,
      },
    };
  }

  /**
   * @param {string} text
   * @returns {import("../index.js").Query}
   */
  function createMatchQuery(text) {
    if (text[text.length - 1] === '*') {
      return {
        multiMatch: {
          query: text.replace(/\*+$/, ''),
          type: 'bool_prefix',
          fields: options.fields,
        },
      };
    }
    if (text.match(/~\d+$/)) {
      const fuzziness = parseInt(text.match(/~(\d+)$/)[1]);
      return {
        multiMatch: {
          query: text.replace(/~\d+$/, ''),
          fields: options.fields,
          fuzziness,
        },
      };
    }
    return {
      multiMatch: {
        query: text,
        fields: options.fields,
      },
    };
  }
}

start
  = _ @BoolExpression _

BoolExpression
  = head:NotExpression tail:(_ @[+|]? _ @NotExpression)* { return createBooleanQuery(head, tail); }

NotExpression
  = "-"? PrimaryExpression

PrimaryExpression
  = GroupExpression
  / PhraseExpression
  / TermExpression

GroupExpression
  = "(" _ @BoolExpression _ ")"

PhraseExpression
  = "\"" text:$QuotedChar+ "\"" slop:("~" @Integer)? { return createMatchPhraseQuery(text, slop); }

TermExpression
  = text:$UnquotedChar+ { return createMatchQuery(text); }

QuotedChar
  = [^"\\]
  / "\\" @.

UnquotedChar
  = [^+|"()\-: \t\n\r\\]
  / "\\" @.

Integer
  = n:$[0-9]+ { return parseInt(n, 10); }

_ "whitespace"
  = [ \t\n\r]*
