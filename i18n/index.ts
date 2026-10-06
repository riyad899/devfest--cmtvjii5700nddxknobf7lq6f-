import type { Dictionary, Language } from "@/types";
import { en } from "./en";
import { bn } from "./bn";

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: Language[] = ["en", "bn"];

const dictionaries: Record<Language, Dictionary> = { en, bn };

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE];
}
