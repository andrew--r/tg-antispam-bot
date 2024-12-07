import { assertEquals } from "@std/assert";
import { detectSpamKeywords, detectWordsWithMixedScripts } from "./index.ts";

Deno.test("hasSpamKeywords", () => {
  assertEquals(
    detectSpamKeywords(
      `5 минyт нaзaд Прeзидент cooбщил вaжнyю нoвocть для вceй PΦ`
    ),
    true
  );
  assertEquals(
    detectSpamKeywords(
      `Я пpeдлaгaю cтaть yчacтнuкoм пpoeктa c выcoкuм дoxoдoм, вce пoлнoстью лeгaльнo`
    ),
    true
  );
  assertEquals(detectSpamKeywords(`пpыбuльнocть cвышe 45O eвpo в дeнь`), true);
});

Deno.test("hasWordsWithMixedScripts", () => {
  assertEquals(
    detectWordsWithMixedScripts(
      `5 минyт нaзaд Прeзидент cooбщил вaжнyю нoвocть для вceй PΦ`
    ),
    true
  );
  assertEquals(
    detectWordsWithMixedScripts(
      `Я пpeдлaгaю cтaть yчacтнuкoм пpoeктa c выcoкuм дoxoдoм, вce пoлнoстью лeгaльнo`
    ),
    true
  );
  assertEquals(
    detectWordsWithMixedScripts(`пpыбuльнocть cвышe 45O eвpo в дeнь`),
    true
  );
});
