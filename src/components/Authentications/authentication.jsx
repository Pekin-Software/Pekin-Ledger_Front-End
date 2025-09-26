import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./authentication.css";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import Cookies from "js-cookie";

// Get all countries with names, dialing codes
const countries = getCountries().map((code) => ({
  name: new Intl.DisplayNames(["en"], { type: "region" }).of(code), // Get country name
  dialCode: `+${getCountryCallingCode(code)}`, // Get dialing code
  code,
}));
const logo = "/LedgerLogo.png";


export default function Authentication({ defaultSignIn }) {
  const [isSignIn, setIsSignIn] = useState(defaultSignIn);
  const navigate = useNavigate();
  return (
      <div className={`auth-container ${isSignIn ? "login-mode" : "signup-mode"}`}>
      <div className="logo-container">
        <div className="logo"><img src={logo} alt="Logo"/></div>
      </div>
      
      <div className="frm-container">
    {isSignIn ? (
          <SignInForm setIsSignIn={setIsSignIn} navigate={navigate} />
        ) : (
          <SignUpForm setIsSignIn={setIsSignIn} navigate={navigate} />
        )}
      </div>
    </div>
   
  );
}

function SignInForm({ navigate, setIsSignIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    const newErrors = {
      username: username.trim() === "",
      password: password.trim() === "",
    };
    setErrors(newErrors);

    // Stop if there are validation errors
    if (newErrors.username || newErrors.password) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://client1.localhost:8000/api/auth/login/", {
      // const response = await fetch("https://api.pekinledger.com/api/auth/login/", {
      
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: 'include',  // Include cookies with the request
      });
      
      if (!response.ok) {
            setErrorMessage("Invalid Username or Password");
            setLoading(false);
          }
      else
        console.log("Login Successful")

      const data = await response.json();
      const { role, user, tenant_domain, store_id,access_token, exchange_rate, business_name} = data;

      Cookies.set("role", role, { path: "/" });
      localStorage.setItem("user", JSON.stringify(user));  
      localStorage.setItem("store_id", store_id);
      localStorage.setItem("exchange_rate", exchange_rate);
      localStorage.setItem("business_name", business_name);
      localStorage.setItem("tenant", tenant_domain);
      localStorage.setItem("token", access_token);

       if (role === "Cashier") {
        navigate("/point-of-sale");
      } else if (role === "Manager") {
        navigate("/store-inventory");
      } else if (role === "Admin") {
        navigate("/general-inventory");
      } else {
        navigate("/")
      }
    } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false); 
    }
  };

  return (
     <form className="login-frm " onSubmit={handleLogin}>
      <h2 className="form-title">Login</h2>

       <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, username: false }));
            setErrorMessage("");
          }}
          placeholder="Enter your username"
          className={`auth-input ${errors.username ? "border-red-500" : ""}`}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: false }));
            setErrorMessage("");
          }}
          placeholder="Enter your password"
          className={`auth-input ${errors.password ? "border-red-500" : ""}`}
          disabled={loading}
        />
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      </div>

      

      <button className="sign-in-btn" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="signup-txt">
        <a href="" className="forget-pwd">
          Forget password
        </a>
       <span>
         Don't have an account?
        <button type="button" onClick={() => setIsSignIn(false)} disabled={loading}>
          Sign Up
        </button>
       </span>
      </p>
    </form>
  );
}

export function SignUpForm({ 
  navigate,
  setIsSignIn,
  title = "Create an account",
  usePositionInsteadOfBusinessName = false,
  defaultPosition = "Admin",
  // apiEndpoint = "http://client1.localhost:8000/api/create/",
  apiEndpoint = "https://api.pekinledger.com/api/create/",
  showLoginLink = true,
  submitButtonText = "Sign Up",
  onSubmit, 
}) {

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    full_name: "",
    phone1: "",
    address: "",
    city: "",
    country: "Liberia",
    position: defaultPosition,
    business_name: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const countryDropdownRef = useRef(null);
  const dialCodeDropdownRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState("Liberia");
  const [selectedDialCode, setSelectedDialCode] = useState("+231");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: false }));
    setErrorMessages([]);
  };

  useEffect(() => {
  function handleClickOutside(event) {
    // Close country dropdown if click is outside
    if (
      countryDropdownRef.current &&
      !countryDropdownRef.current.contains(event.target)
    ) {
      setShowCountryDropdown(false);
    }

    // Close dial code dropdown if click is outside
    if (
      dialCodeDropdownRef.current &&
      !dialCodeDropdownRef.current.contains(event.target)
    ) {
      setShowDialCodeDropdown(false);
    }
    }

  document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- VALIDATION ---
  const validateForm = () => {
  const newErrors = {};
  const messages = [];

  // Business Name
  if (!usePositionInsteadOfBusinessName && formData.business_name.trim()) {
    if (/[^a-zA-Z0-9 ]/.test(formData.business_name)) {
      newErrors.business_name = true;
      messages.push("Business Name cannot contain special characters.");
    }
  } else if (!usePositionInsteadOfBusinessName) {
    newErrors.business_name = true; // mark red border
  }

  // Names
  if (formData.full_name.trim() && /[^a-zA-Z\s'-]/.test(formData.full_name)) {
      newErrors.full_name = true;
      messages.push("Your name can only contain letters, spaces, hyphens, or apostrophes.");
    } else if (!formData.full_name.trim()) {
      newErrors.full_name = true; // mark red border
    }

  // Address and City
  if (formData.address.trim() && /[^a-zA-Z0-9 ,.-]/.test(formData.address)) {
    newErrors.address = true;
    messages.push("Address contains invalid characters.");
  } else if (!formData.address.trim()) {
    newErrors.address = true;
  }

  if (formData.city.trim() && /[^a-zA-Z\s]/.test(formData.city)) {
    newErrors.city = true;
    messages.push("Invalid City Name");
  } else if (!formData.city.trim()) {
    newErrors.city = true;
  }

  // Phone number
  if (formData.phone1.trim() && !/^[1-9][0-9]{8}$/.test(formData.phone1)) {
    newErrors.phone1 = true;
    messages.push("Phone number must be 9 digits and cannot start with 0.");
  } else if (!formData.phone1.trim()) {
    newErrors.phone1 = true;
  }

  // Email
  if (formData.email.trim() && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    newErrors.email = true;
    messages.push("Email is invalid.");
  } else if (!formData.email.trim()) {
    newErrors.email = true;
  }

  // Username
  if (formData.username.trim() && !/^[a-z]{6,10}$/.test(formData.username)) {
    newErrors.username = true;
    messages.push("Username must be 6-10 lowercase letters.");
  } else if (!formData.username.trim()) {
    newErrors.username = true;
  }

  // Password
  if (formData.password.trim() && !/^[A-Za-z0-9!@#$%^&*]{4,8}$/.test(formData.password)) {
    newErrors.password = true;
    messages.push("Password must be 4-8 characters with letters/numbers.");
  } else if (!formData.password.trim()) {
    newErrors.password = true;
  }

  setErrors(newErrors);
  setErrorMessages(messages);

  return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    if (!validateForm()) {
      setLoading(false); 
      return;
    }

    const payload = {
      ...formData,
      phone1: selectedDialCode + formData.phone1,
      phone2: formData.phone2 || "",
      country: selectedCountry,
      photo: null,
    };

    if (formData.business_name.trim()) {
    // Business name is provided → use default position
      payload.position = defaultPosition;
    } else if (formData.position && formData.position !== defaultPosition) {
      // Custom position is provided → remove business_name
      delete payload.business_name;
      payload.position = formData.position;
    }

    // console.log("Submitting payload:", payload);
    
    if (onSubmit) {
          onSubmit(payload);
          return;
        }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessages([errorData.message || "Signup failed"]);
        setLoading(false);
        return;
      }

      // const loginResponse = await fetch("http://client1.localhost:8000/api/auth/login/", {
      const loginResponse = await fetch("https://api.pekinledger.com/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        const loginError = await loginResponse.json();
        setErrorMessages([loginError.message]);
        setLoading(false);
        return;
      }

      const loginData = await loginResponse.json();
      const { role, user, tenant_domain, store_id,access_token, exchange_rate, business_name} = loginData;

      Cookies.set("role", role, { path: "/" });
      localStorage.setItem("user", JSON.stringify(user));  
      localStorage.setItem("store_id", store_id);
      localStorage.setItem("exchange_rate", exchange_rate);
      localStorage.setItem("business_name", business_name);
      localStorage.setItem("tenant", tenant_domain);
      localStorage.setItem("token", access_token);

      navigate(`/${role.toLowerCase()}`);
    } catch (err) {
      setErrorMessages(["An unexpected error occurred. Please try again."]);
    }  finally {
      setLoading(false);
    }

  };

  return (
    <form className="sign-up-frm" onSubmit={handleSubmit}>
      {title && <h2 className="form-title">{title}</h2>}

      {usePositionInsteadOfBusinessName ? (
        <>
          <label htmlFor="position">Position</label>
          <select
            name="position"
            className={`auth-input position-dropdown ${errors.position ? "border-red-500" : ""}`}
            value={formData.position || ""}
            onChange={handleInputChange}
          >
            <option value="">Select Position</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
          </select>
        </>
      ) : (
        <>
          <label htmlFor="business_name">Business Name</label>
          <input
            type="text"
            name="business_name"
            placeholder="Enter your Business Name"
            className={`auth-input ${errors.business_name ? "border-red-500" : ""}`}
            value={formData.business_name || ""}
            onChange={handleInputChange}
          />
        </>
      )}
     
      <div className="busi-info">
        <label htmlFor="admin-name">Admin Full Name</label>
        <input type="text" name="full_name" placeholder="Enter your Full Name" className={`auth-input ${errors.full_name ? "border-red-500" : ""}`} onChange={handleInputChange} />
      </div>
  
      <div className="busi-info">
          <label htmlFor="address">Business Address</label>
          <input type="text" name="address" placeholder="Enter your address"  className={`auth-input ${errors.address ? "border-red-500" : ""}`} onChange={handleInputChange}  />
      </div>

      <div className="row-input">
          <div className="field-holder">
            <label htmlFor="city">City</label>
            <input type="text"  name="city" placeholder="Enter your city"  className={`auth-input ${errors.city ? "border-red-500" : ""}`} onChange={handleInputChange} />
          </div>

        {/* Country Dropdown */}
    
        <div className="field-holder country-dropdown-wrapper">
          <label htmlFor="country">Country</label>

          <div className="custom-dropdown" ref={countryDropdownRef}>
            <div
              className="dropdown-trigger"
              onClick={() => setShowCountryDropdown((prev) => !prev)}
            >
              {selectedCountry} <span className="caret">▼</span>
            </div>

            {showCountryDropdown && (
              <ul className="dropdown-list">
                {countries.map((country) => (
                  <li
                    key={country.code}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedCountry(country.name);
                      setSelectedDialCode(country.dialCode);
                      setErrors((prev) => ({ ...prev, country: false }));
                      setErrorMessages([]);
                      setShowCountryDropdown(false);
                    }}
                  >
                    {country.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
      </div>

      <div className="row-input">
        <div className="field-holder">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Enter your email" className={`auth-input ${errors.email ? "border-red-500" : ""}`} onChange={handleInputChange} />
        </div>

        <div className="field-holder country-dropdown-wrapper">
          <label htmlFor="mobile-number">Mobile Number</label>

          <div className="custom-dropdown" ref={dialCodeDropdownRef}>
            {/* Trigger shows only the selected dial code */}
           <span className="contact">
             <div
              className="dropdown-trigger mobile-input"
              onClick={() => setShowDialCodeDropdown((prev) => !prev)}
            >
              {selectedDialCode} <span className="caret">▼</span>
            </div>

            {/* Phone number input */}
            <input
              type="text"
              name="phone1"
              placeholder="775-123-456"
              className={`phone-num ${errors.phone1 ? "border-red-500" : ""}`}
              onChange={handleInputChange}
            />
           </span>

            {/* Dropdown with only dial codes */}
            {showDialCodeDropdown && (
              <ul className="ph-list dropdown-list">
                {countries.map((country) => (
                  <li
                    key={country.code}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedDialCode(country.dialCode);
                      setSelectedCountry(country.name); // keep internal state for validation if needed
                      setErrors((prev) => ({ ...prev, country: false }));
                      setErrorMessages([]);
                      setShowDialCodeDropdown(false);
                    }}
                  >
                    {country.dialCode}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      <div className="row-input">
        <div className="field-holder">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" placeholder="Enter your username" className={`auth-input ${errors.username ? "border-red-500" : ""}`} onChange={handleInputChange}  />
        </div>
      
        <div className="field-holder"> 
          <label htmlFor="password">Password</label>
          <input type="password" name="password" placeholder="Enter your password" className={`auth-input ${errors.password ? "border-red-500" : ""}`} onChange={handleInputChange} />
        </div>
      </div>

       <button className="sign-in-btn" disabled={loading}>
        {loading ? "Signing up..." : submitButtonText}
      </button>

      {showLoginLink && (
        <p className="signup-txt">
          <span>
            Already have an account?
          <button type="button" onClick={() => setIsSignIn(true)} disabled={loading}>
            Login
          </button>
          </span>
        </p>
      )}


      {/* Display all validation errors at the top */}
      {errorMessages.length > 0 && (
        <div className="error-box">
          {errorMessages.map((msg, idx) => (
            <p key={idx} className="text-red-600">{msg}</p>
          ))}
        </div>
      )}
    </form>
  );
}




