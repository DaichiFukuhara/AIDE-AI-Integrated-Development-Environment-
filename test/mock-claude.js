#!/usr/bin/env node
'use strict';

/*
 * テスト用モック claude。
 * 標準入力からプロンプトを受け取り、環境変数に応じて JSON を標準出力へ返す。
 * MDTALK_CLAUDE_CMD="node <abs>/mock-claude.js" のように指定して使う。
 * 実 claude / ネットワークは不要。
 *
 * 制御用環境変数:
 *   MDTALK_MOCK_SKELETON=1   8節スケルトンを {"skeleton":"..."} で返す
 *   MDTALK_MOCK_FIND=<text>  行番号付きスナップショットから <text> を含む行を探し、
 *                            その行に question 注釈を1件付ける insertion を組む
 *   MDTALK_MOCK_TYPE=<type>  FIND 時の type（既定 question）
 *   MDTALK_MOCK_TEXT=<text>  FIND 時の注釈本文（既定 'auto note'）
 *   MDTALK_MOCK_OUT=<json>   生の出力 JSON をそのまま返す（FIND より優先度低）
 *   MDTALK_MOCK_ENVELOPE=1   good 応答を claude の json エンベロープで包む
 *   MDTALK_MOCK_BAD=always   常に不正 JSON を返す
 *   MDTALK_MOCK_BADFIRST=1   RETRY-SCHEMA-STRICT を含まない初回のみ不正 JSON
 *   MDTALK_MOCK_TIMEOUT=1    応答せずハングする
 */

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
    process.stdout.write(JSON.stringify({ skeleton: SKELETON }));
    return;
  }

  let good;
  if (process.env.MDTALK_MOCK_FIND) good = buildFind(stdin);
  else if (process.env.MDTALK_MOCK_OUT) good = process.env.MDTALK_MOCK_OUT;
  else good = '{"insertions":[]}';

  if (process.env.MDTALK_MOCK_ENVELOPE === '1') {
    good = JSON.stringify({ type: 'result', result: good });
  }

  const wantBad =
    process.env.MDTALK_MOCK_BAD === 'always' ||
    (process.env.MDTALK_MOCK_BADFIRST === '1' && !stdin.includes('RETRY-SCHEMA-STRICT'));

  process.stdout.write(wantBad ? 'これはJSONではありません。' : good);
}

main();
