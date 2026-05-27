import PropTypes from "prop-types";
import TopBar from "../components/Header/TopBar";


export default function MainLayout({ children }) {
  return (
    <div>
      <TopBar />

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};