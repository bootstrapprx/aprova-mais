import { ThemeToggle } from "./theme-toggle";
import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[50px] w-full items-center justify-between border-b bg-green-500 px-4 lg:hidden">
      <MobileSidebar />
      <ThemeToggle className="text-white" />
    </nav>
  );
};
