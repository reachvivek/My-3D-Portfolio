import { socialImgs } from "../constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <p>Terms & Conditions</p>
        </div>
        <div className="socials">
          {socialImgs.map((socialLink, index) => (
            <a
              key={index}
              href={socialLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="icon">
                <img src={socialLink.imgPath} alt={`${socialLink.name} icon`} />
              </div>
            </a>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Vivek Singh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
