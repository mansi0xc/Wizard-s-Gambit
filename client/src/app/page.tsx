
import { MoveRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Spline from "@splinetool/react-spline/next"
import Link from "next/link"
import SplashCursor from '@/components/ui/SplashCursor/SplashCursor'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a2e] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating magical particles */}
      <SplashCursor />

      <div className="absolute inset-0 z-0">
        <div id="particles-container" className="w-full h-full" />
      </div>

      {/* Magical runes that fade in and out */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="rune rune-1 absolute top-1/4 left-1/4 text-6xl text-purple-400">ᛟ</div>
        <div className="rune rune-2 absolute top-1/3 right-1/3 text-5xl text-blue-400">ᚨ</div>
        <div className="rune rune-3 absolute bottom-1/4 right-1/4 text-7xl text-indigo-400">ᚦ</div>
        <div className="rune rune-4 absolute bottom-1/3 left-1/3 text-5xl text-violet-400">ᚹ</div>
      </div>

      <main className="container mx-auto px-4 py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight">
              Wizarding Realms: The Arcane Duel
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 font-light">
              Master the ancient arts of magic, collect powerful wands, and summon mystical creatures in this strategic
              dueling experience.
            </p>

            <Button
              asChild
              className="bg-transparent border border-purple-500 text-white hover:bg-purple-900/20 hover:border-purple-400 transition-all duration-500 group px-6 py-6 text-lg"
            >
              <Link href="/collection">
                Begin Your Journey
                <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="w-full h-[500px] lg:h-[600px] relative">
            <div className="w-full h-full">
              <Spline scene="https://prod.spline.design/0E-lFBbwtBPneAjc/scene.splinecode" />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full absolute bottom-0 pb-8 z-10">
        <div className="container mx-auto flex justify-center gap-8 md:gap-12">
          <Link href="/profile" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300">
            Player Profile
          </Link>
          <Link
            href="/collection"
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300"
          >
            Collection
          </Link>
          <Link
            href="/battle-logs"
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300"
          >
            Battle Logs
          </Link>
        </div>
      </footer>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Animate runes
            const runes = document.querySelectorAll('.rune');
            runes.forEach(rune => {
              setInterval(() => {
                rune.animate([
                  { opacity: 0.1 },
                  { opacity: 0.5 },
                  { opacity: 0.1 }
                ], {
                  duration: Math.random() * 5000 + 3000,
                  iterations: 1
                });
              }, Math.random() * 5000 + 3000);
            });
            
            // Create floating particles
            const particlesContainer = document.getElementById('particles-container');
            for (let i = 0; i < 50; i++) {
              const particle = document.createElement('div');
              particle.className = 'absolute w-1 h-1 rounded-full bg-purple-500 opacity-0';
              particle.style.left = Math.random() * 100 + '%';
              particle.style.top = Math.random() * 100 + '%';
              
              const size = Math.random() * 3 + 1;
              particle.style.width = size + 'px';
              particle.style.height = size + 'px';
              
              const hue = Math.random() > 0.5 ? 'purple' : 'blue';
              const color = hue === 'purple' ? 'rgb(167, 139, 250)' : 'rgb(129, 140, 248)';
              particle.style.backgroundColor = color;
              
              particlesContainer.appendChild(particle);
              
              animateParticle(particle);
            }
            
            function animateParticle(particle) {
              const duration = Math.random() * 15000 + 10000;
              const xMove = (Math.random() - 0.5) * 100;
              const yMove = (Math.random() - 0.5) * 100;
              
              particle.animate([
                { opacity: 0, transform: 'translate(0, 0)' },
                { opacity: 0.7, transform: 'translate(' + xMove/2 + 'px, ' + yMove/2 + 'px)' },
                { opacity: 0, transform: 'translate(' + xMove + 'px, ' + yMove + 'px)' }
              ], {
                duration: duration,
                iterations: Infinity
              });
            }
          });
        `,
        }}
      />
    </div>
  )
}

// import Link from "next/link"
// import { MoveRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a2e] flex flex-col items-center justify-center relative overflow-hidden">
//       {/* Floating magical particles */}
//       <div className="absolute inset-0 z-0">
//         <div id="particles-container" className="w-full h-full" />
//       </div>

//       {/* Magical runes that fade in and out */}
//       <div className="absolute inset-0 z-0 opacity-10">
//         <div className="rune rune-1 absolute top-1/4 left-1/4 text-6xl text-purple-400">ᛟ</div>
//         <div className="rune rune-2 absolute top-1/3 right-1/3 text-5xl text-blue-400">ᚨ</div>
//         <div className="rune rune-3 absolute bottom-1/4 right-1/4 text-7xl text-indigo-400">ᚦ</div>
//         <div className="rune rune-4 absolute bottom-1/3 left-1/3 text-5xl text-violet-400">ᚹ</div>
//       </div>

//       <main className="container mx-auto px-4 py-16 z-10 text-center">
//         <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight">
//           Wizarding Realms: The Arcane Duel
//         </h1>

//         <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light">
//           Master the ancient arts of magic, collect powerful wands, and summon mystical creatures in this strategic
//           dueling experience.
//         </p>

//         <Button
//           asChild
//           className="bg-transparent border border-purple-500 text-white hover:bg-purple-900/20 hover:border-purple-400 transition-all duration-500 group px-6 py-6 text-lg"
//         >
//           <Link href="/collection">
//             Begin Your Journey
//             <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//           </Link>
//         </Button>
//       </main>

//       <footer className="w-full absolute bottom-0 pb-8 z-10">
//         <div className="container mx-auto flex justify-center gap-8 md:gap-12">
//           <Link href="/profile" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300">
//             Player Profile
//           </Link>
//           <Link
//             href="/collection"
//             className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300"
//           >
//             Collection
//           </Link>
//           <Link
//             href="/battle-logs"
//             className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300"
//           >
//             Battle Logs
//           </Link>
//         </div>
//       </footer>

//       <script
//         dangerouslySetInnerHTML={{
//           __html: `
//           document.addEventListener('DOMContentLoaded', function() {
//             // Animate runes
//             const runes = document.querySelectorAll('.rune');
//             runes.forEach(rune => {
//               setInterval(() => {
//                 rune.animate([
//                   { opacity: 0.1 },
//                   { opacity: 0.5 },
//                   { opacity: 0.1 }
//                 ], {
//                   duration: Math.random() * 5000 + 3000,
//                   iterations: 1
//                 });
//               }, Math.random() * 5000 + 3000);
//             });
            
//             // Create floating particles
//             const particlesContainer = document.getElementById('particles-container');
//             for (let i = 0; i < 50; i++) {
//               const particle = document.createElement('div');
//               particle.className = 'absolute w-1 h-1 rounded-full bg-purple-500 opacity-0';
//               particle.style.left = Math.random() * 100 + '%';
//               particle.style.top = Math.random() * 100 + '%';
              
//               const size = Math.random() * 3 + 1;
//               particle.style.width = size + 'px';
//               particle.style.height = size + 'px';
              
//               const hue = Math.random() > 0.5 ? 'purple' : 'blue';
//               const color = hue === 'purple' ? 'rgb(167, 139, 250)' : 'rgb(129, 140, 248)';
//               particle.style.backgroundColor = color;
              
//               particlesContainer.appendChild(particle);
              
//               animateParticle(particle);
//             }
            
//             function animateParticle(particle) {
//               const duration = Math.random() * 15000 + 10000;
//               const xMove = (Math.random() - 0.5) * 100;
//               const yMove = (Math.random() - 0.5) * 100;
              
//               particle.animate([
//                 { opacity: 0, transform: 'translate(0, 0)' },
//                 { opacity: 0.7, transform: 'translate(' + xMove/2 + 'px, ' + yMove/2 + 'px)' },
//                 { opacity: 0, transform: 'translate(' + xMove + 'px, ' + yMove + 'px)' }
//               ], {
//                 duration: duration,
//                 iterations: Infinity
//               });
//             }
//           });
//         `,
//         }}
//       />
//     </div>
//   )
// }
