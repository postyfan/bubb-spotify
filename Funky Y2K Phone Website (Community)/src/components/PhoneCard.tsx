import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, Heart, Star } from 'lucide-react';

interface PhoneCardProps {
  name: string;
  year: string;
  description: string;
  funFact: string;
  imageUrl: string;
  color: string;
}

export function PhoneCard({ name, year, description, funFact, imageUrl, color }: PhoneCardProps) {
  const getBgPattern = (index: number) => {
    const patterns = [
      'pink-gingham',
      'bg-gradient-to-br from-[#ffe5f1] to-[#ffc0dd]',
      'bg-[#ffccee]',
      'gingham-bg'
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  return (
    <div 
      className="myspace-box overflow-hidden relative transition-all duration-300 hover:translate-y-[-4px]"
    >
      {/* Title bar */}
      <div 
        className="myspace-title-bar flex items-center justify-between"
        style={{ 
          background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`
        }}
      >
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-white pixelated" />
          <span className="uppercase text-sm">{name}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-4 h-4 border border-white flex items-center justify-center text-xs">_</div>
          <div className="w-4 h-4 border border-white flex items-center justify-center text-xs">×</div>
        </div>
      </div>

      {/* Content area */}
      <div className="relative scanlines crt-noise">
        {/* Image section with gingham background */}
        <div className="relative h-56 overflow-hidden pink-gingham">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <ImageWithFallback
              src={imageUrl}
              alt={name}
              className="max-h-full max-w-full object-contain pixelated drop-shadow-lg"
            />
          </div>
          
          {/* Pixel art corner decoration */}
          <div className="absolute top-2 right-2 sparkle-star">
            <Star className="w-6 h-6 pixelated" style={{ color: color }} fill={color} />
          </div>

          {/* Year badge - pixel style */}
          <div 
            className="absolute bottom-2 left-2 px-3 py-1 border-2 pixelated"
            style={{
              backgroundColor: color,
              borderColor: '#fff',
              color: '#fff',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.3)'
            }}
          >
            {year}
          </div>
        </div>

        {/* Info section */}
        <div className="bg-white p-4 border-t-4" style={{ borderColor: color }}>
          {/* Phone name with pixel border */}
          <div className="mb-3 pb-2 border-b-2 border-dashed border-[#ff69b4]">
            <h3 
              className="uppercase tracking-wide"
              style={{ color: color }}
            >
              ★ {name} ★
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-[#4a1942] mb-3 leading-relaxed">
            {description}
          </p>

          {/* Fun fact box */}
          <div 
            className="border-3 p-3 relative"
            style={{
              backgroundColor: `${color}10`,
              borderColor: color,
              borderWidth: '2px',
              borderStyle: 'dotted'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 pixelated" style={{ color: color }} />
              <p 
                className="text-xs uppercase tracking-wider"
                style={{ color: color }}
              >
                Fun Fact!
              </p>
            </div>
            <p className="text-xs text-[#8b5a83]">
              {funFact}
            </p>
          </div>

          {/* Pixel decoration at bottom */}
          <div className="flex gap-1 mt-3 justify-center">
            <div className="w-2 h-2" style={{ backgroundColor: color }}></div>
            <div className="w-2 h-2 bg-[#ff69b4]"></div>
            <div className="w-2 h-2" style={{ backgroundColor: color }}></div>
            <div className="w-2 h-2 bg-[#ff69b4]"></div>
            <div className="w-2 h-2" style={{ backgroundColor: color }}></div>
          </div>
        </div>
      </div>

      {/* Floating decoration */}
      <div className="absolute -top-2 -left-2 float">
        <Heart className="w-5 h-5 text-[#ff1493] fill-[#ff1493] pixelated" />
      </div>
    </div>
  );
}
