import { Component } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default class HeaderComponenet extends Component {
  private navLink = [
    { name: "Home", route: "/" },
    {name: "Network", route: "/network"},
    { name: "Message", route: "/message" },
    { name: "Notification", route: "/notification" },
    { name: "Profile", route: "/profile" },
  ];

  private name = "Facebook";

  render() {
    return (
      <div className="w-full h-20 z-20 flex fixed justify-between bg-blue-200 top-0 left-0">
        <div className="w-2/6 flex justify-center items-center">
          <h1 className="text-3xl pr-5! pl-20! not-md:text-2xl font-bold text-blue-800">
            {this.name}
          </h1>
          <div className="w-full">
            <input type="search" name="search" id="search" placeholder="Find here..."  className="rounded-full! flex-1 flex text-base pl-5! bg-white!"/>
          </div>
        </div>
        <div className="flex w-2/4 not-md:w-2/3 items-center">
          <ul className="w-full flex gap-15 uppercase font-semibold text-balance pr-20! not-md:text-[14px] justify-end">
            {this.navLink.map((item, index) => (
              <li key={index} className="hover:text-blue-500">
                <Link to={item.route} className="focus:text-white">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
