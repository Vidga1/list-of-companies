// src/components/CompanyRow.tsx
import React from 'react'
import { Company } from '../types/company'

interface CompanyRowProps {
  index: number
  style: React.CSSProperties
  id: number
  company: Company
  selected: boolean
  isEven: boolean
  handleToggleSelect: (id: number) => void
  handleUpdateCompany: (
    id: number,
    field: 'name' | 'address',
    value: string
  ) => void
}

const CompanyRow: React.FC<CompanyRowProps> = ({
  style,
  id,
  company,
  selected,
  isEven,
  handleToggleSelect,
  handleUpdateCompany,
}) => {
  return (
    <div
      style={style}
      className={`table-row ${selected ? 'selected' : ''} ${
        isEven ? 'even' : 'odd'
      }`}
    >
      <div className="table-cell checkbox-cell">
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
      <div className="table-cell name-cell">
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
      <div className="table-cell address-cell">
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
}

export default React.memo(CompanyRow)
