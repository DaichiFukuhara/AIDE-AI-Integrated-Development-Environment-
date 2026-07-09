#!/usr/bin/env node
'use strict';

/*
 * aide のテスト用モックマスターAI。stdin のプロンプトからプールエントリの
 * id（`id: xxxxxxxx` 行）を拾い、統合結果 JSON を返す。
 * fixtures/ に置く理由は mock-observer.js のコメント参照。
 *
 * 環境変数:
 *   MOCK_MASTER_MODE  consume-all(既定) | bounce-first | bad(不正応答)
 *   MOCK_LOG          呼び出し記録(JSONL)の追記先
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { input += d; });
process.stdin.on('end', () => {
  const fs = require('node:fs');
  if (process.env.MOCK_LOG) {
    fs.appendFileSync(process.env.MOCK_LOG, JSON.stringify({
      role: 'master', argv: process.argv.slice(2), stdinBytes: input.length,
    }) + '\n');
  }
  const mode = process.env.MOCK_MASTER_MODE || 'consume-all';
  if (mode === 'bad') {
    process.stdout.write('マスターAIの気まぐれな散文');
    return;
  }
  const ids = [...input.matchAll(/^id: ([0-9a-f]{8})$/gm)].map((m) => m[1]);
  let consumed = ids;
  let bounced = [];
  if (mode === 'bounce-first' && ids.length > 0) {
    bounced = [{ id: ids[0], reason: 'エントリ間の矛盾（モック）' }];
    consumed = ids.slice(1);
  }
  const res = {
    master: '# マスター設計書（統合済み）\n\n## 機能・コンポーネント（アクセプト済み）\n\n統合済みid: '
      + (consumed.join(', ') || 'なし') + '\n\n## 変更履歴\n\n- モック統合\n',
    consumed,
    bounced,
  };
  process.stdout.write(JSON.stringify(res));
});
