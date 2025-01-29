import Image from "next/image";

export default function Nav() {
  return (
    <div>
    <div className="contact-links">
      <span>📞628-6349 </span>
      <span>✉️ info@cakebakery.com</span>
      <span><a href="#">Facebook</a> </span>
      <span><a href="#">Instagram</a> </span>
    </div>

    
      <Image
        src="/favicon_io/favicon-16x16.png"
        alt="LoveCreamCravings Logo"
        className="logo"
        width={16}
        height={16}
      />
      <h1>LoveCreamCravings</h1>

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
