// components/Visualizer.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { Chart, registerables, ChartConfiguration } from "chart.js";
Chart.register(...registerables);
import { GraphNode } from "../utils/algorithms/graph.ts";
import * as d3 from 'd3';


interface Props {
  data: number[] | GraphNode[];
  algorithmCategory: string;
  steps: any[]; // Array of steps from the algorithm
  currentStep: number;
}

export default function Visualizer({ data, algorithmCategory, steps, currentStep }: Props) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
    const [currentData, setCurrentData] = useState<number[] | GraphNode[]>(data)
  const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        setCurrentData(data)
    }, [data])

  useEffect(() => {
    if (chartRef.current && steps.length > 0) {
        const ctx = chartRef.current.getContext("2d");
        if(!ctx){
            return
        }

        const currentStepData = steps[currentStep];
        let chartData: any = [];
        let labels: any = [];

      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous chart instance
      }

      if (algorithmCategory === "sorting") {
           chartData = currentStepData.state;
           labels = currentStepData.state.map((_: any, index: number) => index);
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Current State',
              data: chartData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            animation: false, // Disable built-in Chart.js animation
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
        chartInstance.current = myChart;
      }
      else if (algorithmCategory === "searching") {
        chartData = currentStepData.state;
        labels = currentStepData.state.map((_: any, index: number) => index);
        const backgroundColors = currentStepData.state.map((_:any, index:number) => {
            if(currentStepData.foundIndex === index){
                return 'rgba(0, 255, 0, 0.5)'; // Highlight found index
            }
            else if (index === currentStepData.mid) {
                return 'rgba(255, 0, 0, 0.5)'; // Highlight mid
            }
            return 'rgba(54, 162, 235, 0.5)';
        })
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Current State',
                data: chartData,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map((color:string) => color.replace('0.5', '1')), // Make border solid
                borderWidth: 1
              }]
            },
            options: {
              animation: false, // Disable built-in Chart.js animation
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
          chartInstance.current = myChart;

      }
    }
  }, [currentStep, steps, algorithmCategory, currentData]); // Depend on currentStep and steps

  useEffect(() => {
    if (algorithmCategory === "graph" && svgRef.current && steps.length > 0) {
      const currentStepData = steps[currentStep];
      const graphData = currentStepData.state as GraphNode[];

      // Clear previous SVG content
      d3.select(svgRef.current).selectAll("*").remove();

      const width = 600;
      const height = 400;
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      // Create links (lines)
      const links = graphData.reduce((acc:any, node:any) => {
        node.neighbors.forEach((neighbor:any) => {
                // Ensure that edges are not duplicated
                const hasReverseEdge = acc.some((link:any) => link.source === neighbor && link.target === node.value);
          if (node.value < neighbor && !hasReverseEdge) { // Only add if source < target

            acc.push({ source: node.value, target: neighbor });
          }
        });
        return acc;
      }, []);

      const simulation = d3.forceSimulation(graphData as any)
            .force("charge", d3.forceManyBody().strength(-100))
            .force("link", d3.forceLink(links).id((d: any) => d.value).distance(80)) // Use .id()
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
            .attr("fill", (d: any) => currentStepData.current === d.value ? "red" : (currentStepData.visited.includes(d.value) ? "green" : "blue"))
            .call(d3.drag<SVGCircleElement, any>()  // Specify types for drag
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        const text = svg.append("g")
          .attr("class", "labels")
          .selectAll("text")
          .data(graphData)
          .enter().append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text((d: any) => d.value);


        function ticked() {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
            text.attr("x", (d:any) => d.x)
            .attr("y", (d:any) => d.y);
        }
        function dragstarted(event:any, d:any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event:any, d:any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event:any, d:any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
}, [currentStep, steps,algorithmCategory, currentData]);



  return (
    <div>
       {algorithmCategory === "graph" ? (
        <svg ref={svgRef} />
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
}