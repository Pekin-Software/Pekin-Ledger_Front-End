import { useRef, useState, useEffect } from 'react';
import './TopSellingStock.css';
import { ChevronDownCircle } from 'lucide-react';
const topSelling = [
  {
    name: 'Dark Biscuit',
    sold: 30,
    remaining: 12,
    price: 'LRD$ 100.00'
  },
  {
    name: 'Extra Juice',
    sold: 21,
    remaining: 15,
    price: 'LRD$ 207.00'
  },
  {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  },
    {
    name: 'Digestive Biscuit',
    sold: 19,
    remaining: 17,
    price: 'LRD$ 105.00'
  }

];


const TopSellingStock = () => {
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
      <div className="top-stock-header">
        <h2 className='top-stock-title'>Top Selling Stock</h2>
        <a href="#">See All</a>
      </div>

      <div className="top-stock-table-wrapper" ref={scrollRef}>
        <table className="top-stock-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sold Quantity</th>
              <th>Remaining Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {topSelling.map((item, index) => (
              <tr key={index}>
                <td className='item-img'><img src="" alt="" /> {item.name}</td>
                <td>{item.sold}</td>
                <td>{item.remaining}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!atBottom && (
          <button className="scroll-arrow" onClick={() => scroll(100)}>
             < ChevronDownCircle  size={24} className='downbtn'/>
          </button>
        )}
      </div>
    </>
  );
};

export default TopSellingStock;