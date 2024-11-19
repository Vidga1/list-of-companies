import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import {
  selectAllCompanies,
  deleteCompanies,
  addCompany,
  Company,
} from '../store/companySlice'
import CompanyRow from './CompanyRow'
import './CompanyTable.css'

const CompanyTable: React.FC = () => {
  const dispatch = useDispatch()
  const companies = useSelector((state: RootState) => state.companies.companies)
  const selectedCompanyIds = useSelector(
    (state: RootState) => state.companies.selectedCompanyIds
  )

  const selectAll =
    selectedCompanyIds.length === companies.length && companies.length > 0

  const handleSelectAll = () => {
    dispatch(selectAllCompanies(!selectAll))
  }

  const handleDelete = () => {
    dispatch(deleteCompanies(selectedCompanyIds))
  }

  const handleAddCompany = () => {
    const maxId = companies.length ? Math.max(...companies.map((c) => c.id)) : 0
    const newId = maxId + 1

    const company: Company = {
      id: newId,
      name: 'Новая компания',
      address: 'Введите адрес',
    }
    dispatch(addCompany(company))
  }

  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const rowHeight = 70
  const buffer = 5
  const totalHeight = companies.length * rowHeight

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer)
  const endIndex = Math.min(
    companies.length,
    Math.ceil((scrollTop + 400) / rowHeight) + buffer
  )

  const visibleCompanies = companies.slice(startIndex, endIndex)

  return (
    <div>
      <div className="buttons">
        <button className="add-btn" onClick={handleAddCompany}>
          Добавить компанию
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Удалить выбранные
        </button>
      </div>
      <div
        className="virtualized-table"
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div className="virtualized-table-header">
          <div>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label htmlFor="selectAll" className="checkbox-label">
                Выделить всё
              </label>
            </div>
          </div>
          <div>
            <div className="header-cell">Название компании</div>
          </div>
          <div>
            <div className="header-cell">Адрес</div>
          </div>
        </div>
        <div
          className="virtualized-table-content"
          style={{ height: `${totalHeight}px`, position: 'relative' }}
        >
          {visibleCompanies.map((company, index) => {
            const top = (startIndex + index) * rowHeight
            const isSelected = selectedCompanyIds.includes(company.id)
            return (
              <CompanyRow
                key={company.id}
                company={company}
                isSelected={isSelected}
                style={{
                  top: `${top}px`,
                  height: `${rowHeight}px`,
                  position: 'absolute',
                  width: '100%',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CompanyTable
