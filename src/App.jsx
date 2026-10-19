import NavBar from './components/NavBar.jsx'
import Products from "./components/Products.jsx"
import ContactForm from "./components/ContactForm.jsx"
import './App.css'

function App() {
  return (
    <>
      {/* La página se compone de tres secciones reutilizables. */}
      <NavBar/>
      <Products/>
      <ContactForm/>
    </>
  )
}

export default App
