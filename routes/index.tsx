import { Head } from "$fresh/runtime.ts";
import MainContent from "../islands/MainContent.tsx"; 


export default function Home() {

  return (
    <div>
      <Head>
        <title>Algorithm Visualizer</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <main class="p-4">
        <h1 class="text-2xl font-bold mb-4">Algorithm Visualizer</h1>
        <MainContent />
      </main>
    </div>
  );
}