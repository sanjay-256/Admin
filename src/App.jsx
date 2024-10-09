import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./Header";
import Home from "./Home";
import DisplayData from './DisplayData';
import AddItem from './AddItem';
import DisplayItems from './assets/DisplayItems';


function App() {
  

  return (
    <>
        <BrowserRouter>
          <Header/>
          <div>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route  path="/displaydata" element={<DisplayData/>}/>
              <Route  path="/additem" element={<AddItem/>}/>
              <Route  path="/displayitem" element={<DisplayItems/>}/>
            </Routes>
          </div>
        </BrowserRouter>
    </>
  )
}

export default App
