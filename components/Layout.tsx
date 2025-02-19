// components/Layout.tsx
import { h, FunctionComponent } from "preact";

interface LayoutProps {
  children: preact.ComponentChildren;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div class="flex flex-col min-h-screen">
      <header class="bg-gray-800 text-white p-4">
        <div class="container mx-auto">
          <h1 class="text-lg font-semibold">Algorithm Visualizer</h1>
        </div>
      </header>
      <main class="container mx-auto flex-grow p-4">
        {children}
      </main>
      <footer class="bg-gray-200 text-center p-4">
        © {new Date().getFullYear()} Algorithm Visualizer
      </footer>
    </div>
  );
};

export default Layout;