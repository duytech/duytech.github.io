import { createContext, useContext } from 'react'

export type Lang = 'vi' | 'en'

export const DEFAULT_LANG: Lang = 'vi'

const vi = {
  navHome: 'Trang chủ',
  switchLanguage: 'Chọn ngôn ngữ',
  homeTitle: 'Trang chủ của Duy Pham',
  homeIntro: 'Lưu trang này để theo dõi các dự án mới của mình!',
  notFoundTitle: 'Không tìm thấy trang',
  backHome: 'Về trang chủ',
}

// Typed from `vi`, so a missing or extra key is a compile error.
const en: typeof vi = {
  navHome: 'Home',
  switchLanguage: 'Choose language',
  homeTitle: 'Duy Pham homepage',
  homeIntro: 'Bookmark this to keep an eye on my project updates!',
  notFoundTitle: 'Page not found',
  backHome: 'Back to home',
}

export type Dictionary = typeof vi

export const dictionaries: Record<Lang, Dictionary> = { vi, en }

export const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: DEFAULT_LANG,
  setLang: () => {},
})

export function useLang() {
  return useContext(LangContext)
}

export function useT(): Dictionary {
  return dictionaries[useLang().lang]
}
