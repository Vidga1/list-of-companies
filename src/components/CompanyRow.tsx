import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  toggleSelectCompany,
  updateCompanyField,
  Company,
} from '../store/companySlice'

interface CompanyRowProps {
  company: Company
  isSelected: boolean
  style: React.CSSProperties
}

const CompanyRow: React.FC<CompanyRowProps> = ({
  company,
  isSelected,
  style,
}) => {
  const dispatch = useDispatch()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [name, setName] = useState(company.name)
  const [address, setAddress] = useState(company.address)

  const handleSelectCompany = () => {
    dispatch(toggleSelectCompany(company.id))
  }

  const handleNameDoubleClick = () => {
    setIsEditingName(true)
  }

  const handleAddressDoubleClick = () => {
    setIsEditingAddress(true)
  }

  const handleNameBlur = () => {
    dispatch(updateCompanyField({ id: company.id, field: 'name', value: name }))
    setIsEditingName(false)
  }

  const handleAddressBlur = () => {
    dispatch(
      updateCompanyField({ id: company.id, field: 'address', value: address })
    )
    setIsEditingAddress(false)
  }

  return (
    <div
      className={`virtualized-table-row ${isSelected ? 'selected' : ''}`}
      style={style}
    >
      <div>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id={`company${company.id}`}
            checked={isSelected}
            onChange={handleSelectCompany}
          />
          <label htmlFor={`company${company.id}`} className="checkbox-label">
            Выбрать
          </label>
        </div>
      </div>
      <div>
        {isEditingName ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            autoFocus
          />
        ) : (
          <span onDoubleClick={handleNameDoubleClick}>{company.name}</span>
        )}
      </div>
      <div>
        {isEditingAddress ? (
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={handleAddressBlur}
            autoFocus
          />
        ) : (
          <span onDoubleClick={handleAddressDoubleClick}>
            {company.address}
          </span>
        )}
      </div>
    </div>
  )
}

export default CompanyRow
