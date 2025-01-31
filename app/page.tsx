import Image from "next/image";

export default function Nav() {
  return (
    <div className="topbar">
    <div className="contact-links">
      <span>📞628-6349 </span>
      <span>✉️ info@cakebakery.com</span>
      <span><a href="#">Facebook</a> </span>
      <span><a href="#">Instagram</a> </span>
    </div>

    <div className="logo-container">
        <Image
          src="https://c8.alamy.com/comp/2R49607/cakes-shop-vector-template-logo-2R49607.jpg"
          alt="LoveCreamCravings Logo"
          className="logo"
          width={50} /* Adjusted size for better alignment */
          height={50}
        />
        <h1>LoveCreamCravings</h1>
      </div>

      <nav id="topbar">
        <ul>
          <li><a href="./index.html">Home</a></li>
          <li><a href="./desserts.html">Desserts</a></li>
          <li><a href="./drinks.html">Drinks</a></li>
          <li><a href="./search.html">Search</a></li>
          <li><a href="./about.html">About</a></li>
        </ul>
      </nav>
    
  </div>
  );
}
