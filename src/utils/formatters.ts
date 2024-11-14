export const standardizeUnits = (value: string): string => {
  // Convert inch notations
  value = value.replace(/(\d+\/?\d*)"/, '$1 IN.');
  value = value.replace(/(\d+\/?\d*) inch/i, '$1 IN.');
  
  // Convert diameter
  value = value.replace(/diameter/i, 'DIA.');
  
  // Convert length
  value = value.replace(/long/i, 'LG.');
  
  // Common abbreviations
  value = value.replace(/diameter/i, 'DIA.');
  value = value.replace(/length/i, 'LG.');
  value = value.replace(/width/i, 'W.');
  value = value.replace(/height/i, 'H.');
  
  return value.trim();
};

export const parseMaterial = (input: string): string => {
  const materials = [
    'CARBON STEEL',
    'STAINLESS STEEL',
    'ALUMINUM',
    'BRASS',
    'BRONZE',
    'COPPER',
  ];
  
  // Handle specific steel grades first
  const gradeMatch = input.match(/(\d{4}-\d{4})\s+([A-Za-z\s]+)/);
  if (gradeMatch) {
    return `${gradeMatch[1]} ${gradeMatch[2].trim().toUpperCase()}`;
  }

  for (const material of materials) {
    if (input.toUpperCase().includes(material)) {
      return material;
    }
  }
  
  return '';
};

export const parseDescription = (input: string): {
  mainNoun: string;
  specs: string[];
  material: string;
} => {
  // Extract material first
  const material = parseMaterial(input);
  let remaining = input.replace(material, '').trim();
  
  // Find the main noun (usually at the start or end)
  const commonNouns = ['PIN', 'BOLT', 'NUT', 'SCREW', 'WASHER', 'COTTER PIN'];
  let mainNoun = '';
  
  for (const noun of commonNouns) {
    const regex = new RegExp(`\\b${noun}s?\\b`, 'i');
    if (regex.test(remaining)) {
      mainNoun = noun;
      remaining = remaining.replace(regex, '').trim();
      break;
    }
  }
  
  // Extract specifications
  const specs = remaining
    .split(/[,\s]+/)
    .map(spec => standardizeUnits(spec))
    .filter(Boolean); // Keep all non-empty specs
    
  return {
    mainNoun,
    specs,
    material
  };
};