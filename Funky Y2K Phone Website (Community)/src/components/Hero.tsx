import { Smartphone, Sparkles, Heart, Star } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden py-12 px-4 gingham-bg crt-noise scanlines">
      {/* Scattered pixel hearts and stars */}
      <div className="absolute top-10 left-[10%] sparkle-star">
        <Heart className="w-6 h-6 text-[#ff1493] fill-[#ff1493] pixelated" />
      </div>
      <div className="absolute top-20 right-[15%] sparkle-star" style={{ animationDelay: '0.5s' }}>
        <Star className="w-5 h-5 text-[#ff69b4] fill-[#ff69b4] pixelated" />
      </div>
      <div className="absolute bottom-16 left-[20%] sparkle-star" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-7 h-7 text-[#ff1493] pixelated" />
      </div>
      <div className="absolute top-32 left-[70%] sparkle-star" style={{ animationDelay: '1.5s' }}>
        <Heart className="w-4 h-4 text-[#ff69b4] fill-[#ff69b4] pixelated" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Main title box - MySpace style */}
        <div className="myspace-box mb-8 overflow-hidden">
          <div className="myspace-title-bar flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 pixelated" />
              <span className="uppercase">My Profile - Fun Shaped Phones</span>
            </div>
            <div className="flex gap-1">
              <div className="w-5 h-5 border-2 border-white flex items-center justify-center">_</div>
              <div className="w-5 h-5 border-2 border-white flex items-center justify-center">□</div>
              <div className="w-5 h-5 border-2 border-white flex items-center justify-center">×</div>
            </div>
          </div>
          
          <div className="p-8 text-center bg-white relative">
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 text-[#ff69b4]">
              <Sparkles className="w-6 h-6 pixelated" />
            </div>
            <div className="absolute top-2 right-2 text-[#ff1493]">
              <Sparkles className="w-6 h-6 pixelated" />
            </div>
            
            <div className="mb-4 flex justify-center items-center gap-3">
              <Heart className="w-8 h-8 text-[#ff69b4] fill-[#ff69b4] pixelated pulse-scale" />
              <Heart className="w-10 h-10 text-[#ff1493] fill-[#ff1493] pixelated pulse-scale" style={{ animationDelay: '0.3s' }} />
              <Heart className="w-8 h-8 text-[#ff69b4] fill-[#ff69b4] pixelated pulse-scale" style={{ animationDelay: '0.6s' }} />
            </div>
            
            <h1 className="mb-4 uppercase tracking-wider cyber-text-outline">
              ★ Welcome to My Profile! ★
            </h1>
            
            <div className="bg-[#ffe5f1] border-4 border-[#ff69b4] p-4 mb-4 dotted-border">
              <p className="text-[#ff1493]">
                ✿ Fun Shaped 2000s Phones ✿
              </p>
            </div>
            
            <p className="mb-3 text-[#4a1942]">
              Remember when phones were WILD?! 📱✨ Before boring smartphones, designers went CRAZY with shapes and colors! Welcome to the most groovy phone collection ever! 💕
            </p>

            {/* Pixel art divider */}
            <div className="flex justify-center items-center gap-1 my-4">
              <div className="w-3 h-3 bg-[#ff69b4]"></div>
              <div className="w-3 h-3 bg-[#ff1493]"></div>
              <div className="w-3 h-3 bg-[#ff69b4]"></div>
              <div className="w-3 h-3 bg-[#ff1493]"></div>
              <div className="w-3 h-3 bg-[#ff69b4]"></div>
            </div>

            {/* Blink text */}
            <p className="blink text-[#ff1493] uppercase">
              ★ Come check out the coolest phones! ★
            </p>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-[#ff1493]">♥</span>
          <span className="text-[#ff69b4]">★</span>
          <span className="text-[#ff1493]">♥</span>
          <span className="text-[#ff69b4]">★</span>
          <span className="text-[#ff1493]">♥</span>
        </div>
      </div>
    </div>
  );
}
