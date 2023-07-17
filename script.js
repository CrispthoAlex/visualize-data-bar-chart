/* global d3 */

// eslint-disable-next-line no-unused-vars
const projectName = "bar-chart";

const w = 800,
  h = 400,
  barWidth = w / 275;

var tooltip = d3
  .select(".barvisualGDP")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3
  .select(".barvisualGDP")
  .append("div")
  .attr("class", "overlay")
  .style("opacity", 0);

var svgContainer = d3
  .select(".barvisualGDP")
  .append("svg")
  .attr("width", w + 100)
  .attr("height", h + 60);

const translateFn = (x, y = 0) => {
  return `translate(${x}, ${y})`;
};

// Getting data and sets graphics elements
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((data) => {
    const series = [...data.data];

    // title x
    svgContainer
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -200)
      .attr("y", 80)
      .text("Gross Domestic Product");

    // title y
    svgContainer
      .append("text")
      .attr("x", w / 2 + 120)
      .attr("y", h + 50)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
      .attr("class", "info");

    // years text
    const years = series.map((d) => {
      var quarter;
      var temp = d[0].substring(5, 7);

      switch (temp) {
        case "01":
          quarter = "Q1";
          break;
        case "04":
          quarter = "Q2";
          break;
        case "07":
          quarter = "Q3";
          break;
        case "10":
          quarter = "Q4";
          break;
      }
      return d[0].substring(0, 4) + " " + quarter;
    });

    // years date
    const yearsDate = series.map((d) => {
      return new Date(d[0]);
    });

    const xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);

    const xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, w]);

    // scale set
    const xAxis = d3.axisBottom().scale(xScale);

    svgContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", translateFn(60, 400));

    const GDP = series.map((d) => d[1]);

    var scaleGDP = [];

    var gdpMax = d3.max(GDP);

    var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, h]);

    scaleGDP = GDP.map((value) => linearScale(value));

    var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([h, 0]);
    console.log("yAxisScale", yAxisScale);
    var yAxis = d3.axisLeft(yAxisScale);
    console.log("yAxis", yAxis);

    svgContainer
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", translateFn(60, 0));

    d3.select("svg")
      .selectAll("rect")
      .data(scaleGDP)
      .enter()
      .append("rect")
      .attr("data-date", (d, i) => series[i][0])
      .attr("data-gdp", (d, i) => series[i][1])
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(yearsDate[i]))
      .attr("y", function (d) {
        return h - d;
      })
      .attr("width", barWidth)
      .attr("height", (d) => d)
      .attr("index", (d, i) => i)
      .style("fill", "#33adff")
      .attr("transform", translateFn(60, 0))
      .on("mouseover", function (event, d) {
        // d or datum is the height of the
        // current rect
        var i = this.getAttribute("index");

        overlay
          .transition()
          .duration(0)
          .style("height", d + "px")
          .style("width", barWidth + "px")
          .style("opacity", 0.85)
          .style("left", i * barWidth + 0 + "px")
          .style("top", h - d + "px")
          .style("transform", translateFn("60px"));

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            years[i] +
              "<br>" +
              "$" +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
              " Billion"
          )
          .attr("data-date", series[i][0])
          .style("left", i * barWidth + 30 + "px")
          .style("top", h - 100 + "px")
          .style("transform", translateFn("60px"));
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
        overlay.transition().duration(200).style("opacity", 0);
      });
  })
  .catch((e) => console.log(e));

// ===================================================
/**
const dataset = [
  [34, 78],
  [109, 280],
  [310, 120],
  [79, 411],
  [420, 220],
  [233, 145],
  [333, 96],
  [222, 333],
  [78, 320],
  [21, 123],
];
const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[0])])
  .range([padding, w - padding]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[1])])
  .range([h - padding, padding]);

const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

svg
  .selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d[0]))
  .attr("cy", (d) => yScale(d[1]))
  .attr("r", (d) => 5);

svg
  .selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text((d) => d[0] + "," + d[1])
  .attr("x", (d) => xScale(d[0] + 10))
  .attr("y", (d) => yScale(d[1]));

const xAxis = d3.axisBottom(xScale);
// Add your code below this line
const yAxis = d3.axisLeft(yScale);
// Add your code above this line

svg
  .append("g")
  .attr("transform", "translate(0," + (h - padding) + ")")
  .call(xAxis);

// Add your code below this line
svg
  .append("g")
  .attr("transform", "translate(" + padding + ", 0)")
  .call(yAxis);

// Add your code above this line
 */
