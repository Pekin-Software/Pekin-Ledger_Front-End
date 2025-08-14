import React, { useState,  useEffect, useCallback, useContext } from 'react';
import { UserCircle, ChevronUp,ChevronDown, X, LogOutIcon, Package, AlertCircle} from 'lucide-react';
import "./cashierdashboard.css";
import ProductCard from '../ProductCard/productCard';
import VariantCard from '../ProductCard/variantCard';
import {ProductCardSkeleton} from '../ProductCard/skeletons';
import Receipt from './cart';
import SignOutModal from '../Authentications/LogOutModal';
import { useInventory } from '../../contexts/InventoryContext';
import Cookies from 'js-cookie';


const logo = "/logo.jpg";
const ScreenSaver = "/POS-Screensaver.png"
const userImageUrl = null; // or a real URL string if available
const item1 = '/item1.jpg'
const item2 = '/items2.jpeg'
const item3 = '/items3.jpeg'

const SCREEN_SAVER_TIMEOUT = 5 * 60 * 1000; // 5 minutes
// const SCREEN_SAVER_TIMEOUT = 10 * 1000; // 10 seconds for testing


// const dummyItems = [
  // { 
  //   id: 1, 
  //   product_name: 'Grilled Chicken', 
  //   price: 12.99, 
  //   image: item1,
  //   currency: "LRD",
  //   variants: [
  //     { id: '1', name: 'Spicy', price: 13.99, image: '/images/variant-spicy-chicken.jpg' },
  //     { id: '1', name: 'BBQ', price: 14.49, image: '/images/variant-bbq-chicken.jpg' }
  //   ]
  // },
//   { 
//     id: 2, 
//     product_name: 'Fried Rice', 
//     price: 10.99, 
//     image: item2,
//       currency: "LRD",
//     variants: [
//       { id: '2b', name: 'Shrimp Fried Rice', price: 12.99, image: item2 },
//       { id: '2a', name: 'Chicken Fried Rice', price: 11.49, image: item3},
//       { id: '2c', name: 'Shrimp Fried Rice', price: 12.99, image: item2 },
//       { id: '2d', name: 'Chicken Fried Rice', price: 11.49, image: item3},
//       { id: '2e', name: 'Shrimp Fried Rice', price: 12.99, image: item2 },
//       { id: '2f', name: 'Chicken Fried Rice', price: 11.49, image: item3},
//       { id: '2g', name: 'Shrimp Fried Rice', price: 12.99, image: item2 },
//       { id: '2h', name: 'Chicken Fried Rice', price: 11.49, image: item3}
      
//     ]
//   },
//   { 
//     id: 3, 
//     product_name: 'Veggie Pizza', 
//     price: 15.49, 
//     image: item3,
//     currency: "LRD",
//     variants: [
//       { id: '3a', name: 'Mushroom Veggie Pizza', price: 16.49, image: item3 },
//       { id: '3b', name: 'Spinach Veggie Pizza', price: 16.99, image: item3 }
//     ]
//   },
//   { 
//     id: 4, 
//     product_name: 'Burger', 
//     price: 8.99, 
//     image: '/images/burger.jpg',
//       currency: "USD",
//     variants: [
//       { id: '4a', name: 'Cheeseburger', price: 9.49, image: '/images/variant-cheeseburger.jpg' },
//       { id: '4b', name: 'Bacon Burger', price: 10.49, image: '/images/variant-bacon-burger.jpg' }
//     ]
//   },
//   { 
//     id: 6, 
//     product_name: 'Yazz Toothpaste', 
//     price: 4.50, 
//     image: item3,
//        currency: "USD",
//     variants: [
//       { id: '6a', name: 'Mint Yazz Toothpaste', price: 4.50, image: '/images/variant-mint-yazz.jpg' },
//       { id: '6b', name: 'Herbal Yazz Toothpaste', price: 4.70, image: '/images/variant-herbal-yazz.jpg' }
//     ]
//   },
//   { 
//     id: 54, 
//     product_name: 'Burger', 
//     price: 8.99, 
//     image: '/images/burger.jpg',
//        currency: "USD",
//     variants: [
//       { id: '4a', name: 'Cheeseburger', price: 9.49, image: '/images/variant-cheeseburger.jpg' },
//       { id: '4b', name: 'Bacon Burger', price: 10.49, image: '/images/variant-bacon-burger.jpg' }
//     ]
//   },
//   { 
//     id: 16, 
//     product_name: 'Yazz Toothpaste', 
//     price: 4.50, 
//     image: item3,
//        currency: "LRD",
//     variants: [
//       { id: '6a', name: 'Mint Yazz Toothpaste', price: 4.50, image: '/images/variant-mint-yazz.jpg' },
//       { id: '6b', name: 'Herbal Yazz Toothpaste', price: 4.70, image: '/images/variant-herbal-yazz.jpg' }
//     ]
//   },
//   { 
//     id: 89, 
//     product_name: 'Burger', 
//     price: 8.99, 
//     image: '/images/burger.jpg',
//        currency: "LRD",
//     variants: [
//       { id: '4a', name: 'Cheeseburger', price: 9.49, image: '/images/variant-cheeseburger.jpg' },
//       { id: '4b', name: 'Bacon Burger', price: 10.49, image: '/images/variant-bacon-burger.jpg' }
//     ]
//   },
//   { 
//     id: 57, 
//     product_name: 'Yazz Toothpaste', 
//     price: 4.50, 
//     image: item3,
//     currency: "USD",
//     variants: [
//       { id: '6a', name: 'Mint Yazz Toothpaste', price: 4.50, image: '/images/variant-mint-yazz.jpg' },
//       { id: '6b', name: 'Herbal Yazz Toothpaste', price: 4.70, image: '/images/variant-herbal-yazz.jpg' }
//     ]
//   }
// ];


const CashierDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const {refreshAll,fetchProducts, POS_Product_data, productsLoading, productsError, 
          variantsLoading, variantsError} = useInventory();
    
  const store_id = localStorage.getItem("store_id");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariant, setshowVariant] = useState(false);
  const openVariantModal = (product) => {
    setSelectedProduct(product);
    setshowVariant(true);
  };
  const handleSignOut = () => {
    // Add your sign-out logic here
    alert("Signed out!");
    setShowModal(false);
  };

  const updateCartQuantity = (variantId, newQuantity, variantData) => {
  setCartItems((prev) => {
    const exists = prev.find((item) => item.id === variantId);
    if (exists) {
      // Update quantity if already in cart
      if (newQuantity < 1) {
        // Remove if quantity less than 1
        return prev.filter((item) => item.id !== variantId);
      } else {
        return prev.map((item) =>
          item.id === variantId ? { ...item, quantity: newQuantity } : item
        );
      }
    } else {
      // Add new variant to cart with quantity
      if (newQuantity < 1) return prev; // don't add if less than 1
      return [...prev, { ...variantData, quantity: newQuantity }];
    }
  });
};
  const cartQuantities = cartItems.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

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
              <div className="product-grid">
                {Array.from({ length: 32 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            </div>
          ) : productsError ? (
            <div className="error">
              <AlertCircle size={30} className="error-icon" />
              <p>Error: {productsError}</p>
            </div>
          ) : POS_Product_data.length > 0 ? (
            <div className="product-grid-scrollable">
              <div className="product-grid">
                {POS_Product_data.map(item => {
                  return (
                    <ProductCard
                      showVariantCardOnClick={true}
                      onCardClick={() => openVariantModal(item)}
                      key={item.id}
                      itemName={item.product_name}
                      price={item.price}
                      imageSrc={item.image}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="empty-message">
              <Package size={108} />
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
                <p>{localStorage.getItem('user')}</p>
            </div>
          </div>

          <div className='business-data'>
            <p>{localStorage.getItem('business_name')}</p>
            <p>-</p>
            <p>Store Number: {store_id}</p>
          </div>

          <div className='rate'>
            <p>Exchange Rate: {localStorage.getItem('exchange_rate')}</p>
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
          <Receipt  cartItems={cartItems} onQuantityChange={updateCartQuantity} onClearCart={handleClearCart} />
        </div>

        {/* Fullscreen billing overlay for mobile */}
        {isBillingOpen && (
          <div className="billing-overlay">
            <button className="closebtn" onClick={() => setIsBillingOpen(false)}>
              <X size={24} />
            </button>
            <Receipt  cartItems={cartItems} onQuantityChange={updateCartQuantity} onClearCart={handleClearCart}/>
          </div>
        )}
        
      </section>

      <SignOutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSignOut}
      />

       {selectedProduct && (
        <VariantCard
          isOpen={showVariant}
          onClose={() => setshowVariant(false)}
          title={selectedProduct.product_name}
          currency={selectedProduct?.currency}
          variants={selectedProduct.variants}
          loading={variantsLoading}
          error = {variantsError}

          initialQuantities={cartQuantities} 
          onQuantityChange={(variantId, qty, variantData) => {
            const combinedVariantData = {
              ...variantData,
              currency: selectedProduct.currency,
              name: `${variantData.name} ${selectedProduct.product_name}`,
              product_id: selectedProduct.id
            };
            updateCartQuantity(variantId, qty, combinedVariantData);
          }}
        />
      )}

    </div>
    
  );
};

export default CashierDashboard;
