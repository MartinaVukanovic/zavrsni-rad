import {
  exampleGraph,
  startPoint,
  endPoint
} from './exampleData.js';

const shortestDistanceNode = (distances, visited) => {
  let shortest = null;

  for (let node in distances) {
    let currentIsShortest =
      shortest === null || distances[node] < distances[shortest];
    if (currentIsShortest && !visited.includes(node)) {
      shortest = node;
    }
  }
  return shortest;
};

export const findShortestPath = (graph, startNode, endNode) => {
  // establish object for recording distances from the start node
  let distances = {};
  distances[endNode] = 'Infinity';
  distances = Object.assign(distances, graph[startNode]);

  // track paths
  let parents = { endNode: null };
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  // track nodes that have already been visited
  let visited = [];

  // find the nearest node
  let node = shortestDistanceNode(distances, visited);

  // for that node
  while (node) {
    // find its distance from the start node & its child nodes
    let distance = distances[node];
    let children = graph[node];
    // for each of those child nodes
    for (let child in children) {
      // make sure each child node is not the start node
      if (String(child) === String(startNode)) {
        // console.log("don't return to the start node!");
        continue;
      } else {
        // console.log('startNode: ' + startNode);
        /*
		 console.log(
          'distance from node ' + parents[node] + ' to node ' + node + ')'
        );
		*/
        // console.log('previous distance: ' + distances[node]);
        // save the distance from the start node to the child node

        // console.log(distance, children[child]);
        let newdistance = distance + children[child];

        // console.log('new distance: ' + newdistance);

        // if there's no recorded distance from the start node to the child node in the distances object
        // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
        // save the distance to the object
        // record the path
        if (!distances[child] || distances[child] > newdistance) {
          distances[child] = newdistance;
          parents[child] = node;
          // console.log('distance + parents updated');
        } else {
          // console.log('not updating, because a shorter path already exists!');
        }
      }
    }
    // move the node to the visited set
    visited.push(node);
    // move to the nearest neighbor node
    node = shortestDistanceNode(distances, visited);
  }

  // using the stored paths from start node to end node
  // record the shortest path
  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  // return the shortest path from start node to end node & its distance
  let results = {
    distance: distances[endNode],
    path: shortestPath,
  };

  return results;
};

// set default graph for first example of algorithm
let graph = exampleGraph;

// construct data so it matches needs of a d3 forced graph

export function constructData(graph) {
  const nodesKeys = Object.keys(graph);
  const nodes = [];
  const links = [];

  for (let i = 0; i < nodesKeys.length; i++) {
    nodes.push({
      id: nodesKeys[i],
      group: nodesKeys[i],
    });
  }

  for (let i = 0; i < nodesKeys.length; i++) {
    const keys = Object.keys(graph[nodes[i].id]);
    for (let j = 0; j < keys.length; j++) {
      const connectedNode = keys[j];
      const link = graph[nodes[i].id];

      links.push({
        source: nodes[i].id,
        target: connectedNode,
        value: link[connectedNode],
      });
    }
  }

  return { nodes, links };
}

// save links of shortest path in graphs so they match needs of a d3 forced graph data

export function createGraphsFromResult(result, graph) {
  const shortestPathLinks = [];
  const shortestPathGraphs = [];

  const { nodes, links } = constructData(graph);
  for (let j = 0; j < result.path.length; j++) {
    if (result.path[j] === undefined || result.path[j + 1] === undefined) {
      break;
    } else {
      for (let i = 0; i < links.length; i++) {
        if (
          (result.path[j] == links[i].source &&
            result.path[j + 1] == links[i].target) ||
          (result.path[j + 1] === links[i].source &&
            result.path[j] === links[i].target)
        ) {
          shortestPathLinks.push({
            source: result.path[j],
            target: result.path[j + 1],
            value: links[i].value,
            color: 'red',
          });
        }
      }
    }
  }
  for (let i = 0; i < shortestPathLinks.length; i++) {
    shortestPathGraphs.push({
      nodes,
      links: [...links, shortestPathLinks[i]],
    });
  }

  return shortestPathGraphs;
}

const result = findShortestPath(graph, startPoint, endPoint);
export const firsExampleGraph = createGraphsFromResult(result, graph);
