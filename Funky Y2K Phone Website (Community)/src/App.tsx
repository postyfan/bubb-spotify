import { Hero } from './components/Hero';
import { PhoneCard } from './components/PhoneCard';
import { SectionHeader } from './components/SectionHeader';
import { Sparkles, Star, Heart, Smartphone } from 'lucide-react';
import nokiaN90 from 'figma:asset/b70068156ec7fa31ca094f83b98241f00f6b8184.png';
import nokia7600 from 'figma:asset/00afd354ce9d36c11053309646e82e0f90c2d359.png';
import nokia7280 from 'figma:asset/9cf6c7d5f305352e2fbcc7376df966b8d311c7ce.png';

// Nokia Phones
const nokiaPhones = [
  {
    name: 'Nokia N90',
    year: '2005',
    description: 'This camera-centric phone could twist and turn like a mini camcorder! The screen rotated 270 degrees - it was basically a full camera that also made calls.',
    funFact: 'It had a 2-megapixel Carl Zeiss lens and could shoot video. Total flex for 2005! 📸',
    imageUrl: nokiaN90,
    color: '#9966ff'
  },
  {
    name: 'Nokia 7600',
    year: '2003',
    description: 'The teardrop/leaf phone! Completely asymmetric design that you held sideways. Fashion over function at its finest!',
    funFact: 'Called "the most radical design departure in Nokia history." Typing was an adventure! 🍃',
    imageUrl: nokia7600,
    color: '#66cc99'
  },
  {
    name: 'Nokia 7280',
    year: '2004',
    description: 'The legendary "lipstick phone"! No external keypad, just a spinning wheel. Came in a velvet pouch like actual jewelry.',
    funFact: 'Texting was nearly impossible. But who cares? You looked AMAZING pulling this out! 💄',
    imageUrl: nokia7280,
    color: '#ff69b4'
  },
  {
    name: 'Nokia N-Gage',
    year: '2003',
    description: 'The "taco phone"! Gaming phone that you held sideways to talk. Combined phone + Game Boy = absolute chaos.',
    funFact: 'You looked ridiculous talking on it, but the games were actually pretty fun! 🎮',
    imageUrl: 'https://images.unsplash.com/photo-1629058547867-55180b00834b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1vYmlsZSUyMHBob25lfGVufDF8fHx8MTc2MTIxNzE0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#33ccff'
  },
  {
    name: 'Nokia 3650',
    year: '2003',
    description: 'Featured a circular keypad instead of the traditional grid. It was weird, wonderful, and totally impractical!',
    funFact: 'One of the first Symbian smartphones! The circular keypad made texting an adventure in finger gymnastics. 🔄',
    imageUrl: 'https://images.unsplash.com/photo-1675462607210-50cbfec63150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBwaG9uZSUyMHJldHJvfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ffcc00'
  },
  {
    name: 'Nokia 7270',
    year: '2004',
    description: 'Compact flip phone with Art Deco styling! It came with a chain so you could wear it as jewelry. Peak fashion phone era!',
    funFact: 'Part of the Nokia "Fashion & Experimental" line. It was literally designed as a fashion accessory! 💍',
    imageUrl: 'https://images.unsplash.com/photo-1731909008517-e8ece183974d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxpcCUyMHBob25lfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff1493'
  }
];

// LG Phones
const lgPhones = [
  {
    name: 'LG U900',
    year: '2007',
    description: 'The "Soul" phone with touch-sensitive controls that glowed red. Sleek slider design with serious futuristic vibes.',
    funFact: 'The LED lights pulsed with music! It was basically a disco in your pocket. ✨',
    imageUrl: 'https://images.unsplash.com/photo-1649594900763-bd4161461293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcGhvbmUlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MTIxNzE0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff1493'
  },
  {
    name: 'LG Chocolate',
    year: '2006',
    description: 'Glossy black slider with touch-sensitive controls! Super sleek and smooth - literally called "Chocolate" for a reason.',
    funFact: 'Sold over 7 million units! The touch controls were SUPER sensitive though. Pocket dials everywhere! 🍫',
    imageUrl: 'https://images.unsplash.com/photo-1675462607210-50cbfec63150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBwaG9uZSUyMHJldHJvfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#4d2600'
  },
  {
    name: 'LG Shine',
    year: '2007',
    description: 'Mirror-finish slider phone that was literally like holding a mirror! You could check your makeup AND make calls.',
    funFact: 'The entire front was polished metal. Fingerprint magnet but SO pretty! ✨',
    imageUrl: 'https://images.unsplash.com/photo-1731908998486-c903c3b662d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGFjY2Vzc29yaWVzJTIwYmxpbmd8ZW58MXx8fHwxNzYxMjE3MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#c0c0c0'
  },
  {
    name: 'LG Prada',
    year: '2007',
    description: 'Designer collaboration! First capacitive touchscreen phone BEFORE the iPhone! Super minimalist and chic.',
    funFact: 'It actually came out before the iPhone! Fashion meets tech at its finest. 👜',
    imageUrl: 'https://images.unsplash.com/photo-1629058547867-55180b00834b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1vYmlsZSUyMHBob25lfGVufDF8fHx8MTc2MTIxNzE0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#000000'
  }
];

// Siemens Phones
const siemensPhones = [
  {
    name: 'Siemens Xelibri 4',
    year: '2003',
    description: 'Looked like a compact mirror! Round flip phone designed to be a fashion accessory. Barely functional, totally fabulous.',
    funFact: 'It came with interchangeable face plates and was sold in jewelry stores! 💎',
    imageUrl: 'https://images.unsplash.com/photo-1731908998486-c903c3b662d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGFjY2Vzc29yaWVzJTIwYmxpbmd8ZW58MXx8fHwxNzYxMjE3MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff69b4'
  },
  {
    name: 'Siemens Xelibri 8',
    year: '2004',
    description: 'The "lipstick" Xelibri! Cylindrical flip phone that looked like makeup. Answering calls was a whole aesthetic.',
    funFact: 'Targeted at women who wanted their phone to match their makeup bag! So extra! 💄',
    imageUrl: 'https://images.unsplash.com/photo-1738716607275-a3e1048343e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRhenpsZWQlMjBwaG9uZXxlbnwxfHx8fDE3NjEyMTcxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#9966ff'
  },
  {
    name: 'Siemens SK65',
    year: '2004',
    description: 'Featured a full QWERTY keyboard that slid out sideways! Perfect for those marathon texting sessions with your BFF.',
    funFact: 'One of the first phones with a slide-out keyboard. Made you feel like a business mogul! 💼',
    imageUrl: 'https://images.unsplash.com/photo-1629058547867-55180b00834b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMG1vYmlsZSUyMHBob25lfGVufDF8fHx8MTc2MTIxNzE0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff69b4'
  },
  {
    name: 'Siemens SX1',
    year: '2003',
    description: 'Compact with a unique rounded square shape. One of the first smartphones with a megapixel camera!',
    funFact: 'Had a removable faceplate system! Customize your phone to match your outfit! 👗',
    imageUrl: 'https://images.unsplash.com/photo-1731909008517-e8ece183974d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxpcCUyMHBob25lfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#cc99ff'
  },
  {
    name: 'Siemens Xelibri 6',
    year: '2003',
    description: 'Unique swivel design that opened like a swiss army knife! Part of the experimental Xelibri fashion line.',
    funFact: 'The entire Xelibri line flopped commercially but they\'re iconic now! Ahead of their time! 🎨',
    imageUrl: 'https://images.unsplash.com/photo-1675462607210-50cbfec63150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBwaG9uZSUyMHJldHJvfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff1493'
  }
];

// Varia (Various Brands)
const variaPhones = [
  {
    name: 'Motorola RAZR V3',
    year: '2004',
    description: 'THE icon! Ultra-thin, ultra-cool, ultra-expensive. Flipping this open made you feel like a movie star. 💅',
    funFact: 'At 13.9mm thick, it was impossibly slim. Over 130 million sold! Paris Hilton had one in every color! 🌟',
    imageUrl: 'https://images.unsplash.com/photo-1731909008517-e8ece183974d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxpcCUyMHBob25lfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff1493'
  },
  {
    name: 'Toshiba G450',
    year: '2004',
    description: 'Swivel phone with a rotating screen! The top half twisted around like a secret agent gadget. So satisfying to fidget with.',
    funFact: 'Featured a motion sensor for gesture controls. Way ahead of its time! 🔄',
    imageUrl: 'https://images.unsplash.com/photo-1675462607210-50cbfec63150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBwaG9uZSUyMHJldHJvfGVufDF8fHx8MTc2MTIxNzE0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#9966ff'
  },
  {
    name: 'Sony Xperia Play',
    year: '2011',
    description: 'The PlayStation phone! Slide out the gaming controls and play actual PlayStation games on your phone. Mind. Blown. 🎮',
    funFact: 'Had an actual D-pad and PlayStation buttons. Peak gaming phone before smartphones took over!',
    imageUrl: 'https://images.unsplash.com/photo-1649594900763-bd4161461293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcGhvbmUlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MTIxNzE0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#0066cc'
  },
  {
    name: 'Sony Vaio UX',
    year: '2006',
    description: 'Not quite a phone but a pocket PC! Tiny computer with a flip-up screen and QWERTY keyboard. Ultimate tech flex.',
    funFact: 'Cost $1,800+ and ran Windows! You could play actual PC games on this tiny beast! 💻',
    imageUrl: 'https://images.unsplash.com/photo-1696621629216-dfed30d4427d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMHRlY2hub2xvZ3klMjBnYWRnZXR8ZW58MXx8fHwxNzYxMjE1MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#666666'
  },
  {
    name: 'Samsung Juke',
    year: '2007',
    description: 'A music phone that swiveled to reveal a numeric keypad. It was basically an iPod shuffle that could make calls!',
    funFact: 'It had a built-in 2GB of memory and came in wild colors. The swivel mechanism was SO satisfying! 🎵',
    imageUrl: 'https://images.unsplash.com/photo-1687178226704-27a0de445a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBub2tpYSUyMHBob25lfGVufDF8fHx8MTc2MTIxNTE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff6600'
  },
  {
    name: 'Bedazzled Phones',
    year: '2000s',
    description: 'Take any phone, add thousands of rhinestones, and BAM! The ultimate girly accessory. Blinding in sunlight. ✨',
    funFact: 'Companies like Swarovski made official crystal-covered phones selling for $1000+! 💎',
    imageUrl: 'https://images.unsplash.com/photo-1738716607275-a3e1048343e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRhenpsZWQlMjBwaG9uZXxlbnwxfHx8fDE3NjEyMTcxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ff69b4'
  }
];

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden gingham-bg scanlines crt-noise">
      {/* Floating pixel decorations */}
      <div className="fixed top-12 left-8 opacity-40 float z-0">
        <Star className="w-10 h-10 text-[#ff1493] fill-[#ff1493] pixelated" />
      </div>
      <div className="fixed top-24 right-12 opacity-40 float z-0" style={{ animationDelay: '1s' }}>
        <Heart className="w-12 h-12 text-[#ff69b4] fill-[#ff69b4] pixelated" />
      </div>
      <div className="fixed bottom-32 left-16 opacity-40 float z-0" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-8 h-8 text-[#ff1493] pixelated" />
      </div>
      <div className="fixed bottom-48 right-20 opacity-40 float z-0" style={{ animationDelay: '1.5s' }}>
        <Star className="w-9 h-9 text-[#ff69b4] fill-[#ff69b4] pixelated" />
      </div>
      <div className="fixed top-64 left-1/4 opacity-40 float z-0" style={{ animationDelay: '0.5s' }}>
        <Heart className="w-7 h-7 text-[#ff1493] fill-[#ff1493] pixelated" />
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Marquee text */}
        <div className="mb-8 overflow-hidden bg-[#ff69b4] border-4 border-[#ff1493] py-2 relative">
          <div className="whitespace-nowrap text-white uppercase">
            ★ Welcome to my phone collection! ★ Organized by brand! ★ Nokia ★ LG ★ Siemens ★ And more! ★ Check them all out! ★ Welcome to my phone collection! ★
          </div>
        </div>

        {/* Nokia Section */}
        <section className="mb-12">
          <SectionHeader 
            title="★ NOKIA ★"
            description="Nokia was THE king of experimental designs! From leaf-shaped phones to lipstick phones, they weren't afraid to get WILD! 📱✨"
            icon={<Smartphone className="w-6 h-6" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nokiaPhones.map((phone) => (
              <PhoneCard key={phone.name} {...phone} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 my-12">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              {i % 2 === 0 ? (
                <Heart className="w-4 h-4 text-[#ff69b4] fill-[#ff69b4] pixelated" />
              ) : (
                <Star className="w-4 h-4 text-[#ff1493] fill-[#ff1493] pixelated" />
              )}
            </div>
          ))}
        </div>

        {/* LG Section */}
        <section className="mb-12">
          <SectionHeader 
            title="★ LG ★"
            description="LG brought us sleek sliders and touch-sensitive controls! Chocolate, Shine, and Prada phones were absolute ICONS! 🍫✨"
            icon={<Heart className="w-6 h-6" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lgPhones.map((phone) => (
              <PhoneCard key={phone.name} {...phone} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 my-12">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              {i % 2 === 0 ? (
                <Star className="w-4 h-4 text-[#ff69b4] fill-[#ff69b4] pixelated" />
              ) : (
                <Heart className="w-4 h-4 text-[#ff1493] fill-[#ff1493] pixelated" />
              )}
            </div>
          ))}
        </div>

        {/* Siemens Section */}
        <section className="mb-12">
          <SectionHeader 
            title="★ SIEMENS ★"
            description="The Xelibri line was PEAK fashion phone era! Siemens said 'phones should be jewelry' and they meant it! 💎💄"
            icon={<Star className="w-6 h-6" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siemensPhones.map((phone) => (
              <PhoneCard key={phone.name} {...phone} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 my-12">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              {i % 2 === 0 ? (
                <Heart className="w-4 h-4 text-[#ff69b4] fill-[#ff69b4] pixelated" />
              ) : (
                <Star className="w-4 h-4 text-[#ff1493] fill-[#ff1493] pixelated" />
              )}
            </div>
          ))}
        </div>

        {/* Varia Section */}
        <section className="mb-12">
          <SectionHeader 
            title="★ VARIA ★"
            description="All the other amazing experimental phones from different brands! Motorola, Sony, Samsung and more brought the VIBES! 🎮📱"
            icon={<Sparkles className="w-6 h-6" />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {variaPhones.map((phone) => (
              <PhoneCard key={phone.name} {...phone} />
            ))}
          </div>
        </section>

        {/* Footer Section - MySpace style */}
        <div className="mt-16">
          <div className="myspace-box overflow-hidden">
            <div className="myspace-title-bar flex items-center justify-between">
              <span className="uppercase">★ About Me ★</span>
              <div className="flex gap-1">
                <Heart className="w-4 h-4 fill-white pixelated" />
                <Star className="w-4 h-4 fill-white pixelated" />
              </div>
            </div>

            <div className="p-8 bg-white text-center relative glitter-overlay">
              <h3 className="mb-4 text-[#ff1493] uppercase">
                ♥ Remember When Phones Had Personality?! ♥
              </h3>
              
              <p className="text-[#8b5a83] mb-4 leading-relaxed">
                The 2000s gave us the most creative, experimental, and downright EXTRA phones ever made! From Nokia's wild shapes to LG's sleek sliders, from Siemens' fashion accessories to bedazzled everything - these devices had PERSONALITY! 💕✨
              </p>

              <div className="border-4 border-[#ff69b4] border-dashed p-4 mb-4 bg-[#ffe5f1]">
                <p className="text-[#ff1493] blink">
                  ★ Thanks for visiting my profile! ★
                </p>
              </div>

              <p className="text-sm text-[#ff69b4] mb-4">
                Made with 💖 sparkles ✨ and Y2K nostalgia
              </p>

              {/* Pixel art at bottom */}
              <div className="flex justify-center gap-1 flex-wrap max-w-md mx-auto">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3"
                    style={{
                      backgroundColor: ['#ff69b4', '#ff1493', '#cc99ff', '#ffccee'][i % 4],
                    }}
                  ></div>
                ))}
              </div>

              {/* Counter (classic MySpace touch) */}
              <div className="mt-6 inline-block border-2 border-[#ff69b4] px-4 py-2 bg-white">
                <p className="text-xs text-[#8b5a83]">
                  You are visitor #9999999 ★
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
