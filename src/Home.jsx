import React from 'react'

const Home = () => {
  return (
    <>
      <section className="main"  style={{ background: 'url(main_bg.jpg) no-repeat center center/cover', minHeight: '93vh' }}>
        <div className="container-fluid">
          <div className="row" style={{ height: '70vh' }}>
            <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
              <div className="text-center mb-5">
                <h1 className="fw-semibold text-white" style={{ fontSize: '3rem' }}>An Women Empowerment <br /> Initiative !</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
