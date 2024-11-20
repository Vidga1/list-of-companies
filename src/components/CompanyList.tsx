import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addCompanies,
  toggleSelect,
  toggleSelectAll,
  deleteSelected,
  updateCompany,
  Company,
} from '../store/companySlice'
import { RootState } from '../store/store'

const CompanyList: React.FC = () => {
  const dispatch = useDispatch()
  const companies = useSelector(
    (state: RootState) => state.companies.companies
  ) as Company[]
  const selected = useSelector((state: RootState) => state.companies.selected)
  const allSelected = useSelector(
    (state: RootState) => state.companies.allSelected
  )
  const [companyCount, setCompanyCount] = useState<number>(5)
  const [pageSize, setPageSize] = useState(50)
  const [renderedCompanies, setRenderedCompanies] = useState<Company[]>([])
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    setRenderedCompanies(companies.slice(startIndex, startIndex + pageSize))
  }, [companies, selected, allSelected, startIndex])

  const handleScroll = () => {
    const tbody = document.getElementById('tableBody')
    if (
      tbody &&
      tbody.scrollHeight - tbody.scrollTop - tbody.clientHeight < 50
    ) {
      setStartIndex((prevStartIndex) =>
        Math.min(prevStartIndex + pageSize, companies.length - pageSize)
      )
    }
  }

  useEffect(() => {
    const tbody = document.getElementById('tableBody')
    if (tbody) {
      tbody.addEventListener('scroll', handleScroll)
      return () => tbody.removeEventListener('scroll', handleScroll)
    }
  }, [companies.length])

  const handleAddCompanies = () => {
    const inputElement = document.getElementById(
      'companyCount'
    ) as HTMLInputElement | null // Приведение типа с учетом null
    if (inputElement) {
      // Проверка на null
      const count = parseInt(inputElement.value) || 0 // Используйте .value после проверки
      dispatch(addCompanies(count))
      setStartIndex(0)
    }
  }

  const handleToggleSelect = (id: number) => {
    dispatch(toggleSelect(id))
  }

  const handleToggleSelectAll = () => {
    dispatch(toggleSelectAll())
  }

  const handleDeleteSelected = () => {
    dispatch(deleteSelected())
    setStartIndex(0) // Сброс startIndex после удаления компаний
  }

  const handleUpdateCompany = (
    id: number,
    field: keyof Company,
    value: string
  ) => {
    dispatch(updateCompany({ id, field, value }))
  }

  return (
    <div className="container">
      <h1 className="title">Список компаний</h1>
      <div className="buttons">
        <div className="button-container">
          <input
            type="number"
            id="companyCount"
            min="1"
            value={companyCount}
            onChange={(e) => setCompanyCount(parseInt(e.target.value) || 0)}
            placeholder="Количество компаний"
          />
          <button className="add-btn" onClick={handleAddCompanies}>
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
      <table id="companiesTable">
        <thead>
          <tr>
            <th>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={allSelected}
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
            </th>
            <th>Название компании</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          {renderedCompanies.map((company) => (
            <tr
              key={company.id}
              className={
                selected.has(company.id) || allSelected ? 'selected' : ''
              }
            >
              <td>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={`company${company.id}`}
                    checked={selected.has(company.id) || allSelected}
                    onChange={() => handleToggleSelect(company.id)}
                  />
                  <label
                    htmlFor={`company${company.id}`}
                    className="checkbox-label"
                  >
                    Выбрать
                  </label>
                </div>
              </td>
              <td>
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
                      company.id,
                      'name',
                      (e.target as HTMLElement).textContent || ''
                    )
                    ;(e.target as HTMLElement).contentEditable = 'false'
                  }}
                >
                  {company.name}
                </div>
              </td>
              <td>
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
                      company.id,
                      'address',
                      (e.target as HTMLElement).textContent || ''
                    )
                    ;(e.target as HTMLElement).contentEditable = 'false'
                  }}
                >
                  {company.address}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CompanyList
