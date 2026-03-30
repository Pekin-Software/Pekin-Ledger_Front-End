import React, { createContext, useContext, useState, useCallback } from "react";

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
    

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [reportOverview, setReportOverview] = useState(null);
  const [profitRevenue, setProfitRevenue] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [bestSellingCategory, setBestSellingCategory] = useState([]);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
        const tenantDomain = localStorage.getItem("tenant");
        const apiBase = `http://${tenantDomain}:8000/api`
        const accesstoken = localStorage.getItem("token");
        const store_id = localStorage.getItem("store_id");
        const baseUrl = `${apiBase}/sales/listsales/`;

        // ✅ Build headers
        const getAuthHeaders = (isJson = true) => ({
            Authorization: `Bearer ${accesstoken}`,
            ...(isJson && { "Content-Type": "application/json" }),
        });
      // ✅ Add store_id if it exists
       let url = baseUrl;

        if (
        store_id &&
        store_id !== "null" &&
        store_id !== "undefined" &&
        store_id !== ""
        ) {
        url = `${baseUrl}?store_id=${store_id}`;
        }

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
          
      // ✅ Store structured data
      setReportOverview(data.report_overview || null);
      setProfitRevenue(data.ProfitRevenue || []);
      setTopSellingProducts(data.top_selling_products || []);
      setBestSellingCategory(data.best_selling_category || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SalesContext.Provider
      value={{
        loading,
        error,
        reportOverview,
        profitRevenue,
        topSellingProducts,
        bestSellingCategory,
        fetchSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => useContext(SalesContext);