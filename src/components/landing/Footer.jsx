import { Landmark, Github, Twitter, Linkedin } from "lucide-react";
import "./Footer.css";

const FOOTER_LINKS = {
  Product: ["Banking accounts", "Money transfers", "Cheque book orders", "Order tracking"],
  Company: ["About", "Security", "Careers", "Contact"],
  Resources: ["Help center", "API status", "Documentation"],
};

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing__container landing-footer__inner">
        <div className="landing-footer__brand-col">
          <div className="landing-footer__brand">
            <span className="landing-footer__brand-mark">
              <Landmark size={18} strokeWidth={2.25} />
            </span>
            <span>NovaBank</span>
          </div>
          <p className="landing-footer__tagline">
            Enterprise-grade banking infrastructure, built for trust.
          </p>
          <div className="landing-footer__socials">
            <a href="#" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="#" aria-label="GitHub">
              <Github size={16} />
            </a>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div className="landing-footer__col" key={heading}>
            <h4 className="landing-footer__heading">{heading}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="landing-footer__bottom">
        <p>&copy; {new Date().getFullYear()} NovaBank. All rights reserved.</p>
        <div className="landing-footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
