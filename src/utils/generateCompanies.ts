import { Company } from '../store/companySlice'

export function generateCompanies(count: number): Company[] {
  const companies: Company[] = []
  for (let i = 1; i <= count; i++) {
    companies.push({
      id: i,
      name: `Компания ${i}`,
      address: `Адрес ${i}`,
      isSelected: false,
    })
  }
  return companies
}
