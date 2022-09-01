import {
  firsExampleGraph,
  getUserGraph,
  correctPathLength,
} from './Djikstra.js';

var firstNode = document.getElementById('firstNode');
var secondNode = document.getElementById('secondNode');
var linkValue = document.getElementById('linkValue');
var startPoint = document.getElementById('startPoint');
var endPoint = document.getElementById('endPoint');

document
  .querySelector('form.points-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    localStorage.removeItem('startPoint');
    localStorage.setItem('startPoint', startPoint.value);
    localStorage.removeItem('endPoint');
    localStorage.setItem('endPoint', endPoint.value);
  });

const listOfUserValues = [];
const newUserGraph = {};

document
  .querySelector('form.pure-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    const firstNodeValue = firstNode.value;
    const secondNodeValue = secondNode.value;
    const linksValue = linkValue.value;

    listOfUserValues.push({
      firstNodeValue,
      secondNodeValue,
      linksValue,
    });
  });

// collect data from user and draw a new graph with that data
document.getElementById('draw').addEventListener('click', function (e) {
  for (let i = 0; i < listOfUserValues.length; i++) {
    if (newUserGraph[listOfUserValues[i].firstNodeValue] == undefined) {
      newUserGraph[listOfUserValues[i].firstNodeValue] = {};
      newUserGraph[listOfUserValues[i].firstNodeValue][
        listOfUserValues[i].secondNodeValue
      ] = parseInt(listOfUserValues[i].linksValue);
    } else {
      newUserGraph[listOfUserValues[i].firstNodeValue][
        listOfUserValues[i].secondNodeValue
      ] = parseInt(listOfUserValues[i].linksValue);
    }
  }

  let startPoint,
    endPoint = '';
  if (localStorage.getItem('startPoint'))
    startPoint = localStorage.getItem('startPoint');

  if (localStorage.getItem('endPoint'))
    endPoint = localStorage.getItem('endPoint');

  const { firsExampleGraph, correctPathLength } = getUserGraph(
    newUserGraph,
    startPoint,
    endPoint
  );
  localStorage.setItem('correctPathLength', correctPathLength);
  localStorage.setItem('userGraph', JSON.stringify(firsExampleGraph));
  updateData(0);
});

let graphs = {};
graphs = firsExampleGraph;

const increaser = document.querySelector('#increaser');
const decreaser = document.querySelector('#decreaser');
const auto = document.querySelector('#auto');
const res = document.querySelector('#result');

if (parseInt(res.textContent) === 1) decreaser.disabled = true;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function steps() {
  const userGraph = JSON.parse(localStorage.getItem('userGraph'));
  if (userGraph) {
    graphs = userGraph;
  }

  auto.addEventListener('click', async () => {
    for (let i = 0; i < Object.keys(graphs).length; i++) {
      updateData(i);
      await sleep(750);
    }
  });

  increaser.addEventListener('click', () => {
    updateData(res.textContent);
    res.textContent++;

    if (res.textContent > Object.keys(graphs).length - 1) {
      increaser.disabled = true;
    }
    if (res.textContent > 1) {
      decreaser.disabled = false;
    }
  });

  decreaser.addEventListener('click', () => {
    updateData(res.textContent - 2);
    res.textContent--;

    if (res.textContent < 2) {
      decreaser.disabled = true;
    }
    if (res.textContent <= Object.keys(graphs).length - 1) {
      increaser.disabled = false;
    }
  });
}

steps();

// write links and their source, target and value, beside graph in HTML
const value = document.getElementById('value');
const finalValue = document.getElementById('finalValue');
const shownLinksData = [];
const shownFinishedLinksData = [];

let valueParagraph = '';
let finalValueParagraph = '';

for (let i = 0; i < graphs[0].links.length; i++) {
  shownLinksData.push({
    data: ` source -  ${graphs[0].links[i].source}
    <span class="tab"></span> target - ${graphs[0].links[i].target} 
    <span class="tab"></span> value - ${graphs[0].links[i].value} `,
  });
  valueParagraph += shownLinksData[i].data;
}

value.innerHTML = valueParagraph;

if (localStorage.getItem('correctPathLength') && Object.keys(graphs).length !== 16) {
  const correctPathLength = localStorage.getItem('correctPathLength');
  for (
    let i = Object.keys(graphs).length;
    i > Object.keys(graphs).length - correctPathLength;
    i--
  ) {
    shownFinishedLinksData.push({
      data: ` source -  ${
        graphs[i - 1].links[graphs[0].links.length - 1].source
      }
      <span class="tab"></span> target - ${
        graphs[i - 1].links[graphs[0].links.length - 1].target
      } 
      <span class="tab"></span> value - ${
        graphs[i - 1].links[graphs[0].links.length - 1].value
      } `,
    });
  }
  for (let i = 0; i < shownFinishedLinksData.length; i++) {
    finalValueParagraph += shownFinishedLinksData[i].data;
  }

  finalValue.innerHTML = finalValueParagraph;
} else {
  for (
  let i = graphs[0].links.length;
  i > graphs[0].links.length - correctPathLength;
  i--
) {
  shownFinishedLinksData.push({
      data: ` source -  ${graphs[i].links[graphs[0].links.length - 1].source}
    <span class="tab"></span> target - ${
      graphs[i].links[graphs[0].links.length - 1].target
    } 
    <span class="tab"></span> value - ${
      graphs[i].links[graphs[0].links.length - 1].value
    } `,
    });
  }
  for (let i = 0; i < shownFinishedLinksData.length; i++) {
    finalValueParagraph += shownFinishedLinksData[i].data;
  }
}

finalValue.innerHTML = finalValueParagraph;

var width = 600;
var height = 400;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var label = {
  nodes: [],
  links: [],
};

// show data on first load (example graph)
updateData(0);

function updateData(i) {
  d3.selectAll('svg > *').remove();
  let graph = {};
  const userGraph = JSON.parse(localStorage.getItem('userGraph'));
  if (userGraph) {
    graph = userGraph[i];
  } else {
    graph = graphs[i];
  }

  graph.nodes.forEach(function (d, i) {
    label.nodes.push({ node: d });
    label.nodes.push({ node: d });
    label.links.push({
      source: i * 2,
      target: i * 2 + 1,
    });
  });

  var labelLayout = d3
    .forceSimulation(label.nodes)
    .force('charge', d3.forceManyBody().strength(-50))
    .force('link', d3.forceLink(label.links).distance(0).strength(2));

  var graphLayout = d3
    .forceSimulation(graph.nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.2))
    .force('y', d3.forceY(height / 2).strength(0.6))
    .force(
      'link',
      d3
        .forceLink(graph.links)
        .id(function (d) {
          return d.id;
        })
        .distance(50)
        .strength(1)
    )
    .on('tick', ticked);

  var adjlist = [];

  graph.links.forEach(function (d) {
    adjlist[d.source.index + '-' + d.target.index] = true;
    adjlist[d.target.index + '-' + d.source.index] = true;
  });

  function neigh(a, b) {
    return a == b || adjlist[a + '-' + b];
  }

  var svg = d3.select('#viz').attr('width', width).attr('height', height);
  var container = svg.append('g');

  svg.call(
    d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', function () {
        container.attr('transform', d3.event.transform);
      })
  );

  var link = container
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', function (d) {
      return Math.sqrt(d.value * 8);
    })
    .style('stroke', function (d) {
      return d.color;
    });

  var node = container
    .append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(graph.nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('fill', function (d) {
      return color(d.group);
    });

  node.on('mouseover', focus).on('mouseout', unfocus);

  node.call(
    d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
  );

  var labelNode = container
    .append('g')
    .attr('class', 'labelNodes')
    .selectAll('text')
    .data(label.nodes)
    .enter()
    .append('text')
    .text(function (d, i) {
      return i % 2 == 0 ? '' : d.node.id;
    })
    .style('fill', '#555')
    .style('font-family', 'Arial')
    .style('font-size', 20)
    .style('pointer-events', 'none');

  node.on('mouseover', focus).on('mouseout', unfocus);

  function ticked() {
    node.call(updateNode);
    link.call(updateLink);

    labelLayout.alphaTarget(0.3).restart();
    labelNode.each(function (d, i) {
      d.x = d.node.x - 15;
      d.y = d.node.y - 15;
    });
    labelNode.call(updateNode);
  }

  function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
  }

  function focus(d) {
    var index = d3.select(d3.event.target).datum().index;
    node.style('opacity', function (o) {
      return neigh(index, o.index) ? 1 : 0.1;
    });
    labelNode.attr('display', function (o) {
      return neigh(index, o.node.index) ? 'block' : 'none';
    });
    link.style('opacity', function (o) {
      return o.source.index == index || o.target.index == index ? 1 : 0.1;
    });
  }

  function unfocus() {
    labelNode.attr('display', 'block');
    node.style('opacity', 1);
    link.style('opacity', 1);
  }

  function updateLink(link) {
    link
      .attr('x1', function (d) {
        return fixna(d.source.x);
      })
      .attr('y1', function (d) {
        return fixna(d.source.y);
      })
      .attr('x2', function (d) {
        return fixna(d.target.x);
      })
      .attr('y2', function (d) {
        return fixna(d.target.y);
      });
  }

  function updateNode(node) {
    node.attr('transform', function (d) {
      return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')';
    });
  }

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) graphLayout.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  label.nodes = [];
}