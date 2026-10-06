import type { Dictionary } from "@/types";

export const bn: Dictionary = {
  app: {
    title: "টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার",
    subtitle: "সম্পূর্ণ ও ক্রমানুসারে সাজানো দরপত্র জমার প্যাকেজ তৈরি করুন",
  },
  language: {
    label: "ভাষা",
    en: "EN",
    bn: "বাং",
  },
  tender: {
    sectionLabel: "সক্রিয় দরপত্র",
    tenderId: "দরপত্র আইডি",
    procuringEntity: "ক্রয়কারী প্রতিষ্ঠান",
    bidder: "দরদাতা",
    deadline: "জমার শেষ তারিখ",
  },
  stats: {
    total: "প্রয়োজনীয় নথি",
    mandatory: "বাধ্যতামূলক",
    optional: "ঐচ্ছিক",
    withExpiry: "মেয়াদ যাচাইযোগ্য",
  },
  steps: {
    upload: { title: "আপলোড", description: "আপনার PDF নথি যোগ করুন" },
    match: { title: "মিলান", description: "ফাইলগুলো চাহিদার সাথে মেলান" },
    review: { title: "পর্যালোচনা", description: "ঘাটতি ও মেয়াদ যাচাই করুন" },
    generate: { title: "তৈরি", description: "চূড়ান্ত প্যাকেজ তৈরি করুন" },
  },
  requirements: {
    title: "প্রয়োজনীয় নথির তালিকা",
    subtitle: "দরপত্রে নির্ধারিত ক্রম অনুযায়ী নথিসমূহ",
    mandatory: "বাধ্যতামূলক",
    optional: "ঐচ্ছিক",
    hasExpiry: "মেয়াদ আছে",
    awaiting: "নথির অপেক্ষায়",
  },
  upload: {
    title: "নথি আপলোড",
    description: "এই দরপত্রের জন্য স্ক্যান করা বা ডিজিটাল PDF নথি আপলোড করুন।",
    dropzone: "PDF ফাইল এখানে টেনে আনুন",
    comingSoon: "পরবর্তী ধাপে আসছে",
  },
  package: {
    title: "প্যাকেজের অবস্থা",
    mandatoryReady: "বাধ্যতামূলক নথি প্রস্তুত",
    generate: "প্যাকেজ তৈরি করুন",
    hint: "সব বাধ্যতামূলক নথি মিলে গেলে সক্রিয় হবে।",
  },
  footer: {
    note: "সমস্ত প্রক্রিয়াকরণ আপনার ব্রাউজারেই সম্পন্ন হয়।",
  },
};
