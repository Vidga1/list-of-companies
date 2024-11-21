import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCompanyCount,
  toggleSelect,
  toggleSelectAll,
  deleteSelectedCompanies,
  deleteAllCompanies,
  updateCompany,
} from '../store/companySlice'
import { RootState } from '../store/store'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import { generateCompanyData } from '../utils/generateCompanyData'
import CompanyRow from './CompanyRow'

const CompanyList: React.FC = () => {
  const dispatch = useDispatch()
  const companyCount = useSelector(
    (state: RootState) => state.companies.companyCount
  )
  const selectedIds = useSelector(
    (state: RootState) => state.companies.selectedIds
  )
  const allSelected = useSelector(
    (state: RootState) => state.companies.allSelected
  )
  const updatedCompanies = useSelector(
    (state: RootState) => state.companies.updatedCompanies
  )
  const deletedIds = useSelector(
    (state: RootState) => state.companies.deletedIds
  )
  const allDeleted = useSelector(
    (state: RootState) => state.companies.allDeleted
  )
  const [inputCompanyCount, setInputCompanyCount] = useState<string>('')

  const tableBodyRef = useRef<HTMLDivElement>(null)
  const [listHeight, setListHeight] = useState<number>(400)

  useEffect(() => {
    const updateListHeight = () => {
      if (tableBodyRef.current) {
        const { height } = tableBodyRef.current.getBoundingClientRect()
        setListHeight(height)
      }
    }

    updateListHeight()
    window.addEventListener('resize', updateListHeight)
    return () => window.removeEventListener('resize', updateListHeight)
  }, [])

  const handleToggleSelect = useCallback(
    (id: number) => {
      dispatch(toggleSelect(id))
    },
    [dispatch]
  )

  const handleToggleSelectAll = useCallback(() => {
    dispatch(toggleSelectAll())
  }, [dispatch])

  const handleDeleteSelected = useCallback(() => {
    dispatch(deleteSelectedCompanies())
  }, [dispatch])

  const handleDeleteAll = useCallback(() => {
    setCompanyCount(0)
    dispatch(deleteAllCompanies())
    setInputCompanyCount('')
  }, [dispatch])

  const handleUpdateCompany = useCallback(
    (id: number, field: 'name' | 'address', value: string) => {
      dispatch(updateCompany({ id, field, value }))
    },
    [dispatch]
  )

  const visibleCompanyCount = useMemo(() => {
    if (allDeleted) {
      return 0
    }
    return companyCount - deletedIds.size
  }, [allDeleted, deletedIds.size, companyCount])

  const getCompanyIdByIndex = useCallback(
    (index: number): number => {
      let id = 1
      let found = 0
      while (id <= companyCount) {
        if (!deletedIds.has(id)) {
          if (found === index) {
            return id
          }
          found++
        }
        id++
      }
      return -1
    },
    [companyCount, deletedIds]
  )

  const isCompanySelected = useCallback(
    (id: number) => {
      if (allDeleted) return false
      if (deletedIds.has(id)) return false
      if (allSelected) {
        return !selectedIds.has(id)
      } else {
        return selectedIds.has(id)
      }
    },
    [allDeleted, allSelected, selectedIds, deletedIds]
  )

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const id = getCompanyIdByIndex(index)
      if (id === -1) return null
      const company = updatedCompanies[id] || generateCompanyData(id)
      const selected = isCompanySelected(id)
      const isEven = index % 2 === 0
      return (
        <CompanyRow
          index={index}
          style={style}
          id={id}
          company={company}
          selected={selected}
          isEven={isEven}
          handleToggleSelect={handleToggleSelect}
          handleUpdateCompany={handleUpdateCompany}
        />
      )
    },
    [
      getCompanyIdByIndex,
      isCompanySelected,
      handleToggleSelect,
      handleUpdateCompany,
      updatedCompanies,
    ]
  )

  return (
    <div className="container">
      <h1 className="title">Список компаний</h1>
      <div className="buttons">
        <div className="button-container">
          <input
            type="text"
            id="companyCount"
            value={inputCompanyCount}
            onChange={(e) => {
              const value = e.target.value
              if (/^\d*$/.test(value)) {
                setInputCompanyCount(value)
                const count = parseInt(value, 10)
                if (!isNaN(count)) {
                  dispatch(setCompanyCount(count))
                } else {
                  dispatch(setCompanyCount(0))
                }
              }
            }}
            placeholder="Количество компаний"
          />
        </div>
        <button
          className="delete-selected-btn"
          onClick={handleDeleteSelected}
          disabled={
            (selectedIds.size === 0 && !allSelected) ||
            visibleCompanyCount === 0 ||
            allDeleted
          }
          title="Удалить выбранные"
        >
          Удалить выбранные
        </button>
      </div>

      <div className="table">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell checkbox-cell">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={
                    visibleCompanyCount > 0 &&
                    ((allSelected && selectedIds.size === 0) ||
                      (!allSelected &&
                        selectedIds.size === visibleCompanyCount))
                  }
                  onChange={handleToggleSelectAll}
                />
                <label htmlFor="selectAll" className="checkbox-label">
                  Выделить всё
                </label>
                <div
                  className="reset-icon"
                  onClick={handleDeleteAll}
                  title="Удалить все компании"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e83d6f"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>
            <div className="table-cell name-cell">Название компании</div>
            <div className="table-cell address-cell">Адрес</div>
          </div>
        </div>
        <div className="table-body" ref={tableBodyRef}>
          {visibleCompanyCount > 0 ? (
            <List
              height={listHeight}
              itemCount={visibleCompanyCount}
              itemSize={70}
              width={'100%'}
            >
              {Row}
            </List>
          ) : (
            <div className="no-companies">Нет компаний для отображения</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyList
