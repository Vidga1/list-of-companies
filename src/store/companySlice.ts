import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Company {
  id: number
  name: string
  address: string
}

interface UpdateCompanyPayload {
  id: number
  field: keyof Company
  value: string
}

interface CompanyState {
  companies: Company[]
  selected: Set<number>
  allSelected: boolean
}

const initialState: CompanyState = {
  companies: [],
  selected: new Set(),
  allSelected: false,
}

function generateCompanyData(count: number): Company[] {
  const streets = ['Ленина', 'Пушкина', 'Гагарина', 'Мира', 'Советская']
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Компания ${index + 1}`,
    address: `ул. ${streets[index % streets.length]}, ${
      Math.floor(Math.random() * 200) + 1
    }`,
  }))
}

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    addCompanies: (state, action: PayloadAction<number>) => {
      state.companies = generateCompanyData(action.payload)
      state.selected.clear()
      state.allSelected = false
    },
    toggleSelect: (state, action: PayloadAction<number>) => {
      if (state.allSelected) {
        state.allSelected = false
        state.selected.clear()
        state.companies.forEach((company) => {
          if (company.id !== action.payload) {
            state.selected.add(company.id)
          }
        })
      } else if (state.selected.has(action.payload)) {
        state.selected.delete(action.payload)
      } else {
        state.selected.add(action.payload)
      }
    },
    toggleSelectAll: (state) => {
      state.allSelected = !state.allSelected
      if (state.allSelected) {
        state.selected = new Set(state.companies.map((company) => company.id))
      } else {
        state.selected.clear()
      }
    },
    deleteSelected: (state) => {
      if (state.allSelected) {
        state.companies = []
      } else {
        state.companies = state.companies.filter(
          (company) => !state.selected.has(company.id)
        )
      }
      state.selected.clear()
      state.allSelected = false
    },
    updateCompany: (state, action: PayloadAction<UpdateCompanyPayload>) => {
      const { id, field, value } = action.payload
      const companyIndex = state.companies.findIndex(
        (company) => company.id === id
      )
      if (companyIndex !== -1) {
        state.companies[companyIndex] = {
          ...state.companies[companyIndex],
          [field]: value,
        }
      }
    },
  },
})

export const {
  addCompanies,
  toggleSelect,
  toggleSelectAll,
  deleteSelected,
  updateCompany,
} = companySlice.actions

export default companySlice.reducer
