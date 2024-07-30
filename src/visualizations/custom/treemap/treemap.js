looker.plugins.visualizations.add({
  options: {
    color_scale: {
      type: "string",
      label: "Color Scale",
      values: [
        {"Viridis": "interpolateViridis"},
        {"Inferno": "interpolateInferno"},
        {"Magma": "interpolateMagma"},
        {"Plasma": "interpolatePlasma"}
      ],
      display: "radio",
      default: "interpolateViridis"
    }
  },
  create: function(element, config) {
    var css = element.innerHTML = `
      <style>
        .treemap-vis {
          width: 100%;
          height: 100%;
        }
        .node {
          border: solid 1px white;
          font: 10px Helvetica, Arial, sans-serif;
          line-height: 12px;
          overflow: hidden;
          position: absolute;
          text-align: center;
        }
        .node-label {
          padding: 2px;
        }
      </style>
    `;

    var container = element.appendChild(document.createElement("div"));
    container.className = "treemap-vis";

    this._containerElement = container;
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();

    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({title: "No Dimensions", message: "This chart requires dimensions."});
      return;
    }

    // Clear previous content
    while (this._containerElement.firstChild) {
      this._containerElement.removeChild(this._containerElement.firstChild);
    }

    // Prepare the data for D3 treemap
    var root = d3.hierarchy({values: data}, function(d) { return d; })
      .sum(function(d) { return d[queryResponse.fields.measures[0].name].value; });

    var width = element.clientWidth;
    var height = element.clientHeight;

    var treemapLayout = d3.treemap()
      .size([width, height])
      .padding(1)
      .round(true);

    treemapLayout(root);

    var colorScale = d3[config.color_scale];

    var nodes = d3.select(this._containerElement)
      .selectAll(".node")
      .data(root.leaves())
      .enter()
      .append("div")
      .attr("class", "node")
      .style("left", function(d) { return d.x0 + "px"; })
      .style("top", function(d) { return d.y0 + "px"; })
      .style("width", function(d) { return d.x1 - d.x0 + "px"; })
      .style("height", function(d) { return d.y1 - d.y0 + "px"; })
      .style("background", function(d) { return colorScale(d.value / root.value); });

    nodes.append("div")
      .attr("class", "node-label")
      .text(function(d) { return d.data[queryResponse.fields.dimensions[0].name].value; });

    done();
  }
});
