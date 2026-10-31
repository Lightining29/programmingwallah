/**
 * Schema-Aware SQL Autocomplete & Language Intelligence Provider for Monaco Editor
 * Matches Image 2 (PopSQL autocomplete) and Image 1 (MySQL Workbench):
 * - Suggests real tables after FROM, JOIN, UPDATE, INTO
 * - Suggests table columns after table. or alias. (e.g. select users.| from users where user.i)
 * - Suggests valid MySQL data types in CREATE TABLE contexts
 * - Standard SQL keywords, snippets, and MySQL functions
 */

export const MYSQL_DATA_TYPES = [
  { name: 'INT', doc: 'Standard 4-byte integer (-2,147,483,648 to 2,147,483,647)' },
  { name: 'BIGINT', doc: '8-byte large integer for IDs and counters' },
  { name: 'SMALLINT', doc: '2-byte integer (-32,768 to 32,767)' },
  { name: 'TINYINT', doc: '1-byte integer (-128 to 127) or boolean (TINYINT(1))' },
  { name: 'VARCHAR(255)', doc: 'Variable-length string with specified maximum length' },
  { name: 'VARCHAR(100)', doc: 'Variable-length string (100 characters)' },
  { name: 'VARCHAR(50)', doc: 'Short variable-length string' },
  { name: 'TEXT', doc: 'Variable-length text string up to 64 KB' },
  { name: 'MEDIUMTEXT', doc: 'Text string up to 16 MB' },
  { name: 'LONGTEXT', doc: 'Large text string up to 4 GB' },
  { name: 'DATE', doc: 'Date in YYYY-MM-DD format' },
  { name: 'DATETIME', doc: 'Date and time in YYYY-MM-DD HH:MM:SS format' },
  { name: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP', doc: 'Timestamp with automatic creation timestamp' },
  { name: 'DECIMAL(10,2)', doc: 'Exact fixed-point decimal for currency and finances' },
  { name: 'FLOAT', doc: 'Single-precision floating-point number' },
  { name: 'DOUBLE', doc: 'Double-precision floating-point number' },
  { name: 'BOOLEAN', doc: 'Synonym for TINYINT(1)' },
  { name: 'JSON', doc: 'Native binary JSON format with automatic validation' },
  { name: 'BLOB', doc: 'Binary Large Object up to 64 KB' }
];

export const MYSQL_FUNCTIONS = [
  { name: 'COUNT(*)', insert: 'COUNT(*)', doc: 'Returns the number of rows matching query criteria' },
  { name: 'SUM(expr)', insert: 'SUM(${1:column})', doc: 'Calculates total sum of values in column' },
  { name: 'AVG(expr)', insert: 'AVG(${1:column})', doc: 'Calculates arithmetic average of values' },
  { name: 'MAX(expr)', insert: 'MAX(${1:column})', doc: 'Returns highest value' },
  { name: 'MIN(expr)', insert: 'MIN(${1:column})', doc: 'Returns lowest value' },
  { name: 'NOW()', insert: 'NOW()', doc: 'Returns current date and time' },
  { name: 'CONCAT(...)', insert: 'CONCAT(${1:col1}, ${2:col2})', doc: 'Concatenates two or more strings' },
  { name: 'COALESCE(...)', insert: 'COALESCE(${1:val1}, ${2:val2})', doc: 'Returns first non-null argument' },
  { name: 'IFNULL(expr1, expr2)', insert: 'IFNULL(${1:col}, ${2:default})', doc: 'Returns expr2 if expr1 is null' },
  { name: 'DATE_FORMAT(date, format)', insert: "DATE_FORMAT(${1:date}, '%Y-%m-%d')", doc: 'Formats date according to specifier' },
  { name: 'ROUND(x, d)', insert: 'ROUND(${1:val}, ${2:2})', doc: 'Rounds number to specified decimal places' }
];

export const MYSQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'ON',
  'GROUP BY', 'HAVING', 'ORDER BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'DISTINCT', 'AS', 'AND', 'OR', 'NOT', 'IN', 'NOT IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'CREATE DATABASE', 'DROP DATABASE', 'USE', 'SHOW DATABASES', 'SHOW TABLES', 'DESCRIBE', 'EXPLAIN',
  'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'ADD COLUMN', 'DROP COLUMN', 'RENAME TABLE',
  'PRIMARY KEY', 'AUTO_INCREMENT', 'FOREIGN KEY', 'REFERENCES', 'UNIQUE', 'NOT NULL', 'DEFAULT',
  'START TRANSACTION', 'COMMIT', 'ROLLBACK'
];

/**
 * Register Monaco completion provider for SQL with dynamic schema inspection
 */
export function registerSqlLanguageProvider(monaco, getSchemaTreeFn, getActiveDbFn) {
  if (!monaco || monaco._sqlProviderRegistered) return;
  monaco._sqlProviderRegistered = true;

  monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: ['.', ' ', '(', ',', '`'],

    provideCompletionItems: (model, position) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const textUntilPosition = lineContent.substring(0, position.column - 1);
      const wordInfo = model.getWordUntilPosition(position);

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordInfo.startColumn,
        endColumn: wordInfo.endColumn
      };

      const fullCode = model.getValue();
      const currentSchema = getSchemaTreeFn ? getSchemaTreeFn() : { tables: [] };
      const activeDb = getActiveDbFn ? getActiveDbFn() : 'main';
      const tables = currentSchema?.tables || [];

      const suggestions = [];

      // ── Context 1: Dot access (e.g. users.id or u.email matching Image 2) ──
      const dotMatch = textUntilPosition.match(/([a-zA-Z0-9_$]+)\.\s*$/);
      if (dotMatch) {
        const qualifier = dotMatch[1].toLowerCase();
        
        // Find matching table or alias in query
        let matchedTable = tables.find(t => t.name.toLowerCase() === qualifier);

        // Check if alias in query (e.g. FROM users u or FROM users AS u)
        if (!matchedTable) {
          const aliasRegex = new RegExp(`(?:FROM|JOIN)\\s+[\`"]?([a-zA-Z0-9_$]+)[\`"]?\\s+(?:AS\\s+)?${qualifier}\\b`, 'i');
          const aliasMatch = fullCode.match(aliasRegex);
          if (aliasMatch) {
            const realTableName = aliasMatch[1];
            matchedTable = tables.find(t => t.name.toLowerCase() === realTableName.toLowerCase());
          }
        }

        // If no explicit table matched, fallback to the first table in query or active table
        if (!matchedTable && tables.length > 0) {
          matchedTable = tables[0];
        }

        if (matchedTable && Array.isArray(matchedTable.columns)) {
          for (const col of matchedTable.columns) {
            suggestions.push({
              label: col.name,
              kind: monaco.languages.CompletionItemKind.Field,
              detail: `${col.type} (${matchedTable.name})`,
              documentation: `Column \`${col.name}\` in table \`${matchedTable.name}\`\n- Type: ${col.type}\n- Nullable: ${col.nullable ? 'YES' : 'NO'}${col.key ? `\n- Key: ${col.key}` : ''}`,
              insertText: col.name,
              range
            });
          }
        }

        return { suggestions };
      }

      // ── Context 2: Table Suggestions (after FROM, JOIN, UPDATE, INTO, TABLE) ──
      const tableKeywordMatch = textUntilPosition.match(/\b(FROM|JOIN|INTO|UPDATE|TABLE)\s+([a-zA-Z0-9_$]*)$/i);
      if (tableKeywordMatch) {
        for (const tbl of tables) {
          suggestions.push({
            label: tbl.name,
            kind: monaco.languages.CompletionItemKind.Class,
            detail: `Table (${tbl.rowCount || 0} rows)`,
            documentation: `MySQL Table: \`${activeDb}\`.\`${tbl.name}\`\nColumns: ${tbl.columns?.map(c => c.name).join(', ') || 'N/A'}`,
            insertText: tbl.name,
            range
          });
        }
        return { suggestions };
      }

      // ── Context 3: Data Type Suggestions (inside CREATE TABLE) ──
      if (fullCode.toUpperCase().includes('CREATE TABLE') && !textUntilPosition.toUpperCase().includes('SELECT')) {
        for (const dt of MYSQL_DATA_TYPES) {
          suggestions.push({
            label: dt.name,
            kind: monaco.languages.CompletionItemKind.TypeParameter,
            detail: 'MySQL Data Type',
            documentation: dt.doc,
            insertText: dt.name,
            range
          });
        }
      }

      // ── Context 4: Column suggestions for SELECT, WHERE, ORDER BY, GROUP BY ──
      for (const tbl of tables) {
        if (Array.isArray(tbl.columns)) {
          for (const col of tbl.columns) {
            suggestions.push({
              label: col.name,
              kind: monaco.languages.CompletionItemKind.Field,
              detail: `${col.type} - ${tbl.name}`,
              documentation: `Column in \`${tbl.name}\``,
              insertText: col.name,
              range
            });
          }
        }
      }

      // ── Context 5: Tables list ──
      for (const tbl of tables) {
        suggestions.push({
          label: tbl.name,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: `Table (${tbl.columns?.length || 0} cols)`,
          insertText: tbl.name,
          range
        });
      }

      // ── Context 6: MySQL Functions ──
      for (const fn of MYSQL_FUNCTIONS) {
        suggestions.push({
          label: fn.name,
          kind: monaco.languages.CompletionItemKind.Function,
          detail: 'MySQL Function',
          documentation: fn.doc,
          insertText: fn.insert,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range
        });
      }

      // ── Context 7: SQL Keywords ──
      for (const kw of MYSQL_KEYWORDS) {
        suggestions.push({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range
        });
      }

      return { suggestions };
    }
  });
}
