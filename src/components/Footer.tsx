const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Jobs</li>
              <li className="hover:text-white cursor-pointer">
                For the Record
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Communities</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">For Artists</li>
              <li className="hover:text-white cursor-pointer">Developers</li>
              <li className="hover:text-white cursor-pointer">Advertising</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Useful links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Support</li>
              <li className="hover:text-white cursor-pointer">Web Player</li>
              <li className="hover:text-white cursor-pointer">
                Free Mobile App
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Spotify</h3>
            <p className="text-sm leading-relaxed">
              Nghe nhạc mọi lúc, mọi nơi. Khám phá hàng triệu bài hát miễn phí.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs border-t border-white/10 pt-6">
          <p>© 2025 Spotify Clone</p>

          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Legal</span>
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
