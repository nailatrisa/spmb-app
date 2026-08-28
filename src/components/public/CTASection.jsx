import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-navy-900 text-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Siap Menjadi Bagian dari Kami?
        </h2>

        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Jangan lewatkan kesempatan untuk bergabung dan mengembangkan
          potensi bersama sekolah kami.
        </p>

        <Link
          to="/pendaftaran"
          className="inline-flex mt-8 px-6 py-3 rounded-lg bg-blue-600 font-semibold hover:bg-blue-700 transition"
        >
          Daftar Sekarang
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
