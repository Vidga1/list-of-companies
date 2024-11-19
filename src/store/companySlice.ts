import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Company {
  id: number
  name: string
  address: string
}

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type CompanyStringFields = StringKeys<Company>

interface CompanyState {
  companies: Company[]
  selectedCompanyIds: number[]
}

const initialState: CompanyState = {
  companies: [],
  selectedCompanyIds: [],
}

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies(state, action: PayloadAction<Company[]>) {
      state.companies = action.payload
      state.selectedCompanyIds = []
    },
    addCompany(state, action: PayloadAction<Company>) {
      state.companies.unshift(action.payload)
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
      const idsToDelete = action.payload
      state.companies = state.companies.filter(
        (c) => !idsToDelete.includes(c.id)
      )
      state.selectedCompanyIds = state.selectedCompanyIds.filter(
        (id) => !idsToDelete.includes(id)
      )
    },
    toggleSelectCompany(state, action: PayloadAction<number>) {
      const id = action.payload
      if (state.selectedCompanyIds.includes(id)) {
        state.selectedCompanyIds = state.selectedCompanyIds.filter(
          (selectedId) => selectedId !== id
        )
      } else {
        state.selectedCompanyIds.push(id)
      }
    },
    selectAllCompanies(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.selectedCompanyIds = state.companies.map((c) => c.id)
      } else {
        state.selectedCompanyIds = []
      }
    },
  },
})

export const {
  setCompanies,
  addCompany,
  updateCompanyField,
  deleteCompanies,
  toggleSelectCompany,
  selectAllCompanies,
} = companySlice.actions

export default companySlice.reducer
export type { Company }
