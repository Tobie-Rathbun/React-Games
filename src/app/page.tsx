'use client';
// Import Declarations
import { useState, useEffect } from 'react';
import { useAnimate } from 'framer-motion';
import Link from 'next/link';
import './globals.css';

// Pull request and review test for project

export default function Home() {
  // Constant Declarations
  const [wrapper1, animateWrapper1] = useAnimate();
  const [wrapper2, animateWrapper2] = useAnimate();
  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
 
  // Animations 
  const hoverSequence = [
    { rotate: -90, duration: 0.12 },
    { scale: 1.15, duration: 0.15 },
    { rotate: 0, duration: 0.18 },
    { scale: 1.5, duration: 0.21 },
  ];

  const startFloatingAnimation = () => {
    animateWrapper1(
      { y: [-10, 0] },
      { repeat: Infinity, duration: 4, ease: 'easeInOut' }
    );

    animateWrapper2(
      { y: [-10, 0] },
      { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 2 }
    );
  };

  useEffect(() => {
    console.log("Wrapper1:", wrapper1.current);
    console.log("Wrapper2:", wrapper2.current);
    startFloatingAnimation();
  }, []);
  

  const applyBackgroundColor = (scope: HTMLElement | null, color: string) => {
    if (scope) {
      scope.style.transition = 'background-color 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      scope.style.backgroundColor = color;
    }
  };


  // Input Handling
  const handleHover = async (
    animate: typeof animate1,
    scope: HTMLElement | null,
    cardIndex: number
  ) => {
    setHoveredCard(cardIndex);
    applyBackgroundColor(scope, 'var(--highlight-color)');
  
    if (scope) {
      try {
        for (const step of hoverSequence) {
          // Allow animations to complete in sequence
          await animate(scope, step, { duration: step.duration, ease: 'easeInOut' });
        }
      } catch (e) {
        console.warn('Hover animation interrupted:', e);
      }
    }
  };
  
  const handleLeave = async (
    animate: typeof animate1,
    scope: HTMLElement | null
  ) => {
    setHoveredCard(null);
    applyBackgroundColor(scope, 'var(--highlight-color-light)');
  
    if (scope) {
      try {
        // Immediately reset to a neutral state if not already there
        await animate(scope, { scale: 1, rotate: 0 }, { ease: 'easeInOut', duration: 0.2 });
  
        // Play the bounce-out animation
        await animate(scope, { scale: 1.1, y: -10 }, { type: 'spring', stiffness: 300, damping: 15 });
        await animate(scope, { scale: 1, y: 0 }, { duration: 0.2 });
      } catch (e) {
        console.warn('Leave animation interrupted:', e);
      }
    }
  };
  
  

  const getTitleStyle = (cardIndex: number) => {
    const isHovered = hoveredCard === cardIndex;
    const animationDelay = cardIndex === 1 ? '0s' : '2s';
    return {
      color: isHovered ? '#bb86fc' : 'inherit',
      animation: 'float 4s ease-in-out infinite',
      animationDelay,
    };
  };
  

  return (
    <>
      <div className="-page">
        <h1>
          Howdy <span className="emoji" id="cowboy">&#x1F920;</span>
        </h1>
        <p>
          If you are looking for my qualifications and skillsets, check out my{' '}
          <span className="link">
            <Link href="https://portfolio.tobie-developer.com">Portfolio</Link>
          </span>{' '}
          page.
        </p>

        <div className="cards-flexbox">
          <div className="cards-flexbox-item">
            <Link href="/rockpaperscissors" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1
                className="card-title"
                style={getTitleStyle(1)}
                onMouseEnter={() => handleHover(animate1, scope1.current, 1)}
                onMouseLeave={() => handleLeave(animate1, scope1.current)}
              >
                Rock, Paper, Scissors
              </h1>
            </Link>
            <div
              ref={wrapper1}
              className="wrapper"
              key="wrapper"
              style={{ animation: 'float 4s ease-in-out infinite' }}
            >
              <div 
                ref={scope1}
                className='animated-card'
                onMouseEnter={() => handleHover(animate1, scope1.current, 1)}
                onMouseLeave={() => handleLeave(animate1, scope1.current)}
              >
                <Link href="/rockpaperscissors" style={{ textDecoration: 'none' }}>
                  <div className="card-content">
                    <div className="emoji-container">
                      <div className="emoji" id="rock">
                        <img src="/images/rock-emoji.png" alt="Rock" className="emoji" />
                      </div>
                      <div className="emoji" id="paper">
                        <img src="/images/paper-emoji.png" alt="Paper" className="emoji" />
                      </div>
                      <div className="emoji" id="scissors">
                        <img src="/images/scissors-emoji.png" alt="Scissors" className="emoji" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="cards-flexbox-item">
            <Link href="/texasholdem" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1
                className="card-title"
                style={getTitleStyle(2)}
                onMouseEnter={() => handleHover(animate2, scope2.current, 2)}
                onMouseLeave={() => handleLeave(animate2, scope2.current)}
              >
                Texas Hold &#39;Em
              </h1>
            </Link>
            <div
              ref={wrapper2}
              className="wrapper"
              key="wrapper"
              style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '2s' }}

            >
              <div 
                ref={scope2}
                className='animated-card'
                onMouseEnter={() => handleHover(animate2, scope2.current, 2)}
                onMouseLeave={() => handleLeave(animate2, scope2.current)}  
              >
                <Link href="/texasholdem" style={{ textDecoration: 'none' }}>
                  <div className="card-content">
                    <h2 className="emoji-flex-container">
                      <span className="emoji">&#9824;&#65039;</span>
                      <span className="emoji" id="heart">&#9829;&#65039;</span>
                      <span className="emoji">&#9827;&#65039;</span>
                    </h2>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="about-bio">
          <p>
            The <span className='link'><Link href="/rps">Rock, Paper, Scissors Simulator</Link></span> runs through many iterations of gameplay where the user decision is random and the AI computer makes guesses based on past decisions and their previous turn on a decision matrix known as a Markov Chain. It balances its decisions with a dynamic exponent to use the regret tracking data to minimize the counterfactual regret. Different computer move patterns can be selected with a dropdown before starting the simulation allowing for different results.
          </p>
          <p>
            The <span className='link'><Link href="/poker2d">2D Poker Game</Link></span> uses an AI logic with a decision matrix and counterfactual regret minimization that is based around the concepts I explored in the rock, paper, scissors game. The AI will make turns and over many iterations will learn to play better hands. The win likelihood percentage is calculated from an external &quot;pokersolver&quot; library with credit and thanks to goldfire.
          </p>
          <p>
            The <span className='link'><Link href="/chord-player">Chord Player</Link></span> will play any four note piano chord by simultaneously playing four separate .mp3 files each containing the sound of a different piano note. The GUI contains dropdown elements to choose the root note and the chord type, and then displays the selected notes. It also contains buttons to translate the chord to a higher inversion which involves playing one of the same notes in a higher octave, effectively making it higher pitched. The &quot;Play Chord&quot; button can be pushed many times and duplicates of the sound files are loaded to support the latency.
          </p>
          <p>
            The <span className='link'><Link href="/pokerfrogs">3D Poker Game</Link></span> showcases draggable panel components that are imported and update with live data from the cards dealt within the game logic that runs alongside the Babylon 3D scene in the page.tsx that contains the code for the webpage.
          </p>
        </div>
        

      </div>
    </>
  );
}
