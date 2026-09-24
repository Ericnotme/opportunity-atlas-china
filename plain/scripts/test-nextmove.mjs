import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundled = await build({ entryPoints: ['src/lib/nextmove/game.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const g = await import('data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const date = '2026-09-24';
const start = () => ({ date, answers: [], prediction: null });
// Exhaust all 16 possible games: the fourth choice must not change the sealed prediction.
for (let mask = 0; mask < 16; mask++) {
  let run = start();
  const choices = [0, 1, 2, 3].map(i => (mask >> i) & 1);
  for (const a of choices.slice(0, 3)) run = g.advance(run, a);
  const sealed = run.prediction;
  assert.equal(sealed, choices.slice(0, 3).filter(a => a === 1).length >= 2 ? 1 : 0);
  const snapshot = JSON.stringify(run);
  const result = g.advance(run, choices[3]);
  assert.equal(result.prediction, sealed);
  assert.equal(JSON.stringify(run), snapshot, 'advance mutates the previously sealed state');
  assert.deepEqual(g.parseJournal(JSON.stringify(g.saveRun({ runs: [] }, result))).runs[0], result);
  assert.throws(() => g.advance(result, 0));
  assert.equal(g.validRun({ ...result, prediction: 1 - sealed }), false);
}
assert.equal(g.validDate('2026-02-30'), false);
assert.deepEqual(g.parseJournal('{bad'), { runs: [] });
assert.deepEqual(g.parseJournal('{"runs":[null,{},42]}'), { runs: [] });
assert.equal(g.validRun({ ...start(), answers: ['0'] }), false);
assert.equal(g.validRun({ ...start(), prediction: 0 }), false);
assert.equal(g.validRun({ ...start(), tried: true }), false);
assert.throws(() => g.advance(start(), 2));
assert.throws(() => g.deck('bad'));
assert.throws(() => g.predict([0]));
let journal = { runs: [] };
const decks = new Set();
for (let i = 0; i < 100; i++) {
  const day = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
  const d = g.deck(day);
  assert.equal(new Set(d.questions.map(q => q.title[0])).size, 4);
  assert.deepEqual(d, g.deck(day));
  for (const q of d.questions) {
    assert.ok(q.title.every(t => t.length > 5));
    assert.ok(q.options.flat().every(t => t.length > 3));
  }
  if (i < 24) decks.add(JSON.stringify(d.questions));
  journal = g.saveRun(journal, { date: day, answers: [], prediction: null });
}
assert.equal(decks.size, 24, 'daily ordered question sets repeat too early');
assert.equal(journal.runs.length, 90);
const newest = journal.runs[0];
journal = g.saveRun(journal, g.advance(newest, 1));
assert.equal(journal.runs.length, 90);
assert.equal(journal.runs[0].answers.length, 1);
assert.equal(g.parseJournal(JSON.stringify({ runs: [newest, newest] })).runs.length, 1);
console.log('PASS next move: all 16 games, immutable sealed guesses, honest hit/miss outcomes, 24 daily sets, bilingual content, resume, corrupt storage and history limits');
