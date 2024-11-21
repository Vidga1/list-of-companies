import { Company } from '../types/company'

export function generateCompanyData(id: number): Company {
  const streets = ['Ленина', 'Пушкина', 'Гагарина', 'Мира', 'Советская']
  return {
    id,
    name: `Компания ${id}`,
    address: `ул. ${streets[id % streets.length]}, ${((id * 7) % 200) + 1}`,
  }
}
