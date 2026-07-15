import { Link } from "react-router-dom";
import { Globe, Shield, Store, Truck } from "lucide-react";

const footerLinks = {
  "Get to Know Us": ["About Markethub", "Careers", "Press Releases"],
  "Make Money with Us": ["Sell on Markethub", "Become a Seller", "Advertise"],
  "Let Us Help You": ["Your Account", "Your Orders", "Help Center"],
};

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-nav-secondary py-8 text-center">
        <Link
          to="/products"
          className="text-sm text-white hover:text-brand-orange no-underline"
        >
          Back to top
        </Link>
      </div>

      <div className="bg-nav px-4 py-10 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 font-display text-sm font-bold">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <span className="cursor-default text-sm text-white/70 hover:text-white">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-3 font-display text-sm font-bold">Why Markethub?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Truck className="h-4 w-4 text-brand-orange" />
                Fast wallet checkout
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Shield className="h-4 w-4 text-brand-orange" />
                Secure payments
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Globe className="h-4 w-4 text-brand-orange" />
                Trusted sellers
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-nav px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-orange">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">
              Market<span className="text-brand-orange">hub</span>
            </span>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Markethub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
