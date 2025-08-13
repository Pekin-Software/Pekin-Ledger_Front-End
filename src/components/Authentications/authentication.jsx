import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import "./authentication.css";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import Cookies from "js-cookie";
// Get all countries with names, dialing codes
const countries = getCountries().map((code) => ({
  name: new Intl.DisplayNames(["en"], { type: "region" }).of(code), // Get country name
  dialCode: `+${getCountryCallingCode(code)}`, // Get dialing code
  code,
}));
const back_btn = "/arrow.png";
const logo = "/logo.jpg";

export default function Authentication({ defaultSignIn, setShowAuth }) {
  const [isSignIn, setIsSignIn] = useState(defaultSignIn);
  const navigate = useNavigate();
  return (
    <div className="auth-container">
      <div className="logo-container">
        <button className="close-btn" onClick={() => { navigate('/');  }}><img src={back_btn} alt="Back"/></button>
        <div className="logo"><img src={logo} alt="Logo"/></div>
      </div>
      
      <div className="form-container">
      {isSignIn ? (
          <SignInForm setIsSignIn={setIsSignIn} navigate={navigate} />
        ) : (
          <SignUpForm setIsSignIn={setIsSignIn} navigate={navigate} />
        )}
       
      </div>
    </div>
  );
}

function SignInForm({ navigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserData } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      // const response = await fetch("http://client1.localhost:8000/api/auth/login/", {
      const response = await fetch("https://pekingledger.store/api/auth/login/", {
      
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: 'include',  // Include cookies with the request
      });
  if (!response.ok) {
        throw new Error("Login failed: " + response.statusText);
      }
      else
        console.log("Login Successful")
  
      const data = await response.json();
      const { role, user, tenant_domain, access_token, store_id, exchange_rate, business_name} = data;

      if (!role || !user) {
        throw new Error("Invalid login response: Missing role, or user data");
      }
  
      // // Optionally store non-sensitive data (like role, tenant, or user info)
      // Cookies.set("access_token", data.access_token, { path: "/" });
      // Cookies.set("refresh_token", data.refresh_token, { path: "/" });
      Cookies.set("role", role, { path: "/" });
      Cookies.set("user", JSON.stringify(user), { path: "/" });  
      Cookies.set("store_id", store_id, { path: "/" });
      Cookies.set("exchange_rate", exchange_rate, { path: "/" });
      Cookies.set("business_name", business_name, { path: "/" });
      Cookies.set("tenant", tenant_domain, { path: "/" });

      setUserData({ role, user, store_id, exchange_rate, business_name });
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
      console.error("Login failed", error);
    }
  
  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent form submission behavior
    navigate("/signup"); // Navigate to the signup page
  };
  };
  
  return (
    <form className="auth-form" >
      <h2 className="form-title">Login to your account</h2>
      <p className="welcome-txt">Welcome! Please enter your details</p>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        value={username} // Bind value to the username state
        onChange={(e) => setUsername(e.target.value)} // Update the state on change
        placeholder="Enter your username"
        className="auth-input"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="auth-input"
      />
      <a href="" className="forget-pwd">
        Forget password
      </a>
      <button className="submit-button" type="submit" onClick={handleLogin}>
        Sign In
      </button>

      <p className="signup-txt">
        Don't have an account?
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </p>
    </form>

  );
}

export function SignUpForm({ 
  navigate,
  title = "Create an account",
  subtitle = "Start your 30-day free trial.",
  usePositionInsteadOfBusinessName = false,
  defaultPosition = "Admin",
  apiEndpoint = "https://pekingledger.store/api/create/",
  onSuccess,
  showLoginLink = true,
  submitButtonText = "Sign Up",
  onSubmit, 
}) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone1: "",
    phone2: "",
    address: "",
    city: "",
    country: "Liberia",
    date_of_birth: "",
    nationality: "",
    position: defaultPosition,
    business_name: "",
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };


    const [selectedCountry, setSelectedCountry] = useState("Liberia");
    const [selectedDialCode, setSelectedDialCode] = useState("+231");

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name === countryName);
    if (country) {
      setSelectedCountry(country.name);
      setSelectedDialCode(country.dialCode);
    }
  };
  
  
  // const handleSubmit = async (e) => {
  // e.preventDefault();
  // const payload = {
  //   ...formData,
  //   phone1: selectedDialCode + formData.phone1,
  //   phone2: formData.phone2 || "",
  //   country: selectedCountry,
  //   photo: null,
  // };

  // try {
  //   // 1. Send signup request
  //   const response = await fetch("https://pekingledger.store/api/create/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     console.error("Signup failed:", errorData);
  //     return;
  //   }

  //   // 2. If successful, auto-login
  //   const loginResponse = await fetch("https://pekingledger.store/api/auth/login/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: 'include',
  //     body: JSON.stringify({
  //       username: formData.username,
  //       password: formData.password,
  //     }),
  //   });

  //   if (!loginResponse.ok) {
  //     const loginError = await loginResponse.json();
  //     console.error("Auto-login failed:", loginError);
  //     return;
  //   }

  //   const loginData = await loginResponse.json();
  //   const { role, tenant_domain, user, access_token } = loginData;

  //   Cookies.set("role", role, { path: "/" });
  //   Cookies.set("tenant", tenant_domain.split('.')[0], { path: "/" });
  //   Cookies.set("user", user, { path: "/" });
  //   Cookies.set("access_token", access_token, { path: "/" });

  //   navigate(`/${role.toLowerCase()}`);
  // } catch (error) {
  //   console.error("Error during signup/login:", error);
  // }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      phone1: selectedDialCode + formData.phone1,
      phone2: formData.phone2 || "",
      country: selectedCountry,
      photo: null,
    };

    if (usePositionInsteadOfBusinessName) {
      delete payload.business_name;
    } else {
      delete payload.position;
    }

    if (onSubmit) {
      // If custom onSubmit passed, call it with payload
      onSubmit(payload);
      return;
    }
    try {
    // 1. Send signup request
      const response = await fetch("https://pekingledger.store/api/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
      const errorData = await response.json();
      console.error("Signup failed:", errorData);
      return;
    }

    // 2. If successful, auto-login
    const loginResponse = await fetch("https://pekingledger.store/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    if (!loginResponse.ok) {
      const loginError = await loginResponse.json();
      console.error("Auto-login failed:", loginError);
      return;
    }

    const loginData = await loginResponse.json();
    const { role, tenant_domain, user, access_token } = loginData;

    Cookies.set("role", role, { path: "/" });
    Cookies.set("tenant", tenant_domain.split('.')[0], { path: "/" });
    Cookies.set("user", user, { path: "/" });
    Cookies.set("access_token", access_token, { path: "/" });

    navigate(`/${role.toLowerCase()}`);
    } catch (error) {
      console.error("Error during signup/login:", error);
    }
    };

    return (
      <form className="auth-form sign-up-form" onSubmit={handleSubmit}>
        {/* <h2 className="form-title">Create an account</h2>
        <p className="welcome-txt">Start your 30-day free trial.</p>
        <label htmlFor="business-name">Business Name</label>
        <input type="text"  name="business_name" placeholder="Enter your Business Name" className="auth-input" onChange={handleInputChange}  /> */}
        {title && <h2 className="form-title">{title}</h2>}
        {subtitle && <p className="welcome-txt">{subtitle}</p>}

        {usePositionInsteadOfBusinessName ? (
          <>
            <label htmlFor="position">Position</label>
            <select
              name="position"
              className="auth-input position-dropdown"
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
              className="auth-input"
              value={formData.business_name || ""}
              onChange={handleInputChange}
            />
          </>
        )}


        <div></div>
  
        <div className="row-input">
          <div>
            <label htmlFor="first-name">First Name</label>
            <input type="text"  name="first_name" placeholder="Enter your First Name" className="auth-input"  onChange={handleInputChange} />
          </div>
          <div >
          <label htmlFor="middle-name">Middle Name</label>
          <input type="text"  name="middle_name" placeholder="Enter your Middle Name" className="auth-input" onChange={handleInputChange}  />
          </div>
          <div>
          <label htmlFor="last-name">Last Name</label>
          <input type="text"  name="last_name" placeholder="Enter your Last Name" className="auth-input" onChange={handleInputChange}  />
          </div>
        </div>
  
        <div className="row-input">
          <div >
            <label htmlFor="dob">Date of Birth</label>
            <input type="date"name="date_of_birth" className="auth-input" onChange={handleInputChange} />
          </div>
  
          <div>
            <label htmlFor="country">Country</label>
            <select className="countries" value={selectedCountry} onChange={handleCountryChange}>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="nationality">Nationality</label>
            <input type="text" name="nationality" placeholder="Enter your nationality" className="auth-input" onChange={handleInputChange} />
          </div>
        </div>
  
        <div className="row-input">
          <div>
            <label htmlFor="address">Address</label>
            <input type="text" name="address" placeholder="Enter your address" className="auth-input" onChange={handleInputChange}  />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input type="text"  name="city" placeholder="Enter your city" className="auth-input" onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="mobile-number">Mobile Number</label>
            <section className="mobile-input">
              <select className="input-list" value={selectedDialCode} onChange={(e) => setSelectedDialCode(e.target.value)}>
                {countries.map((country) => (
                  <option key={`${country.dialCode}-${country.code}`} value={country.dialCode}>
                    {country.dialCode}
                  </option>
                ))}
              </select>
              <input type="text" name="phone1"placeholder="775-123-456" className="phone-num"  onChange={handleInputChange} />
            </section>
          </div>
        </div>
  
        <div></div>
        <div className="row-input">
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Enter your email" className="auth-input" onChange={handleInputChange} />
        
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" placeholder="Enter your username" className="auth-input" onChange={handleInputChange}  />
          </div>
          
          <div> 
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Enter your password" className="auth-input" onChange={handleInputChange} />
          </div>
        </div>
  
        
        <button className="submit-button">{submitButtonText} </button>

        {showLoginLink && (
          <p className="signup-txt">
            Already have an account?
            <button onClick={() => navigate('/login')}>Login</button>
          </p>
        )}
      </form>
    );
}
