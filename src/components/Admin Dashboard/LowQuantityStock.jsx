import React, { useRef, useState, useEffect } from 'react';
import { ChevronDownCircle, ArrowUp } from 'lucide-react';
import './LowQuantityStock.css';

const pic1 = "./items2.jpeg"
const stockItems = [
  { name: 'Crown Vita', quantity: 10, image: pic1 },
  { name: 'Vegetable Oil', quantity: 15, image: pic1 },
  { name: 'Cream of Wheat', quantity: 15, image: pic1 },
  { name: 'Extra Oil', quantity: 12, image: pic1 },
  { name: 'Powder Milk', quantity: 13, image: pic1 },
  { name: 'Oats', quantity: 8, image: pic1 },
];

const LowQuantityStock = () => {
  const scrollRef = useRef(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    setAtTop(el.scrollTop === 0);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 10);
  };

  const scroll = (amount) => {
    scrollRef.current.scrollBy({ top: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="stock-header">
        <h2 className='qty-title'>Low Quantity Stock</h2>
        <a href="#">See All</a>
      </div>
      
      <div className="stock-scroll-area" ref={scrollRef}>
        {stockItems.map((item, index) => (
          <div className=" stock-item" key={index}>
            <img src={item.image} alt={item.name} />
            <div className="stock-info">
              <p className="stock-name">{item.name}</p>
              <p className="stock-qty">Remaining Quantity: {item.quantity} Packet</p>
            </div>
            <span className="stock-low">Low</span>
          </div>
        ))}

    
        {!atBottom && (
          <button className="scroll-arrow" onClick={() => scroll(100)}>
             < ChevronDownCircle  size={24} className='downbtn'/>
          </button>
        )}
      </div>

</>
  );
};

export default LowQuantityStock;
