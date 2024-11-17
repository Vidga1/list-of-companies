import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Company {
  id: number
  name: string
  address: string
  isSelected: boolean
}

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type CompanyStringFields = StringKeys<Company>

interface CompanyState {
  companies: Company[]
}

const initialState: CompanyState = {
  companies: [],
}

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies(state, action: PayloadAction<Company[]>) {
      state.companies = action.payload
    },
    addCompany(state, action: PayloadAction<Company>) {
      state.companies.unshift(action.payload)
    },
    updateCompany(state, action: PayloadAction<Company>) {
      const index = state.companies.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.companies[index] = action.payload
      }
    },
    updateCompanyField(
      state,
      action: PayloadAction<{
        id: number
        field: CompanyStringFields
        value: string
      }>
    ) {
      const { id, field, value } = action.payload
      const company = state.companies.find((c) => c.id === id)
      if (company) {
        company[field] = value
      }
    },
    deleteCompanies(state, action: PayloadAction<number[]>) {
      state.companies = state.companies.filter(
        (c) => !action.payload.includes(c.id)
      )
    },
    toggleSelectCompany(state, action: PayloadAction<number>) {
      const company = state.companies.find((c) => c.id === action.payload)
      if (company) {
        company.isSelected = !company.isSelected
      }
    },
    selectAllCompanies(state, action: PayloadAction<boolean>) {
      state.companies.forEach((c) => (c.isSelected = action.payload))
    },
  },
})

export const {
  setCompanies,
  addCompany,
  updateCompany,
  updateCompanyField,
  deleteCompanies,
  toggleSelectCompany,
  selectAllCompanies,
} = companySlice.actions

export default companySlice.reducer
export type { Company }
