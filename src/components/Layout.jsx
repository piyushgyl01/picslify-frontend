import { Outlet } from "react-router-dom";
import AppBar from "./AppBar";

export default function Layout() {
  return (
    <>
      <AppBar />
      <main className="pt-5">
        <Outlet />
      </main>
    </>
  );
}
