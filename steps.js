export function correctSteps(graphs, correctPathLength) {
  const shownFinishedLinksData = [];
  const finalValue = document.getElementById('finalValue');
  let finalValueParagraph = '';

  if (
    localStorage.getItem('correctPathLength') &&
    Object.keys(graphs).length !== 16
  ) {
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
}

export function allSteps(graphs) {
  const value = document.getElementById('value');
  const shownLinksData = [];
  let valueParagraph = '';

  for (let i = 0; i < graphs[0].links.length; i++) {
    shownLinksData.push({
      data: ` source -  ${graphs[0].links[i].source}
    <span class="tab"></span> target - ${graphs[0].links[i].target} 
    <span class="tab"></span> value - ${graphs[0].links[i].value} `,
    });
    valueParagraph += shownLinksData[i].data;
  }

  value.innerHTML = valueParagraph;
}
