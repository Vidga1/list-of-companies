import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Company {
  id: number
  name: string
  address: string
}

type UpdatableCompanyFields = 'name' | 'address'

interface CompanyState {
  companyCount: number
  selectedIds: Set<number>
  allSelected: boolean
  updatedCompanies: { [key: number]: Company }
}

const initialState: CompanyState = {
  companyCount: 0,
  selectedIds: new Set(),
  allSelected: false,
  updatedCompanies: {},
}

function generateCompanyData(id: number): Company {
  const streets = ['Ленина', 'Пушкина', 'Гагарина', 'Мира', 'Советская']
  return {
    id,
    name: `Компания ${id}`,
    address: `ул. ${streets[id % streets.length]}, ${((id * 7) % 200) + 1}`,
  }
}

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanyCount: (state, action: PayloadAction<number>) => {
      state.companyCount = action.payload
      state.selectedIds.clear()
      state.allSelected = false
      state.updatedCompanies = {}
    },
    toggleSelect: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (state.selectedIds.has(id)) {
        state.selectedIds.delete(id)
      } else {
        state.selectedIds.add(id)
      }
    },
    toggleSelectAll: (state) => {
      state.allSelected = !state.allSelected
      state.selectedIds.clear()
    },
    deleteSelected: (state) => {
      if (state.allSelected) {
        state.companyCount = 0
      } else {
        state.companyCount -= state.selectedIds.size
      }
      state.selectedIds.clear()
      state.allSelected = false
      state.updatedCompanies = {}
    },
    updateCompany: (
      state,
      action: PayloadAction<{
        id: number
        field: UpdatableCompanyFields
        value: string
      }>
    ) => {
      const { id, field, value } = action.payload
      if (!state.updatedCompanies[id]) {
        state.updatedCompanies[id] = generateCompanyData(id)
      }
      state.updatedCompanies[id][field] = value
    },
  },
})

export const {
  setCompanyCount,
  toggleSelect,
  toggleSelectAll,
  deleteSelected,
  updateCompany,
} = companySlice.actions

export default companySlice.reducer
