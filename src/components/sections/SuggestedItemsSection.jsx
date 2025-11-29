import React from 'react';
import { PharmacyProductCard } from '@/components/features/product';

const SuggestedItemsSection = ({
    title = "Suggested Items",
    items = [],
    className = "",
    containerStyle = {},
    titleStyle = {}
}) => {
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

    return (
        <div className={className} style={containerStyle}>
            <h2 style={defaultTitleStyle}>
                <span style={defaultSpanStyle}>
                    {title}
                </span>
            </h2>
            <div
                className="flex w-full overflow-x-auto pb-4 hide-scrollbar sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 lg:gap-8 sm:pb-0"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    gap: '1rem'
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="w-[calc(50%-0.5rem)] min-w-[160px] shrink-0 sm:w-auto sm:min-w-0 sm:shrink"
                    >
                        <PharmacyProductCard
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            originalPrice={item.originalPrice}
                            discount={item.discount}
                            quantity="1 piece"
                            imageUrl={item.image}
                            className="w-full h-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedItemsSection;
