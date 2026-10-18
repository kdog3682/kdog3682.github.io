// prints the fingerprint of the worksheets Drive holds right now (see worksheetFingerprint).
// the deploy workflow compares it with the one the live site published at /worksheets/fingerprint.txt
import { worksheetFingerprint } from "../src/lib/drive"

console.log(await worksheetFingerprint())
