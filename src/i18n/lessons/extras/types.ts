/** The end-of-lesson summary every lesson carries (see components/Learn.tsx → Recap). */
export interface RecapText {
  /** the rule in one sentence, as you would say it to someone */
  oneLine: string;
  /** things people mix up, each with the way to tell them apart */
  confusions: string[];
  /** the gesture at the keyboard that demonstrates the rule */
  show: string;
}
