import { useState } from 'react';
import { Link } from 'react-router-dom';

type PricingInterval = 'monthly' | 'annual';
type UserType = 'artist' | 'recruiter';

const Pricing = () => {
  const [interval, setInterval] = useState<PricingInterval>('monthly');
  const [userType, setUserType] = useState<UserType>('artist');

  const plans = {
    artist: [
      {
        name: 'Basic',
        price: interval === 'monthly' ? 0 : 0,
        description: 'Perfect for getting started',
        features: [
          'Basic profile',
          'Apply to 5 gigs per month',
          'Basic analytics',
          'Email support',
        ],
      },
      {
        name: 'Pro',
        price: interval === 'monthly' ? 29 : 290,
        description: 'Best for active performers',
        features: [
          'Enhanced profile with portfolio',
          'Unlimited applications',
          'Priority in search results',
          'Advanced analytics',
          'Priority support',
          'Custom profile URL',
        ],
      },
      {
        name: 'Elite',
        price: interval === 'monthly' ? 99 : 990,
        description: 'For serious professionals',
        features: [
          'All Pro features',
          'Featured profile placement',
          'Direct messaging with recruiters',
          'Personal talent agent',
          '24/7 phone support',
          'Career coaching sessions',
        ],
      },
    ],
    recruiter: [
      {
        name: 'Basic',
        price: interval === 'monthly' ? 49 : 490,
        description: 'For occasional hiring',
        features: [
          '3 active job posts',
          'Basic candidate search',
          'Standard support',
          'Basic analytics',
        ],
      },
      {
        name: 'Business',
        price: interval === 'monthly' ? 199 : 1990,
        description: 'For growing companies',
        features: [
          'Unlimited job posts',
          'Advanced candidate search',
          'Priority support',
          'Advanced analytics',
          'Team collaboration',
          'Custom company page',
        ],
      },
      {
        name: 'Enterprise',
        price: interval === 'monthly' ? 499 : 4990,
        description: 'For large organizations',
        features: [
          'All Business features',
          'Dedicated account manager',
          'Custom integration options',
          'API access',
          'Volume hiring tools',
          'Custom reporting',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Toggle User Type */}
        <div className="mt-12 flex justify-center">
          <div className="relative bg-white rounded-lg p-1 flex">
            <button
              onClick={() => setUserType('artist')}
              className={`${
                userType === 'artist'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500'
              } relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-colors`}
            >
              For Artists
            </button>
            <button
              onClick={() => setUserType('recruiter')}
              className={`${
                userType === 'recruiter'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500'
              } relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-colors`}
            >
              For Recruiters
            </button>
          </div>
        </div>

        {/* Toggle Billing Interval */}
        <div className="mt-8 flex justify-center">
          <div className="relative bg-white rounded-lg p-1 flex">
            <button
              onClick={() => setInterval('monthly')}
              className={`${
                interval === 'monthly'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500'
              } relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-colors`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('annual')}
              className={`${
                interval === 'annual'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500'
              } relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-colors`}
            >
              Annual (Save 17%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans[userType].map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-lg shadow-lg divide-y divide-gray-200"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /{interval}
                  </span>
                </p>
                <Link
                  to={`/auth/signup?plan=${plan.name.toLowerCase()}&type=${userType}`}
                  className="mt-8 block w-full bg-primary-600 text-white text-center py-3 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Get started
                </Link>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
