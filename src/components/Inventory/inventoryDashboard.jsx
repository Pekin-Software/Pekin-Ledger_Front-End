import { useState, useRef, useEffect } from "react";
import "./inventoryDashboard.css";
import ProductSection from "./ProductDetails/products.jsx";
import { useApi } from "../../contexts/ApiContext.jsx";
import { useInventory } from "../../contexts/InventoryContext.jsx";
import { AlertCircle } from "lucide-react";

function Card({ title, value, detail, color }) {
    return (
      <div className="inventory-card">
        <h3 style={{ color }}>{title}</h3>
        <p className="value">{value}</p>
        <p className="detail">{detail}</p>
      </div>
    );
  }

export default function InventoryDashboard() {
  const { fetchProducts, products, productsLoading, productsError } = useApi();  
  const { mainInventoryOverview, overviewLoading, overviewError } = useInventory();

    if (overviewLoading) return <p>Loading...</p>;
    // if (overviewError) return <p>Error: </p>;

  // Fallback test products for design/development
  // Simulated loading and error state (since we're not using real API)
  // const productsLoading = false;
  // const productsError = null;
  // const products = [];
  // const fetchProducts = () => {};
  // const mockProducts = [
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //    id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //    {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 2,
  //     product_name: "Allergy Relief",
  //     image: "",
  //     stock_status: "Out of Stock",
  //     quantity: 0,
  //     price: 12.5,
  //   },
  //   {
  //     id: 3,
  //     product_name: "Pain Reliever",
  //     image: "",
  //     stock_status: "Expired",
  //     quantity: 0,
  //     price: 7.75,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  //   {
  //     id: 4,
  //     product_name: "Cough Syrup",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 30,
  //     price: 15.25,
  //   },
  //   {
  //     id: 1,
  //     product_name: "Vitamin C Tablets",
  //     image: "",
  //     stock_status: "In Stock",
  //     quantity: 120,
  //     price: 9.99,
  //   },
  // ];
  // const displayProducts = products && products.length > 0 ? products : mockProducts;

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="inventory-container">
      <section className="overview">
        <h2>Inventory Overview</h2>
        {overviewLoading ? (
          <div className="card-container" role="status" aria-busy="true">
                <Card title="Total Products" value={<span className="skeleton-value skeleton" > 0</span>} detail="All stocked items" color="blue" />
                <Card title="Categories" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Product Group" color="red" />
                <Card title="Top Selling" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Highest sales volume" color="blue" />
                <Card title="In Stock" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Currently available" color="green" />
                <Card title="Out of Stock" value={<span className="skeleton-value skeleton" > 0</span>} detail="Reorder soon" color="orange" />
                <Card title="Low Stock" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Needs restocking" color="red" />
                <Card title="Expiring Soon" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Check expiry dates" color="purple" />
                <Card title="Total Value" value={<span className="skeleton-value skeleton" > 0</span>}  detail="Inventory worth" color="green" />
          </div>
        ) : overviewError ? (
          <div className="card-container">
              <Card title="Total Products" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="All stocked items" color="blue" />
              <Card title="Categories" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Product Group" color="red" />
              <Card title="Top Selling" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Highest sales volume" color="blue" />
              <Card title="In Stock" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Currently available" color="green" />
              <Card title="Out of Stock" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Reorder soon" color="orange" />
              <Card title="Low Stock" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Needs restocking" color="red" />
              <Card title="Expiring Soon" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Check expiry dates" color="purple" />
              <Card title="Total Value" value={<span className="skeleton-value error-text"><AlertCircle size={15} className="error-icon" />An error occurred</span>} detail="Inventory worth" color="green" />
          </div>
        ) : mainInventoryOverview ? (
          <div className="card-container">
              <Card title="Total Products" value={mainInventoryOverview.total_products} detail="All stocked items" color="blue" />
              <Card title="Categories" value={mainInventoryOverview.total_categories} detail="Product Group" color="red" />
              <Card title="Top Selling" value={mainInventoryOverview.top_selling || 0} detail="Highest sales volume" color="blue" />
              <Card title="In Stock" value={mainInventoryOverview.in_stock || 0} detail="Currently available" color="green" />
              <Card title="Out of Stock" value={mainInventoryOverview.out_of_stock || 0} detail="Reorder soon" color="orange" />
              <Card title="Low Stock" value={mainInventoryOverview.low_stock || 0} detail="Needs restocking" color="red" />
              <Card title="Expiring Soon" value={mainInventoryOverview.expiring_soon || 0} detail="Check expiry dates" color="purple" />
              <Card title="Total Value" value={mainInventoryOverview.total_value || 0} detail="Inventory worth" color="green" />
          </div>
        ):null}
      </section>

        <ProductSection
          products={products}
          productsLoading={productsLoading}
          productsError={productsError}
          context="inventory"
        />
      </div>

    );
}
  