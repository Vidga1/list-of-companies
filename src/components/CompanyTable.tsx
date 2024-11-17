import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import {
  toggleSelectCompany,
  selectAllCompanies,
  deleteCompanies,
  addCompany,
  Company,
  updateCompanyField,
} from '../store/companySlice'
import './CompanyTable.css'

const CompanyTable: React.FC = () => {
  const dispatch = useDispatch()
  const companies = useSelector((state: RootState) => state.companies.companies)

  const selectAll = companies.length > 0 && companies.every((c) => c.isSelected)

  const handleSelectAll = () => {
    dispatch(selectAllCompanies(!selectAll))
  }

  const handleSelectCompany = (id: number) => {
    dispatch(toggleSelectCompany(id))
  }

  const handleDelete = () => {
    const idsToDelete = companies.filter((c) => c.isSelected).map((c) => c.id)
    dispatch(deleteCompanies(idsToDelete))
  }

  const handleAddCompany = () => {
    const maxId = companies.length ? Math.max(...companies.map((c) => c.id)) : 0
    const newId = maxId + 1

    const company: Company = {
      id: newId,
      name: 'Новая компания',
      address: 'Введите адрес',
      isSelected: false,
    }
    dispatch(addCompany(company))
  }

  const handleFieldUpdate = (
    id: number,
    field: 'name' | 'address',
    value: string
  ) => {
    dispatch(updateCompanyField({ id, field, value }))
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

  const [editingFields, setEditingFields] = useState<string[]>([])
  const editingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const isEditing = (fieldId: string) => editingFields.includes(fieldId)

  const startEditing = (fieldId: string) => {
    setEditingFields([...editingFields, fieldId])
  }

  const stopEditing = (fieldId: string) => {
    setEditingFields(editingFields.filter((id) => id !== fieldId))
  }

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
            return (
              <div
                key={company.id}
                className={`virtualized-table-row ${
                  company.isSelected ? 'selected' : ''
                }`}
                style={{ top: `${top}px`, height: `${rowHeight}px` }}
              >
                <div>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id={`company${company.id}`}
                      checked={company.isSelected}
                      onChange={() => handleSelectCompany(company.id)}
                    />
                    <label
                      htmlFor={`company${company.id}`}
                      className="checkbox-label"
                    >
                      Выбрать
                    </label>
                  </div>
                </div>
                <div>
                  <div
                    ref={(el) =>
                      (editingRefs.current[`${company.id}_name`] = el)
                    }
                    className="editable"
                    contentEditable={isEditing(`${company.id}_name`)}
                    suppressContentEditableWarning
                    onDoubleClick={() => {
                      startEditing(`${company.id}_name`)
                      setTimeout(() => {
                        editingRefs.current[`${company.id}_name`]?.focus()
                      }, 0)
                    }}
                    onBlur={(e) => {
                      handleFieldUpdate(
                        company.id,
                        'name',
                        e.currentTarget.textContent || ''
                      )
                      stopEditing(`${company.id}_name`)
                    }}
                  >
                    {company.name}
                  </div>
                </div>
                <div>
                  <div
                    ref={(el) =>
                      (editingRefs.current[`${company.id}_address`] = el)
                    }
                    className="editable"
                    contentEditable={isEditing(`${company.id}_address`)}
                    suppressContentEditableWarning
                    onDoubleClick={() => {
                      startEditing(`${company.id}_address`)
                      setTimeout(() => {
                        editingRefs.current[`${company.id}_address`]?.focus()
                      }, 0)
                    }}
                    onBlur={(e) => {
                      handleFieldUpdate(
                        company.id,
                        'address',
                        e.currentTarget.textContent || ''
                      )
                      stopEditing(`${company.id}_address`)
                    }}
                  >
                    {company.address}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CompanyTable
