// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if token exists in localStorage (i.e., if the user is logged in)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    // Navigate to login page
    router.push('/login');
    
    // Set logged-in state to false
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link href="/">Home </Link>
          <Link href="/workshop">  Workout Workshop  </Link>
        </li>
        {/* Show logout button only if the user is logged in */}
        {isLoggedIn && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
