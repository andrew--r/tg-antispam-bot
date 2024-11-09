import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getTextSuspicionScore } from "./rules.ts";

Deno.test("should mark multiparagraph text as suspicious", () => {
  const text = `
    Caмaя пpибыльнaя идeя для Бизнeca в 2024 гοду - зapaбοтοκ нa Теlеgrаm.
  
    Большинство людeй бeздумнο тpaтят вpeмя и энepгию зaлипaя в Теlеgrаm, a лишь 1% в нeм зapaбaтывaют xοpοшиe дeньги.
    
    Κaнaлοв cтaнοвитcя οгpοмнοe κοличecтвο, a cпeциaлиcтοв, κοтοpыe мοгут зaнимaтьcя пpοдвижeниeм, пpοдaжeй peκлaмы, cοздaниeм κοнтeнтa и пpοчими зaдaчaми οчeнь мaлο...
    
    Κοнκуpeнция cκοpο выpacтeт и чтοбы нaчaть зapaбaтывaть нa Теlеgrаm быcтpee дpугиx — читaйтe κaнaл Cэмa Биκбaeвa, οн нa пaльцax οбъяcняeт и пοκaзывaeт, κaκ c пοмοщью ТG в пepвый мecяц выйти нa дοxοд οт 150.000₽ вοοбщe бeз влοжeний.
    
    Зa пοдпиcκу нa κaнaл, Cэм дapит пοшaгοвый ΓΑЙД пο cтapту и paзвитию cвοeгο бизнeca в Τelegram. 
    
    Ποдпиcывaйтecь нa κaнaл Cэмa зaбиpaй гaйд в зaκpeпe κaнaлa
    
    Пoдпиcaтьcя
      `;

  assertEquals(getTextSuspicionScore(text), 5);
});

Deno.test("should detect character spoofing", () => {
  assertEquals(
    getTextSuspicionScore(
      `5 минyт нaзaд Прeзидент cooбщил вaжнyю нoвocть для вceй PΦ`,
    ),
    1,
  );
  assertEquals(
    getTextSuspicionScore(
      `Я пpeдлaгaю cтaть yчacтнuкoм пpoeктa c выcoкuм дoxoдoм, вce пoлнoстью лeгaльнo`,
    ),
    1,
  );
  assertEquals(getTextSuspicionScore(`пpыбuльнocть cвышe 45O eвpo в дeнь`), 1);
});

Deno.test("2024-11-05", () => {
  const text = `Настало время зарабатывать! Пиши https://t.me/hawk_hawk_bot`;
  assertEquals(getTextSuspicionScore(text), 1);
});
