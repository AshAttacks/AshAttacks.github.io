function modularAddD3VisToPage(elementID){
    //PRE: Pass the string of the ID we want to append the new D3 Vis to
    //POST: Updated the web page to include the D3 vis as a child of the element whose ID we pass

    const width = 640, height = 380;
    const margin = {top: 20, right: 20, bottom: 55, left: 60};

    d3.csv("data.csv").then(function(data){

        data.forEach(d => d.Hours = +d.Hours);

        const svg = d3.select("#" + elementID)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("class", "chart");

        const x = d3.scaleBand()
            .domain(data.map(d => d.Week))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Hours)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", (margin.left + width - margin.right) / 2)
            .attr("y", height - 12)
            .attr("text-anchor", "middle")
            .text("Week");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(margin.top + height - margin.bottom) / 2)
            .attr("y", 18)
            .attr("text-anchor", "middle")
            .text("Hours flown");

        const tooltip = d3.select("body").append("div").attr("class", "tooltip");

        svg.selectAll("rect")
            .data(data)
            .join("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.Week))
                .attr("y", d => y(d.Hours))
                .attr("width", x.bandwidth())
                .attr("height", d => y(0) - y(d.Hours))
            .on("mouseover", function(event, d){
                tooltip.style("opacity", 1).text(`Week ${d.Week}: ${d.Hours} hours`);
            })
            .on("mousemove", function(event){
                tooltip.style("left", (event.pageX + 12) + "px")
                       .style("top",  (event.pageY - 28) + "px");
            })
            .on("mouseout", function(){
                tooltip.style("opacity", 0);
            });
    });
}
