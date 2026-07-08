// The most devastating lines, drawn VERBATIM from Bharti Shori's three poems in
// poems.ts. Nothing here is invented: `deva` is her exact text; `gloss` is a
// faithful English translation of her meaning (the journal is bilingual by design).
// Line breaks are typographic only and never alter her words or punctuation.

export type Verse = {
  deva: string;
  gloss: string;
  poemId: string;
  poemTitle: string;
};

export const VERSES: Verse[] = [
  {
    deva: "जहाँ शब्द थम जाते हैं,\nवहाँ सैलाब दफ़्न हो जाते हैं।",
    gloss: "Where the words stop, the floods are buried alive.",
    poemId: "poem-02",
    poemTitle: "दफ़्न सैलाब",
  },
  {
    deva: "जो चाहते हुए भी नहीं छलकता,\nपर छलकना चाहता है।",
    gloss: "What will not spill, though it longs to spill.",
    poemId: "poem-03",
    poemTitle: "अनकहा दर्द",
  },
  {
    deva: "भीतर ही भीतर दबे हुए सैलाब में\nघुट-घुटकर मरती रहती है।",
    gloss: "In the flood buried deep within, she goes on dying, breath by breath.",
    poemId: "poem-02",
    poemTitle: "दफ़्न सैलाब",
  },
  {
    deva: "इतिहास ने इसे देखा तो अवश्य,\nपर पूरी तरह समझा शायद कभी नहीं।",
    gloss: "History surely saw it, yet perhaps never fully understood.",
    poemId: "poem-01",
    poemTitle: "मौन वेदना",
  },
  {
    deva: "और पीछे छोड़ जाना\nअपने अनकहे अनुभवों का\nअथाह, बहुत-सा समंदर।",
    gloss: "And to leave behind a vast, unfathomable sea of all that was never said.",
    poemId: "poem-03",
    poemTitle: "अनकहा दर्द",
  },
];
