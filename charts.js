function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// Bar, Bubble, and Gauge charts

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.    
    var selectedArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var selected = selectedArray[0];

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var selected = selectedArray[0];

    // Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = Object.values(selected.otu_ids);
    var otuLabels = Object.values(selected.otu_labels);
    var sampleValues = Object.values(selected.sample_values);


    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    var slicedValues = sampleValues.sort((a, b) => b - a).slice(0,10);

    var slicedIds = otuIds.slice(0,10).reverse();
    var yticks = [];
    for (var i = 0; i < slicedIds.length; i++) {
      yticks.push("OTU " + slicedIds[i])
      };

    console.log(slicedIds.length);

    /* var trace = {
      x: slicedValues.reverse(),
      y: yticks,
      type: "horizontalBar"
    };
 */
    // var barData = [trace];
   
    var barData = [{
      x: slicedValues.reverse(),
      y: yticks,
      type: "bar",
      orientation: 'h',
    }]

    var barLayout = {
      width: 360,
      height: 360,
      
      title: "Top 10 Bacteria Cultures Found"     
    };

    Plotly.newPlot("bar", barData, barLayout);


    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var traceBubble = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues
      },
      hovertemplate:
        "(%{x}, " + "%{y})<br>" + 
        otuLabels
    };

    var bubbleData = [traceBubble];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      height: 400,
      margin: {t: -10},
      hovermode: "closest",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // Deliverable 3
    // 3. Create a variable that holds the washing frequency.
    var washfreq = parseInt(result.wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0,1], y: [0,1]},
        value: washfreq,
        title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color:"red"},
            {range: [2,4], color:"orange"},
            {range: [4,6], color:"yellow"},
            {range: [6,8], color:"lime"},
            {range: [8,10], color:"green"}
          ],}
        }
      ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {width: 540, height: 360, margin: {t:0, b:0}}; 
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
