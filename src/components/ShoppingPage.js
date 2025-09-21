import React from 'react';

// Create and export the product data so other components can use it
export const products = Array.from({ length: 50 }).map((_, index) => ({
  itemId: `product-${index + 1}`,
  name: `Product Name ${index + 1}`,
  description: "This is a great product. You should buy it!",
  price: parseFloat((Math.random() * 50 + 10).toFixed(2))
}));

const ShoppingPage = React.forwardRef(function ShoppingPage({ onScroll, onAddToCart }, ref) {
  return (
    <div
      ref={ref}
      onScroll={onScroll}
      style={{
        height: '60vh',
        overflowY: 'scroll',
        border: '1px solid #ccc',
        marginTop: '20px',
      }}
    >
      {products.map((product) => (
        <div key={product.itemId} style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', marginRight: '20px', flexShrink: 0 }}></div>
          <div>
            <h3>{product.name} - ${product.price.toFixed(2)}</h3>
            <p>{product.description}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ShoppingPage;