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

  locale: 'vi-VN',
  navSalary: 'Tính lương',
  salaryTitle: 'Tính lương Gross sang Net',
  effectiveFrom: 'Áp dụng quy định từ',
  grossLabel: 'Lương Gross (VNĐ/tháng)',
  regionLabel: 'Vùng',
  regionNames: ['Vùng I', 'Vùng II', 'Vùng III', 'Vùng IV'],
  dependentsLabel: 'Số người phụ thuộc',
  insuranceBaseLabel: 'Lương đóng bảo hiểm (VNĐ/tháng)',
  insuranceBaseHint: 'Để trống nếu bằng lương Gross',
  enterGross: 'Nhập lương Gross để xem kết quả.',
  employeeHeading: 'Người lao động',
  employerHeading: 'Công ty đóng',
  gross: 'Lương Gross',
  bhxh: 'Bảo hiểm xã hội',
  bhyt: 'Bảo hiểm y tế',
  bhtn: 'Bảo hiểm thất nghiệp',
  deduction: 'Giảm trừ gia cảnh',
  taxableIncome: 'Thu nhập tính thuế',
  tax: 'Thuế thu nhập cá nhân',
  net: 'Lương Net',
  employerCost: 'Tổng chi phí công ty',
}

// Typed from `vi`, so a missing or extra key is a compile error.
const en: typeof vi = {
  navHome: 'Home',
  switchLanguage: 'Choose language',
  homeTitle: 'Duy Pham homepage',
  homeIntro: 'Bookmark this to keep an eye on my project updates!',
  notFoundTitle: 'Page not found',
  backHome: 'Back to home',

  locale: 'en-US',
  navSalary: 'Salary calculator',
  salaryTitle: 'Gross to Net salary calculator',
  effectiveFrom: 'Rules effective from',
  grossLabel: 'Gross salary (VND/month)',
  regionLabel: 'Region',
  regionNames: ['Region I', 'Region II', 'Region III', 'Region IV'],
  dependentsLabel: 'Number of dependents',
  insuranceBaseLabel: 'Insurance salary (VND/month)',
  insuranceBaseHint: 'Leave empty if same as gross',
  enterGross: 'Enter a gross salary to see the result.',
  employeeHeading: 'Employee',
  employerHeading: 'Employer contributions',
  gross: 'Gross salary',
  bhxh: 'Social insurance',
  bhyt: 'Health insurance',
  bhtn: 'Unemployment insurance',
  deduction: 'Family deductions',
  taxableIncome: 'Taxable income',
  tax: 'Personal income tax',
  net: 'Net salary',
  employerCost: 'Total employer cost',
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
