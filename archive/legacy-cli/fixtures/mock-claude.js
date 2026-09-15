#!/usr/bin/env node
'use strict';

/*
 * テスト用モック claude。
 * 標準入力からプロンプトを受け取り、環境変数に応じて JSON を標準出力へ返す。
 * MDTALK_CLAUDE_CMD="node <abs>/mock-claude.js" のように指定して使う。
 * 実 claude / ネットワークは不要。
 *
 * 注意: このヘルパは `test/` の外（fixtures/）に置く。`node --test` が
 * `test/**` の .js を自動的にテストとして拾い、stdin 待ちでハングするのを避けるため。
 *
 * 制御用環境変数:
 *   MDTALK_MOCK_SKELETON=1   8節スケルトンを {"skeleton":"..."} で返す
 *   MDTALK_MOCK_FIND=<text>  行番号付きスナップショットから <text> を含む行を探し、
 *                            その行に question 注釈を1件付ける insertion を組む
 *   MDTALK_MOCK_TYPE=<type>  FIND 時の type（既定 question）
 *   MDTALK_MOCK_TEXT=<text>  FIND 時の注釈本文（既定 'auto note'）
 *   MDTALK_MOCK_PROPOSAL_TOPIC=<topic> FIND 時に注釈ではなくレーン分割提案を返す
 *   MDTALK_MOCK_OUT=<json>   生の出力 JSON をそのまま返す（FIND より優先度低）
 *   MDTALK_MOCK_ENVELOPE=1   good 応答を claude の json エンベロープで包む
 *   MDTALK_MOCK_STRUCTURED=1 good 応答を structured_output エンベロープで包む
 *   MDTALK_MOCK_BAD=always   常に不正 JSON を返す
 *   MDTALK_MOCK_BADFIRST=1   RETRY-SCHEMA-STRICT を含まない初回のみ不正 JSON
 *   MDTALK_MOCK_EXIT_CODE=N  dialogue 呼び出しを stderr 付きの終了コード N で失敗させる
 *   MDTALK_MOCK_TIMEOUT=1    応答せずハングする
 *   MDTALK_MOCK_MINUTES=<text>   minutes 応答本文（既定 '議事メモ'）
 *   MDTALK_MOCK_SUMMARY=<text>   summary 応答本文（既定 '# まとめ'）
 *   MDTALK_MOCK_MINUTES_BAD=1    minutes 要求に不正 JSON を返す
 *   MDTALK_MOCK_SUMMARY_BAD=1    summary 要求に不正 JSON を返す
 *   MDTALK_MOCK_LOG=<file>       呼び出しごとに {role, model} を1行 JSON で追記
 *
 * 役割判定: プロンプト（stdin）中の応答スキーマ・マーカーで dialogue /
 * minutes / summary / skeleton を見分ける。
 */

const fs = require('fs');

function argModel() {
  const a = process.argv;
  const i = a.indexOf('--model');
  return i >= 0 && i + 1 < a.length ? a[i + 1] : null;
}

function argJsonSchema() {
  const a = process.argv;
  const i = a.indexOf('--json-schema');
  if (i < 0 || i + 1 >= a.length) return null;
  try { return JSON.parse(a[i + 1]); } catch (_) { return 'invalid'; }
}

function logCall(role) {
  const f = process.env.MDTALK_MOCK_LOG;
  if (!f) return;
  try {
    fs.appendFileSync(f, JSON.stringify({
      role,
      model: argModel(),
      jsonSchema: argJsonSchema(),
    }) + '\n');
  } catch (_) { /* ignore */ }
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => { data += d; });
    process.stdin.on('end', () => resolve(data));
  });
}

const SKELETON = [
  '# 目的 / 背景', '', 'ここに目的を書く。', '> ❓ **AI**: 主なユーザーは誰ですか？', '',
  '## 対象ファイル', '', '- ', '',
  '## インターフェース / シグネチャ', '', '',
  '## 振る舞い / データフロー', '', '',
  '## 受け入れ条件', '', '- [ ] ', '',
  '## エッジケース / エラー処理', '', '',
  '## テスト方針', '', '',
  '## スコープ外', '', '',
].join('\n');

function buildFind(stdin) {
  const target = process.env.MDTALK_MOCK_FIND;
  const type = process.env.MDTALK_MOCK_TYPE || 'question';
  const text = process.env.MDTALK_MOCK_TEXT || 'auto note';
  const lines = stdin.split(/\r\n|\n/);
  for (const line of lines) {
    const mm = line.match(/^(\d+):\s?(.*)$/);
    if (mm && mm[2].includes(target)) {
      const anchorLine = parseInt(mm[1], 10);
      const anchorText = mm[2].slice(0, 20);
      if (process.env.MDTALK_MOCK_PROPOSAL_TOPIC) {
        const topic = process.env.MDTALK_MOCK_PROPOSAL_TOPIC;
        return JSON.stringify({
          insertions: [],
          laneProposals: [{
            anchorLine,
            anchorText,
            topic,
            title: process.env.MDTALK_MOCK_PROPOSAL_TITLE || topic,
            reason: process.env.MDTALK_MOCK_PROPOSAL_REASON || '独立した設計判断が必要なため',
            goal: process.env.MDTALK_MOCK_PROPOSAL_GOAL || '方針を決める',
            scope: process.env.MDTALK_MOCK_PROPOSAL_SCOPE || '対象範囲',
            dependencies: [],
          }],
        });
      }
      return JSON.stringify({ insertions: [{ anchorLine, anchorText, type, text }] });
    }
  }
  return JSON.stringify({ insertions: [] });
}

async function main() {
  const stdin = await readStdin();

  if (process.env.MDTALK_MOCK_TIMEOUT === '1') {
    setTimeout(() => {}, 1e9);
    return;
  }
  if (process.env.MDTALK_MOCK_SKELETON === '1') {
    logCall('skeleton');
    process.stdout.write(JSON.stringify({ skeleton: SKELETON }));
    return;
  }

  // minutes / summary はスキーマ・マーカーで判別（dialogue より先に処理）。
  if (stdin.includes('{"minutes"')) {
    logCall('minutes');
    if (process.env.MDTALK_MOCK_MINUTES_BAD === '1') {
      process.stdout.write('これはJSONではありません。');
      return;
    }
    const text = process.env.MDTALK_MOCK_MINUTES || '議事メモ';
    process.stdout.write(JSON.stringify({ minutes: text }));
    return;
  }
  if (stdin.includes('{"summary"')) {
    logCall('summary');
    if (process.env.MDTALK_MOCK_SUMMARY_BAD === '1') {
      process.stdout.write('これはJSONではありません。');
      return;
    }
    const text = process.env.MDTALK_MOCK_SUMMARY || '# まとめ';
    process.stdout.write(JSON.stringify({ summary: text }));
    return;
  }

  logCall('dialogue');
  if (process.env.MDTALK_MOCK_EXIT_CODE) {
    process.stderr.write(process.env.MDTALK_MOCK_STDERR || 'mock claude failure');
    process.exitCode = Number(process.env.MDTALK_MOCK_EXIT_CODE);
    return;
  }
  let good;
  if (process.env.MDTALK_MOCK_FIND) good = buildFind(stdin);
  else if (process.env.MDTALK_MOCK_OUT) good = process.env.MDTALK_MOCK_OUT;
  else good = '{"insertions":[]}';

  if (process.env.MDTALK_MOCK_ENVELOPE === '1') {
    good = JSON.stringify({ type: 'result', result: good });
  }
  if (process.env.MDTALK_MOCK_STRUCTURED === '1') {
    good = JSON.stringify({ type: 'result', structured_output: JSON.parse(good) });
  }

  const wantBad =
    process.env.MDTALK_MOCK_BAD === 'always' ||
    (process.env.MDTALK_MOCK_BADFIRST === '1' && !stdin.includes('RETRY-SCHEMA-STRICT'));

  process.stdout.write(wantBad ? 'これはJSONではありません。' : good);
}

main();
