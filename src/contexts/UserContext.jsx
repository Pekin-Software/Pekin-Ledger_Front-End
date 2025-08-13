import React, { useState } from "react";
import Cookies from "js-cookie";

export const UserContext = React.createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const role = Cookies.get("role");
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;
    const store_id = Cookies.get("store_id");
    const exchange_rate = Cookies.get("exchange_rate");
    const business_name = Cookies.get("business_name");

    if (role && user && store_id) {
      return { role, user, store_id, exchange_rate, business_name };
    }
    return null;
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}
