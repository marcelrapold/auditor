import { describe, it, expect } from "vitest";
import { REPORTS } from "./reports";
import {
  reportVerdict,
  reportReason,
  reportFinding,
  reportDedupProse,
  type Lang,
} from "./i18n";

const LANGS: Lang[] = ["en", "de"];

describe("reports i18n resolution", () => {
  for (const report of REPORTS) {
    describe(`report "${report.slug}"`, () => {
      for (const lang of LANGS) {
        it(`[${lang}] verdictKey resolves`, () => {
          // reportVerdict falls back to "" on a missing key, so a non-empty string proves it resolved.
          const verdict = reportVerdict(lang, report.verdictKey);
          expect(verdict, `verdictKey "${report.verdictKey}" missing in "${lang}"`).toBeTruthy();
        });

        it(`[${lang}] every notApplicable reasonKey resolves`, () => {
          for (const na of report.notApplicable) {
            const reason = reportReason(lang, na.reasonKey);
            expect(reason, `reasonKey "${na.reasonKey}" missing in "${lang}"`).toBeTruthy();
          }
        });

        it(`[${lang}] every finding key resolves to real prose`, () => {
          for (const f of report.findings) {
            // reportFinding falls back to { title: key } (no evidence) on a miss; a real entry
            // carries a title that isn't the bare key and concrete evidence.
            const prose = reportFinding(lang, f.key);
            expect(prose.title, `finding key "${f.key}" missing in "${lang}"`).toBeTruthy();
            expect(prose.title, `finding key "${f.key}" fell back to the bare key in "${lang}"`).not.toBe(f.key);
            expect(prose.evidence, `finding key "${f.key}" has no evidence in "${lang}"`).toBeTruthy();
          }
        });

        it(`[${lang}] dedup key resolves`, () => {
          // reportDedupProse falls back to { title: key, body: "" } on a miss; a real entry has a body.
          const dedup = reportDedupProse(lang, report.dedup.key);
          expect(dedup.title, `dedup key "${report.dedup.key}" missing in "${lang}"`).toBeTruthy();
          expect(dedup.body, `dedup key "${report.dedup.key}" has no body in "${lang}"`).toBeTruthy();
        });
      }

      it("dedup.issue is one of the findings' issues", () => {
        const findingIssues = report.findings.map((f) => f.issue);
        expect(findingIssues).toContain(report.dedup.issue);
      });
    });
  }
});
