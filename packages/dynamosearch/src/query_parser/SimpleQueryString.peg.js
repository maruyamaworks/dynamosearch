{
  function createBooleanQuery(head, tail) {
    if (tail.length === 0) {
      return { bool: { must: [head[1]] } };
    }
    const query = { bool: {} };
    const defaultClause = options.defaultOperator === 'AND' ? 'must' : 'should';
    if (head[0] === '-') {
      query.bool.mustNot ||= [];
      query.bool.mustNot.push(head[1]);
    } else if (tail[0][0] === '+') {
      query.bool.must ||= [];
      query.bool.must.push(head[1]);
    } else {
      query.bool[defaultClause] ||= [];
      query.bool[defaultClause].push(head[1]);
    }
    for (let i = 0; i < tail.length; i++) {
      if (tail[i][1][0] === '-') {
        query.bool.mustNot ||= [];
        query.bool.mustNot.push(tail[i][1][1]);
      } else if (tail[i][0] === '+') {
        query.bool.must ||= [];
        query.bool.must.push(tail[i][1][1]);
      } else {
        query.bool[defaultClause] ||= [];
        query.bool[defaultClause].push(tail[i][1][1]);
      }
    }
    return query;
  }

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
