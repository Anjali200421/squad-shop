import React from 'react';

// Forwarding the ref is crucial for the parent to control this component's scroll
const ShoppingPage = React.forwardRef(({ onScroll }, ref) => {
  return (
    <div
      ref={ref}
      onScroll={onScroll} // We'll only attach this for the controller
      style={{
        height: '60vh', // Make it a fixed height so it's scrollable
        overflowY: 'scroll',
        border: '1px solid #ccc',
        marginTop: '20px',
      }}
    >
      {/* Generate a long list of fake products to make the page scrollable */}
      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', marginRight: '20px', flexShrink: 0 }}></div>
          <div>
            <h3>Product Name {index + 1}</h3>
            <p>This is a great product. You should buy it!</p>
            <button>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ShoppingPage;