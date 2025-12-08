import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PharmacyProductCard } from '@/components/features/product';

const SuggestedItemsSection = ({
    title = "Suggested Items",
    items = [],
    className = "",
    containerStyle = {},
    titleStyle = {}
}) => {
    const navigate = useNavigate();

    // Default styles that can be overridden
    const defaultTitleStyle = {
        fontFamily: 'Gyrotrope',
        fontSize: '20px',
        fontWeight: 600,
        color: '#000000',
        marginBottom: '1.5rem',
        marginTop: '2rem',
        ...titleStyle
    };

    const defaultSpanStyle = {
        textDecoration: 'underline',
        textDecorationSkipInk: 'auto',
        textUnderlineOffset: '4px',
        display: 'inline-block'
    };

    const handleProductClick = (item) => {
        navigate(`/product/${item.id}`);
    };

    return (
        <div className={className} style={containerStyle}>
            <h2 style={defaultTitleStyle}>
                <span style={defaultSpanStyle}>
                    {title}
                </span>
            </h2>
            <div
                className="flex w-full overflow-x-auto pb-4 hide-scrollbar gap-4 px-4 sm:gap-6 lg:gap-8"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    marginBottom: '2rem'
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="w-[160px] shrink-0 sm:w-[230px]"
                    >
                        <PharmacyProductCard
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            originalPrice={item.originalPrice}
                            discount={item.discount}
                            quantity="1 piece"
                            imageUrl={item.image}
                            onCardClick={() => handleProductClick(item)}
                            className="w-full h-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedItemsSection;
