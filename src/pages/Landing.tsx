import { Link } from 'react-router-dom';
import { useAccordion } from '../hooks/useAccordion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Splash from '../components/common/Splash';
import HeroAnimation from '../components/common/HeroAnimation';
import spotlightLogo from '../assets/SPOTLIGHT.png';

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
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur transform-style-3d">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center transform-gpu hover:scale-105 transition-transform">
              <img src={spotlightLogo} alt="Spotlight" className="h-8 w-auto" />
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/artists" className="text-gray-600 hover:text-blue-500 transform-gpu hover:-translate-y-0.5 hover:translate-z-2 transition-all">
                Find Artists
              </Link>
              <Link to="/gigs" className="text-gray-600 hover:text-blue-500 transform-gpu hover:-translate-y-0.5 hover:translate-z-2 transition-all">
                Browse Gigs
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-500 transform-gpu hover:-translate-y-0.5 hover:translate-z-2 transition-all">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-500 transform-gpu hover:-translate-y-0.5 hover:translate-z-2 transition-all">
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-gray-600 hover:text-blue-500 transform-gpu hover:-translate-y-0.5 hover:translate-z-2 transition-all">
                Sign In
              </Link>
              <Link
                to="/auth"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transform-gpu hover:-translate-y-1 hover:translate-z-4 hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center perspective-2000">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-900"></div>
        <div className="relative w-full transform-style-3d">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Left side - Text content */}
              <div className="text-left z-10 lg:col-span-3">
                <h1 className="font-minimal text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                  Your Talent <br />
                  Deserves a{' '}
                  <span className="text-blue-400 animate-tilt inline-block transform-gpu">Spotlight</span>
                </h1>
                <p className="text-white/70 text-lg sm:text-xl lg:text-2xl mb-12 animate-fade-in-up max-w-xl" style={{ animationDelay: '200ms' }}>
                  Connect with top artists and recruiters in the performing arts industry. Showcase your talent and find your next big opportunity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <Link 
                    to="/register" 
                    className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold transform-gpu hover:translate-z-4 hover:-translate-y-1 hover:shadow-xl transition-all"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/about" 
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold transform-gpu hover:translate-z-4 hover:-translate-y-1 hover:bg-white/20 transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Right side - Animation */}
              <div className="relative h-[400px] lg:h-[600px] lg:col-span-2 transform-style-3d animate-tilt">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-2 bg-white/30 rounded-full mx-auto animate-[float_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 bg-white w-full perspective-1000">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
          <h2 className="font-minimal text-3xl font-bold text-black mb-8 text-center animate-fade-in">Featured Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist, index) => (
              <div 
                key={artist.id} 
                className="bg-white rounded-xl p-6 transform-style-3d hover:animate-card-hover cursor-pointer transition-all border border-gray-100 shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img src={artist.image} alt={artist.name} className="w-20 h-20 rounded-full mb-4 transform-gpu hover:scale-105 transition-transform" />
                <h3 className="font-minimal text-xl font-semibold text-black">{artist.name}</h3>
                <p className="text-gray-600">{artist.role}</p>
                <div className="mt-2 text-blue-500">★ {artist.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recruiters */}
      <section className="py-16 bg-gray-50 w-full perspective-1000">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
          <h2 className="font-minimal text-3xl font-bold text-black mb-8 text-center animate-fade-in">Featured Recruiters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRecruiters.map((recruiter, index) => (
              <div 
                key={recruiter.id} 
                className="bg-white rounded-xl p-6 transform-style-3d hover:animate-card-hover cursor-pointer transition-all border border-gray-100 shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img src={recruiter.image} alt={recruiter.name} className="w-20 h-20 rounded-full mb-4 transform-gpu hover:scale-105 transition-transform" />
                <h3 className="font-minimal text-xl font-semibold text-black">{recruiter.name}</h3>
                <p className="text-gray-600">{recruiter.role}</p>
                {recruiter.verified && (
                  <div className="mt-2 text-blue-500 transform-gpu hover:scale-105 transition-transform">✓ Verified</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white w-full perspective-1000">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
          <h2 className="font-minimal text-3xl font-bold text-black mb-8 text-center animate-fade-in">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
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
      <section className="py-16 bg-black w-full">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 text-center animate-fade-in-up">
          <h2 className="font-minimal text-3xl font-bold text-white mb-6">
            Ready to Join Spotlight?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Start your journey today and connect with the best opportunities in the performing arts industry.
          </p>
          <Link to="/register" className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-black-800 hover:text-white transition-colors inline-block">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black animate-fade-in" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="w-full max-w-7xl mx-auto py-6 px-2 sm:px-4">
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
