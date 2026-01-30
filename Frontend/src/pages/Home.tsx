import RotatingText from '../components/animations/RotationText';
import Header from '../components/common/Header';
import '../styles/global.css';
import './Home.css';

const Home = () => {
  const countries = [
    'Japan', 'Italy', 'France', 'Greece', 'Thailand',
    'Spain', 'South Africa', 'Vietnam', 'Croatia', 'New Zealand',
    'Iceland', 'Norway', 'Canada', 'Australia', 'Turkey',
    'Peru', 'Mexico', 'Costa Rica', 'Morocco', 'Portugal'
  ];

  return (
    <>
      <Header />
      <main>
        <div className="Background">
          <section className="hero-message">
              <div className="hero-text">
                  Your next journey starts in 
                  <RotatingText
                    texts={countries}
                    mainClassName="rotating-text-main"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.1}
                    splitLevelClassName="rotating-text-split"
                    transition={{ type: "spring", damping: 80, stiffness: 400 }}
                    rotationInterval={5500}
                    textColor="#D4AF37"
                  />
              </div>
          </section>
          <div className="Search">
            <a className="Slot">
              <div>
                <img className="mini_logo" src="./src/assets/icons/location.svg" alt="Location"/>
                Where are you going ?
              </div>
              <div>HERE_OUTPUT_FUNC</div>
            </a>
            <a className="Slot">
              <div>
                <img className="mini_logo" src="./src/assets/icons/calendar.svg" alt="Calendar"/>
                Dates
              </div>
              <div>HERE_OUTPUT_FUNC</div>
            </a>
            <a className="Slot">
              <div>
                <img className="mini_logo" src="./src/assets/icons/person.svg" alt="Person"/>
                Travellers
              </div>
              <div>HERE_OUTPUT_FUNC</div>
            </a>
            <button>Search</button>
          </div>
        </div>

        <div className="Discounts"></div>
        <div className="Promotion"></div>
        <div className="Recommendation"></div>
        <div className="DealsBasedonTrack"></div>
        <div className="MobileApp"></div>
      </main>
    </>
  );
};

export default Home;