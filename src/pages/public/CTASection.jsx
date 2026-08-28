import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 bg-primary-600">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Siap Bergabung?</h2>
        <p className="mt-3 text-primary-100 max-w-xl mx-auto">
          Daftarkan dirimu sekarang dan raih masa depan cerah di SMK Negeri 1 Ponorogo.
        </p>
        <Link to="/pendaftaran">
          <Button size="lg" className="mt-6 bg-white text-primary-700 hover:bg-slate-100 gap-2 shadow-lg">
            Daftar Sekarang
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;