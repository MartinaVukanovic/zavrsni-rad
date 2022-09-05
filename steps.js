import { sleep } from './utilityService.js';

// displays shortest path calculated by the algorithm
export function correctSteps(graphs, correctPathLength, weightOfFinalPath) {
  const shownFinishedLinksData = [];
  const finalValue = document.getElementById('finalValue');
  let finalValueParagraph = '';
  const weightOfFinalPathText = `<p class="text" style="margin: 25px">Weight of a shortest path: <span class="finalWeight">${weightOfFinalPath}</span>  </p>`;

  if (correctPathLength && Object.keys(graphs).length !== 16) {
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

    finalValueParagraph += weightOfFinalPathText;

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
      <span class="tab"></span> weight - ${
        graphs[i].links[graphs[0].links.length - 1].value
      } `,
      });
    }
    for (let i = 0; i < shownFinishedLinksData.length; i++) {
      finalValueParagraph += shownFinishedLinksData[i].data;
    }
    finalValueParagraph += weightOfFinalPathText;
  }

  finalValue.innerHTML = finalValueParagraph;
}

// displays table with all links and their source point, target point and weight of a link
export function allSteps(graphs) {
  const value = document.getElementById('value');
  const shownLinksData = [];
  let valueParagraph = '';

  for (let i = 0; i < graphs[0].links.length - 1; i++) {
    shownLinksData.push({
      data: `
      <tr>
      <td>${graphs[0].links[i].source} </td>
      <td>${graphs[0].links[i].target}</td>
      <td>${graphs[0].links[i].value}</td></tr>`,
    });
    valueParagraph += shownLinksData[i].data;
  }

  value.innerHTML = valueParagraph;
}

// displays steps one by one when clicked on buttons
export async function showStepsManual(n, clear, graphs, correctPathLength) {
  const stepsValue = document.getElementById('stepsValue');
  stepsValue.textContent = '';

  let stepsData = [];
  let stepsParagraph = '';

  for (let i = 0; i < Object.keys(graphs).length - correctPathLength; i++) {
    let source, target;
    source = graphs[i].links[graphs[n].links.length - 1].source;
    target = graphs[i].links[graphs[n].links.length - 1].target;

    if (graphs[i].links[graphs[n].links.length - 1].source.id)
      source = graphs[i].links[graphs[n].links.length - 1].source.id;
    if (graphs[i].links[graphs[n].links.length - 1].target.id)
      target = graphs[i].links[graphs[n].links.length - 1].target.id;
    let text = '';
    const firstSource = graphs[i].links[graphs[n].links.length - 1].source.id
      ? graphs[i].links[graphs[n].links.length - 1].source.id
      : graphs[i].links[graphs[n].links.length - 1].source;
    if (graphs[i + 1] !== undefined) {
      const secondSource = graphs[i + 1].links[graphs[n].links.length - 1]
        .source.id
        ? graphs[i + 1].links[graphs[n].links.length - 1].source.id
        : graphs[i + 1].links[graphs[n].links.length - 1].source;
      if (i !== 0 && i !== 11 && firstSource !== secondSource) {
        text = `<p class="animated text" style="color: black; margin: 10px"> new node - ${secondSource} </p>`;
      }
    }

    stepsData.push({
      data: `<p class="animated"> source -  ${source}
  <span class="tab"></span> target - ${target} 
  <span class="tab"></span> weight - ${
    graphs[i].links[graphs[n].links.length - 1].value
  } </p> ${text}`,
    });
  }

  if (Object.keys(graphs).length - correctPathLength < n)
    n = Object.keys(graphs).length - correctPathLength - 1;
  for (let i = 0; i < n; i++) {
    stepsParagraph += stepsData[i + 1].data;
    stepsValue.innerHTML = stepsParagraph;
  }
}

// displays steps automatically when clicked on "autorun" button
export async function showSteps(a, graphs, correctPathLength) {
  const stepsValue = document.getElementById('stepsValue');
  stepsValue.textContent = '';

  let stepsData = [];
  let stepsParagraph = '';

  for (let i = 0; i < graphs[i].links.length - correctPathLength + 1; i++) {
    let source, target;
    if (graphs[i].links[graphs[i].links.length - 1].source.id) {
      source = graphs[i].links[graphs[i].links.length - 1].source.id;
    } else {
      source = graphs[i].links[graphs[i].links.length - 1].source;
    }
    if (graphs[i].links[graphs[i].links.length - 1].target.id) {
      target = graphs[i].links[graphs[i].links.length - 1].target.id;
    } else {
      target = graphs[i].links[graphs[i].links.length - 1].target;
    }
    let text = '';
    if (
      i !== 0 &&
      i !== 11 &&
      graphs[i].links[graphs[i].links.length - 1].source !==
        graphs[i + 1].links[graphs[i].links.length - 1].source
    ) {
      const newNode = graphs[i + 1].links[graphs[i].links.length - 1].source.id
        ? graphs[i + 1].links[graphs[i].links.length - 1].source.id
        : graphs[i + 1].links[graphs[i].links.length - 1].source;
      text = `<p class="animated text" style="color: black; margin: 10px"> new node - ${newNode} </p>`;
    }
    stepsData.push({
      data: `<p class="animated"> source -  ${source}
  <span class="tab"></span> target - ${target} 
  <span class="tab"></span> weight - ${
    graphs[i].links[graphs[i].links.length - 1].value
  } </p> ${text}`,
    });
  }
  for (let i = 0; i < stepsData.length; i++) {
    stepsParagraph += stepsData[i].data;
    stepsValue.innerHTML = stepsParagraph;
    await sleep(a);
  }
}
