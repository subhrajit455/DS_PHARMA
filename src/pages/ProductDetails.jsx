import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PharmacyProductCard from '../components/ui/PharmacyProductCard';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [selectedImage, setSelectedImage] = useState(0);

  // Product data
  const product = {
    id: 1,
    name: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
    price: 1500,
    originalPrice: 1800,
    discount: 25,
    stock: 15,
    images: [
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg',
      '/src/assets/images/medicine.jpeg'
    ],
    specialOffer: {
      title: '15% off on SBI Cards',
      code: 'T&C Applied'
    },
    description: `Fish Oil is an essential health supplement that serves many benefits. Our everyday diet is often unable to provide us with the right quantities of all vital nutrients. The result is nutritional deficiencies that can cause a number of health problems.

Fish oil is a dietary source of omega-3 fatty acids. It is mostly found in fish oils present in fatty fish such as salmon, tuna, mackerel, herring, and sardines. Omega 3 fatty acids are vital for our overall health, including our heart, brain, and eyes. They are also needed for reducing inflammation and thereby help to manage joint problems.

• The soft gelatin pills contain two powerful ingredients- 180mg of EPA and 120mg of DHA. EPA is good for maintaining brain health, helps to manage blood sugar levels and so prevent the formation of blood clots. DHA is also important for brain and eye health. It can also help reduce the risk of cardiovascular diseases.

• It may support the health of the eyes, and regular consumption of fish oil tablets may help to reduce the risk of macular degeneration.

• Fish oil may help to reduce some risk factors of heart diseases like high blood pressure, high levels of cholesterol, and plaque in the arteries.

• Omega 3 fatty acids in fish oil may help reduce inflammation in the body. This can be beneficial for people with inflammatory conditions like rheumatoid arthritis, and other autoimmune conditions.

• Omega 3 fatty acids in fish oil may help reduce the likelihood of depression.

• Omega 3 fatty acids during pregnancy is beneficial for the healthy growth and development of the foetus.

• Omega 3 fatty acids may help to maintain the firmness and elasticity of skin.

How to take Pharmeasy Fish Oil 1000 mg

• It is important to consult with a doctor to know if it is safe for you.

• The dosage of Fish Oil 1000 mg will be determined by your doctor. Generally, 1000-3000 mg of fish oil is considered safe for consumption. But your current health, health problems and health requirements will determine how many pills you need per day.

• The pills can be taken at any time of the day. People who get fish-smelling burps should take the pill right after meals.`
  };

  const suggestedItems = [
    {
      id: 1,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 2,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 3,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 4,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 5,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    }
  ];

  const scrollThumbnails = (direction) => {
    if (direction === 'up' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'down' && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">


      {/* Main Content */}
      <main className="flex-grow" style={{ paddingTop: '140px' }}>
        <div className="w-full px-6 lg:px-12 flex flex-col items-center">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left - Product Images */}
            <div className="flex gap-4">
              {/* Thumbnail Navigation */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => scrollThumbnails('up')}
                  disabled={selectedImage === 0}
                  className="p-1 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Scroll up"
                >
                  <ChevronUp size={20} />
                </button>

                <div className="flex flex-col gap-3 overflow-hidden" style={{ maxHeight: '400px' }}>
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-orange-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => scrollThumbnails('down')}
                  disabled={selectedImage === product.images.length - 1}
                  className="p-1 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Scroll down"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ minHeight: '400px', maxHeight: '500px' }}
                />
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="flex flex-col">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                {/* Product Title */}
                <h1
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#000000',
                    marginBottom: '16px',
                    lineHeight: '1.4'
                  }}
                >
                  {product.name}
                </h1>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#000000'
                      }}
                    >
                      ₹{product.price}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '18px',
                        fontWeight: 400,
                        color: '#9CA3AF',
                        textDecoration: 'line-through'
                      }}
                    >
                      ₹{product.originalPrice}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#10B981',
                        backgroundColor: '#D1FAE5',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}
                    >
                      {product.discount}% Off
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '14px',
                      color: '#EF4444',
                      fontWeight: 500
                    }}
                  >
                    Hurry, only {product.stock} in stock
                  </p>
                </div>

                {/* Special Offer */}
                <div
                  className="mb-6 p-4 rounded-lg border-2"
                  style={{
                    borderColor: '#FED7AA',
                    backgroundColor: '#FFF7ED'
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#000000',
                      marginBottom: '8px'
                    }}
                  >
                    Special Offer For You
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000000'
                      }}
                    >
                      {product.specialOffer.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '12px',
                      color: '#6B7280',
                      marginTop: '4px'
                    }}
                  >
                    {product.specialOffer.code}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex-1 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '16px',
                      backgroundColor: '#F97316',
                      color: '#FFFFFF',
                      border: 'none'
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '16px',
                      borderColor: '#F97316',
                      color: '#F97316',
                      backgroundColor: 'transparent'
                    }}
                  >
                    View Cart &gt;&gt;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-8 mb-12 max-w-full mx-auto" style={{ padding:'10px'}}>
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
              <h3 className="font-bold text-base mt-4 mb-2" style={{ color: '#111827' }}>Benefits of PharmEasy Fish Oil 1000 mg</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>The soft gelatin pills contain two powerful ingredients- 180mg of EPA and 120mg of DHA. EPA is good for maintaining brain health, helps to manage blood sugar levels and to prevent the formation of blood clots. DHA also helps the brain by increasing blood supply to it, and aids in brain function. It can also help reduce the chances of depression.</li>
                <li>These tablets help to strengthen immunity.</li>
                <li>It may support the health of the eyes, and regular consumption of fish oil tablets may help to reduce the risk of macular degeneration.</li>
                <li>Fish oil pills may help to reduce some risk factors of heart diseases like high blood pressure, high levels of cholesterol, hardened arteries.</li>
                <li>Omega 3 fatty acids are known to help to lower inflammation in the body thereby helping people suffering from chronic inflammatory disorders like rheumatoid arthritis, and other autoimmune conditions.</li>
                <li>Omega 3 fatty acids in fish oil may help reduce the likelihood of depression.</li>
                <li>Intake of Omega 3 fatty acids during pregnancy is beneficial for the healthy growth and development of the foetus.</li>
                <li>Omega 3 fatty acids may help to maintain the firmness and elasticity of skin.</li>
              </ul>
              <h3 className="font-bold text-base mt-4 mb-2" style={{ color: '#111827' }}>How to take PharmEasy Fish Oil 1000 mg</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Before taking any health supplement, have a word with your doctor to see if it is safe for you.</li>
                <li>The dosage of Fish Oil 1000 mg will be determined by your doctor. Generally, 1000-3000 mg of fish oil is considered safe for consumption. But your current health, health problems and health requirements will determine how many pills you need per day.</li>
                <li>The pills can be taken at any time of the day. People who get fish-smelling burps should take the pill right after meals.</li>
              </ul>
            </div>
          </div>

          {/* Suggested Medicine Section */}
          <div className="mb-10">
            <h2
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '24px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '1.5rem'
              }}
            >
              Suggested Medicine
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
            style={{ paddingBottom:'25px'}}>
              {suggestedItems.map((item) => (
                <PharmacyProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discount={item.discount}
                  quantity="1 piece"
                  imageUrl={item.image}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
      </main>

    </div>
  );
};

export default ProductDetails;
