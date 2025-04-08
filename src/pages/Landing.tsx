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
      answer: 'Spotlight connects talented artists with top recruiters in the industry. Create your profile, showcase your work, and apply to opportunities that match your skills.' 
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
    <>
      <Splash />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur w-screen">
        <nav className="w-full">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={spotlightLogo} alt="Spotlight" className="h-8 w-auto" />
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/artists" className="text-gray-600 hover:text-blue-500">Find Artists</Link>
              <Link to="/gigs" className="text-gray-600 hover:text-blue-500">Browse Gigs</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-500">Pricing</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-500">About</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-gray-600 hover:text-blue-500">Sign In</Link>
              <Link to="/auth" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Get Started</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-screen h-screen flex items-center m-0 p-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
          style={{ backgroundImage: `url(${herobg})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left side - Text content */}
            <div className="flex flex-col justify-center p-4 lg:p-8">
              <div className="max-w-3xl">
                <h1 className="font-minimal text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-left">
                  Your Talent <br className="hidden sm:block" />
                  Deserves our{' '}
                  <span className="text-blue-400">Spotlight</span>
                </h1>
                <p className="text-white/90 text-lg sm:text-xl lg:text-2xl mt-6 backdrop-blur-sm bg-black/20 p-4 rounded-lg text-left">
                  Connect with top artists and recruiters in the performing arts industry. Showcase your talent and find your next big opportunity.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4 mt-8">
                  <Link
                    to="/auth"
                    className="w-full sm:w-auto bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/artists"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20"
                  >
                    Explore Artists
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white w-full overflow-hidden">
        <div className="w-full">
          <h2 className="font-minimal text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 text-center">Featured Artists</h2>
          
          {/* Sliding container */}
          <div className="relative">
            <div className="flex animate-slide-left whitespace-nowrap">
              {/* First set of artists */}
              {[...featuredArtists, ...featuredArtists].map((artist, index) => (
                <div 
                  key={`${artist.id}-${index}`}
                  className="flex-none w-[260px] sm:w-[300px] mx-2 sm:mx-4 bg-white rounded-xl p-4 sm:p-6 transform-style-3d hover:animate-card-hover cursor-pointer transition-all border border-gray-100 shadow-sm"
                >
                  <img src={artist.image} alt={artist.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 sm:mb-4 transform-gpu hover:scale-105 transition-transform" />
                  <h3 className="font-minimal text-lg sm:text-xl font-semibold text-black">{artist.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{artist.role}</p>
                  <div className="mt-2 text-blue-500">★ {artist.rating}</div>
                </div>
              ))}
            </div>

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Featured Recruiters */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 w-full overflow-hidden">
        <div className="w-full">
          <h2 className="font-minimal text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-8 text-center">Featured Recruiters</h2>
          
          {/* Sliding container */}
          <div className="relative">
            <div className="flex animate-slide-right whitespace-nowrap">
              {/* First set of recruiters */}
              {[...featuredRecruiters, ...featuredRecruiters].map((recruiter, index) => (
                <div 
                  key={`${recruiter.id}-${index}`}
                  className="flex-none w-[260px] sm:w-[300px] mx-2 sm:mx-4 bg-white rounded-xl p-4 sm:p-6 transform-style-3d hover:animate-card-hover cursor-pointer transition-all border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <img src={recruiter.image} alt={recruiter.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full transform-gpu hover:scale-105 transition-transform" />
                    {recruiter.verified && (
                      <div className="ml-2 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-minimal text-lg sm:text-xl font-semibold text-black">{recruiter.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{recruiter.role}</p>
                </div>
              ))}
            </div>

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white w-full perspective-1000">
        <div className="w-full">
          <h2 className="font-minimal text-3xl font-bold text-black mb-8 text-center animate-fade-in">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-100 transform-style-3d hover:translate-z-2 hover:-translate-y-0.5 transition-transform shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <span className="font-minimal font-semibold text-black">{item.question}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-blue-500 w-full">
        <div className="w-full text-center animate-fade-in-up">
          <h2 className="font-minimal text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Ready to Join Spotlight?</h2>
          <p className="text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
            Start your journey today and connect with the best opportunities in the performing arts industry.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-500 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block text-sm sm:text-base"
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
    </>
  );
};

export default Landing;
