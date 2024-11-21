// src/store/companySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Company } from '../types/company'
import { generateCompanyData } from '../utils/generateCompanyData'

type UpdatableCompanyFields = 'name' | 'address'

interface CompanyState {
  companyCount: number
  selectedIds: Set<number>
  allSelected: boolean
  updatedCompanies: { [key: number]: Company }
  deletedIds: Set<number>
  allDeleted: boolean
}

const initialState: CompanyState = {
  companyCount: 0,
  selectedIds: new Set(),
  allSelected: false,
  updatedCompanies: {},
  deletedIds: new Set(),
  allDeleted: false,
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
      state.deletedIds.clear()
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
    deleteSelectedCompanies: (state) => {
      if (state.allDeleted) {
        // Если все удалены, то восстанавливаем выбранные
        state.selectedIds.forEach((id) => {
          state.deletedIds.delete(id)
        })
      } else {
        // Если не все удалены, то удаляем выбранные
        state.selectedIds.forEach((id) => {
          state.deletedIds.add(id)
        })
      }
      state.selectedIds.clear()
      state.allSelected = false
    },
    deleteAllCompanies: (state) => {
      state.allDeleted = true
      state.deletedIds.clear() // Очистка, так как все уже удалены
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
  deleteSelectedCompanies,
  deleteAllCompanies,
  updateCompany,
} = companySlice.actions

export default companySlice.reducer
