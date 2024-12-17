import React from 'react';

export const CompanyStats = () => {
  const stats = [
    { value: '50+', label: 'Games Released' },
    { value: '10M+', label: 'Active Players' },
    { value: '15+', label: 'Years Experience' },
    { value: '100+', label: 'Team Members' },
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <h3 className="text-4xl font-bold text-purple-500 mb-2">{value}</h3>
              <p className="text-gray-300">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};