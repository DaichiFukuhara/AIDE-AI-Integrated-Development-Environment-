#!/usr/bin/env node
'use strict';

/*
 * aide のテスト用モック観察者。stdin のプロンプトを読み、固定 JSON を返す。
 * test/ 配下に置くと node --test が収集して stdin 待ちでハングするため
 * fixtures/ に置いてある。
 *
 * 環境変数:
 *   MOCK_OBSERVER_VERDICT  pass(既定) | fail | bad(不正応答)
 *   MOCK_LOG               呼び出し記録(JSONL)の追記先
 */

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => { input += d; });
process.stdin.on('end', () => {
  const fs = require('node:fs');
  if (process.env.MOCK_LOG) {
    fs.appendFileSync(process.env.MOCK_LOG, JSON.stringify({
      role: 'observer', argv: process.argv.slice(2), stdinBytes: input.length,
    }) + '\n');
  }
  const verdict = process.env.MOCK_OBSERVER_VERDICT || 'pass';
  if (verdict === 'bad') {
    process.stdout.write('これはJSONではない応答');
    return;
  }
  const res = {
    verdict,
    conflicts: verdict === 'fail'
      ? [{ with: 'lanes/other.md', detail: '用語「セッション」の定義が衝突（モック）' }]
      : [],
    separability: { ok: verdict === 'pass', detail: 'モック判定' },
    report: '# 観察レポート（モック）\n\nverdict: ' + verdict,
  };
  process.stdout.write(JSON.stringify(res));
});
