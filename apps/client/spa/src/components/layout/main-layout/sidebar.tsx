import "../../../styles/layout/sidebar.css";
import Nav from "./nav";

function Sidebar() {
  return (
    <aside className="sidebar">
      <ProjectInfo />
      <Nav />
    </aside>
  );
}

function ProjectInfo() {
  return (
    <div className="project-info">
      <img src="https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699" />
      <p>Project Name</p>
    </div>
  );
}
export default Sidebar;
