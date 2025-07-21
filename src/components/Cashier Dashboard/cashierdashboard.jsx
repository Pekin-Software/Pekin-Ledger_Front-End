import React, { useState,  useEffect, useCallback } from 'react';
import { UserCircle, ChevronUp,ChevronDown, X, LogOutIcon, Package} from 'lucide-react';
import "./cashierdashboard.css";
import "../Inventory/inventoryDashboard.css"
import Receipt from './cart';
import ItemCard from './ItemCard';
import SignOutModal from '../Authentications/LogOutModal';
import { useInventory } from '../../contexts/InventoryContext';
import Cookies from 'js-cookie';


const logo = "/logo.jpg";
const ScreenSaver = "/POS-Screensaver.png"
const userImageUrl = null; // or a real URL string if available
// const item1 = '/item1.jpg'
// const item2 = '/items2.jpeg'
// const item3 = '/items3.jpeg'

const SCREEN_SAVER_TIMEOUT = 5 * 60 * 1000; // 5 minutes
// const SCREEN_SAVER_TIMEOUT = 10 * 1000; // 10 seconds for testing

// const dummyItems = [
//   { id: 1, name: 'Grilled Chicken', price: 12.99, image: item1},
//   { id: 2, name: 'Fried Rice', price: 10.99, image: item2 },
//   { id: 3, name: 'Veggie Pizza', price: 15.49, image: item3 },
//   { id: 4, name: 'Burger', price: 8.99, image: '/images/burger.jpg' },
//   { id: 5, name: 'Fries', price: 4.50, image: item3 },
// ];

const CashierDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const {refreshAll,fetchProducts, products, productsLoading, productsError} = useInventory();
  const store_id = Cookies.get("store_id");

  
  const handleSignOut = () => {
    // Add your sign-out logic here
    alert("Signed out!");
    setShowModal(false);
  };

    // Select or deselect an item
  const handleSelectItem = (item, selected) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);

      if (selected) {
        // Add only if it doesn't exist
        if (exists) return prev;
        return [...prev, { ...item, quantity: 1 }];
      } else {
        // Remove item from cart
        return prev.filter((i) => i.id !== item.id);
      }
    });
  };

  // Update quantity from Receipt or ItemCard
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove if quantity becomes 0
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCartItems((prev) =>
        prev.map((i) => i.id === itemId ? { ...i, quantity: newQuantity } : i)
      );
    }
  };

   useEffect(() => {
    if (store_id) {
      fetchProducts({ storeId: store_id, type: "store" });
    }
  }, [store_id]);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    clearTimeout(window.screenSaverTimer);
    window.screenSaverTimer = setTimeout(() => {
      setIsIdle(true);
    }, SCREEN_SAVER_TIMEOUT);
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(window.screenSaverTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);

  useEffect(() => {
    const handleArrowScroll = (e) => {
      const container = document.querySelector(".items-scroll-container");
      if (!container) return;

      if (e.key === "ArrowDown") {
        container.scrollBy({ top: 50, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        container.scrollBy({ top: -50, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleArrowScroll);
    return () => window.removeEventListener("keydown", handleArrowScroll);
  }, []);

    const handleClearCart = () => {
    setCartItems([]); // empty the cart
    };

  return (
    <div className='pos-container'>
       {/* Screen Saver Overlay */}
      {isIdle && (
        <div
          className="screen-saver"
          onClick={() => {
            setIsIdle(false);
            resetTimer();
          }}
        >
          <img src={ScreenSaver} alt="Screen Saver" className="saver-img" />
        </div>
      )}

      <section className='product-section'>
      {/* For mobile/tablet combined header */}
        <div className='top-header-mobile'>
          <div className='group_img'>
            <img src={logo} alt="logo" />
          </div>

          <div className='business-info mobile-layout'>
            <div className="user-section" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {userImageUrl ? (
                <img
                  src={userImageUrl}
                  alt="User"
                  className="user-pic"
                />
              ) : (
                <UserCircle size={  30} className="user-icon" />
              )}
              <ChevronDown size={18} className="user-icon" />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="logout-btn" 
                    onClick={() => setShowModal(true)}
                  >
                    <LogOutIcon size={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <section className='main-section'>
          {productsLoading ? (
            <div className="product-grid-scrollable">
              <div className="product-grid-skeleton">
                {Array.from({ length: 28 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            </div>
          ) : productsError ? (
            <div className="error">
              <AlertCircle size={48} className="error-icon" />
              <p>Error: {productsError}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid-scrollable">
              <div className="product-grid">
                {products.map(item => {
                  const cartItem = cartItems.find(ci => ci.id === item.id);
                  return (
                    <ItemCard
                      key={item.id}
                      itemName={item.product_name}
                      price={item.price}
                      imageSrc={item.image}
                      selected={!!cartItem}
                      quantity={cartItem?.quantity || 0}
                      onSelect={(selected) => handleSelectItem(item, selected)}
                      onQuantityChange={(q) => updateQuantity(item.id, q)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="empty-message">
              <Package size={48} />
              <p>No products available.</p>
            </div>
          )}
        </section>
        
        {/* Only shown on desktop */}
        <section className='business-info desktop-layout'>
          <div className='user-info'>
            <button className="logout-btn" onClick={() => setShowModal(true)}>
              <LogOutIcon size={20} />
              Logout
            </button>

            <div>
              {userImageUrl ? (
                  <img
                    src={userImageUrl}
                    alt="User"
                    className="user-pic"
                  />
                ) : (
                  <UserCircle size={  20} className="user-icon" />
                )}
                <p>Cashier Name</p>
            </div>
          </div>

          <div className='business-data'>
            <p>Business Name</p>
          </div>
          
          <div className='date'>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </section>
      </section>

      {/* Desktop billing section */}
      <section className={`billing-section ${isBillingOpen ? 'open' : ''}`}>
        {/* Mobile Footer Toggle */}
        <div className="mobile-toggle" onClick={() => setIsBillingOpen(true)}>
          <span>Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          <span>
            Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} USD ||
            {(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100).toFixed(2)} LRD
          </span>
          <ChevronUp size={20} />
        </div>
        
        <div className="desktop-billing-content">
          <Receipt  cartItems={cartItems} onQuantityChange={updateQuantity} onClearCart={handleClearCart} />
        </div>

        {/* Fullscreen billing overlay for mobile */}
        {isBillingOpen && (
          <div className="billing-overlay">
            <button className="closebtn" onClick={() => setIsBillingOpen(false)}>
              <X size={24} />
            </button>
            <Receipt  cartItems={cartItems} onQuantityChange={updateQuantity} onClearCart={handleClearCart}/>
          </div>
        )}
        
      </section>

      <SignOutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSignOut}
      />
    </div>
    
  );
};

export default CashierDashboard;
