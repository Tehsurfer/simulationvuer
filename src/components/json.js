export function validJson(json) {
  // Make sure that we have some JSON data.

  if (Object.keys(json).length === 0) {
    console.warn("JSON: no data is available.");

    return false;
  }

  // Check simulation information.

  let simulation = json.simulation;

  if (typeof simulation === "object") {
    // Check that the ending point is valid.

    if (!((typeof simulation.endingPoint === "number") && (simulation.endingPoint > 0.0))) {
      console.warn("JSON: a simulation ending point must be present and greater than zero.");

      return false;
    }

    // Check that the point interval is valid.

    if (!((typeof simulation.pointInterval === "number") && (simulation.pointInterval > 0.0))) {
      console.warn("JSON: a simulation point interval must be present and greater than zero.");

      return false;
    }
  }

  // Check each input.

  let idUsed = [];
  let inputValid = json.input.every((input) => {
    // Check that the input has a valid name.

    if (!((typeof input.name === "string") && (input.name !== ""))) {
      console.warn("JSON: a name is required and it must be a non-empty string.");

      return false;
    }

    // Check whether we are dealing with a discrete input or a scalar input.

    if ((typeof input.defaultValue === "number")
        && (typeof input.possibleValues === "object")) {
      // We are dealing with a discrete input, so check that it has a valid
      // id, if any.

      if (!((typeof input.id === "string") && (input.id !== "")
            || (typeof input.id === "undefined"))) {
        console.warn("JSON: an id, if present, must be a non-empty string.");

        return false;
      }

      // Check that the id is not already used.

      if (typeof input.id !== undefined) {
        if (idUsed[input.id]) {
          console.warn("JSON: an id must be unique (" + input.id + " is used more than once).");

          return false;
        }

        idUsed[input.id] = true;
      }

      // Check that each possible value is valid.

      if (!input.possibleValues.every((possibleValue) => {
        // Check that the possible value is an object with a non-empty name
        // and a value.

        if (!((typeof possibleValue === "object")
              && (typeof possibleValue.name === "string") && (possibleValue.name !== "")
              && (typeof possibleValue.value === "number"))) {
          console.warn("JSON: a possible value must be an object with a non-empty name and a value.");

          return false;
        }

        return true;
      })) {
        return false;
      }

      // Check that the values of the possible values are unique.

      const values = input.possibleValues.map((value) => {
        return value.value;
      });

      let valueUsed = [];

      if (!values.every((value) => {
        if (valueUsed[value]) {
          console.warn("JSON: a possible value must have a unique value (" + value + " is used more than once).");

          return false;
        }

        valueUsed[value] = true;

        return true;
      })) {
        return false;
      }

      // Check that the default value is one of the possible values.

      if (!values.includes(input.defaultValue)) {
        console.warn("JSON: the default value (" + input.defaultValue + ") must be one of the possible values (" + values.join(", ") + ").");

        return false;
      }
    } else if ((typeof input.defaultValue === "number")
                && (typeof input.minimumValue === "number")
                && (typeof input.maximumValue === "number")) {
      // We are dealing with a scalar input, so check that it has a valid
      // enabled, if any.

      if (!((typeof input.enabled === "string") && (input.enabled !== "")
            || (typeof input.enabled === "undefined"))) {
        console.warn("JSON: an enabled, if present, must be a non-empty string.");

        return false;
      }

      if (!(input.minimumValue < input.maximumValue)) {
        console.warn("JSON: the minimum value (" + input.minimumValue + ") must be lower than the maximum value (" + input.maximumValue + ").");

        return false;
      }

      if (!((input.defaultValue >= input.minimumValue)
            && (input.defaultValue <= input.maximumValue))) {
        console.warn("JSON: the default value (" + input.defaultValue + ") must be greater or equal to the minimum value (" + input.minimumValue + ") and lower or equal to the maximum value (" + input.maximumValue + ").");

        return false;
      }
    } else {
      // Not something that we can recognise.

      console.warn("JSON: the input cannot be recognised.");

      return false;
    }

    return true;
  });

  if (!inputValid) {
    return false;
  }

  // Check each output.

  return json.output.every((output) => {
    // Check that the output is valid.

    if (!((typeof output === "string") && (output !== ""))) {
      console.warn("JSON: an output must be a non-empty string.");

      return false;
    }

    return true;
  });
}
