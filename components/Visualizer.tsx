// components/Visualizer.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { GraphNode } from "../utils/algorithms/graph.ts";
import * as d3 from "d3";

interface Props {
  data: number[] | GraphNode[];
  algorithmCategory: string;
  steps: any[]; // Array of steps from the algorithm
  currentStep: number;
}

export default function Visualizer({ data, algorithmCategory, steps, currentStep }: Props) {
  // Refs for chart and svg
  const svgRef = useRef<SVGSVGElement | null>(null);
  const searchCanvasRef = useRef<HTMLCanvasElement>(null);
  const sortCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentData, setCurrentData] = useState<number[] | GraphNode[]>(data);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Sorting branch – using Chart.js to render sorting steps
  useEffect(() => {
    if (algorithmCategory === "sorting" && steps.length > 0 && sortCanvasRef.current) {
      const currentStepData = steps[currentStep];
      if (!currentStepData || !currentStepData.state) {
        console.error("Sorting: currentStepData or its state is undefined");
        return;
      }
      // Expecting the state to be an array of numbers
      const chartData = currentStepData.state;
      const labels = chartData.map((_, idx: number) => idx.toString());

      if ((window as any).sortChartInstance) {
        (window as any).sortChartInstance.destroy();
      }

      (window as any).sortChartInstance = new Chart(sortCanvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Sorted Data",
              data: chartData,
              backgroundColor: "rgba(75, 192, 192, 0.4)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          animation: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    }
  }, [steps, currentStep, algorithmCategory]);

  // Existing branches for graph and searching…
  useEffect(() => {
    if (algorithmCategory === "graph" && svgRef.current && steps.length > 0) {
      const currentStepData = steps[currentStep];
      if (!currentStepData || !currentStepData.state) {
        console.error("Graph: currentStepData or its state is undefined");
        return;
      }
      const graphData = currentStepData.state as GraphNode[];
      console.log("Graph data:", graphData);
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 600;
      const height = 400;
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      const validGraphData = graphData.filter((node) => node !== undefined);
      const links = validGraphData.reduce((acc: any, node: GraphNode) => {
        node.neighbors.forEach((neighbor: number) => {
          if (!validGraphData[neighbor]) {
            console.warn(`Neighbor ${neighbor} is not defined for node ${node.value}`);
            return;
          }
          const exists = acc.find(
            (l: any) => l.source === neighbor && l.target === node.value
          );
          if (node.value < neighbor && !exists) {
            acc.push({ source: node.value, target: neighbor });
          }
        });
        return acc;
      }, []);

      console.log("Graph links:", links);

      const simulation = d3.forceSimulation(graphData)
        .force("charge", d3.forceManyBody().strength(-100))
        .force("link", d3.forceLink(links).id((d: any) => d.value).distance(80))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

      const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 2);

      const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graphData)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", (d: GraphNode) => {
          if (currentStepData.current === d.value) return "red";
          if (currentStepData.visited && currentStepData.visited.includes(d.value)) return "green";
          return "blue";
        })
        .call(
          d3.drag<SVGCircleElement, any>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      const text = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graphData)
        .enter().append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text((d: GraphNode) => d.value);

      function ticked() {
        link
          .attr("x1", (d: any) => d.source.x)
          .attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x)
          .attr("y2", (d: any) => d.target.y);

        node
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y);
        text
          .attr("x", (d: any) => d.x)
          .attr("y", (d: any) => d.y);
      }

      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }
  }, [currentStep, steps, algorithmCategory, currentData]);

  useEffect(() => {
    if (algorithmCategory === "searching" && steps.length > 0 && searchCanvasRef.current) {
      const currentStepData = steps[currentStep];
      if (!currentStepData || !currentStepData.state) {
        console.error("Searching: currentStepData or its state is undefined");
        return;
      }
      const rawState = currentStepData.state;
      const chartData =
        typeof rawState[0] === "object" && rawState[0] !== null
          ? rawState.map((item: any) => item.value)
          : rawState;
      const labels = chartData.map((_, idx: number) => idx.toString());

      const backgroundColors = rawState.map((item: any, idx: number) => {
        const mid = currentStepData.mid;
        const foundIndex = currentStepData.foundIndex;
        if (typeof mid === "number" && idx === mid) return "red";
        if (typeof foundIndex === "number" && idx === foundIndex) return "green";
        return "rgba(54, 162, 235, 0.5)";
      });

      if ((window as any).searchChartInstance) {
        (window as any).searchChartInstance.destroy();
      }

      (window as any).searchChartInstance = new Chart(searchCanvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Binary Search State",
              data: chartData,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map((color: string) => color.replace("0.5", "1")),
              borderWidth: 1,
            },
          ],
        },
        options: {
          animation: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    }
  }, [steps, currentStep, algorithmCategory]);

  return (
    <div>
      {algorithmCategory === "graph" && <svg ref={svgRef} />}
      {algorithmCategory === "searching" && <canvas ref={searchCanvasRef} id="searchChart" width={600} height={300}></canvas>}
      {algorithmCategory === "sorting" && <canvas ref={sortCanvasRef} id="sortingChart" width={600} height={300}></canvas>}
    </div>
  );
}