import { Link } from 'react-router-dom';
import { useAccordion } from '../hooks/useAccordion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Splash from '../components/common/Splash';
import spotlightLogo from '../assets/SPOTLIGHT.png';
import herobg from '../assets/herobg.jpg';

const Landing = () => {
  const { openIndex, toggleAccordion } = useAccordion();

  const featuredArtists = [
    { id: 1, name: 'Sarah Johnson', role: 'Theater Actor', image: 'https://i.pravatar.cc/150?img=1', rating: 4.9 },
    { id: 2, name: 'Michael Chen', role: 'Classical Musician', image: 'https://i.pravatar.cc/150?img=2', rating: 4.8 },
    { id: 3, name: 'Emma Davis', role: 'Contemporary Dancer', image: 'https://i.pravatar.cc/150?img=3', rating: 4.9 }
  ];

  const featuredRecruiters = [
    { id: 1, name: 'Royal Theater Company', role: 'Theater Production', image: 'https://i.pravatar.cc/150?img=4', verified: true },
    { id: 2, name: 'Symphony Orchestra', role: 'Music Production', image: 'https://i.pravatar.cc/150?img=5', verified: true },
    { id: 3, name: 'Modern Dance Co.', role: 'Dance Company', image: 'https://i.pravatar.cc/150?img=6', verified: true }
  ];

  const faqItems = [
    { 
      question: 'How does Spotlight work?', 
      answer: 'Spotlight connects talented artists with top recruiters in the performing arts industry. Create your profile, showcase your work, and apply to opportunities that match your skills.' 
    },
    { 
      question: 'Is Spotlight free to use?', 
      answer: 'Yes, Spotlight offers a free basic plan. We also offer premium plans with advanced features for both artists and recruiters.' 
    }
  ];

  const footerLinks = {
    forArtists: [
      { name: 'Find Jobs', href: '/gigs' },
      { name: 'Create Profile', href: '/auth/signup?role=artist' },
      { name: 'Success Stories', href: '/stories' },
      { name: 'Resources', href: '/resources' },
    ],
    forRecruiters: [
      { name: 'Post a Job', href: '/recruiter/post' },
      { name: 'Search Artists', href: '/artists' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Enterprise', href: '/enterprise' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
      { name: 'Careers', href: '/careers' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    social: [
      {
        name: 'Twitter',
        href: 'https://twitter.com/spotlight',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        ),
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com/company/spotlight',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        ),
      },
      {
        name: 'Instagram',
        href: 'https://instagram.com/spotlight',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        ),
      },
    ],
  };

  return (
    <div className="w-full max-w-none px-0 mx-0 bg-cream-50">
      <Splash />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur w-screen border-b-2 border-black">
        <nav className="w-full">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={spotlightLogo} alt="Spotlight" className="h-8 w-auto" />
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/pricing" className="text-gray-600 hover:text-blue-500">Pricing</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="header-auth-btn landing-btn text-white border border-[#140D32] bg-[#140D32] px-4 py-2 rounded-lg font-semibold transition-all duration-150 shadow-none hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg focus:outline-none">Sign In</Link>
              <Link to="/auth" className="header-auth-btn get-started landing-btn bg-[#CC2114] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-150 shadow-none hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg focus:outline-none">Get Started</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full h-screen flex items-center m-0 p-0 bg-white pt-16 font-inter">
        <div className="relative w-full h-full">
          <div className="grid grid-cols-1 lg:[grid-template-columns:1.618fr_1fr] h-full">
            {/* Mobile Hero Image - show above text on mobile, hide on lg+ */}
            <div className="relative h-64 w-full block lg:hidden mb-4">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full overflow-hidden shadow-2xl lg:rounded-3xl"
                style={{ backgroundImage: `url(${herobg})` }}
              >
                <div className="absolute inset-0 bg-black/60 lg:rounded-3xl"></div>
              </div>
            </div>
            {/* Left side - Text content */}
            <div className="flex flex-col justify-center p-4 lg:p-8 bg-white h-full">
              <div className="max-w-3xl">
                <h1 className="font-minimal text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black text-left font-inter">
                  Your Talent <br className="hidden sm:block" />
                  Deserves our{' '}
                  <span className="font-inter" style={{ color: '#F2C200' }}>Spotlight</span>
                </h1>
                <p className="text-black/80 text-lg sm:text-xl lg:text-2xl mt-6 bg-white/80 p-4 rounded-lg text-left font-inter">
                  Connect with top artists and recruiters in the performing arts industry. Showcase your talent and find your next big opportunity.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4 mt-8">
                  <Link
                    to="/auth"
                    className="w-full sm:w-auto bg-cta1 text-white px-8 py-4 rounded-xl text-lg font-semibold cta-btn landing-btn font-inter"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/artists"
                    className="w-full sm:w-auto bg-cta3 text-white px-8 py-4 rounded-xl text-lg font-semibold cta-btn landing-btn font-inter"
                  >
                    Explore Artists
                  </Link>
                </div>
              </div>
            </div>
            {/* Right side - Hero BG Image only (desktop) */}
            <div className="relative h-64 w-full lg:h-full pt-8 pr-0 lg:pt-12 lg:pr-12 hidden lg:block">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                style={{ backgroundImage: `url(${herobg})` }}
              >
                <div className="absolute inset-0 bg-black/60 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Heading */}
      <h2 className="w-full text-center font-inter text-2xl sm:text-3xl font-bold text-[#000000] my-8">TRUSTED BY</h2>
      {/* Featured Artists Banner */}
      <section className="py-0 w-full bg-[#551138] flex items-center justify-center">
        <div className="w-full max-w-7xl px-2 sm:px-4 md:px-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-center">
          {featuredArtists.slice(0, 3).map((artist) => (
            <div
              key={artist.id}
              className="flex flex-col items-center justify-center flex-1 min-w-0 py-8 px-2 sm:px-6 lg:px-8 w-full max-w-xs"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
              />
              <h3 className="text-xl sm:text-2xl font-bold text-white font-inter text-center">{artist.name}</h3>
              <div className="text-white font-inter text-base sm:text-lg font-semibold text-center">{artist.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 w-full pl-4 pr-0">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* FAQ Main Card (golden ratio: ~61.8%) */}
          <div className="faq-section-bg border-2 px-4 sm:px-8 py-12" style={{ flex: '1 1 61.8%', minWidth: 0 }}>
            <h2 className="faq-title-glow font-inter text-3xl sm:text-4xl font-extrabold text-center mb-10 relative z-10 text-black tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`faq-card transition-all ${openIndex === index ? 'active' : ''}`}
                  style={{ boxShadow: openIndex === index ? '0 8px 32px 0 rgba(242,194,0,0.12)' : undefined }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none landing-btn"
                  >
                    <span className="faq-question">
                      <span className="faq-icon">★</span>
                      {item.question}
                    </span>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="faq-answer p-4 pt-0 border-t-0 text-left">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Contact Me Card (golden ratio: ~38.2%) */}
          <div className="flex-shrink-0" style={{ flex: '1 1 38.2%', minWidth: 0 }}>
            <div className="bg-white border-2 border-[#140D32] rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 h-full">
              <div className="w-16 h-16 rounded-full bg-[#F2C200] flex items-center justify-center mb-2 shadow-md">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path d="M21 8.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5m18 0A2.5 2.5 0 0 0 18.5 6h-13A2.5 2.5 0 0 0 3 8.5m18 0V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v.5m18 0l-9 6.5L3 8.5" stroke="#140D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="font-inter font-bold text-xl text-[#140D32]">Contact Me</h3>
              <p className="font-inter text-gray-700 text-base">Still have questions or need personalized help? Reach out directly and I’ll get back to you soon.</p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <a href="mailto:ayushdsd@gmail.com" className="bg-[#140D32] text-white px-4 py-2 rounded-lg font-semibold transition-all hover:bg-[#F2C200] hover:text-[#140D32] border-2 border-[#140D32] hover:border-[#F2C200]">ayushdsd@gmail.com</a>
                <a href="https://www.linkedin.com/in/ayushdsd/" target="_blank" rel="noopener noreferrer" className="bg-white text-[#140D32] px-4 py-2 rounded-lg font-semibold border-2 border-[#140D32] hover:bg-[#F2C200] hover:text-[#140D32] transition-all">LinkedIn Profile</a>
              </div>
              <span className="text-xs text-gray-400 mt-2">Response within 24 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 w-full border border-black" style={{ backgroundColor: '#551138' }}>
        <div className="w-full text-center animate-fade-in-up">
          <h2 className="font-minimal text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Ready to Join Spotlight?
          </h2>
          <p className="text-white/70 mb-6 sm:mb-8 text-base sm:text-lg">
            Start your journey today and connect with the best opportunities in the performing arts industry.
          </p>
          <Link
            to="/register"
            className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors inline-block text-sm sm:text-base landing-btn"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black animate-fade-in" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="w-full py-6 px-2 sm:px-4">
          <div className="xl:grid xl:grid-cols-3 xl:gap-4">
            <div className="space-y-3 xl:col-span-1">
              <span className="font-display text-lg font-bold text-white">Spotlight</span>
              <p className="text-white/70 text-xs leading-relaxed">
                Connecting talented artists with top industry recruiters. Build your career, showcase your talent, and find your next big opportunity.
              </p>
              <div className="flex space-x-3">
                {footerLinks.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white/70 hover:text-blue-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 xl:mt-0 xl:col-span-2">
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wider uppercase">For Artists</h3>
                <ul className="mt-2 space-y-1.5">
                  {footerLinks.forArtists.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-white/70 hover:text-blue-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-0">
                <h3 className="text-xs font-semibold text-white tracking-wider uppercase">For Recruiters</h3>
                <ul className="mt-2 space-y-1.5">
                  {footerLinks.forRecruiters.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-white/70 hover:text-blue-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 xl:mt-0 xl:col-span-2">
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wider uppercase">Company</h3>
                <ul className="mt-2 space-y-1.5">
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-white/70 hover:text-blue-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-0">
                <h3 className="text-xs font-semibold text-white tracking-wider uppercase">Support</h3>
                <ul className="mt-2 space-y-1.5">
                  {footerLinks.support.map((item) => (
                    <li key={item.name}>
                      <Link to={item.href} className="text-white/70 hover:text-blue-400 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-white/10">
            <p className="text-white/70 text-xs text-center">
              {new Date().getFullYear()} Spotlight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
