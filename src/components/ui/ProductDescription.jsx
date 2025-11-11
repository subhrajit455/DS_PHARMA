import React from 'react';

const ProductDescription = () => {
  return (
    <div className="max-w-full p-8 mx-auto mb-12" style={{ padding: '10px' }}>
      <h2
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '22px',
          fontWeight: 700,
          color: '#111827',
          margin: '.5rem',
          letterSpacing: '0.01em'
        }}
      >
        Description
      </h2>
      <div className="space-y-1 text-gray-800" style={{ fontFamily: 'Gyrotrope', fontSize: '15px', lineHeight: '1.8' }}>
        <p>
          Fish Oil is an essential health supplement that serves many benefits. Our everyday diet is often unable to provide us with the right quantities of all vital nutrients. The result is nutritional deficiencies that can cause a number of health problems.
        </p>
        <p>
          One important nutrient that our body really needs is Omega 3 fatty acids. It is mostly found in fish oils present in fish that don't usually show up in our diet, for example, oysters, mackerel, sardines, cod liver oil, herring etc. This shortage can easily be met with fish oil supplements such as PharmEasy Fish Oil 1000 mg.
        </p>
        <p>
          Omega 3 fatty acids can help to boost our immunity and cardiac health, may improve eye health, can help to reduce inflammation and thereby help to manage joint problems.
        </p>
        <h3 className="mt-4 mb-2 text-base font-bold" style={{ color: '#111827' }}>Benefits of PharmEasy Fish Oil 1000 mg</h3>
        <ul className="pl-4 space-y-2 list-disc list-inside">
          <li>The soft gelatin pills contain two powerful ingredients- 180mg of EPA and 120mg of DHA.</li>
          <li>These tablets help to strengthen immunity.</li>
          <li>It may support the health of the eyes.</li>
          <li>Fish oil pills may help to reduce some risk factors of heart diseases.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescription;