import test from "node:test";
import assert from "node:assert/strict";
import {
  makePlan,
  initialProfile,
  dayKey,
  studentType,
  newStudent,
} from "../src/lib.js";
test("regular plan distributes the exact daily availability across subjects", () => {
  for (const hours of [0.5, 1, 1.5, 2, 3, 8]) {
    const plan = makePlan({ ...initialProfile, hours });
    assert.equal(
      plan.reduce((s, t) => s + t.minutes, 0),
      hours * 60,
    );
    assert(plan.every((t) => t.minutes > 0));
    assert.equal(new Set(plan.map((t) => t.id)).size, plan.length);
  }
});
test("fatigue and overwhelm reduce workload and prioritize favorite subject", () => {
  for (const mood of ["tired", "overwhelmed"]) {
    const regular = makePlan(initialProfile),
      gentle = makePlan(initialProfile, mood);
    assert.equal(gentle.length, 1);
    assert.equal(gentle[0].subject, initialProfile.favorite);
    assert(gentle[0].minutes <= 25);
    assert(gentle[0].minutes < regular.reduce((s, t) => s + t.minutes, 0));
  }
});
test("classification is a supportive routine label and new accounts start clean", () => {
  assert.equal(
    studentType({ ...initialProfile, hours: 0.5 }),
    "Pequenos passos",
  );
  assert.equal(
    studentType({ ...initialProfile, frequency: "Estou começando" }),
    "Explorando meu ritmo",
  );
  const a = newStudent(),
    b = newStudent();
  a.stats.sessions.push({});
  assert.equal(b.stats.sessions.length, 0);
  assert.equal(b.stats.xp, 0);
  assert.equal(b.profile, null);
});
test("calendar keys use local date without UTC day shifts", () => {
  assert.equal(dayKey(new Date(2027, 0, 2, 23, 59)), "2027-01-02");
});
