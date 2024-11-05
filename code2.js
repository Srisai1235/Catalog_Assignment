const fs = require("fs");

// Function to decode a value from a given base to base 10
function decodeValue(valueStr, base) {
  return parseInt(valueStr, base);
}

// Function to parse JSON input to extract points and keys
function parseInput(jsonData) {
  const { n, k } = jsonData.keys;
  const points = [];

  for (const key in jsonData) {
    if (key !== "keys") {
      const x = parseInt(key, 10);
      const base = parseInt(jsonData[key].base, 10);
      const yEncoded = jsonData[key].value;
      const y = decodeValue(yEncoded, base);
      points.push({ x, y });
    }
  }

  return { n, k, points };
}

// Function to calculate the constant term using Lagrange interpolation
function findConstantTerm(points, k) {
  let constantTerm = 0;

  // Apply Lagrange interpolation formula to find f(0)
  for (let i = 0; i < k; i++) {
    const { x: xi, y: yi } = points[i];
    let term = yi;

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        const xj = points[j].x;
        term *= -xj / (xi - xj);
      }
    }
    constantTerm += term;
  }

  return Math.round(constantTerm); // Round to handle any floating-point precision issues
}

// Main function to load JSON files and solve for the constant term
function main() {
  // Load JSON data from files
  const jsonData1 = JSON.parse(fs.readFileSync("input1.json", "utf8"));
  const jsonData2 = JSON.parse(fs.readFileSync("input2.json", "utf8"));

  const testCases = [jsonData1, jsonData2];

  for (const jsonData of testCases) {
    const { n, k, points } = parseInput(jsonData);
    const constantTerm = findConstantTerm(points, k);
    console.log(`Constant term (c) for this test case: ${constantTerm}`);
  }
}

main();
