import './App.css'

function App() {
  return (
    <>
      <header>
        <a href="#" className="logo">
          Premium Escape<span>+</span>
        </a>
        <div className="header-right">
          <div className="profile-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </header>
      <main>
        <div className="Background">
          <div className="Search">
            <a className="Slot">
              <div>
                <img className="mini_logo" src="./src/assets/icons/location.svg"/>
                Where are you going ?
              </div>
              <div>HERE_OUTPUT_FUNC</div>
            </a>
            <a className="Slot">
              <div>
                <img className="mini_logo" src="./src/assets/icons/calendar.svg"/>
                Dates
              </div>
              <div>HERE_OUTPUT_FUNC</div>
            </a>
            <a className="Slot">
              <div>
                <img className="mini_logo" src="./src/assets/icons/person.svg"/>
                Travellers
              </div>
              <div>HERE_OUTPUT_FUNC</div>
            </a>
            <button>Search</button>
          </div>
        </div>
      </main>
      <footer></footer>
    </>
  )
}

export default App