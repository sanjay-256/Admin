import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger sticky-top">
       <div className="container">
       <Link to='/' className="navbar-brand fw-medium fst-italic ">
          <img src="/main_logo.png" className='img-fluid' alt="logo" style={{width:'45px'}}/>Kaimanam
        </Link>
        <button className='navbar-toggler' data-bs-toggle="collapse" data-bs-target="#navbar" data-bs-auto-close="inside" type="button">
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbar'>
        <ul className='navbar-nav ms-auto mb-2 mb-lg-0 fw-semibold' >
            <li className="nav-item">
              <Link className='nav-link' to="/"><i className="px-1 bi bi-house"/>Home</Link>
            </li>
            <li className="nav-item">
              <Link className='nav-link' to="/displaydata"><i className="px-1 bi bi-house"/>Admin</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' to="/additem">
                  <i className="px-1 bi bi-plus-circle" /> Add Item
                </Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/displayitem">
                  <i className="px-1 bi bi-plus-circle" /> Display Item
                </Link>
              </li>
        </ul>
        </div>
       </div>
      </nav>
    </>
  )
}

export default Header
