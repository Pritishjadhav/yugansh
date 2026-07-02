"use client";

import { motion } from "framer-motion";

export default function WhatsAppButton() {
  const phoneNumber = "917507774878";
  const message = encodeURIComponent("Hello YugAnsh, I'm interested in your services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip / Label */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="group relative flex items-center"
      >
        <span className="absolute right-16 bg-slate-950/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm font-sans">
          Chat on WhatsApp
        </span>

        {/* Outer pulse effect rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping pointer-events-none" />

        {/* Main WhatsApp Button */}
        <div className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba56] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-all duration-300 transform hover:scale-110 active:scale-95">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.275 0 9.57-4.296 9.573-9.57.001-2.556-.993-4.959-2.798-6.766C16.242 2.46 13.844 1.46 11.282 1.46c-5.282 0-9.58 4.297-9.584 9.574-.001 1.62.433 3.202 1.258 4.606l-1.01 3.69 3.79-.994zM16.522 13.56c-.27-.135-1.602-.79-1.85-.88-.248-.09-.43-.135-.61.135-.18.27-.698.88-.856 1.06-.157.18-.315.2-.585.065-.27-.135-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.157-.27-.017-.417.118-.552.122-.122.27-.315.405-.471.135-.157.18-.27.27-.45.09-.18.045-.337-.023-.472-.068-.135-.61-1.47-.837-2.013-.22-.53-.44-.457-.61-.466-.156-.008-.336-.01-.516-.01-.18 0-.472.067-.72.337-.248.27-.947.927-.947 2.26 0 1.333.97 2.62 1.104 2.8.135.18 1.907 2.913 4.62 4.086.645.278 1.15.445 1.543.57.65.206 1.24.177 1.707.107.52-.078 1.603-.656 1.828-1.256.225-.6.225-1.114.158-1.222-.068-.109-.248-.174-.518-.309z" />
          </svg>
        </div>
      </motion.a>
    </div>
  );
}
