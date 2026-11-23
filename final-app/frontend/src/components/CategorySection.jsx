import React from 'react';
import CategoryCard from './CategoryCard';

const categoriesData = [
  {
    id: 1,
    title: 'Electrical',
    icon: 'bi-lightning-charge-fill',
    description: 'Lighting, fans, switches, circuit breakers and power problems.',
    sla: '2 Hours'
  },
  {
    id: 2,
    title: 'Plumbing',
    icon: 'bi-droplet-fill',
    description: 'Water leakage, taps, washroom fixtures and drainage maintenance.',
    sla: '3 Hours'
  },
  {
    id: 3,
    title: 'Internet & Wi-Fi',
    icon: 'bi-wifi',
    description: 'Campus Wi-Fi connectivity, access point faults and ethernet jacks.',
    sla: '1 Hour'
  },
  {
    id: 4,
    title: 'Furniture',
    icon: 'bi-lamp-fill',
    description: 'Broken classroom desks, chairs, podiums and laboratory benches.',
    sla: '6 Hours'
  },
  {
    id: 5,
    title: 'Cleaning',
    icon: 'bi-stars',
    description: 'Classroom, corridor and washroom hygiene and waste disposal.',
    sla: '1.5 Hours'
  },
  {
    id: 6,
    title: 'Equipment',
    icon: 'bi-cpu-fill',
    description: 'Projectors, display screens, oscilloscopes and specialized lab gear.',
    sla: '4 Hours'
  }
];

export default function CategorySection({ onSelectCategory }) {
  return (
    <section id="categories" className="py-5 bg-warm-white">
      <div className="container py-lg-3">
        <div className="section-header mb-5">
          <span className="badge bg-charcoal text-white text-uppercase px-2 py-1 mb-2">Scope of Services</span>
          <h2 className="h2 fw-bold text-charcoal mb-2">Maintenance Categories</h2>
          <p className="text-slate lead fs-6">Select a category below to route your request directly to specialized campus maintenance teams.</p>
        </div>

        <div className="row g-4">
          {categoriesData.map(cat => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              title={cat.title}
              description={cat.description}
              sla={cat.sla}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
