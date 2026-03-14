import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const hooprRef = useRef(null);
  const bseDaaSRef = useRef(null);
  const nsdlFpiRef = useRef(null);
  const fmsRef = useRef(null);
  const emitRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    const cards = [
      hooprRef.current,
      bseDaaSRef.current,
      nsdlFpiRef.current,
      fmsRef.current,
      emitRef.current,
    ];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div className="verticallayout">
            <div ref={hooprRef} className="first-project-wrapper">
              <div className="image-wrapper">
                <img
                  src="/images/projects/hoopr_app.png"
                  alt="Hoopr.AI Interface"
                />
              </div>
              <div className="text-content">
                <h2>Hoopr.AI: Revolutionizing AI-driven Business Solutions</h2>
                <p className="text-white-50 md:text-xl">
                  An AI-driven platform focused on automating and optimizing
                  business processes.
                </p>
              </div>
            </div>

            <div className="second-project-wrapper" ref={bseDaaSRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <img
                  src="/images/projects/bse_app.png"
                  alt="BSE Data as a Service"
                />
              </div>
              <div className="text-content">
                <h2>
                  BSE Data as a Service: Financial Data Access at Your
                  Fingertips
                </h2>
                <p className="text-white-50 md:text-xl">
                  Providing reliable and real-time stock market data services to
                  businesses and financial analysts.
                </p>
              </div>
            </div>
          </div>
          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={nsdlFpiRef}>
              <div className="image-wrapper bg-[#FFE7EB]">
                <img
                  src="/images/projects/nsdl_app.png"
                  alt="NSDL FPI Interface"
                />
              </div>
              <h2>
                NSDL FPI: Simplifying Investments for Foreign Portfolio
                Investors
              </h2>
              <p className="text-white-50 md:text-xl">
                A seamless platform enabling foreign investors to invest in
                India’s stock market.
              </p>
            </div>

            <div className="project" ref={fmsRef}>
              <div className="image-wrapper bg-[#D1E8FF]">
                <img
                  src="/images/projects/fms_app.png"
                  alt="Fleet Management System"
                />
              </div>
              <h2>
                FMS (Fleet Management System): Efficient Fleet Operations for
                Businesses
              </h2>
              <p className="text-white-50 md:text-xl">
                A comprehensive system for tracking, managing, and optimizing
                fleet operations.
              </p>
            </div>

            {/* Emit Project */}
            <div ref={emitRef} className="center-project">
              <div className="image-wrapper">
                <img
                  src="/images/projects/emit_app.png"
                  alt="Emit Timesheet Interface"
                />
              </div>
              <div className="text-content">
                <h2>Emit: Streamlining Timesheet Tracking for Teams</h2>
                <p className="text-white-50 md:text-xl">
                  A customizable and AI-powered platform to help teams fill
                  timesheets 50% faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
