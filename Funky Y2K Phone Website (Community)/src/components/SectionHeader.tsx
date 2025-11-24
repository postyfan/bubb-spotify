import { Sparkles, Star, Heart } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="mb-8 relative">
      {/* MySpace style section header box */}
      <div className="myspace-box overflow-hidden">
        <div className="myspace-title-bar flex items-center gap-2">
          {icon && <div className="pixelated">{icon}</div>}
          <span className="uppercase">{title}</span>
          <div className="flex gap-1 ml-auto">
            <Heart className="w-4 h-4 fill-white pixelated" />
            <Star className="w-4 h-4 fill-white pixelated" />
          </div>
        </div>

        <div className="p-6 bg-white relative glitter-overlay">
          {/* Decorative pixel corners */}
          <div className="absolute top-1 left-1">
            <div className="flex gap-px">
              <div className="w-2 h-2 bg-[#ff69b4]"></div>
              <div className="w-2 h-2 bg-[#ff1493]"></div>
            </div>
            <div className="flex gap-px mt-px">
              <div className="w-2 h-2 bg-[#ff1493]"></div>
              <div className="w-2 h-2 bg-[#ff69b4]"></div>
            </div>
          </div>
          <div className="absolute top-1 right-1">
            <div className="flex gap-px">
              <div className="w-2 h-2 bg-[#ff1493]"></div>
              <div className="w-2 h-2 bg-[#ff69b4]"></div>
            </div>
            <div className="flex gap-px mt-px">
              <div className="w-2 h-2 bg-[#ff69b4]"></div>
              <div className="w-2 h-2 bg-[#ff1493]"></div>
            </div>
          </div>

          <p className="text-center text-[#8b5a83] mb-3">
            {description}
          </p>

          {/* Pixel divider */}
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2"
                style={{
                  backgroundColor: i % 2 === 0 ? '#ff69b4' : '#ff1493',
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="absolute -top-3 -right-3 float">
        <Sparkles className="w-8 h-8 text-[#ff1493] pixelated sparkle-star" />
      </div>
    </div>
  );
}
