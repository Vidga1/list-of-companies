import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCompanies } from './store/companySlice'
import { generateCompanies } from './utils/generateCompanies'
import CompanyTable from './components/CompanyTable'
import './App.css'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const [companyCount, setCompanyCount] = useState(5)

  useEffect(() => {
    const companies = generateCompanies(companyCount)
    dispatch(setCompanies(companies))
  }, [dispatch, companyCount])

  const handleCompanyCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0) {
      setCompanyCount(value)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Список компаний</h1>
      <div className="input-wrapper">
        <label htmlFor="companyCount">Количество компаний: </label>
        <input
          type="number"
          id="companyCount"
          value={companyCount}
          onChange={handleCompanyCountChange}
          min="0"
        />
      </div>
      <CompanyTable />
    </div>
  )
}

export default App
