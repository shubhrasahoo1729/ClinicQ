import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Counter from "../models/Counter.js";
import { getNextSequence } from "../services/counterService.js";

const N = 50;

// The WRONG way: read the number, add one, write it back (three separate steps)
async function naiveNext(key) {
  const counter = await Counter.findOne({ key });
  const next = counter.seq + 1;
  await Counter.updateOne({ key }, { $set: { seq: next } });
  return next;
}

function report(label, numbers) {
  const unique = new Set(numbers).size;
  console.log(`${label}: ${unique} unique numbers out of ${numbers.length}`);
  return unique;
}

async function run() {
  await connectDB();
  await Counter.init(); // make sure the unique index exists before we start

  const naiveKey = `test-naive-${Date.now()}`;
  const atomicKey = `test-atomic-${Date.now()}`;

  await Counter.create({ key: naiveKey, seq: 0 });
  const naive = await Promise.all(
    Array.from({ length: N }, () => naiveNext(naiveKey)),
  );
  report("Naive read-then-write", naive);

  const atomic = await Promise.all(
    Array.from({ length: N }, () => getNextSequence(atomicKey)),
  );
  const unique = report("Atomic $inc          ", atomic);

  const sorted = [...atomic].sort((a, b) => a - b);
  const consecutive = sorted.every((n, i) => n === i + 1);
  console.log(
    unique === N && consecutive
      ? `PASS: numbers 1 to ${N}, no duplicates, no gaps`
      : "FAIL: something is wrong",
  );

  // Clean up the test counters
  await Counter.deleteMany({ key: { $in: [naiveKey, atomicKey] } });
  await mongoose.disconnect();
}

run();
