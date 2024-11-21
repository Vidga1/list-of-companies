// companySlice.ts
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
  existingIds: Set<number>
  allDeleted: boolean
}

const initialState: CompanyState = {
  companyCount: 0,
  selectedIds: new Set(),
  allSelected: false,
  updatedCompanies: {},
  existingIds: new Set(),
  allDeleted: false,
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
      state.existingIds.clear()
      state.allDeleted = false
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
        state.allDeleted = true
        state.existingIds = new Set(state.selectedIds)
      } else {
        if (state.allDeleted) {
          // Если все удалены по умолчанию, добавляем выбранные идентификаторы в existingIds
          for (const id of state.selectedIds) {
            state.existingIds.add(id)
          }
        } else {
          // Если все существуют по умолчанию, удаляем выбранные идентификаторы из existingIds
          for (const id of state.selectedIds) {
            state.existingIds.delete(id)
          }
        }
      }
      state.selectedIds.clear()
      state.allSelected = false
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
