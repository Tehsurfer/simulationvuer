function doEvaluateValue(value, from, to) {
  if (from !== undefined) {
    let re = new RegExp(`\\b${ from }\\b`, 'g');

    value = value.replace(re, to);
  }

  return value;
}

export function evaluateValue(parent, value) {
  let index = -1;

  parent.json.input.forEach((input) => {
    ++index;

    value = doEvaluateValue(value, input.id, parent.$children[index].vModel);
  });

  return Function("return " + value + ";")();
}

export function evaluateSimulationValue(parent, results, value, i) {
  parent.json.output.data.forEach((data) => {
    value = doEvaluateValue(value, data.id, results[parent.simulationDataId[data.id]][i]);
  });

  return Function("return " + value + ";")();
}
