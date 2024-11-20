import { Provider } from 'react-redux'
import CompanyList from './components/CompanyList'
import store from './store/store'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <CompanyList />
    </Provider>
  )
}

export default App
