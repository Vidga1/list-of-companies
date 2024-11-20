import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setCompanyCount,
  toggleSelect,
  toggleSelectAll,
  deleteSelected,
  updateCompany,
  Company,
} from '../store/companySlice'
import { RootState } from '../store/store'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'

function generateCompanyData(id: number): Company {
  const streets = ['Ленина', 'Пушкина', 'Гагарина', 'Мира', 'Советская']
  return {
    id,
    name: `Компания ${id}`,
    address: `ул. ${streets[id % streets.length]}, ${((id * 7) % 200) + 1}`,
  }
}

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
  const [inputCompanyCount, setInputCompanyCount] = useState<number>(5)

  const handleSetCompanyCount = useCallback(() => {
    dispatch(setCompanyCount(inputCompanyCount))
  }, [dispatch, inputCompanyCount])

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
    dispatch(deleteSelected())
  }, [dispatch])

  const handleUpdateCompany = useCallback(
    (id: number, field: 'name' | 'address', value: string) => {
      dispatch(updateCompany({ id, field, value }))
    },
    [dispatch]
  )

  const isCompanySelected = useCallback(
    (id: number) => {
      if (allSelected) {
        return !selectedIds.has(id)
      } else {
        return selectedIds.has(id)
      }
    },
    [allSelected, selectedIds]
  )

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const id = index + 1
      const company = updatedCompanies[id] || generateCompanyData(id)
      const selected = isCompanySelected(id)
      return (
        <div
          style={style}
          className={`table-row ${selected ? 'selected' : ''}`}
        >
          <div className="table-cell">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id={`company${id}`}
                checked={selected}
                onChange={() => handleToggleSelect(id)}
              />
              <label htmlFor={`company${id}`} className="checkbox-label">
                Выбрать
              </label>
            </div>
          </div>
          <div className="table-cell">
            <div
              className="editable"
              contentEditable={false}
              suppressContentEditableWarning={true}
              onDoubleClick={(e) => {
                ;(e.target as HTMLElement).contentEditable = 'true'
                ;(e.target as HTMLElement).focus()
              }}
              onBlur={(e) => {
                handleUpdateCompany(
                  id,
                  'name',
                  (e.target as HTMLElement).textContent || ''
                )
                ;(e.target as HTMLElement).contentEditable = 'false'
              }}
            >
              {company.name}
            </div>
          </div>
          <div className="table-cell">
            <div
              className="editable"
              contentEditable={false}
              suppressContentEditableWarning={true}
              onDoubleClick={(e) => {
                ;(e.target as HTMLElement).contentEditable = 'true'
                ;(e.target as HTMLElement).focus()
              }}
              onBlur={(e) => {
                handleUpdateCompany(
                  id,
                  'address',
                  (e.target as HTMLElement).textContent || ''
                )
                ;(e.target as HTMLElement).contentEditable = 'false'
              }}
            >
              {company.address}
            </div>
          </div>
        </div>
      )
    },
    [
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
            type="number"
            id="companyCount"
            min="1"
            value={inputCompanyCount}
            onChange={(e) =>
              setInputCompanyCount(parseInt(e.target.value) || 0)
            }
            placeholder="Количество компаний"
          />
          <button className="add-btn" onClick={handleSetCompanyCount}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Добавить
          </button>
        </div>
      </div>
      <div className="table">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={
                    (allSelected && selectedIds.size === 0) ||
                    (!allSelected && selectedIds.size === companyCount)
                  }
                  onChange={handleToggleSelectAll}
                />
                <label htmlFor="selectAll" className="checkbox-label">
                  Выделить всё
                </label>
                <div
                  className="delete-icon"
                  onClick={handleDeleteSelected}
                  title="Удалить выбранные"
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
            <div className="table-cell">Название компании</div>
            <div className="table-cell">Адрес</div>
          </div>
        </div>
        <div className="table-body">
          <List
            height={window.innerHeight - 300}
            itemCount={companyCount}
            itemSize={70} // Подберите оптимальное значение
            width={'100%'}
          >
            {Row}
          </List>
        </div>
      </div>
    </div>
  )
}

export default CompanyList
