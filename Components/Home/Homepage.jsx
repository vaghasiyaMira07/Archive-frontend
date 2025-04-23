import { useRouter } from "next/router";

const Homepage = () => {
  const router = useRouter();

  return (
    <>

      <div className="homepage">
        <nav className="HomepageNav">
          <div className="HomepageNav-logo">
            <img
              src="/image/homepage/logo2.png"
              alt=""
              className="HomepageNav-logo-img"
            />
          </div>{" "}
          <div className="HomepageNav-item">
            <a href="https://rejoicehub.com/" className="navlink">
              <div className="HomepageNav-item-name"> ABOUT </div>{" "}
            </a>{" "}
            <div className="HomepageNav-item-name HomepageNav-item-name-btncss" onClick={()=>router.push('./signin')}> SIGN IN </div>
          </div>{" "}
        </nav>
        <div className="Homediv container-fluid">
          <div className="Homediv-text">
            <p>
              {" "}
              “Your time is limited, so don’ t waste it living someone else’ s
              life.”{" "}
            </p>{" "}
          </div>{" "}
          <div className="Homediv-img">
            <img
              src="/image/homepage/homeimage.svg"
              alt=""
              className="Homediv-img-imglogo"
            />
          </div>{" "}
        </div>
        <div className="companylogo">
          <img src="/image/homepage/company.svg" alt="" />
        </div>{" "}
      </div>{" "}
    </>
  );
};

export default Homepage;
