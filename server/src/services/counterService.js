import Counter from "../models/Counter.js";

export async function getNextSequence(key) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { key },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );
      return counter.seq;
    } catch (err) {
      // Very first use of a key: two requests can both try to create it at once.
      // One loses with a duplicate-key error (11000), and simply trying again works.
      if (err.code === 11000 && attempt < 3) continue;
      throw err;
    }
  }
}
