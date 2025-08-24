import {useState, useEffect, useRef} from "react";
import ProfitRevenueChart from "./SalesLineChart";
import { ChevronDownCircle } from "lucide-react";
import "./reports.css";


export default function Reports() {
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

const productData = [
  {
    product: "Tomato",
    id: "23567",
    category: "Vegetable",
    qty: "225 kg",
    turnover: "LRDS 17,000.00",
    increase: "2.3%",
    increaseClass: "green",
  },
  {
    product: "Onion",
    id: "25831",
    category: "Vegetable",
    qty: "200 kg",
    turnover: "LRDS 12,000.00",
    increase: "1.3%",
    increaseClass: "green",
  },
  {
    product: "Maggi",
    id: "56841",
    category: "Instant Food",
    qty: "200 Packets",
    turnover: "LRDS 10,000.00",
    increase: "1.3%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf Excel",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
  {
    product: "Surf",
    id: "23567",
    category: "Household",
    qty: "125 Packets",
    turnover: "LRDS 9,000.00",
    increase: "1%",
    increaseClass: "green",
  },
];

  return (
    <div className="report-container">
        <div className="overview-cards">
            <div className="card">
                <h4 className="card-title">Overview</h4>
                <div className="card-col">
                    <div  className="card-row">
                        <h4>Total Sales</h4>
                        <p>LRDS 90,000.00</p>
                    </div> 
                    <div className="card-row" >
                        <h4>Total Purchase Cost</h4>
                        <p>LRDS 19,000,000.00</p>
                    </div>
                    <div className="card-row">
                        <h4>Net Profit</h4>
                        <p>LRDS 190,000.00</p>
                    </div>
                </div>
                
                <div className="card-col">
                    <div  className="card-row">
                        <h4>Total Sales</h4>
                        <p>LRDS 90,000.00</p>
                    </div> 
                    <div className="card-row" >
                        <h4>Total Purchase Cost</h4>
                        <p>LRDS 19,000,000.00</p>
                    </div>
                    <div className="card-row">
                        <h4>Net Profit</h4>
                        <p>LRDS 190,000.00</p>
                    </div>
                    <div className="card-row">
                        <h4>Net Profit</h4>
                        <p>LRDS 190,000.00</p>
                    </div>
                </div>
            </div>

            <div className="card">
               <div className="category-card">
                    <h4 className="card-title">Best Selling Category</h4>
                    <table>
                        <thead>
                        <tr>
                            <th>Category</th>
                            <th>Turn Over</th>
                            <th>Increase By</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Vegetable</td>
                            <td>LRDS 17,000.00</td>
                            <td className="green">3.2%</td>
                        </tr>
                        <tr>
                            <td>Instant Food</td>
                            <td>LRDS 10,000.00</td>
                            <td className="green">2%</td>
                        </tr>
                        <tr>
                            <td>Households</td>
                            <td>LRDS 9,000.00</td>
                            <td className="green">1.5%</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>

        <div className="chart">
             <ProfitRevenueChart /> 
        </div>

        <div className="product-table">
          <h4 className="card-title head" >Best Selling Product</h4>
          
         <div className="product-list" ref={scrollRef}>
           <table className="product-list-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Product ID</th>
                <th>Category</th>
                <th>Remaining Qty</th>
                <th>Turn Over</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.id}</td>
                  <td>{item.category}</td>
                  <td>{item.qty}</td>
                  <td>{item.turnover}</td>
                  <td className={item.increaseClass}>{item.increase}</td>
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
        </div>
    </div>
  );
}